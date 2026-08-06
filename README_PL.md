# ATLAS PWA 3.7.0 — ETAP O

## Adaptacyjny plan treningowy

Zakładka **Plan adaptacyjny** łączy wynik gotowości z ETAPU M, historię treningów oraz postępy ćwiczeń. ATLAS może:

- zachować plan bazowy,
- ograniczyć objętość treningu,
- zasugerować progres,
- zamienić ciężki trening na regenerację przy bardzo niskiej gotowości,
- uwzględnić ręczne zmiany na konkretny dzień.

## Czat z trenerem

Czat działa lokalnie i nie wysyła rozmów do zewnętrznej usługi. Przykłady poleceń:

- `Jutro zamiast treningu chcę spacer`
- `Ustaw kalorie na 2200 i białko na 180 g`
- `Zamień przysiad goblet na przysiad do ławki`
- `Co proponujesz na dziś?`

Każda zmiana jest najpierw wyświetlana do zatwierdzenia. Można ją później usunąć w sekcji **Wprowadzone zmiany**.

Pełna swobodna rozmowa AI będzie wymagała osobnego, zabezpieczonego backendu. Nie należy umieszczać klucza API w plikach PWA publikowanych na GitHubie.

## Publikacja

1. Rozpakuj ZIP.
2. Wgraj zawartość folderu `ATLAS_PWA_3.7.0_ETAP_O` do głównego katalogu repozytorium `atlas-pwa`.
3. Zatwierdź zmiany na gałęzi `main`.
4. Cloudflare Pages opublikuje aktualizację automatycznie.
