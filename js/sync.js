// Transfert par QR code via le relais : la sauvegarde est compressée puis chiffrée (AES-GCM 256) dans le navigateur.
// La clé n'est que dans le QR code : le relais ne stocke qu'un paquet illisible, effacé au bout de 10 minutes.
import { RELAY } from './config.js';

// Encodage par morceaux : String.fromCharCode(...tableau) plante au-delà de ~100 Ko (sauvegarde avec photo d'avatar).
function b64u(buf) {
  const u = new Uint8Array(buf); let bin = '';
  for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const hex = (n) => [...crypto.getRandomValues(new Uint8Array(n))].map(b => b.toString(16).padStart(2, '0')).join('');

async function gzip(text) { return new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer(); }
async function gunzip(buf) { return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text(); }

export const available = () => !!RELAY;

export function newSession() {
  const raw = crypto.getRandomValues(new Uint8Array(32));
  return { id: hex(16), key: b64u(raw), raw };
}
export function qrPayload(dir, s) {
  return `cyberdeck://sync?d=${dir}&r=${encodeURIComponent(RELAY)}&i=${s.id}&k=${s.key}`;
}
async function cryptoKey(raw) { return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']); }

export async function upload(s, json) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await cryptoKey(s.raw), await gzip(json));
  const r = await fetch(`${RELAY}/box/${s.id}`, { method: 'PUT', body: b64u(iv) + '.' + b64u(ct) });
  if (r.status === 413) throw new Error('Sauvegarde trop lourde pour le relais (plus de 2 Mo)');
  if (!r.ok) throw new Error('Relais indisponible (' + r.status + ')');
}
/** Attend le paquet du téléphone (10 min max). Renvoie le JSON déchiffré. */
export async function waitDownload(s, isCancelled) {
  const end = Date.now() + 10 * 60 * 1000;
  while (Date.now() < end && !isCancelled()) {
    const r = await fetch(`${RELAY}/box/${s.id}`).catch(() => null);
    if (r && r.ok) {
      const [iv, ct] = (await r.text()).split('.');
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64u(iv) }, await cryptoKey(s.raw), unb64u(ct));
      fetch(`${RELAY}/box/${s.id}`, { method: 'DELETE' }).catch(() => {});
      return gunzip(plain);
    }
    await new Promise(res => setTimeout(res, 2000));
  }
  return null;
}
export async function waitPickedUp(s, isCancelled) {
  const end = Date.now() + 10 * 60 * 1000;
  while (Date.now() < end && !isCancelled()) {
    const r = await fetch(`${RELAY}/box/${s.id}`).catch(() => null);
    if (r && r.status === 404) return true;
    await new Promise(res => setTimeout(res, 2500));
  }
  return false;
}
