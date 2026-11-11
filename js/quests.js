// Quêtes et succès : défis de la semaine, événement de ville, récit, cartes holo, succès et secrets (mêmes règles que le launcher).
import * as S from './save.js';
import { R, hashCode, today, epochDay } from './krand.js';
import { CONTACTS, ACHIEVEMENTS, SECRETS_LIST, CHALLENGES, CHAPTERS, CITY_EVENTS } from './gamedata.js';
export { ACHIEVEMENTS, SECRETS_LIST, CHAPTERS };
const B7 = 'cyberdeck_b7', B6 = 'cyberdeck_b6';

// ── Semaine ISO (comme IsoFields de Java) : « 2026-46 »
export function week(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
  return `${y}-${w}`;
}
let wcCache = null;
export function challenges() {
  const w = week(); if (wcCache?.w === w) return wcCache.l;
  const l = R(hashCode(w)).shuffled(CHALLENGES).slice(0, 3); wcCache = { w, l }; return l;
}
export const progress = (id) => S.get(B7, `wc_${week()}_${id}`, 0);
export const challengeDone = (c) => progress(c.id) >= c.goal;
export const claimed = (id) => S.get(B7, `wcc_${week()}_${id}`, false);
/** Avance un défi de la semaine ; renvoie le défi s'il vient d'être réussi. */
export function challenge(id, n = 1) {
  const c = challenges().find(x => x.id === id); if (!c) return null;
  const was = challengeDone(c); S.setI(B7, `wc_${week()}_${id}`, progress(id) + n); S.persist();
  return !was && challengeDone(c) ? c : null;
}
export function claim(c) {
  if (!challengeDone(c) || claimed(c.id)) return null;
  S.setB(B7, `wcc_${week()}_${c.id}`, true); S.addXp(40); S.addEddies(20);
  let msg = 'Défi encaissé : +40 XP · +20 €$';
  if (challenges().every(x => claimed(x.id)) && !S.get(B7, `wcall_${week()}`, false)) {
    S.setB(B7, `wcall_${week()}`, true); S.setI(B7, 'wc_full', S.get(B7, 'wc_full', 0) + 1); S.addXp(150); S.addEddies(100);
    msg = 'SEMAINE PARFAITE : les 3 défis réussis · +150 XP · +100 €$';
  }
  S.persist(); return msg;
}

// ── Événement de ville du jour (environ un jour sur trois)
export function cityEvent() { const r = R(epochDay() * 131 + 7); return r.nextIntUntil(3) === 0 ? CITY_EVENTS[r.nextIntUntil(CITY_EVENTS.length)] : null; }
export const cityEventDone = () => S.get(B6, 'ev_' + today(), false);
/** Action de jeu : termine l'événement de ville s'il correspond. */
export function cityEventCheck(ev) {
  const ce = cityEvent(); if (!ce || ce.event !== ev || cityEventDone()) return null;
  S.setB(B6, 'ev_' + today(), true); S.addXp(ce.xp); S.addEddies(Math.floor(ce.xp / 2)); S.persist();
  return `${ce.name} : mission réussie (+${ce.xp} XP)`;
}

// ── Récit
export const storyUnlocked = () => S.get('cyberdeck_b5', 'story', 1);

// ── Cartes holographiques (bronze 30, argent 60, or 90 d'affinité)
export const TIERS = [30, 60, 90], TIER_NAMES = ['BRONZE', 'ARGENT', 'OR'];
export const cards = () => CONTACTS.flatMap(c => [1, 2, 3].map(t => ({ c, tier: t, id: `${c.id}_${t}` })));
export const cardOwned = (id) => S.get(B7, 'card_' + id, false);
export function checkCards() {
  const fresh = cards().filter(k => !cardOwned(k.id) && S.get('cyberdeck_holophone', 'aff_' + k.c.id, 0) >= TIERS[k.tier - 1]);
  fresh.forEach(k => S.setB(B7, 'card_' + k.id, true)); if (fresh.length) S.persist();
  return fresh;
}
export const quote = (c, tier) => tier === 1 ? c.hello[0] : tier === 2 ? c.thanks[0] : c.close[0];

// ── Secrets
export const secretFound = (id) => S.get(B7, 'secret_' + id, false);
