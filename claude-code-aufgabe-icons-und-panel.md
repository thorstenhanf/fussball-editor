# Aufgabe für Claude Code: Echte Icons + Eigenschaften-Panel

Kontext: Dies ist der Fußball-Trainer-Editor (React + Vite + react-konva).
Aktuell sind Spieler/Equipment nur Platzhalter-Formen (Kreise, Dreiecke) und
es gibt kein Eigenschaften-Panel für Werkzeuge. Beides soll jetzt ergänzt
werden, analog zu den Referenz-Screenshots von ft-graphics.fussballtraining.com
(liegen als Bilder im Chat-Verlauf vor, falls du sie mir nochmal zeigen
kannst/sollst — sonst beschreibe ich es unten so genau wie möglich).

Bitte in der Reihenfolge der Abschnitte vorgehen, nach jedem Abschnitt kurz
`npm run dev` im frontend-Ordner laufen lassen und visuell prüfen, dass nichts
kaputt ist, bevor der nächste Abschnitt beginnt.

---

## Teil 1: Echte SVG-Icons für Spieler und Equipment

### 1a. Spieler-Sprites
Ersetze in `frontend/src/components/editor/PlacedObject.jsx` die aktuelle
Kreis+Buchstabe-Darstellung für `object.type === 'player'` durch echte
SVG-Spielerfiguren, abhängig von `object.pose`:

- `pose: 'laufen'` → Spielerfigur in Laufbewegung (ein Bein vorne angewinkelt)
- `pose: 'stehen'` → Spielerfigur aufrecht stehend, Arme leicht angewinkelt
- `pose: 'passen'` → Spielerfigur mit ausgestrecktem Spielbein (Schussbewegung)
- `pose: 'springen'` → Spielerfigur mit beiden Armen oben, in der Luft

Zusätzlich: wenn `object.role === 'torhueter'`, eine eigene Torhüter-Silhouette
(z. B. mit ausgebreiteten Armen) statt der normalen Pose verwenden.
Wenn `object.role === 'trainer'`, eine neutrale Stehfigur ohne Trikot/mit
anderer Kleidung (z. B. längere Hose) verwenden.

Die Trikotfarbe soll weiterhin von `object.team` abhängen (`a` = Blau, `b` =
Rot, `neutral` = Grau/Dunkelblau für Trainer) — am saubersten lösbar, indem
das SVG-Trikot-Element eine `fill`-Farbe aus einer kleinen Lookup-Tabelle
bekommt, statt für jede Farbe ein eigenes SVG zu bauen.

Technischer Hinweis: react-konva kann kein beliebiges SVG direkt rendern.
Zwei gängige Wege:
1. Mit `Konva.Path` die SVG-Pfade (d-Attribute) nachbauen — funktioniert gut
   für einfache, flache Figuren.
2. Mit `useImage` (Hook aus `react-konva-utils` oder selbst geschrieben via
   `new window.Image()` + `Konva.Image`) ein vorgerendertes PNG/SVG als
   Bild laden und als `<Image>` in Konva einbinden.

Empfehlung: Variante 2 ist deutlich einfacher zu pflegen und erlaubt,
die Spielerfiguren als eigenständige `.svg`-Dateien in
`frontend/src/assets/players/` abzulegen (z. B. `spieler_laufen.svg`,
`spieler_stehen.svg`, `torhueter_stehen.svg`, `trainer_stehen.svg` — als
neutrale schwarz/weiß-Silhouetten ohne feste Trikotfarbe), und die Teamfarbe
dann zur Laufzeit per CSS-Filter oder durch Einfärben einer Maske zu setzen.
Falls das Einfärben zu komplex wird, ist es auch akzeptabel, pro Team eine
eigene Variante des SVGs mit fest codierter Farbe zu erzeugen (also z. B.
`spieler_laufen_blau.svg` und `spieler_laufen_rot.svg`) — einfacher, aber
mehr Dateien. Bitte für den Anfang den einfacheren Weg (separate Dateien pro
Team) wählen, das lässt sich später noch verfeinern.

Die SVGs selbst bitte als einfache, klare Strichfiguren selbst zeichnen
(geometrische Grundformen: Kreis für Kopf, Rechtecke/Pfade für Rumpf, Beine,
Arme) — keine echten Personen oder lizenzierte Spielerfiguren nachbilden.

### 1b. Equipment-Icons
Ersetze ebenfalls in `PlacedObject.jsx` die Platzhalter-Formen für:
- `huetchen` → klassische flache Hütchen-Form (wie eine kleine Kuppel von
  oben/leicht schräg betrachtet), orange
- `pylon` → klassischer Pylon/Kegel (höher, spitzer als Hütchen), orange
- `tor` / `minitor` / `hallentor` → Tor mit Pfosten und angedeutetem Netz
  (Gitter-Muster), unterschiedlich groß je nach Typ
- `fahne` → kleine Eckfahne (Stange + dreieckiges Fähnchen)
- `leiter` → liegende Koordinationsleiter (mehrere parallele Querstreben)
- `stange` → einzelne senkrechte Slalomstange
- `ring` → liegender Ring/Reifen (Ellipse mit Loch, also Ring-Form)
- `ball` → Fußball mit angedeutetem Fünfeck-Muster (nicht das offizielle
  Adidas-Telstar-Muster wegen Markenrechten, ein generisches Fünfeck-Muster
  reicht völlig)

Gleiche Technik wie bei den Spielern: SVG-Dateien in
`frontend/src/assets/equipment/`, dann per Bild-Referenz in Konva einbinden.

### 1c. Lookup-Tabelle pflegen
Aktualisiere `frontend/src/lib/elementLibrary.js`, sodass jeder Eintrag in
`PLAYER_GROUPS` und `EQUIPMENT_GROUPS` ein zusätzliches Feld `iconPath`
bekommt, das auf die jeweilige SVG-Datei zeigt (z. B.
`iconPath: '/src/assets/equipment/huetchen.svg'`). `PlacedObject.jsx` und
`ElementPicker.jsx` sollen darüber die Vorschau-/Render-Bilder laden, statt
Pfade hart zu codieren.

Auch `ElementPicker.jsx` soll diese Icons in den Auswahl-Karten anzeigen
(aktuell zeigt es nur den ersten Buchstaben des Labels als Platzhalter).

---

## Teil 2: Eigenschaften-Panel (rechts) für aktive Werkzeuge

Referenz-Verhalten (aus den Original-Screenshots): Sobald ein Zeichenwerkzeug
aktiv ist oder ein gezeichnetes Objekt ausgewählt wird, erscheint rechts ein
Panel mit den für dieses Werkzeug relevanten Optionen. Das Panel ändert sich
je nach Werkzeugtyp.

### 2a. Neue Komponente `PropertiesPanel.jsx`
Erstelle `frontend/src/components/editor/PropertiesPanel.jsx`. Sie bekommt als
Props den aktuell aktiven Werkzeugtyp bzw. das aktuell ausgewählte Objekt und
rendert je nach Typ unterschiedliche Optionsgruppen:

**Für Pfeile (`arrow_straight`, `arrow_curved`):**
- Krümmung: Gerade / Gebogen (Radio-Auswahl, sollte das Werkzeug selbst
  umschalten können, nicht nur Anzeige)
- Linientyp: Normal / Gestrichelt / Geschlängelt (geschlängelt = Dribbling-
  Symbol im Fußballkontext — als gewellte/sinusförmige Linie umsetzen)
- Linienende: Keine / Pfeil (Pfeilspitze am Ende ja/nein)
- Linienfarbe: Farbwähler (kleines Farbfeld + Klick öffnet
  Browser-Farbpicker via `<input type="color">`)
- Linienbreite: Numerisches Eingabefeld (Standard 2)
- Pfeilgröße: Numerisches Eingabefeld (Standard 5, nur relevant wenn
  Linienende = Pfeil)

**Für Text:**
- Schriftstil: Normal / Fett / Kursiv (Mehrfachauswahl möglich, beides
  gleichzeitig aktivierbar)
- Schriftgröße: Numerisches Eingabefeld (Standard 14)
- Schriftfarbe: Farbwähler

**Für Rechteck/Ellipse:**
- Füllfarbe: Farbwähler (mit Option "Keine Füllung" / transparent)
- Randfarbe: Farbwähler
- Randbreite: Numerisches Eingabefeld

**Für Spieler/Equipment (wenn ein platziertes Objekt ausgewählt ist):**
- Team-Zugehörigkeit ändern (für Spieler: Team A / Team B / Neutral —
  ändert die Trikotfarbe)
- Lösch-Button für das ausgewählte Objekt

Wenn kein Werkzeug mit Optionen aktiv ist und kein Objekt ausgewählt ist,
soll das Panel einfach nicht angezeigt werden (kein leerer Rahmen).

### 2b. State-Verwaltung in `Editor.jsx`
Erweitere den State in `Editor.jsx` um ein Objekt `toolOptions`, das die
aktuell gewählten Eigenschaften für das jeweils aktive Werkzeug hält, z. B.:
```js
const [toolOptions, setToolOptions] = useState({
  arrow: { curve: 'straight', lineStyle: 'normal', lineEnd: 'arrow', color: '#1f2937', width: 2, arrowSize: 5 },
  text: { style: [], fontSize: 14, color: '#1f2937' },
  shape: { fill: 'transparent', stroke: '#1f2937', strokeWidth: 2 },
});
```
Diese Optionen sollen beim Zeichnen eines neuen Objekts (Pfeil, Text, Form)
in das jeweils neu erzeugte Objekt übernommen werden, damit jedes Objekt
seine eigenen Eigenschaften "einfriert" und spätere Änderungen an
`toolOptions` nicht rückwirkend alle bereits gezeichneten Objekte verändern.

Layout-Anpassung: `editor-canvas-wrapper` soll jetzt rechts Platz für das
neue `PropertiesPanel` lassen (Flexbox: Toolbar oben, darunter eine Zeile mit
Canvas links + Properties-Panel rechts, analog zum Seitenverhältnis in den
Screenshots). Bitte CSS in `index.css` entsprechend ergänzen
(`.editor-main-row { display: flex; }`, `.properties-panel { width: 280px;
border-left: 1px solid #e5e7eb; background: #fff; padding: 16px; }` als
Ausgangspunkt, gerne optisch verfeinern).

### 2c. Pfeil-Werkzeug tatsächlich implementieren
Aktuell existiert das Pfeil-Werkzeug nur als Toolbar-Button ohne
Zeichenlogik. Bitte ergänzen:
- Klick auf "Pfeil (gerade)" oder "Pfeil (gebogen)" aktiviert einen
  Zeichenmodus: erster Klick auf die Canvas setzt den Startpunkt, zweiter
  Klick setzt den Endpunkt und erzeugt das Pfeil-Objekt mit den aktuellen
  `toolOptions.arrow`-Werten.
- Bei "gebogen" einen einfachen Kontrollpunkt in der Mitte erzeugen, den man
  nachträglich ziehen kann, um die Kurve zu formen (Quadratic Bezier reicht).
- Render-Logik dafür in `PlacedObject.jsx` ergänzen (Konva `Arrow` für
  gerade Linien, Konva `Shape` mit eigenem `sceneFunc` für gebogene Pfeile
  mit Quadratic-Bezier-Pfad).
- Gestrichelte Variante über Konva's `dash`-Prop, geschlängelte Variante
  über eine selbst berechnete Sinus-Wellenlinie im `sceneFunc`.

---

## Allgemeine Hinweise
- Bitte nach jedem der drei Teile (1a, 1b/1c, 2) einen kurzen Test im Browser
  machen (`npm run dev` im `frontend`-Ordner, falls nicht schon offen) und mir
  kurz Bescheid geben, was sichtbar funktioniert bzw. wo es noch hakt.
- Code-Kommentare und Variablennamen bitte weiterhin auf Deutsch halten
  (Projekt-Konvention bisher), reiner Code/Syntax natürlich Englisch wie
  üblich in JS/React.
- Bei Unsicherheiten bezüglich der genauen visuellen Gestaltung der Icons:
  einfache, klare Strichzeichnungen reichen völlig, es muss nicht
  fotorealistisch sein — Hauptsache erkennbar und konsistent im Stil.
