// Service Worker registrieren
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {
    // SW-Registrierung fehlgeschlagen – App läuft trotzdem weiter
  });
}

// Standard-PIN für Erstbenutzung
const DEFAULT_PIN = '1234';
const SETTINGS_KEY = 'brugger_settings';

/** Einstellungen aus localStorage laden */
function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  } catch (_) {
    return {};
  }
}

/** Einstellungen in localStorage speichern */
function saveSettings(obj) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj || {}));
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');
  const loginContainer = document.getElementById('login-container');
  const menuContainer = document.getElementById('menu-container');
  const openSettingsBtn = document.getElementById('openSettings');
  const settingsModal = document.getElementById('settingsModal');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const hardResetBtn = document.getElementById('hardReset');

  // Hilfsfunktionen: Login-Fehlermeldung anzeigen/verstecken
  function showLoginError(msg) {
    if (!loginError) return;
    loginError.textContent = msg || 'PIN falsch!';
    loginError.classList.remove('hidden');
    loginError.setAttribute('aria-hidden', 'false');
  }

  function hideLoginError() {
    if (!loginError) return;
    loginError.classList.add('hidden');
    loginError.setAttribute('aria-hidden', 'true');
  }

  // Einstellungs-Felder mit gespeicherten Werten befüllen
  function populateSettingsInputs() {
    const s = loadSettings();
    const emailEl = document.getElementById('settingsEmail');
    const techEl = document.getElementById('settingsTechnician');
    const adminEl = document.getElementById('settingsAdminEmail');
    const darkEl = document.getElementById('settingsDarkMode');
    const newPinEl = document.getElementById('settingsNewPin');

    if (emailEl) emailEl.value = s.email || '';
    if (techEl) techEl.value = s.technician || '';
    if (adminEl) adminEl.value = s.adminEmail || '';
    if (darkEl) darkEl.checked = !!s.darkMode;
    if (newPinEl) newPinEl.value = ''; // PIN nie vorausfüllen
  }

  // App entsperren (Login-Bereich verstecken, Menü zeigen)
  function unlockApp() {
    if (loginContainer) loginContainer.classList.add('hidden');
    if (menuContainer) menuContainer.classList.remove('hidden');
    hideLoginError();
    if (loginPassword) loginPassword.value = '';
  }

  // Dark-Mode anwenden
  function applyDarkMode() {
    const s = loadSettings();
    if (s.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  applyDarkMode();
  populateSettingsInputs();

  // Login-Button: PIN prüfen
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const pin = loginPassword ? loginPassword.value.trim() : '';
      const s = loadSettings();
      const storedPin = s.pin || DEFAULT_PIN;

      if (!pin || pin.length < 4) {
        showLoginError('PIN zu kurz (min. 4 Ziffern)');
        return;
      }

      if (pin === storedPin) {
        unlockApp();
      } else {
        showLoginError('PIN falsch!');
      }
    });

    // PIN-Feld: Enter-Taste unterstützen
    if (loginPassword) {
      loginPassword.addEventListener('keydown', e => {
        if (e.key === 'Enter') loginBtn.click();
      });
    }
  }

  // Einstellungen-Button: Modal öffnen
  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => {
      populateSettingsInputs();
      if (typeof settingsModal.showModal === 'function') {
        settingsModal.showModal();
      } else {
        settingsModal.classList.add('open');
      }
    });
  }

  // Einstellungen speichern
  if (saveSettingsBtn && settingsModal) {
    saveSettingsBtn.addEventListener('click', () => {
      const emailEl = document.getElementById('settingsEmail');
      const techEl = document.getElementById('settingsTechnician');
      const adminEl = document.getElementById('settingsAdminEmail');
      const darkEl = document.getElementById('settingsDarkMode');
      const newPinEl = document.getElementById('settingsNewPin');

      const s = loadSettings();
      if (emailEl) s.email = emailEl.value.trim();
      if (techEl) s.technician = techEl.value.trim();
      if (adminEl) s.adminEmail = adminEl.value.trim();
      if (darkEl) s.darkMode = darkEl.checked;

      if (newPinEl && newPinEl.value.trim()) {
        const newPin = newPinEl.value.trim();
        if (!/^[0-9]{4,10}$/.test(newPin)) {
          alert('PIN muss aus 4–10 Ziffern bestehen.');
          return;
        }
        s.pin = newPin;
      }

      saveSettings(s);
      applyDarkMode();

      if (typeof settingsModal.close === 'function') {
        settingsModal.close();
      } else {
        settingsModal.classList.remove('open');
      }
    });
  }

  // Hard Reset: Einstellungen löschen und neu laden
  if (hardResetBtn) {
    hardResetBtn.addEventListener('click', () => {
      if (!confirm('Wirklich App reparieren / Reset? Alle lokalen Einstellungen werden gelöscht.')) return;
      localStorage.removeItem(SETTINGS_KEY);
      location.reload();
    });
  }
});