// Carnet de NEURA : une ligne par jour sur ta journée. Mêmes compteurs (cyberdeck_b9, j<k>_<date>) et même texte que le téléphone.
import * as S from './save.js';
import { segments } from './world.js';

const B9 = 'cyberdeck_b9';
const pad = (n) => String(n).padStart(2, '0');
export const dateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const epoch = (d) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
const get = (k, d) => S.get(B9, `j${k}_${dateStr(d)}`, 0);
export const active = (d) => ['x', 'g', 'v', 'e', 'c'].some(k => get(k, d) > 0);
/** Pire météo de la journée : orage > sable > pluie > clair. */
export function dayWeather(d) { const w = segments(epoch(d)).map(s => s[2]); return [2, 4, 3, 1, 0].find(x => w.includes(x)); }
const WEATHER_LINES = [
  ['Ciel clair sur NEO-BXL.', 'Une rare journée sans pluie acide.'],
  ['La pluie acide n\'a pas cessé.', 'Pluie acide sur les néons, comme d\'habitude.'],
  ['Un orage a secoué le réseau.', 'Les éclairs ont fait trembler les antennes.'],
  ['Une tempête de sable a voilé la ville.', 'Le sable des badlands a envahi les rues.'],
  ['Une tempête magnétique a fait danser les aurores sur la ville.', 'Les implants ont grésillé sous la tempête magnétique.'],
];
const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;
export function text(d) {
  const w = WEATHER_LINES[dayWeather(d)][epoch(d) % 2];
  const xp = get('x', d), g = get('g', d), v = get('v', d), e = get('e', d);
  const acts = [xp > 0 && `gagné ${xp} XP`, g > 0 && 'encaissé ' + plural(g, 'gig', 'gigs'), v > 0 && 'visité ' + plural(v, 'lieu', 'lieux'), e > 0 && 'bouclé ' + plural(e, 'expédition', 'expéditions')].filter(Boolean);
  const act = !acts.length ? 'Pas encore d\'activité.' : 'Tu as ' + (acts.length === 1 ? acts[0] : acts.slice(0, -1).join(', ') + ' et ' + acts[acts.length - 1]) + '.';
  const crisis = get('c', d) > 0 ? ' Crise de cyberpsychose : j\'ai cru te perdre.' : '';
  const end = xp >= 200 ? 'Grosse journée. Je suis fière de toi.' : xp >= 50 ? 'Une bonne journée de travail.' : 'On fera mieux demain.';
  return `${w} ${act}${crisis} ${end}`;
}
/** Jours avec de l'activité sur 30 jours (le plus récent d'abord) ; aujourd'hui toujours présent. */
export function days() {
  const out = [], t = new Date(); t.setHours(12, 0, 0, 0);
  for (let i = 0; i < 30; i++) { const d = new Date(t); d.setDate(t.getDate() - i); if (i === 0 || active(d)) out.push(d); }
  return out;
}
