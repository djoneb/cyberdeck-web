// Compte les appareils qui téléchargent l'appli : un identifiant aléatoire par navigateur, envoyé au relais au clic.
import { RELAY } from './config.js';

function deviceId() {
  let id = null;
  try { id = localStorage.getItem('cd_dev'); } catch (e) {}
  if (!id || !/^[a-f0-9]{32}$/.test(id)) {
    const b = crypto.getRandomValues(new Uint8Array(16));
    id = Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
    try { localStorage.setItem('cd_dev', id); } catch (e) {}
  }
  return id;
}
function kind() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  return 'pc';
}
document.querySelectorAll('a[data-dl]').forEach(a => a.addEventListener('click', () => {
  if (!RELAY) return;
  const body = JSON.stringify({ d: deviceId(), k: kind() });
  // text/plain : pas de requête préalable CORS, et sendBeacon survit au départ vers le téléchargement
  try { if (navigator.sendBeacon(RELAY + '/dl', new Blob([body], { type: 'text/plain' }))) return; } catch (e) {}
  fetch(RELAY + '/dl', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
}));
