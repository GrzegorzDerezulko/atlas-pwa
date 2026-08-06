# ATLAS PWA 3.6.0 — ETAP N

## Inteligentne powiadomienia i plan dnia

W menu wybierz **Plan dnia**. ATLAS przygotowuje przypomnienia na podstawie:

- gotowości i rekomendacji Trenera 2.0,
- świeżości danych zegarka i Firebase,
- dzisiejszego treningu lub aktywności,
- aktualnej liczby kroków,
- pory snu i kilku słabszych dni z rzędu.

Można ustawić godziny, cel kroków, rodzaje komunikatów oraz tryb ciszy. Centrum powiadomień przechowuje historię na tym urządzeniu.

## Pierwsze uruchomienie

1. Otwórz **Plan dnia**.
2. Kliknij **Włącz powiadomienia** i zaakceptuj zgodę przeglądarki.
3. Ustaw godziny oraz rodzaje przypomnień.
4. Kliknij **Zapisz harmonogram**.
5. Użyj **Wyślij test**, aby sprawdzić systemowe powiadomienie.

## Ograniczenie techniczne

ATLAS jest statyczną PWA na Cloudflare Pages. Plan i historia są odświeżane po otwarciu aplikacji. Bez osobnego serwera push Android lub przeglądarka może wstrzymać zegar aplikacji po jej całkowitym zamknięciu, dlatego przypomnienie o dokładnej godzinie nie jest wtedy gwarantowane.

## Publikacja

1. Rozpakuj ZIP.
2. Wgraj **zawartość folderu** do głównego katalogu repozytorium `atlas-pwa` na GitHubie.
3. Zatwierdź zmiany w gałęzi `main`.
4. Cloudflare Pages opublikuje wersję automatycznie.
