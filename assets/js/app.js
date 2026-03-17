
import { qs, on } from './modules/ui.js';
import { applyTheme, loadSettingsIntoUI, openSettingsDialog, saveSettings, secureLoginInit, restoreAutosaveInit, hardReset } from './modules/storage.js';
import { startApp } from './modules/reports.js';
import { registerPWA } from './modules/pwa.js';

applyTheme();
loadSettingsIntoUI();
registerPWA();
secureLoginInit();
restoreAutosaveInit();

on('#loginBtn','click', async ()=>{
  const ok = await window.__attemptLogin?.();
  if(ok){ qs('#login-container').classList.add('hidden'); qs('#menu-container').classList.remove('hidden'); }
});

on('#loginPassword','keyup', (e)=>{ if(e.key==='Enter') qs('#loginBtn').click(); });

on('#openSettings','click', openSettingsDialog);
on('#saveSettings','click', (e)=>{ e.preventDefault(); saveSettings(); });

on('#importSaved','click', ()=> qs('#startImportFile').click());
on('#startImportFile','change', (e)=> window.__importFromStart?.(e.target));
on('#restoreAutosave','click', ()=> window.__restoreAutosave?.());
on('#hardReset','click', hardReset);

['LO','KB','RB','DL'].forEach(code=>{
  on(`[data-app="${code}"]`, 'click', ()=> startApp(code));
});
