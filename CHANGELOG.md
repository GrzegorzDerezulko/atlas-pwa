# Changelog

## 3.3.0 — ETAP K: stabilizacja synchronizacji i historia

- dodano panel stanu synchronizacji Firebase / Firestore,
- dodano automatyczne ponawianie połączenia z narastającym opóźnieniem,
- dodano ręczne odświeżenie danych bezpośrednio z serwera,
- rozróżniono dane z serwera i pamięci podręcznej,
- zapisywany jest ostatni poprawny kontakt z serwerem i ostatni czas danych zegarka,
- dodano ostrzeżenie o nieaktualnych danych,
- dodano historię zegarka z 7, 30 lub 90 dni,
- dodano wykres kroków i snu,
- dodano średnie kroków, snu, tętna, sumę aktywnych kcal i aktywności,
- dodano ocenę kompletności danych w każdym dniu,
- po odzyskaniu internetu lub powrocie do aplikacji synchronizacja jest wznawiana,
- odświeżono Service Workera i cache PWA.

## 3.2.2 — Clean Realtime Fix

- naprawiono konflikt funkcji daty, który psuł harmonogram i numer tygodnia,
- zabezpieczono stan aplikacji i widoki diety/kuchni przed błędem `reading items`,
- przebudowano logowanie i diagnostykę Firebase,
- dodano przycisk ponownego sprawdzenia połączenia LIVE,
- synchronizacja Firebase jest trybem głównym, a JSON pozostaje tylko awaryjny,
- dodano brakujące ikony PWA,
- naprawiono instalowanie i odświeżanie Service Workera,
- usunięto pliki Gradle niezwiązane z PWA.
