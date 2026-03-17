
import { showToast } from './ui.js';

export function initGeocode(btnSel){
  const btn=document.querySelector(btnSel); if(!btn) return;
  btn.addEventListener('click', ()=> autoLocate(btn));
}

async function autoLocate(btn){
  if(!navigator.geolocation) return showToast('Geolokalisierung nicht unterstützt','error');
  const orig=btn.textContent; btn.textContent='⏳'; btn.disabled=true;
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const admin = encodeURIComponent(localStorage.getItem('brugger_admin_email')||'');
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&addressdetails=1${admin?`&email=${admin}`:''}`;
      const res = await fetch(url); const data = await res.json();
      if(data && data.address){
        const a=data.address; const street=a.road||a.pedestrian||a.footway||''; const nr=a.house_number||'';
        const input = document.getElementById('adresse'); if(input) input.value = `${street} ${nr}`.trim();
        showToast('Adresse übernommen','success');
      } else showToast('Adresse nicht ermittelbar','error');
    }catch{ showToast('Fehler beim Abrufen','error'); }
    finally{ btn.textContent=orig; btn.disabled=false; }
  }, ()=>{ showToast('Standort konnte nicht ermittelt werden','error'); btn.textContent=orig; btn.disabled=false; }, { enableHighAccuracy:true, timeout:10000, maximumAge:0 });
}
