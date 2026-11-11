// Sauvegarde Cyberdeck : même format que l'export du launcher (« cyberdeck-progress »).
// files.<fichier>.<clé> = { t: "b"|"i"|"l"|"f"|"s"|"set", v: valeur }

const KEY = 'cyberdeck-web-save';
let save = null;

export function load() {
  try { save = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { save = null; }
  return save;
}
export function hasSave() { return !!save; }
export function persist() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch { /* stockage indisponible */ } }

export function importJson(text) {
  const o = JSON.parse(text);
  if (o.app !== 'cyberdeck-progress' || !o.files) throw new Error('Ce fichier n\'est pas une sauvegarde de progression Cyberdeck.');
  save = o; persist(); return save;
}
export function newGame(name) {
  save = { app: 'cyberdeck-progress', version: 2, date: new Date().toISOString().slice(0, 10), files: {} };
  setS('cyberdeck', 'deckName', name || 'NETRUNNER');
  persist(); return save;
}
export function exportJson() {
  save.date = new Date().toISOString().slice(0, 10);
  return JSON.stringify(save);
}

function file(f) { save.files[f] = save.files[f] || {}; return save.files[f]; }
export function get(f, k, def) { const e = save?.files?.[f]?.[k]; return e ? e.v : def; }
export function setS(f, k, v) { file(f)[k] = { t: 's', v: String(v) }; }
export function setI(f, k, v) { file(f)[k] = { t: 'i', v: Math.round(v) }; }
export function setL(f, k, v) { file(f)[k] = { t: 'l', v: Math.round(v) }; }
export function setB(f, k, v) { file(f)[k] = { t: 'b', v: !!v }; }
export function setSet(f, k, arr) { file(f)[k] = { t: 'set', v: [...new Set(arr)] }; }

// ── Profil
export const name = () => get('cyberdeck', 'deckName', 'NETRUNNER');
export function xp() { try { return parseInt(JSON.parse(get('cyberdeck', 'progress', '{}')).xp || '0', 10) || 0; } catch { return 0; } }
export const raw = (f) => file(f);
export function addXp(n) {
  // Stim XP (marché noir ou cadeau) : XP doublée pendant 24 h, comme sur le téléphone.
  if (n > 0 && get('cyberdeck_b5', 'boostUntil', 0) > Date.now()) n *= 2;
  let p = {}; try { p = JSON.parse(get('cyberdeck', 'progress', '{}')); } catch { /* vide */ }
  p.xp = String(xp() + n); setS('cyberdeck', 'progress', JSON.stringify(p)); persist();
}
export const eddies = () => get('cyberdeck_b5', 'eddies', 0);
export function addEddies(n) { setI('cyberdeck_b5', 'eddies', Math.max(0, eddies() + n)); persist(); }
export const achievements = () => get('cyberdeck', 'achievements', []);
export function unlock(id) { const a = achievements(); if (!a.includes(id)) { setSet('cyberdeck', 'achievements', [...a, id]); persist(); return true; } return false; }
export const avatar = () => get('cyberdeck', 'avatar', 'a0');
export const streak = () => get('cyberdeck_b9', 'streak', 0);
export const affinity = (id) => get('cyberdeck_holophone', 'aff_' + id, 0);
export const owned = (item) => get('cyberdeck_b5', 'own_' + item, false);
export const pronoun = () => get('cyberdeck', 'pronoun', '');
