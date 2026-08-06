# ATLAS PWA 3.8.0 — ETAP P

## Trener AI w chmurze

ETAP P dodaje pełny czat dostępny w zakładce **Trener AI**. Model otrzymuje wyłącznie zwięzłe podsumowanie danych ATLAS i może:

- wyjaśnić wynik gotowości,
- omówić tydzień treningowy,
- zaproponować lżejszy trening lub regenerację,
- przygotować zmianę dnia treningowego,
- zamienić ćwiczenie,
- zaproponować zmianę kalorii, białka lub posiłku.

Zmiany nigdy nie są stosowane automatycznie. Najpierw pojawia się karta **Propozycja zmiany — wymaga potwierdzenia**.

## Uruchomienie chmury

Po wgraniu plików do GitHuba wykonaj instrukcję z `CLOUDFLARE_AI_SETUP_PL.md`. Bez sekretu OpenAI czat pozostanie w dotychczasowym trybie lokalnym.

## Historia między urządzeniami

Opcjonalna synchronizacja przez Firebase wymaga reguły z `FIRESTORE_RULES_ETAP_P.txt`. Brak tej reguły nie blokuje rozmowy AI.

## Publikacja

1. Rozpakuj ZIP.
2. Wgraj zawartość folderu `ATLAS_PWA_3.8.0_ETAP_P` do głównego katalogu repozytorium `atlas-pwa`.
3. Zatwierdź zmiany na gałęzi `main`.
4. Cloudflare Pages opublikuje PWA i katalog `functions`.
5. Dodaj sekret `OPENAI_API_KEY` w Cloudflare i wykonaj ponowne wdrożenie.
