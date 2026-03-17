
import { showToast, qs } from './ui.js';
import { initDrawing } from './drawing.js';
import { initPhotos } from './photos.js';
import { initExport } from './export.js';
import { initGeocode } from './geocode.js';
import { initTemplates } from './templates.js';
import { initCustomers } from './customers.js';

function basePage(title){
  return `
  <div class="controls">
    <button class="btn btn--primary" id="printAndSave">Drucken & Speichern</button>
    <button class="btn" id="sendEmail">E‑Mail senden</button>
    <input type="file" id="photoInput" accept="image/*" multiple class="hidden" />
    <button class="btn" id="addPhotos">Fotos hinzufügen</button>
    <button class="btn" id="homeBtn">🏠 Zum Hauptmenü</button>
  </div>
  <section class="sheet">
    <header class="sheet__header">
      <div class="sheet__brand">
        <img src="Logo.PNG" alt="Brugger Logo" class="logo" onerror="this.style.display='none'" />
        <div class="brand__text">
          <strong>Brugger Entfeuchtung & Kanaltechnik GmbH</strong><br/>
          Liebenauer Hauptstraße 181, 8041 Graz<br/>
          Tel: +43 316 471771 · office@brugger-entfeuchtung.at
        </div>
      </div>
      <h1 class="sheet__title">${title}</h1>
    </header>

    <div class="grid-2">
      <div>
        <label class="label">Kunde / Mieter vor Ort</label>
        <input type="text" id="name" class="input" />
      </div>
      <div>
        <label class="label">Datum</label>
        <input type="date" id="datum" class="input" />
      </div>
    </div>

    <label class="label">Einsatzadresse</label>
    <div class="row">
      <input type="text" id="adresse" class="input" placeholder="Straße / Hausnummer" />
      <button class="btn" id="autoLocate">📍 Ortung</button>
    </div>

    <h2 class="sheet__title" style="font-size:16px;margin-top:10px">Befund</h2>
    <textarea id="befund" class="input" rows="5" placeholder="Ergebnisse der Ortung…"></textarea>

    <h2 class="sheet__title" style="font-size:16px;margin-top:10px">Skizze</h2>
    <div style="border:1px dashed var(--border); border-radius:8px; overflow:hidden;">
      <canvas id="sketchCanvas" style="width:100%;height:360px;display:block"></canvas>
    </div>

    <h2 class="sheet__title" style="font-size:16px;margin-top:10px">Fotos</h2>
    <div id="photoGrid" style="display:grid;grid-template-columns:1fr 1fr; gap:12px;"></div>

    <footer class="sheet__footer"><span>Brugger GmbH</span><span>Seite 1</span></footer>
  </section>`;
}

export function startApp(code){
  const titles = { LO:'Leckortungsbericht', KB:'Kanalreinigungs- & Inspektionsbericht', RB:'Regiebericht', DL:'Datenlogger Auswertung' };
  const root = document.getElementById('app-root');
  root.innerHTML = basePage(titles[code]||'Bericht');
  showToast(`${titles[code]} gestartet`,'success');

  document.getElementById('homeBtn').addEventListener('click', ()=> location.reload());
  document.getElementById('addPhotos').addEventListener('click', ()=> document.getElementById('photoInput').click());

  initDrawing('#sketchCanvas');
  initPhotos('#photoInput', '#photoGrid');
  initExport(code);
  initGeocode('#autoLocate');
  initTemplates(code);
  initCustomers();
}
