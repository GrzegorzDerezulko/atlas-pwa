ATLAS PWA 2.0 - aktualizacja centrum synchronizacji

NAJWAŻNIEJSZE ZMIANY
- poprawny import plików atlas_sync_*.json z aplikacji ATLAS Sync Android,
- obsługa formatu: atlasSyncVersion, source, syncedAt, days,
- trzy tryby łączenia danych,
- dane z zegarka aktualizują kroki, aktywne kcal, sen i tętno bez usuwania wpisów ręcznych,
- aktywności są chronione przed duplikatami,
- historia ostatnich 25 importów,
- importer w zakładce Centrum synchronizacji oraz w Ustawieniach,
- nowa wersja pamięci offline Service Worker.

AKTUALIZACJA GITHUB PAGES
1. Otwórz repozytorium atlas-pwa.
2. Add file -> Upload files.
3. Wgraj pliki ze środka tego folderu (index.html, service-worker.js, manifest.webmanifest, .nojekyll i folder icons).
4. Commit changes.
5. Poczekaj 2-3 minuty.
6. Na telefonie zamknij ATLAS, otwórz adres w Chrome i odśwież stronę.
7. Jeżeli nadal widzisz starą wersję, Chrome -> Ustawienia witryny -> grzegorzderezulko.github.io -> Wyczyść i zresetuj, a następnie ponownie otwórz aplikację. Uwaga: wcześniej wykonaj eksport kopii PWA, jeżeli masz ważne dane.

IMPORT
Centrum synchronizacji -> wybierz atlas_sync_YYYY-MM-DD.json -> Importuj do ATLAS.
Zalecany tryb: Aktualizuj dane z zegarka.
