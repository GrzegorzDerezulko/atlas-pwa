# Historia zmian ATLAS PWA

## 3.7.0 — ETAP O

- adaptacyjny plan tygodnia zależny od gotowości i postępów
- automatyczne ograniczenie ciężkiego treningu przy słabej regeneracji
- lokalny czat z potwierdzaniem zmian treningu i diety
- ręczne nadpisania planu, ćwiczeń i posiłków

## 3.6.0 — ETAP N

- inteligentny plan dnia i harmonogram przypomnień
- powiadomienia o gotowości, synchronizacji, treningu, krokach i śnie
- tryb ciszy, centrum komunikatów i szybkie reakcje
- service worker obsługujący powiadomienia systemowe

## 3.5.0 — ETAP M

- gotowość dzienna 0–100 i poziom wiarygodności
- Trener adaptacyjny 2.0 z wyjaśnieniem wyniku
- adaptacyjne ciężary, serie i czas cardio
- opcjonalny check-in regeneracji
- trend 7 vs 30 dni i historia gotowości

## 3.4.0 — ETAP L

- raport 7 dni i porównanie z poprzednim tygodniem
- analiza trendów zdrowotnych i aktywności
- wykresy, tabela dzienna, kompletność danych i priorytet tygodnia
- kopiowanie oraz drukowanie raportu

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
