// assets/js/app.js – App-Startup-Code für Brugger Formulare PWA

// Service Worker registrieren (falls vom Browser unterstützt)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('[SW] Registrierung erfolgreich, Scope:', registration.scope);
      })
      .catch((error) => {
        console.warn('[SW] Registrierung fehlgeschlagen:', error);
      });
  });
}

// Login-Skeleton: Basis-EventListener für den Login-Button
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');
  const loginContainer = document.getElementById('login-container');
  const menuContainer = document.getElementById('menu-container');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const pin = loginPassword ? loginPassword.value.trim() : '';

      // Einfache PIN-Validierung (Skeleton – keine echte Authentifikation)
      if (pin.length >= 4 && /^[0-9]+$/.test(pin)) {
        if (loginError) loginError.classList.add('hidden');
        if (loginContainer) loginContainer.classList.add('hidden');
        if (menuContainer) menuContainer.classList.remove('hidden');
      } else {
        if (loginError) loginError.classList.remove('hidden');
        if (loginPassword) loginPassword.focus();
      }
    });

    // Login auch per Enter-Taste auslösen
    if (loginPassword) {
      loginPassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loginBtn.click();
      });
    }
  }

  // Settings-Dialog öffnen
  const openSettingsBtn = document.getElementById('openSettings');
  const settingsModal = document.getElementById('settingsModal');
  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => settingsModal.showModal());
  }
});