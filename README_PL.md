# ATLAS PWA 3.3.0 — ETAP K

## Co dodano

- stabilizację synchronizacji Firebase / Firestore,
- automatyczne ponawianie połączenia,
- kontrolę świeżości danych i źródła serwer/cache,
- historię danych z zegarka z 7, 30 lub 90 dni,
- wykres kroków i snu,
- zestawienie średnich oraz kompletności danych.

## Codzienne użycie

1. Xiaomi Watch S3 synchronizuje dane z Mi Fitness.
2. ATLAS Sync Android wysyła je do Firebase.
3. ATLAS PWA pobiera dane automatycznie po zalogowaniu.
4. W zakładce **Zegarek / Sync** można sprawdzić stan połączenia i historię 30 dni.

PWA nie musi być stale otwarte. Po ponownym uruchomieniu pobiera aktualny stan Firestore i uzupełnia lokalną historię. Import JSON pozostaje wyłącznie narzędziem awaryjnym.

## Publikacja

Wgraj wszystkie pliki do głównego katalogu gałęzi `main` repozytorium `atlas-pwa`. Cloudflare Pages opublikuje zmianę automatycznie.
