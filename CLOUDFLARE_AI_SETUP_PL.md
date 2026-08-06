# Uruchomienie Trenera AI — Cloudflare Pages

Kod funkcji jest już w katalogu `functions/api/ai.js`. Po wgraniu projektu do GitHuba Cloudflare utworzy endpoint `/api/ai`.

## Jedyny wymagany sekret

1. Utwórz klucz API na platformie OpenAI.
2. Otwórz Cloudflare → **Workers & Pages** → projekt **atlas-pwa**.
3. Wejdź w **Settings → Variables and Secrets**.
4. Dodaj zmienną o nazwie `OPENAI_API_KEY`.
5. Wybierz typ **Secret / Encrypt**, wklej wartość klucza i zapisz.
6. Wykonaj nowe wdrożenie projektu, aby sekret był dostępny dla Pages Function.

Opcjonalnie możesz dodać zwykłą zmienną `OPENAI_MODEL`. Domyślna wartość w kodzie to `gpt-5-mini`.

## Firebase

Czat chmurowy wymaga zalogowania w zakładce **Zegarek / Sync**. Pages Function weryfikuje token projektu `atlas-c39fd`.

Synchronizacja historii między urządzeniami jest opcjonalna i wymaga dopisania reguły z pliku `FIRESTORE_RULES_ETAP_P.txt`.

## Bezpieczeństwo

- Klucz OpenAI nie znajduje się w `index.html` ani w repozytorium.
- Funkcja przyjmuje tylko żądania z tej samej domeny.
- Każde żądanie wymaga ważnego tokenu Firebase.
- Model nie stosuje zmian bez potwierdzenia w PWA.
- Żądania OpenAI używają `store: false`.
