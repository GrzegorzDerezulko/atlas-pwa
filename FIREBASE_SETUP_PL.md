# Konfiguracja ATLAS Cloud

Aplikacja PWA korzysta z projektu Firebase `atlas-c39fd` i oczekuje tego samego konta użytkownika co ATLAS Sync Android.

## 1. Authentication

W konsoli Firebase:

1. Otwórz **Authentication**.
2. Włącz metodę **Email/Password**.
3. W **Settings / Authorized domains** dodaj:
   - `grzegorzderezulko.github.io`

## 2. To samo UID w Androidzie i PWA

W aplikacji Android najpierw połącz istniejące konto anonimowe z e-mailem i hasłem. Następnie w PWA zaloguj się tym samym e-mailem i hasłem. Dzięki temu oba programy używają tego samego UID.

## 3. Oczekiwana struktura Firestore

- `users/{uid}/daily/{data}` - dane dzienne,
- `users/{uid}/activities/{id}` - aktywności.

PWA rozpoznaje zarówno dokumenty bezpośrednie, jak i dokumenty zawierające tablice `items`, `days`, `records`, `activities` albo `workouts`.

## 4. Reguły Firestore - wzór

Poniższy wzór ogranicza dostęp do danych zalogowanego właściciela. Przed wdrożeniem sprawdź go w konsoli Firebase:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 5. Diagnostyka

W ATLAS otwórz **Zegarek**. Moduł pokazuje:

- UID zalogowanego użytkownika,
- liczbę dokumentów dziennych,
- liczbę aktywności,
- źródło danych: serwer albo lokalna pamięć Firebase,
- dokładny kod błędu logowania lub Firestore.
