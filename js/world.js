// Règles du monde (mêmes clés et mêmes formules que le launcher) : gigs, affinité, ville, expéditions.
import * as S from './save.js';
import { R, hashCode, today, epochDay } from './krand.js';
import { chromeActive, itemActive } from './social.js';
import { CONTACTS, GIGS, EXPEDITIONS, RUNNER_NAMES, PLACES, STRANGERS, DISTRICTS, SPOTS, EXP_EVENTS, CHAINS, CHAIN_NEED } from './gamedata.js';

export { CONTACTS, PLACES, DISTRICTS, SPOTS, CHAINS, CHAIN_NEED };
const HP = 'cyberdeck_holophone', B8 = 'cyberdeck_b8', B9 = 'cyberdeck_b9';
const pick = (a, r) => a[r.nextIntUntil(a.length)];

// ── Holophone
export const contact = (id) => CONTACTS.find(c => c.id === id);
let availCache = null;
export function available() {
  const d = epochDay();
  if (availCache?.d === d) return availCache.l;
  const l = R(d * 7919).shuffled(CONTACTS.map(c => c.id)).slice(0, 4);
  availCache = { d, l }; return l;
}
export function gigFor(c) {
  if (!available().includes(c.id)) return null;
  const ev = c.gigs[R(epochDay() * 31 + hashCode(c.id)).nextIntUntil(c.gigs.length)];
  return GIGS[ev] || null;
}
export const gigState = (id) => S.get(HP, `g_${today()}_${id}`, null);
export function setGigState(id, st) { S.setS(HP, `g_${today()}_${id}`, st); S.persist(); }
export const affinity = (id) => S.get(HP, 'aff_' + id, 0);
export function addAffinity(id, n) { S.setI(HP, 'aff_' + id, Math.max(0, Math.min(100, affinity(id) + n))); S.persist(); }
export const chattedToday = (id) => S.get(HP, `chat_${today()}_${id}`, false);
export function markChat(id) { S.setB(HP, `chat_${today()}_${id}`, true); S.persist(); }
export const partner = () => S.get(HP, 'partner', null);
export function relation(aff, romance, isPartner) {
  if (isPartner) return '♥ En couple';
  if (aff >= 90) return romance ? 'Proche · ♥ possible' : 'Famille';
  if (aff >= 60) return 'Ami·e'; if (aff >= 30) return 'Allié·e'; if (aff >= 10) return 'Contact'; return 'Inconnu·e';
}
export const dayPick = (list, salt = 0) => list[R(epochDay() + salt).nextIntUntil(list.length)];
const bonus = (aff) => aff >= 90 ? 1.4 : aff >= 60 ? 1.2 : 1;
/** Gigs réalisables sur le site (mini-jeux). Les autres demandent le téléphone. */
export const WEB_GIGS = ['breach', 'decrypt', 'reflex'];
/** Événement de jeu : valide les gigs acceptés correspondants. Renvoie les contacts concernés. */
export function questEvent(ev) {
  const done = [];
  for (const c of CONTACTS) { const g = gigFor(c); if (g && g.event === ev && gigState(c.id) === 'accepted') { setGigState(c.id, 'done'); done.push(c); } }
  return done;
}
export function claimGig(c, g) {
  const aff = affinity(c.id);
  const xp = Math.floor(g.xp * bonus(aff) * (chromeActive('synapse') ? 1.2 : 1));
  const plus = chromeActive('empathy') ? 11 : 8, vip = itemActive('vip_pass');
  setGigState(c.id, 'claimed'); addAffinity(c.id, plus);
  S.addXp(xp); const cash = Math.floor(Math.floor(vip ? g.xp / 2 : g.xp / 3) * (chromeActive('wallet') ? 1.25 : 1)); S.addEddies(cash);
  if (vip && c.id === 'lou') addAffinity(c.id, 4);
  return `+${xp} XP · +${cash} €$ · affinité +${plus}`;
}

// ── Mini-jeux
export function finishGame(id, score, xp) {
  const k = 'mg_best_' + id; if (score > S.get('cyberdeck_b7', k, 0)) S.setI('cyberdeck_b7', k, score);
  if (xp > 0) S.addXp(xp); S.persist();
}

// ── Ville
export const place = (id) => PLACES.find(p => p.id === id);
export const spot = (id) => SPOTS.find(s => s.placeId === id);
export const district = (id) => DISTRICTS.find(d => d.id === id);
const hour = () => new Date().getHours();
export function isOpen(s, h = hour()) {
  if (s.open === 0 && s.close === 24) return true;
  return s.open < s.close ? (h >= s.open && h < s.close) : (h >= s.open || h < s.close);
}
export const isNight = (h = hour()) => h >= 20 || h < 8;
export const hoursLabel = (s) => (s.open === 0 && s.close === 24) ? '24/7' : `${String(s.open).padStart(2, '0')}h–${String(s.close % 24).padStart(2, '0')}h`;
export const rep = (d) => S.get(B9, 'rep_' + d, 0);
export function addRep(d, n) { S.setI(B9, 'rep_' + d, rep(d) + n); }
export const tier = (r) => r >= 50 ? 3 : r >= 25 ? 2 : r >= 10 ? 1 : 0;
export const TIER_NAMES = ['Inconnu·e', 'Connu·e', 'Respecté·e', 'Légende du quartier'];
export const totalRep = () => DISTRICTS.reduce((a, d) => a + rep(d.id), 0);
export const bunkerUnlocked = () => totalRep() >= 40;
export function present(placeId) {
  const pl = place(placeId); if (!pl) return [];
  const r = R(epochDay() * 24 + hour() + hashCode(placeId));
  return pl.regulars.filter(() => r.nextIntUntil(100) < 40);
}
const cooldown = () => (chromeActive('scanner') ? 15 : 30) * 60000;
export const lastVisit = (id) => S.get(B8, 'city_last_' + id, 0);
export const cooldownLeft = (id) => Math.max(0, lastVisit(id) + cooldown() - Date.now());
export const visits = () => S.get(B8, 'visits', 0);
const pending = {};
/** Arrivée dans un lieu : renvoie { encounter } ou { error }. */
export function visit(id) {
  const pl = place(id), sp = spot(id);
  if (!pl) return { error: 'Lieu inconnu' };
  if (id === 'bunker' && !bunkerUnlocked()) return { error: 'Accès refusé. Il faut plus de réputation dans les quartiers.' };
  if (sp && !isOpen(sp)) return { error: 'Fermé. Ouvert ' + hoursLabel(sp) };
  const left = cooldownLeft(id);
  if (left > 0) return { error: `Rien de neuf ici. Reviens dans ${Math.floor(left / 60000) + 1} min` };
  if (pending[id]) return { encounter: pending[id] };
  const now = Date.now(), r = R(now), roll = r.nextIntUntil(100), mood = pick(pl.mood, r);
  let e;
  const runnerJobs = EXPEDITIONS.filter(x => x.contactId === 'runner' && !takenToday(x.id));
  if (roll < 22 && runnerJobs.length) {
    const job = pick(runnerJobs, r), name = RUNNER_NAMES[R(now).nextIntUntil(RUNNER_NAMES.length)];
    e = { kind: 'runner', who: name, contactId: null, expedition: job,
      text: `${mood}\n\n${name} s'assoit en face de toi. « On m'a dit que tu étais fiable. J'ai un contrat : ${job.title.toLowerCase()}. ${job.brief} »`,
      choices: [{ label: `Accepter le contrat (${job.minutes} min)`, result: '« Parfait. Je t\'envoie les coordonnées. On se revoit quand c\'est fait. »', xp: 10, eddies: 0, aff: 0 },
        { label: 'Négocier', result: '« T\'es dur·e en affaires. D\'accord, je rajoute un petit bonus. »', xp: 10, eddies: 15, aff: 0 },
        { label: 'Refuser', result: '« Dommage. Il y en aura d\'autres. »', xp: 5, eddies: 0, aff: 0 }] };
  } else if (roll < 65) {
    const c = contact(pick(pl.regulars, r));
    e = { kind: 'contact', who: c.name, contactId: c.id, text: `${mood}\n\n${c.name} est là. « ${pick(c.hello, r)} »`,
      choices: [{ label: 'Offrir un verre (−10 €$)', result: pick(c.thanks, r), xp: 15, eddies: -10, aff: 5 },
        { label: 'Parler boulot', result: pick(c.offer, r), xp: 20, eddies: 0, aff: 2 },
        { label: 'Juste un salut', result: pick(c.close, r), xp: 8, eddies: 0, aff: 1 }] };
  } else {
    const s = pick(STRANGERS, r);
    e = { ...s, text: `${mood}\n\n${s.who}. ${s.text}` };
  }
  pending[id] = e;
  return { encounter: e };
}
/** Choix dans une rencontre : renvoie { result } ou { error }. */
export function choose(placeId, e, idx) {
  const ch = e.choices[idx];
  if (ch.eddies < 0 && S.eddies() < -ch.eddies) return { error: 'Pas assez d\'eddies' };
  let started = false;
  if (e.kind === 'runner' && idx < 2 && e.expedition) { const err = startExpedition(e.expedition, e.who); if (err) return { error: err }; started = true; }
  S.setL(B8, 'city_last_' + placeId, Date.now()); S.setI(B8, 'visits', visits() + 1); S.setI(B8, 'met_' + placeId, S.get(B8, 'met_' + placeId, 0) + 1);
  delete pending[placeId];
  if (visits() >= 20) S.unlock('city_20');
  const sp = spot(placeId);
  let mult = 100;
  if (isNight()) mult = Math.floor(mult * 125 / 100);
  if (placeId === 'bunker') mult = Math.floor(mult * 150 / 100);
  if (sp) { mult = Math.floor(mult * (100 + 10 * tier(rep(sp.district))) / 100); addRep(sp.district, ch.xp >= 20 ? 2 : 1); }
  const cash = ch.eddies > 0 ? Math.floor(ch.eddies * mult / 100) : ch.eddies;
  if (cash) S.addEddies(cash);
  if (ch.aff && e.contactId) addAffinity(e.contactId, ch.aff);
  const xp = Math.floor((chromeActive('charisma') ? Math.floor(ch.xp * 3 / 2) : ch.xp) * mult / 100); if (xp > 0) S.addXp(xp);
  S.persist();
  return { result: { ...ch, xp, eddies: cash, started } };
}

// ── Expéditions
export const expXp = (e) => e.minutes <= 15 ? 30 : e.minutes <= 20 ? 40 : e.minutes <= 30 ? 60 : 120;
export const expEddies = (e) => Math.floor(expXp(e) / 2);
const expAff = (e) => e.minutes >= 60 ? 6 : 3;
export function expById(id) {
  const e = EXPEDITIONS.find(x => x.id === id); if (e) return e;
  const p = parseChain(id); if (!p) return null;
  const ep = CHAINS[p[0]]?.[p[1]]; return ep ? chainExp(p[0], p[1], ep) : null;
}
const chainExp = (cid, n, ep) => ({ id: `chain_${cid}_${n}`, contactId: cid, title: `Épisode ${n + 1} · ${ep.title}`, place: ep.place, minutes: ep.minutes, brief: ep.brief, report: ep.report });
function parseChain(id) { if (!id.startsWith('chain_')) return null; const p = id.slice(6).split('_'); const n = parseInt(p[1], 10); return p[0] && !isNaN(n) ? [p[0], n] : null; }
export function offers() {
  const seen = new Set();
  return R(epochDay() * 4441).shuffled(EXPEDITIONS.filter(e => e.contactId !== 'runner'))
    .filter(e => !seen.has(e.contactId) && seen.add(e.contactId)).slice(0, 3);
}
export const takenToday = (id) => (S.get(B8, 'taken_' + epochDay(), []) || []).includes(id);
export function active() {
  return String(S.get(B8, 'active', '') || '').split(';').filter(Boolean).map(row => {
    const f = row.split('|'); const e = expById(f[0]); const start = +f[1], end = +f[2];
    return e && start && end ? { exp: e, start, end, runner: f[3] || null } : null;
  }).filter(Boolean);
}
function saveActive(list) { S.setS(B8, 'active', list.map(a => `${a.exp.id}|${a.start}|${a.end}|${a.runner || ''}`).join(';')); }
export const progress = (a, now = Date.now()) => Math.max(0, Math.min(1, (now - a.start) / Math.max(1, a.end - a.start)));
export function startExpedition(e, runner = null) {
  const cur = active();
  if (cur.length >= 1) return 'Une seule expédition à la fois : termine celle en cours';
  const now = Date.now();
  const mins = chromeActive('courier') ? Math.floor((e.minutes * 3 + 3) / 4) : e.minutes;
  saveActive([...cur, { exp: e, start: now, end: now + mins * 60000, runner }]);
  S.setSet(B8, 'taken_' + epochDay(), [...(S.get(B8, 'taken_' + epochDay(), []) || []), e.id]);
  S.persist(); return null;
}
const evKey = (a) => `${a.exp.id}@${a.end}`;
export const expEvent = (a) => EXP_EVENTS[(hashCode(evKey(a)) & 0x7fffffff) % EXP_EVENTS.length];
export function expEventState(a, now = Date.now()) {
  if (S.get(B9, 'ee_' + evKey(a), -1) >= 0) return 2;
  return progress(a, now) >= 0.5 && now < a.end ? 1 : 0;
}
export function resolveExpEvent(a, risky) {
  const m = !risky ? 110 : (Math.random() < 0.5 ? 160 : 70);
  S.setI(B9, 'ee_' + evKey(a), m); S.persist();
  return m >= 160 ? 'Coup de maître ! Récompense +60 %' : m >= 110 ? 'Prudence payante : récompense +10 %' : 'Raté… récompense −30 %';
}
export const chainProgress = (cid) => S.get(B9, 'chain_' + cid, 0);
export function startChainEp(cid) {
  const n = chainProgress(cid), ep = CHAINS[cid]?.[n];
  if (!ep || affinity(cid) < CHAIN_NEED[n]) return 'Épisode verrouillé';
  return startExpedition(chainExp(cid, n, ep));
}
export function targetSpot(a, spots) { return spots[(hashCode(a.exp.place) & 0x7fffffff) % spots.length]; }
/** Encaisser une expédition terminée. Renvoie le message de fin. */
export function claimExpedition(a) {
  if (Date.now() < a.end || !active().some(x => x.exp.id === a.exp.id)) return null;
  saveActive(active().filter(x => x.exp.id !== a.exp.id));
  S.setI(B8, 'completed', S.get(B8, 'completed', 0) + 1);
  const mult = S.get(B9, 'ee_' + evKey(a), 100);
  const xp = Math.floor(expXp(a.exp) * mult / 100); S.addXp(xp);
  let cash = Math.floor(expEddies(a.exp) * mult / 100); if (chromeActive('loot')) cash = Math.floor(cash * 3 / 2); S.addEddies(cash);
  addRep(DISTRICTS[(hashCode(a.exp.place) & 0x7fffffff) % DISTRICTS.length].id, 2);
  let chainEnd = false;
  const p = parseChain(a.exp.id);
  if (p) {
    S.setI(B9, 'chain_' + p[0], p[1] + 1);
    if (p[1] + 1 >= (CHAINS[p[0]]?.length || 3)) { chainEnd = true; S.addXp(150); S.addEddies(200); addAffinity(p[0], 10); S.unlock('chain_done'); }
  }
  if (a.exp.contactId !== 'runner') addAffinity(a.exp.contactId, expAff(a.exp));
  if (S.get(B8, 'completed', 0) >= 10) S.unlock('expeditions_10');
  S.persist();
  const who = contact(a.exp.contactId)?.name || a.runner || 'Runner';
  return { title: chainEnd ? 'HISTOIRE TERMINÉE · +150 XP · +200 €$' : `EXPÉDITION RÉUSSIE · +${xp} XP` + (mult !== 100 ? ` (${mult > 100 ? '+' : ''}${mult - 100} %)` : ''), text: `${who} : « ${a.exp.report} »` };
}
export function fmtLeft(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return s >= 3600 ? `${Math.floor(s / 3600)}h${String(Math.floor(s % 3600 / 60)).padStart(2, '0')}` : `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
