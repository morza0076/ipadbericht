# Brugger Formulare – ipadbericht

Eine Progressive Web App (PWA) zur Erstellung von Berichten für Brugger Entfeuchtung.

## Projektbeschreibung

Die App ermöglicht das Erstellen und Verwalten von:
- Leckortungsberichten
- Kanalreinigungs- & Inspektionsberichten
- Regieberichten
- Datenlogger-Auswertungen

Sie läuft vollständig im Browser, speichert Daten lokal (localStorage) und funktioniert offline als installierbare PWA.

## Lokale Entwicklung (HTTP-Server erforderlich)

Da die App einen Service Worker verwendet, muss sie über HTTP(S) ausgeliefert werden – nicht direkt als `file://`.

**Option 1 – Python:**
```bash
python3 -m http.server 8080
```

**Option 2 – Node.js:**
```bash
npx http-server -p 8080
```

Dann im Browser öffnen: [http://localhost:8080](http://localhost:8080)

## Login / Entsperren

- **Standard-PIN:** `1234`
- Den PIN kann man in den Einstellungen (⚙️-Button) ändern.
- Einstellungen werden im `localStorage` des Browsers gespeichert (kein Server).
- **App-Reset:** Mit dem „App Reparatur / Reset"-Button werden alle lokalen Einstellungen gelöscht und die App neu geladen. Danach gilt wieder der Standard-PIN `1234`.

## PWA – Offline-Nutzung

Der Service Worker (`sw.js`) cached die App-Shell beim ersten Laden:
- `index.html`, `Logo.PNG`, `assets/css/app.css`, `assets/js/app.js`

**Service Worker testen:**
1. App einmal online laden (SW wird registriert und Cache befüllt)
2. In den Browser-DevTools unter *Application → Service Workers* prüfen ob SW aktiv ist
3. Netzwerk deaktivieren (Offline-Modus in DevTools)
4. Seite neu laden → App sollte offline weiter funktionieren

**Update des Service Workers:**
- Bei Änderungen an `sw.js`: `CACHE_NAME` auf neue Version erhöhen (z. B. `brugger-v7`)
- In Chrome DevTools: *Application → Service Workers → Update on reload* aktivieren

## Icons & Manifest

- Icons liegen als SVG-Platzhalter in `icons/icon-192.svg` und `icons/icon-512.svg`
- Das Manifest (`manifest.webmanifest`) verwendet relative Pfade (`./icons/...`) für GitHub Pages-Kompatibilität
- Für Produktion: echte PNG-Icons (192×192 und 512×512) empfohlen und in `manifest.webmanifest` eintragen

## Dateistruktur

```
ipadbericht/
├── index.html              # Haupt-HTML (Login + Menü)
├── sw.js                   # Service Worker
├── manifest.webmanifest    # PWA-Manifest
├── Logo.PNG                # Firmenlogo
├── icons/
│   ├── icon-192.svg        # PWA-Icon (192px)
│   └── icon-512.svg        # PWA-Icon (512px)
└── assets/
    ├── css/app.css         # App-Styles
    └── js/app.js           # App-Logik (Login, Einstellungen)
```

## Lizenz

MIT – siehe [LICENSE](./LICENSE)
