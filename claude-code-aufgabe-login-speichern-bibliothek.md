# Aufgabe für Claude Code: Login, Speichern-Funktion, Bibliotheksansicht

Kontext: Backend-Routen für Auth (`/api/auth/login`, `/api/auth/me`) und
Übungen (`/api/exercises` CRUD) existieren bereits und funktionieren. Im
Frontend fehlen noch: eine Login-Seite, eine Speichern-Funktion im Editor,
und eine Bibliotheksansicht zum Durchsuchen/Öffnen gespeicherter Übungen.
Zusätzlich fehlt noch Routing zwischen diesen Ansichten (aktuell rendert
`App.jsx` immer nur direkt den Editor).

Bitte in der Reihenfolge der Abschnitte vorgehen, nach jedem Abschnitt kurz
testen.

---

## Teil 0: Ersten Admin-Account anlegen (einmalig, vorbereitend)

Bevor das Login getestet werden kann, muss ein erster Benutzer in der
Datenbank existieren. Bitte ein kleines Hilfsskript erstellen,
`backend/src/db/createFirstAdmin.js`, das per Kommandozeilenargumenten
(oder interaktiv per readline) E-Mail, Passwort und Anzeigename abfragt,
das Passwort mit bcrypt hasht und einen Benutzer mit `role = 'admin'`
einfügt. Als npm-Script in `backend/package.json` ergänzen:
`"create-admin": "node src/db/createFirstAdmin.js"`. Dann einmal ausführen
und mir das Ergebnis zeigen, damit ich mich testweise einloggen kann.

---

## Teil 1: Routing einführen

`react-router-dom` ist bereits als Abhängigkeit in `frontend/package.json`
vorhanden, wird aber noch nicht genutzt. Bitte in `frontend/src/App.jsx`
einen Router aufsetzen mit folgenden Routen:

- `/login` → Login-Seite (siehe Teil 2)
- `/` → Bibliotheksansicht (siehe Teil 4), nur erreichbar wenn eingeloggt
- `/editor/neu` → Editor mit leerer neuer Übung
- `/editor/:id` → Editor lädt die Übung mit dieser ID und zeigt sie an

Für den Eingeloggt-Status: Token nach Login in `localStorage` unter einem
Schlüssel wie `sve_trainer_token` speichern. Eine kleine Hilfsfunktion/Hook
`useAuth()` in `frontend/src/hooks/useAuth.js` erstellen, die den Token aus
`localStorage` liest, bei Bedarf gegen `/api/auth/me` validiert, und
`{ user, token, login(), logout() }` zurückgibt.

Alle Routen außer `/login` sollen über eine kleine `RequireAuth`-Wrapper-
Komponente geschützt sein, die bei fehlendem/ungültigem Token auf `/login`
umleitet.

## Teil 2: Login-Seite

Neue Komponente `frontend/src/components/auth/LoginPage.jsx`:
- Einfaches Formular mit E-Mail- und Passwort-Feld, Submit-Button "Anmelden"
- Bei Submit: POST an `/api/auth/login` mit `{ email, password }`
- Bei Erfolg: Token speichern (über `useAuth().login(...)`), Weiterleitung
  zur Bibliotheksansicht (`/`)
- Bei Fehler (401): Fehlermeldung anzeigen ("E-Mail oder Passwort falsch.")
- Schlichtes, zentriertes Layout (Karte mittig auf der Seite), Titel
  "SV Enkenbach – Trainer-Tool", deutsche Beschriftungen durchgehend

Die Backend-Basis-URL bitte nicht hart codieren, sondern über eine Umgebungs-
variable `VITE_API_URL` konfigurierbar machen (Vite liest automatisch
`.env`-Dateien mit `VITE_`-Prefix). Eine kleine zentrale Datei
`frontend/src/lib/api.js` erstellen mit einer `apiFetch(path, options)`-
Hilfsfunktion, die automatisch die Basis-URL voranstellt und, falls ein
Token vorhanden ist, den `Authorization: Bearer <token>`-Header ergänzt.
Alle folgenden API-Aufrufe (Speichern, Laden der Bibliothek, etc.) sollen
über diese Funktion laufen statt direkt `fetch` zu nutzen.

## Teil 3: Speichern-Funktion im Editor

In `frontend/src/components/editor/Editor.jsx`:
- Oben im Editor (z. B. in der Toolbar-Zeile oder einer neuen Kopfzeile
  darüber) Felder für Titel, Kategorie-Auswahl (Mehrfachauswahl aus den
  Kategorien, die über `GET /api/categories` geladen werden), Altersgruppe
  (Freitextfeld reicht fürs Erste) und Dauer in Minuten ergänzen.
- Einen "Speichern"-Button hinzufügen. Beim Klick:
  - Wenn die Übung neu ist (Route `/editor/neu`): `POST /api/exercises` mit
    `{ title, description, age_group, duration_minutes, field_template,
    choreography: { objects, keyframes }, category_ids }`. Nach Erfolg zur
    URL `/editor/:id` der neu erzeugten Übung wechseln (damit weiteres
    Speichern als Update funktioniert, nicht wieder als Neuanlage).
  - Wenn eine bestehende Übung bearbeitet wird (Route `/editor/:id`):
    `PUT /api/exercises/:id` mit denselben Feldern.
- Kurzes Feedback nach dem Speichern anzeigen (z. B. "Gespeichert" für ein
  bis zwei Sekunden einblenden, dann wieder ausblenden — kein hartes
  `alert()`).
- Beim Laden über `/editor/:id`: `GET /api/exercises/:id` aufrufen und
  `objects`/`keyframes` aus der zurückgegebenen `choreography` in den
  Editor-State laden, sowie Titel/Kategorie/Altersgruppe/Dauer in die
  entsprechenden Felder.

Wichtig: Die `objects`-Liste (Typen, Team, Pose) und `keyframes`-Liste
(Positionen pro Frame) existieren bereits als getrennte States in
`Editor.jsx` — beim Speichern beide zusammen in ein Objekt
`{ objects, keyframes }` verpacken, das dann als `choreography` ans Backend
geht; beim Laden entsprechend wieder auseinandernehmen.

## Teil 4: Bibliotheksansicht

Neue Komponente `frontend/src/components/library/LibraryPage.jsx`:
- Lädt beim Mounten die Übungsliste über `GET /api/exercises`
- Zeigt die Übungen als Karten-Grid: Titel, Kategorien als kleine Badges,
  Altersgruppe, Dauer, Datum der letzten Änderung
- Oben ein Suchfeld (filtert per `?search=`-Query-Parameter ans Backend,
  das diesen Parameter laut `exercisesController.js` bereits unterstützt)
  und eine Kategorie-Dropdown-Filterung (`?category=`-Parameter, ebenfalls
  bereits unterstützt)
- Jede Karte ist klickbar und navigiert zu `/editor/:id`
- Button "Neue Übung" oben, der zu `/editor/neu` navigiert
- Lösch-Möglichkeit pro Karte (kleiner Button/Icon, mit kurzer
  Bestätigungsabfrage "Übung wirklich löschen?" bevor `DELETE
  /api/exercises/:id` aufgerufen wird)
- Logout-Button irgendwo sichtbar platzieren (oben rechts reicht), der
  `useAuth().logout()` aufruft und zu `/login` zurückleitet

Bitte als eigenständige Seite mit eigenem, übersichtlichem Grid-Layout
umsetzen (CSS in `index.css` ergänzen, eigene Klassen wie `.library-grid`,
`.library-card` etc.), nicht als Konva-Canvas — das ist reines HTML/CSS.

---

## Allgemeine Hinweise
- Bitte nach jedem Teil kurz testen: Teil 0+2 zusammen (Login funktioniert
  mit dem angelegten Admin), dann Teil 3 (eine Übung im Editor anlegen und
  speichern, in der Datenbank/per API prüfen dass sie ankommt), dann Teil 4
  (Bibliothek zeigt die gespeicherte Übung, Klick öffnet sie wieder im
  Editor mit den ursprünglichen Objekten/Keyframes).
- Deutsche Beschriftungen und Kommentare wie bisher im Projekt.
- Falls beim Laden einer Übung in den Editor Objekte fehlen sollten (z. B.
  weil `iconPath`-Referenzen aus der vorherigen Aufgabe noch nicht überall
  gegriffen haben), bitte das nicht "stillschweigend" reparieren, sondern
  kurz Rückmeldung geben, was beobachtet wurde.
