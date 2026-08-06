# ATLAS PWA 3.2.2 – Clean Realtime Fix

To jest czysta gałąź PWA przeznaczona do GitHub Pages. Nie zawiera plików projektu Android/Gradle.

## Aktualizacja na GitHub Pages

1. Wgraj do głównego katalogu repozytorium wszystkie pliki i folder `icons` z tej paczki.
2. Zatwierdź zmiany i poczekaj na publikację GitHub Pages.
3. Otwórz stronę w Chrome, odśwież ją, a następnie zamknij i ponownie uruchom zainstalowaną aplikację ATLAS.
4. Wejdź w **Zegarek** i zaloguj się tym samym kontem Firebase co w ATLAS Sync Android.

## Synchronizacja LIVE

Normalny przepływ danych:

`Xiaomi Watch S3 → Mi Fitness → Health Connect → ATLAS Sync Android → Firestore → ATLAS PWA`

Import pliku JSON pozostał wyłącznie jako narzędzie awaryjne i jest domyślnie zwinięty.

## Wymagania Firebase

- w Authentication musi być włączone logowanie Email/Password,
- domena `grzegorzderezulko.github.io` musi znajdować się w Authorized domains,
- Android i PWA muszą używać tego samego projektu Firebase oraz tego samego UID,
- dane są oczekiwane w `users/{uid}/daily` i `users/{uid}/activities`.

## Najważniejsze poprawki

- przywrócono prawidłowe obliczanie dni i tygodni programu (usunięto konflikt dwóch funkcji daty),
- zabezpieczono dietę i kuchnię przed błędem `reading items`,
- przebudowano logowanie i diagnostykę Firebase,
- dodano brakujące ikony PWA,
- naprawiono instalację i aktualizację Service Workera,
- usunięto obce pliki Gradle z paczki PWA.
