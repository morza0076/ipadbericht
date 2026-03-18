# Brugger Formulare – iPad‑Bericht PWA

Eine Progressive Web App (PWA) zur Erstellung und Verwaltung von Berichten für den iPad-Einsatz. Die App läuft vollständig im Browser und kann auf iOS/iPadOS sowie Desktop-Geräten als installierbare App genutzt werden.

---

## Inhalt

- [Beschreibung](#beschreibung)
- [Funktionen](#funktionen)
- [Installation & lokale Verwendung](#installation--lokale-verwendung)
- [PWA-Hinweise](#pwa-hinweise)
- [Service Worker testen](#service-worker-testen)
- [Icons & Manifest](#icons--manifest)
- [Lizenz](#lizenz)

---

## Beschreibung

Die App ermöglicht das Erstellen von Berichten (Leckortung, Kanalreinigung, Regie, Datenlogger) direkt auf dem iPad. Sie ist als PWA konzipiert, d. h. sie funktioniert auch offline und kann auf dem Homescreen installiert werden.

**Technologie-Stack:**
- Vanilla HTML / CSS / JavaScript (kein Framework)
- Service Worker für Offline-Unterstützung
- Web App Manifest für PWA-Installation

---

## Funktionen

- 🔐 PIN-geschützter Login-Bereich
- 📝 Verschiedene Berichtstypen auswählbar
- 💾 Autosave & gespeicherte Berichte laden
- ⚙️ Einstellungen (E-Mail, Techniker, Dark Mode, PIN)
- 📴 Offline-Betrieb dank Service Worker (App Shell Caching)
- 🌓 Dark Mode Unterstützung

---

## Installation & lokale Verwendung

### Voraussetzungen

- Ein moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Für lokale Entwicklung: ein einfacher HTTP-Server (Service Worker benötigen HTTPS oder localhost)

### Lokal starten

**Option 1 – Python (empfohlen, kein Install nötig):**

```bash
# Python 3
python3 -m http.server 8080
# Dann im Browser öffnen: http://localhost:8080
```

**Option 2 – Node.js mit `serve`:**

```bash
npx serve .
```

**Option 3 – VS Code Live Server:**

Rechtsklick auf `index.html` → „Open with Live Server"

---

## PWA-Hinweise

- Die App kann auf **iOS/iPadOS** über Safari → „Zum Home-Bildschirm" installiert werden.
- Auf **Android/Desktop** erscheint ein Installations-Banner, wenn Manifest und Service Worker korrekt registriert sind.
- Die App-Shell (index.html, CSS, JS, Logo) wird beim ersten Besuch gecacht und steht danach offline zur Verfügung.
- Bei einer neuen Version der App muss der Service Worker manuell aktualisiert werden (Cache-Version in `sw.js` hochzählen).

---

## Service Worker testen

1. App in Chrome/Edge öffnen (auf `localhost` oder HTTPS).
2. Chrome DevTools öffnen → **Application** → **Service Workers**.
3. „Update on reload" aktivieren, dann Seite neu laden.
4. Unter **Cache Storage** prüfen, ob `brugger-v7` und `brugger-runtime-v1` angelegt wurden.
5. **Offline-Test:** In DevTools → Network → Throttling auf „Offline" stellen → Seite neu laden. Die App sollte trotzdem erscheinen.

---

## Icons & Manifest

Die PWA-Icons befinden sich im Ordner `icons/`:

| Datei              | Größe   | Typ |
|--------------------|---------|-----|
| `icon-192.svg`     | 192×192 | SVG |
| `icon-512.svg`     | 512×512 | SVG |

Die Icons sind als Platzhalter gestaltet (goldenes „B" auf gelbem Hintergrund). Für den Produktionseinsatz können diese durch eigene PNG/SVG-Icons ersetzt werden. Das Manifest verweist auf diese Dateien über relative Pfade (`./icons/...`), was mit GitHub Pages kompatibel ist.

---

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).

© 2024 Brugger Entfeuchtung