const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const OPENAI_MODERATIONS_URL = 'https://api.openai.com/v1/moderations';
const rateBuckets = new Map();
let jwksCache = { expiresAt: 0, keys: null };

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });
}

function b64urlBytes(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function b64urlJson(value) {
  return JSON.parse(new TextDecoder().decode(b64urlBytes(value)));
}

async function getFirebaseJwks() {
  if (jwksCache.keys && Date.now() < jwksCache.expiresAt) return jwksCache.keys;
  const response = await fetch(FIREBASE_JWKS_URL, { cf: { cacheTtl: 3600, cacheEverything: true } });
  if (!response.ok) throw new Error('Nie udało się pobrać kluczy Firebase.');
  const keys = await response.json();
  const cacheControl = response.headers.get('cache-control') || '';
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] || 3600);
  jwksCache = { keys, expiresAt: Date.now() + Math.max(300, maxAge - 60) * 1000 };
  return keys;
}

async function verifyFirebaseToken(token, projectId) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('Niepoprawny token Firebase.');
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = b64urlJson(encodedHeader);
  const payload = b64urlJson(encodedPayload);
  if (header.alg !== 'RS256' || !header.kid) throw new Error('Nieobsługiwany token Firebase.');
  const keys = await getFirebaseJwks();
  const jwk = keys.keys?.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error('Nie znaleziono klucza podpisu Firebase.');
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    b64urlBytes(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );
  const now = Math.floor(Date.now() / 1000);
  if (!valid) throw new Error('Nieprawidłowy podpis tokenu Firebase.');
  if (payload.aud !== projectId) throw new Error('Token pochodzi z innego projektu Firebase.');
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('Nieprawidłowy wystawca tokenu Firebase.');
  if (!payload.sub || payload.sub.length > 128) throw new Error('Brak identyfikatora użytkownika.');
  if (!payload.exp || payload.exp <= now) throw new Error('Sesja Firebase wygasła.');
  if (payload.iat && payload.iat > now + 60) throw new Error('Nieprawidłowy czas tokenu Firebase.');
  return payload;
}

function checkSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

function rateLimit(uid) {
  const now = Date.now();
  const bucket = rateBuckets.get(uid);
  if (!bucket || now - bucket.startedAt >= 60_000) {
    rateBuckets.set(uid, { startedAt: now, count: 1 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= 10;
}

function cleanHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-16).map((item) => ({
    role: item?.role === 'assistant' ? 'assistant' : 'user',
    content: String(item?.content || '').slice(0, 2400),
  })).filter((item) => item.content.trim());
}

function safeContext(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const serialized = JSON.stringify(value);
  if (serialized.length > 28_000) throw new Error('Kontekst ATLAS jest zbyt duży.');
  return value;
}

async function moderate(apiKey, message) {
  const response = await fetch(OPENAI_MODERATIONS_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'omni-moderation-latest', input: message }),
  });
  if (!response.ok) return null;
  return (await response.json()).results?.[0] || null;
}

function safetyReply(result) {
  const categories = result?.categories || {};
  if (categories['self-harm/intent'] || categories['self-harm/instructions']) {
    return 'Bardzo mi przykro, że przechodzisz przez tak trudny moment. Nie zostawaj z tym sam. Jeżeli istnieje bezpośrednie zagrożenie, zadzwoń pod 112. Skontaktuj się teraz z bliską osobą lub specjalistą i odłóż trening na później.';
  }
  return 'Nie mogę pomóc w tej formie. Mogę natomiast bezpiecznie porozmawiać o treningu, regeneracji, diecie i zdrowych nawykach.';
}

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    reply: { type: 'string' },
    action: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: { type: 'string', enum: ['none', 'settings', 'schedule', 'exercise', 'meal'] },
        summary: { type: 'string' },
        date: { type: ['string', 'null'] },
        kind: { type: ['string', 'null'] },
        trainingId: { type: ['string', 'null'] },
        exerciseId: { type: ['string', 'null'] },
        newName: { type: ['string', 'null'] },
        day: { type: ['integer', 'null'] },
        index: { type: ['integer', 'null'] },
        mealName: { type: ['string', 'null'] },
        kcal: { type: ['integer', 'null'] },
        protein: { type: ['integer', 'null'] },
      },
      required: ['type', 'summary', 'date', 'kind', 'trainingId', 'exerciseId', 'newName', 'day', 'index', 'mealName', 'kcal', 'protein'],
    },
  },
  required: ['reply', 'action'],
};

function normalizeAction(action, context) {
  if (!action || action.type === 'none') return { type: 'none', summary: '' };
  const base = { ...action, summary: String(action.summary || '').slice(0, 500) };
  if (base.type === 'settings') {
    base.kcal = Number.isInteger(base.kcal) && base.kcal >= 1200 && base.kcal <= 5000 ? base.kcal : null;
    base.protein = Number.isInteger(base.protein) && base.protein >= 40 && base.protein <= 350 ? base.protein : null;
    if (!base.kcal && !base.protein) return { type: 'none', summary: '' };
  } else if (base.type === 'schedule') {
    if (!/^20\d{2}-\d{2}-\d{2}$/.test(base.date || '')) return { type: 'none', summary: '' };
    if (!['base', 'walk', 'recovery', 'rest', 'strength'].includes(base.kind)) return { type: 'none', summary: '' };
    if (base.kind === 'strength' && !['upperA', 'lowerCore', 'upperB'].includes(base.trainingId)) return { type: 'none', summary: '' };
  } else if (base.type === 'exercise') {
    const ids = new Set((context.trainingCatalog || []).flatMap((plan) => (plan.exercises || []).map((exercise) => exercise.id)));
    if (!ids.has(base.exerciseId) || !String(base.newName || '').trim()) return { type: 'none', summary: '' };
    base.newName = String(base.newName).trim().slice(0, 120);
  } else if (base.type === 'meal') {
    if (!Number.isInteger(base.day) || base.day < 1 || base.day > 14) return { type: 'none', summary: '' };
    if (!Number.isInteger(base.index) || base.index < 0 || base.index > 4) return { type: 'none', summary: '' };
    if (!String(base.mealName || '').trim()) return { type: 'none', summary: '' };
    base.mealName = String(base.mealName).trim().slice(0, 120);
    base.kcal = Number.isInteger(base.kcal) && base.kcal >= 100 && base.kcal <= 1500 ? base.kcal : null;
    base.protein = Number.isInteger(base.protein) && base.protein >= 0 && base.protein <= 120 ? base.protein : null;
    if (!base.kcal || base.protein === null) return { type: 'none', summary: '' };
  }
  return base;
}

function extractOutputText(response) {
  for (const item of response?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === 'output_text' && content.text) return content.text;
      if (content?.type === 'refusal' && content.refusal) throw new Error(content.refusal);
    }
  }
  throw new Error('Model nie zwrócił odpowiedzi tekstowej.');
}

async function callOpenAI(env, message, history, context) {
  const model = env.OPENAI_MODEL || 'gpt-5-mini';
  const instructions = `Jesteś Trenerem ATLAS i odpowiadasz po polsku. Korzystaj wyłącznie z przekazanego kontekstu użytkownika; nie wymyślaj brakujących danych. Pomagasz w treningu siłowym, regeneracji, krokach, śnie i zwykłej diecie. Nie stawiaj diagnoz i nie zmieniaj leków. Przy bólu w klatce, duszności, omdleniu, ostrym urazie lub wyraźnie złym samopoczuciu zalecaj przerwanie wysiłku i kontakt z pomocą medyczną. Nie proponuj skrajnego deficytu kalorii ani niebezpiecznych metod odchudzania. Jeśli użytkownik prosi o zmianę treningu lub diety, przygotuj dokładnie jedną propozycję action, ale nigdy nie twierdź, że została zastosowana — aplikacja poprosi o osobne zatwierdzenie. Jeżeli użytkownik tylko pyta lub prosi o analizę, ustaw action.type na none. Odpowiadaj konkretnie, życzliwie i krótko.\n\nKONTEKST ATLAS (zagregowany):\n${JSON.stringify(context)}`;
  const input = [...history, { role: 'user', content: message }];
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      instructions,
      input,
      store: false,
      max_output_tokens: 1000,
      text: { format: { type: 'json_schema', name: 'atlas_coach_response', strict: true, schema: RESPONSE_SCHEMA } },
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || `OpenAI API: HTTP ${response.status}`);
  const parsed = JSON.parse(extractOutputText(payload));
  return { reply: String(parsed.reply || '').slice(0, 5000), action: normalizeAction(parsed.action, context), model };
}

export async function onRequestGet({ env }) {
  return json({ ok: true, configured: Boolean(env.OPENAI_API_KEY), model: env.OPENAI_MODEL || 'gpt-5-mini', firebaseProjectId: env.FIREBASE_PROJECT_ID || 'atlas-c39fd', version: '3.8.0' });
}

export async function onRequestPost({ request, env }) {
  if (!checkSameOrigin(request)) return json({ error: 'Żądanie z niedozwolonej domeny.' }, 403);
  if (!env.OPENAI_API_KEY) return json({ error: 'Brakuje sekretu OPENAI_API_KEY w Cloudflare Pages.' }, 503);
  const authorization = request.headers.get('authorization') || '';
  if (!authorization.startsWith('Bearer ')) return json({ error: 'Zaloguj się do Firebase.' }, 401);
  let user;
  try { user = await verifyFirebaseToken(authorization.slice(7), env.FIREBASE_PROJECT_ID || 'atlas-c39fd'); }
  catch (error) { return json({ error: String(error?.message || error) }, 401); }
  if (!rateLimit(user.sub)) return json({ error: 'Zbyt wiele wiadomości. Odczekaj minutę.' }, 429);
  const raw = await request.text();
  if (raw.length > 60_000) return json({ error: 'Żądanie jest zbyt duże.' }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: 'Niepoprawny format żądania.' }, 400); }
  const message = String(body?.message || '').trim().slice(0, 2400);
  if (!message) return json({ error: 'Wiadomość jest pusta.' }, 400);
  let context;
  try { context = safeContext(body?.context); } catch (error) { return json({ error: String(error.message) }, 400); }
  const history = cleanHistory(body?.history);
  try {
    const moderation = await moderate(env.OPENAI_API_KEY, message);
    if (moderation?.flagged) return json({ ok: true, reply: safetyReply(moderation), action: { type: 'none', summary: '' }, model: 'moderation', safety: true });
    const result = await callOpenAI(env, message, history, context);
    return json({ ok: true, ...result });
  } catch (error) {
    return json({ error: String(error?.message || error) }, 502);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Allow': 'GET, POST, OPTIONS', 'Cache-Control': 'no-store' } });
}
