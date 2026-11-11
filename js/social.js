// Messages, conversations, romance, piratage de dossiers, cyberware et marché noir (mêmes règles et clés que le launcher).
import * as S from './save.js';
import { R, hashCode, today, epochDay } from './krand.js';
import { CONTACTS, SMS_LINES, SECRETS, CONVOS, DATE_PLACES, BOND_TITLES, DATE_LINES, GIFTS_R, CHROMES, ITEMS } from './gamedata.js';
export { SECRETS, CONVOS, DATE_PLACES, CHROMES, ITEMS };

const B6 = 'cyberdeck_b6', B5 = 'cyberdeck_b5', HP = 'cyberdeck_holophone';
const hour = () => new Date().getHours();
const aff = (id) => S.get(HP, 'aff_' + id, 0);
function addAff(id, n) { S.setI(HP, 'aff_' + id, Math.max(0, Math.min(100, aff(id) + n))); }
export const level = () => Math.floor(Math.sqrt(S.xp() / 5)) + 1;

// ── SMS du jour (3 contacts, vers 9 h, 13 h et 19 h)
let smsCache = null;
export function smsToday() {
  const d = epochDay(); if (smsCache?.d === d) return smsCache.l;
  const r = R(d * 977 + 3), ids = r.shuffled(CONTACTS.map(c => c.id)).slice(0, 3), hours = [9, 13, 19], day = today();
  const l = ids.map((id, i) => { const lines = SMS_LINES[id] || ['…']; return { key: `${day}_${i}`, contactId: id, text: lines[r.nextIntUntil(lines.length)], hour: hours[i] }; });
  smsCache = { d, l }; return l;
}
export const smsReceived = () => smsToday().filter(m => hour() >= m.hour);
export const smsForContact = (id) => smsReceived().filter(m => m.contactId === id);
export const smsReplied = (key) => S.get(B6, 'smsr_' + key, -1);
export const SMS_QUICK = ['👍 Bien reçu.', 'Merci, prends soin de toi.', 'On en reparle bientôt ?'];
export function markRead(key) { if (!S.get(B6, 'sms_' + key, false)) { S.setB(B6, 'sms_' + key, true); S.persist(); } }
export function replySms(m, idx) {
  if (smsReplied(m.key) >= 0) return null;
  S.setI(B6, 'smsr_' + m.key, idx); addAff(m.contactId, 1); S.addXp(5); S.persist();
  return '+5 XP · affinité +1';
}
export function smsBack(m) { const c = CONTACTS.find(x => x.id === m.contactId); return c.close[(hashCode(m.key) & 0x7fffffff) % c.close.length]; }

// ── Conversation du jour (à choix multiples)
export function convoToday() {
  const d = epochDay(), r = R(d * 4441 + 17);
  if (r.nextIntUntil(10) >= 6) return null;
  const h = 9 + r.nextIntUntil(13), key = 'cvd_' + today();
  let c = CONVOS.find(x => x.id === S.get(B6, key, null));
  if (!c) {
    const pool0 = CONVOS.filter(x => convoAnswered(x.id) < 0), pool = pool0.length ? pool0 : CONVOS;
    c = pool[r.nextIntUntil(pool.length)]; S.setS(B6, key, c.id); S.persist();
  }
  return { convo: c, hour: h };
}
export const convoAnswered = (id) => S.get(B6, 'cva_' + id, -1);
export function convoReceived() { const t = convoToday(); return t && hour() >= t.hour ? t.convo : null; }
export function convoPending() { const c = convoReceived(); return c && convoAnswered(c.id) < 0 ? c : null; }
export function answerConvo(c, idx) {
  if (convoAnswered(c.id) >= 0) return;
  const ch = c.choices[idx]; S.setI(B6, 'cva_' + c.id, idx); addAff(c.contactId, ch.aff); S.addXp(ch.xp); S.persist();
}
export const unreadCount = () => smsReceived().filter(m => smsReplied(m.key) < 0).length + (convoPending() ? 1 : 0);

// ── Piratage des dossiers
export const hackUnlocked = (id) => S.get(B6, 'hack_' + id, false);
export const hackTriesLeft = (id) => 3 - S.get(B6, `hackt_${today()}_${id}`, 0);
export function finishHack(id, ok) {
  const k = `hackt_${today()}_${id}`; S.setI(B6, k, S.get(B6, k, 0) + 1);
  if (ok) { S.setB(B6, 'hack_' + id, true); addAff(id, 5); S.addXp(30); }
  S.persist();
}

// ── Romance : lien, rendez-vous, cadeaux
export const partner = () => S.get(HP, 'partner', null);
export const bond = (id) => S.get(B6, 'bond_' + id, 0);
const addBond = (id, n) => S.setI(B6, 'bond_' + id, bond(id) + n);
export const bondLevel = (b) => Math.min(10, Math.floor(b / 100) + 1);
export const bondTitle = (b) => BOND_TITLES[bondLevel(b) - 1];
export const bondProgress = (b) => bondLevel(b) >= 10 ? 1 : (b % 100) / 100;
export const flirted = (id) => S.get(B6, `flirt_${today()}_${id}`, false);
/** Déclaration : renvoie [phrase, réponse]. */
export function flirt(id) {
  S.setB(B6, `flirt_${today()}_${id}`, true);
  const good = aff(id) >= 70 || Math.random() < 2 / 3;
  addAff(id, good ? 5 : -2); S.addXp(good ? 15 : 5); S.persist();
  return good ? '… Je commençais à l\'espérer.  [affinité +5]' : 'Oh. Je… ne m\'y attendais pas. Laisse-moi un peu de temps.  [affinité −2]';
}
export function becomeCouple(id) { S.setS(HP, 'partner', id); addAff(id, 5); S.addXp(50); S.persist(); }
export const dateWith = () => S.get(B6, 'date_with', null);
export const datePlace = () => DATE_PLACES.find(p => p.id === S.get(B6, 'date_place', null));
export const dateUntil = () => S.get(B6, 'date_until', 0);
export const datedToday = (id) => S.get(B6, `dated_${today()}_${id}`, false);
export function startDate(id, place) {
  if (dateWith()) return 'Un rendez-vous est déjà en cours';
  S.setS(B6, 'date_with', id); S.setS(B6, 'date_place', place.id); S.setL(B6, 'date_until', Date.now() + place.minutes * 60000); S.setB(B6, `dated_${today()}_${id}`, true);
  S.persist(); return null;
}
function clearDate() { const f = S.raw(B6); delete f.date_with; delete f.date_place; delete f.date_until; }
export function cancelDate() { clearDate(); S.persist(); }
/** Rendez-vous terminé ? Renvoie { title, text } une seule fois. */
export function checkDate() {
  const id = dateWith(); if (!id || Date.now() < dateUntil()) return null;
  const place = datePlace(); clearDate();
  const before = bondLevel(bond(id));
  addBond(id, place?.bond ?? 15); addAff(id, 3); S.addXp(place?.xp ?? 30); S.persist();
  const after = bondLevel(bond(id)), c = CONTACTS.find(x => x.id === id);
  const lines = DATE_LINES[id]; const line = lines ? lines[Math.floor(Math.random() * lines.length)] : 'C\'était un très beau moment. Merci.';
  return { title: 'RENDEZ-VOUS TERMINÉ', text: `${c.name} : « ${line} »` + (after > before ? `  ♥ Lien niv ${after}` : '') };
}
export function giftToday(id) {
  const r = R(epochDay() * 733 + hashCode(id)), chance = 18 + bondLevel(bond(id)) * 4;
  return r.nextIntUntil(100) < chance ? GIFTS_R[r.nextIntUntil(GIFTS_R.length)] : null;
}
export const giftClaimed = () => S.get(B6, 'gift_' + today(), false);
export function claimGift(c) {
  const g = giftToday(c.id); if (!g || giftClaimed()) return null;
  S.setB(B6, 'gift_' + today(), true);
  let msg;
  if (g.id === 'stim') { S.setL(B5, 'boostUntil', Date.now() + 864e5); msg = `🎁 ${c.name} t'offre un stim : XP doublée pendant 24 h`; }
  else if (g.id === 'xp') { S.addXp(80); msg = `🎁 ${c.name} t'offre un souvenir partagé : +80 XP`; }
  else if (g.id === 'look') {
    const pool = ITEMS.filter(i => i.kind === 'look' && !i.consumable && !owned(i.id));
    if (pool.length) { const it = pool[Math.floor(Math.random() * pool.length)]; S.setB(B5, 'own_' + it.id, true); msg = `🎁 ${c.name} t'offre « ${it.name} » (marché noir)`; }
    else { S.addEddies(100); msg = `🎁 ${c.name} t'offre 100 €$`; }
  } else { const n = 60 + 20 * bondLevel(bond(c.id)); S.addEddies(n); msg = `🎁 ${c.name} t'offre ${n} €$`; }
  addBond(c.id, 5); S.persist();
  return { gift: g, msg };
}

// ── Marché noir
export const owned = (id) => S.get(B5, 'own_' + id, false);
export const itemActive = (id) => owned(id) && S.get(B5, 'equip_' + id, true);
export function setEquipped(id, on) { S.setB(B5, 'equip_' + id, on); S.persist(); }
export const boostActive = () => S.get(B5, 'boostUntil', 0) > Date.now();
const EVO = ['neura_evo2', 'neura_evo3', 'neura_evo4', 'neura_evo5'];
export function lockedReason(item) {
  const i = EVO.indexOf(item.id); if (i > 0 && !owned(EVO[i - 1])) return `NEURA doit d'abord atteindre le stade ${i + 1}`;
  if (item.id === 'slot_5' && !owned('slot_4')) return 'Installe d\'abord l\'emplacement n°4';
  if (item.id === 'slot_6' && !owned('slot_5')) return 'Installe d\'abord l\'emplacement n°5';
  return null;
}
export function buy(item) {
  if (!item.consumable && owned(item.id)) return 'Déjà acheté';
  const lk = lockedReason(item); if (lk) return lk;
  if (S.eddies() < item.price) return `Pas assez d'eddies (${S.eddies()} €$)`;
  S.setI(B5, 'eddies', S.eddies() - item.price);
  if (item.id === 'boost_xp') S.setL(B5, 'boostUntil', Date.now() + 864e5); else S.setB(B5, 'own_' + item.id, true);
  if (item.id === 'neura_evo5') S.unlock('neura_ascend');
  S.persist(); return null;
}

// ── Cyberware
export const slots = () => 3 + ['slot_4', 'slot_5', 'slot_6'].filter(owned).length;
export const equipped = () => String(S.get(B6, 'chrome', '') || '').split(',').filter(Boolean);
export const chromeActive = (id) => equipped().includes(id);
export function toggleChrome(id) {
  const cur = equipped();
  if (cur.includes(id)) cur.splice(cur.indexOf(id), 1);
  else {
    const c = CHROMES.find(x => x.id === id);
    if (level() < c.level) return `Niveau ${c.level} requis`;
    const n = slots();
    if (cur.length >= n) return n < 6 ? `Les ${n} emplacements sont occupés : achète-en un au marché noir ou retire un implant` : 'Les 6 emplacements sont occupés : retire d\'abord un implant';
    cur.push(id);
  }
  S.setS(B6, 'chrome', cur.join(',')); S.persist(); return null;
}
