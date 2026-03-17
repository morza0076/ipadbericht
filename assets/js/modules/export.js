
import { showToast } from './ui.js';

export function initExport(code){
  document.getElementById('printAndSave')?.addEventListener('click', async ()=>{ await exportFullReport(code); setTimeout(()=> window.print(), 400); });
  document.getElementById('sendEmail')?.addEventListener('click', ()=>{ window.print(); setTimeout(()=>{
    const emailTarget = localStorage.getItem('brugger_email')||'kanal@brugger-entfeuchtung.at';
    const subject = buildReportBaseName(code);
    const body = 'BITTE DAS SOEBEN ERSTELLTE PDF HIER ANHÄNGEN.

Gesendet vom Brugger-Formular.';
    window.location.href = `mailto:${emailTarget}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, 600); });
}

function buildReportBaseName(code){
  const adr = (document.getElementById('adresse')?.value||'').trim();
  let base = ({LO:'Leckortungsbericht', KB:'Kanalreinigungs- & Inspektionsbericht', RB:'Regiebericht', DL:'Datenlogger-Auswertung'})[code]||'Bericht';
  return adr? `${base} - ${adr}` : base;
}

async function exportFullReport(code){
  const data = collectData(code);
  const name = buildReportBaseName(code).replace(/[\/?%*:|"<>]/g,'-') + '.lok';
  const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href);
  showToast('Bericht gespeichert','success');
}

function collectData(code){
  const byId={}; ['name','datum','adresse','befund'].forEach(id=>{ const el=document.getElementById(id); if(el) byId[id]=el.value; });
  // Fotos einsammeln (einfach)
  const photos = Array.from(document.querySelectorAll('#photoGrid img')).map(img=> img.src);
  // Skizze als PNG
  let sketch=''; try{ sketch = document.getElementById('sketchCanvas').toDataURL('image/png'); }catch(e){}
  return { appType:code, byId, photos, sketch, version:1 };
}
