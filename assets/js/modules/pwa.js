
export function registerPWA(){ if('serviceWorker' in navigator && location.protocol.startsWith('http')){ navigator.serviceWorker.register('/sw.js').catch(e=> console.error('SW Error', e)); } }
