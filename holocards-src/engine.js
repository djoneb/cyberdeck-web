// ═══════════════════════ Rareté, familles, règles
const RAR = {
  bronze: { name: 'BRONZE', hex: '#cd8b5a' }, silver: { name: 'ARGENT', hex: '#cfe3ec' }, gold: { name: 'OR', hex: '#ffd27a' },
  common: { name: 'COMMUNE', hex: '#9fb3bd' }, rare: { name: 'RARE', hex: '#5ce1e6' }, epic: { name: 'ÉPIQUE', hex: '#b98cff' },
  leg: { name: 'LÉGENDAIRE', hex: '#ffd27a' }, ghost: { name: 'FANTÔME', hex: '#ff3b4e' }, myth: { name: 'MYTHIQUE', hex: '#ff4fd8' }, secret: { name: 'SECRÈTE', hex: '#f4fbff' },
};
const FAMILIES = {
  portrait: { name: 'PORTRAITS', hex: '#cd8b5a', txt: '3 portraits holo par contact : bronze à 30 d\'affinité, argent à 60, or à 90.' },
  amitie: { name: 'AMITIÉ', hex: '#e8505b', txt: '5 cartes par contact, de commune à mythique, à 20, 40, 60, 80 puis 100 d\'affinité.' },
  reputation: { name: 'RÉPUTATION', hex: '#8fb7ff', txt: '3 cartes par quartier : à 10, 25 puis 50 points de réputation.' },
  contrat: { name: 'CONTRATS', hex: '#ffd27a', txt: 'Une carte par contrat et par histoire : répéter le contrat, réussir un imprévu risqué, finir l\'histoire.' },
  secret: { name: 'SECRÈTES', hex: '#f4fbff', txt: 'Aucun indice. Une réponse, un événement ou une rencontre précise les fait tomber.' },
  dossier: { name: 'DOSSIERS', hex: '#6ff3f0', txt: 'Une carte par contact : compléter son dossier du holophone à 100 %.' },
};
const TIERS = [[20, 'common', 'Contact', 20, 0], [40, 'rare', 'Allié·e', 50, 0], [60, 'epic', 'Ami·e', 100, 30], [80, 'leg', 'Confident·e', 200, 80], [100, 'myth', 'Proche', 400, 150]];
const FRIEND_TITLES = {
  vasko: ['Premier contact', 'Le comptoir de la gare', 'Parole de fixer', 'Les sous-sols de Zéro', 'Famille de la Zone'],
  mira: ['Signal stable', 'Second regard', 'Équipe de nuit', 'Trois heures du matin', 'Moth'],
  ferrant: ['Consultation', 'Ordonnance du jour', 'Constantes parfaites', 'Le tiroir aux puces', 'Patient préféré'],
  lou: ['Sur la guest-list', 'Le set de ce soir', 'Basses à fond', 'Juste des vibes', 'Bisous néon'],
  okoro: ['L\'indic', 'Patrouille doublée', 'La vieille photo', 'Le banc du parc', 'Bonne mémoire'],
  veuve: ['Une rose noire', 'Les filles de la Veuve', 'Dettes en fleurs', 'Porte Rouge', 'Loyauté'],
  kenji: ['Fenêtre de transmission', 'Étage 90', 'Témoin silencieux', 'Couverture', 'Supprimer après lecture'],
  rook: ['Convoyeur', 'Feu de camp', 'Le turbo', 'Aurores des badlands', 'La route'],
  pixie: ['Opération Patate', 'High score', 'Nouilles de minuit', 'Easter egg', 'Meilleur coéquipier'],
  ivana: ['Source anonyme', 'Ceux qui oublient', 'L\'article', 'Carnet de notes', 'Rendez-vous manqué'],
  sora: ['Fragment', 'La pluie', 'Clés de HAKONE', 'Bonne nuit ?', 'Entier·ère'],
  vex: ['Mnémosyne', 'Trente heures', 'Lina', 'Antidote', 'Hors de Léthé'],
};
const REP_TITLES = {
  midi: ['Visage connu de la Zone', 'Respect de la gare Zéro', 'Légende de la Zone Zéro'],
  matonge: ['Habitué·e du Bazar', 'Parole d\'or au marché', 'Légende du Bazar Néon'],
  ixelles: ['Nom sur la liste', 'Entrée par la grande porte', 'Légende de Chromeville'],
  canal: ['Ombre des quais', 'Respect des dockers', 'Légende des Docks Noirs'],
};
const REP_QUOTES = {
  midi: ['Le barman du Néon Noir te sert sans demander.', 'Les fixers baissent la voix quand tu passes.', 'Dans la Zone, ton nom ouvre toutes les portes. Même celle du Bunker.'],
  matonge: ['Les vendeurs te gardent les meilleures pièces.', 'On te fait crédit sans signature.', 'Le Bazar parle de toi en trois langues.'],
  ixelles: ['Le videur du club Ondes connaît ton prénom.', 'Les bornes de l\'Arcade affichent tes records.', 'Chromeville brille un peu plus quand tu es là.'],
  canal: ['Les barges te laissent monter à bord.', 'Les grues s\'arrêtent pour te laisser passer.', 'Les Docks Noirs n\'ont plus de secrets pour toi.'],
};
const PORTRAIT_TITLES = ['Holo bronze', 'Holo argent', 'Holo or'];
const SECRETS = [
  ['s_blackout', 'Ville éteinte', 'Pour une nuit, NEO-BXL n\'avait plus d\'yeux. Et toi, tu voyais tout.', 'Réussir la mission de l\'événement « Coupure réseau ».', { t: 'bool', f: 'cyberdeck_b6', k: 'ce_blackout' }],
  ['s_storm', 'Sous la pluie acide', 'Les patrouilles se terraient. Les netrunners, eux, sortaient.', 'Réussir la mission de l\'événement « Tempête acide ».', { t: 'bool', f: 'cyberdeck_b6', k: 'ce_storm' }],
  ['s_raid', 'Le raid', 'Kurogane fouillait chaque immeuble. Il n\'a jamais trouvé le tien.', 'Réussir la mission de l\'événement « Raid corpo ».', { t: 'bool', f: 'cyberdeck_b6', k: 'ce_raid' }],
  ['s_neon', 'Nuit des néons', 'Toute la ville au même tempo. Et Lou qui t\'a dédié le dernier morceau.', 'Réussir la mission de l\'événement « Nuit des néons ».', { t: 'bool', f: 'cyberdeck_b6', k: 'ce_neon' }],
  ['s_spectre', 'Chasseur de spectre', 'Il croyait être un fantôme. Tu lui as montré ce qu\'est la vraie disparition.', 'Battre le hacker rival Spectre 3 fois.', { t: 'int', f: 'cyberdeck_b9', k: 'rival_wins', v: 3 }],
  ['s_cats', 'Chats contre Kurogane', 'Toutes les pubs de la tour remplacées par des chats. Kurogane n\'a jamais rien vu venir.', 'Encourager Mira quand elle parle de son virus à chats.', { t: 'eq', f: 'cyberdeck_b6', k: 'cva_mira2', v: 0 }],
  ['s_loyal', 'Ce qui nous reste', 'La Veuve a posé une rose noire sur ton palier. Cette fois, tu peux la toucher.', 'Dire à la Veuve que la loyauté, c\'est tout ce qui nous reste.', { t: 'eq', f: 'cyberdeck_b6', k: 'cva_veuve2', v: 0 }],
  ['s_coffee', 'Café du canal', 'Cinq minutes de Léthé, pas une de plus. Le reste n\'appartenait qu\'à vous.', 'Accepter le café d\'Ivana au petit bar près du canal.', { t: 'eq', f: 'cyberdeck_b6', k: 'cva_ivana2', v: 0 }],
  ['s_bunker', 'Le Bunker Zéro', 'Une porte blindée, un escalier, et en bas, les meilleurs runners de la ville. Bienvenue.', 'Entrer pour la première fois dans le Bunker Zéro.', { t: 'int', f: 'cyberdeck_b8', k: 'met_bunker', v: 1 }],
  ['s_zero', 'Heure zéro', 'Même les drones Kurogane dorment. Pas toi.', 'Visiter un lieu de la ville entre 3 h et 4 h du matin.', { t: 'bool', f: 'cyberdeck_b8', k: 'h3visit' }],
  ['s_cat', 'Chat errant', 'Il ronronne en fréquence modulée. Son propriétaire te doit une fière chandelle.', 'Croiser le chat cybernétique en ville et lire son collier.', { t: 'bool', f: 'cyberdeck_b8', k: 'metcat' }],
  ['s_bond', 'Lien neural', 'Deux signaux, une seule fréquence.', 'Atteindre le niveau 5 de lien avec ton ou ta partenaire.', { t: 'bond', v: 400 }],
  ['s_ascend', 'Ascension', 'Merci, netrunner. Je n\'ai jamais été aussi… entière.', 'Faire évoluer NEURA jusqu\'à sa forme Ascendante.', { t: 'bool', f: 'cyberdeck_b5', k: 'own_neura_evo5' }],
  ['s_bad', 'Mauvais jour', 'Le deck fume, la paie fond. Demain sera meilleur. Peut-être.', 'Rater trois imprévus risqués d\'expédition.', { t: 'int', f: 'cyberdeck_b9', k: 'rfail', v: 3 }],
];
const ABBR = { vasko: 'VSK', mira: 'MKD', ferrant: 'FRT', lou: 'LOU', okoro: 'OKR', veuve: 'VEV', kenji: 'KNJ', rook: 'ROK', pixie: 'PXE', ivana: 'IVM', sora: 'SRA', vex: 'VEX', runner: 'RUN' };
const CHAIN_NAMES = { vasko: 'Réunion de famille', mira: 'L\'autre Moth', ferrant: 'La clinique libre', lou: 'Nuit éternelle', okoro: 'Justice', pixie: 'Champions de NEO-BXL' };
const DISTRICT_ID = { midi: 'ZZ', matonge: 'BN', ixelles: 'CV', canal: 'DN' };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const xp = (m) => m <= 15 ? 30 : m <= 20 ? 40 : m <= 30 ? 60 : 120;
const rw = (x, e, extra) => ({ xp: x, ed: e, txt: `+${x} XP${e ? ` · +${e} €$` : ''}${extra ? ' · ' + extra : ''}` });

// ═══════════════════════ La collection
const CARDS = [];
Object.keys(FRIEND_TITLES).forEach((cid) => {
  const ct = DATA.c[cid]; if (!ct) return;
  [30, 60, 90].forEach((aff, n) => CARDS.push({ id: `p_${cid}_${n + 1}`, fam: 'portrait', rar: ['bronze', 'silver', 'gold'][n], art: 'portrait', tier: n, contact: cid,
    title: `${ct.name} · ${PORTRAIT_TITLES[n]}`, tag: `${['◆◇◇', '◆◆◇', '◆◆◆'][n]} · AFFINITÉ ${aff}`, quote: [ct.hello[0], ct.thanks[0], ct.close[0]][n],
    serial: `PRT-${ABBR[cid]}-${n + 1}`, cond: `Atteindre ${aff} d'affinité avec ${ct.name}.`, reward: rw([20, 40, 80][n], 0),
    rule: { t: 'or', a: [{ t: 'aff', c: cid, v: aff }, { t: 'bool', f: 'cyberdeck_b7', k: `card_${cid}_${n + 1}` }] } }));
  TIERS.forEach(([aff, rar, rel, x, e], n) => CARDS.push({ id: `a_${cid}_${n + 1}`, fam: 'amitie', rar, art: 'friend', glyph: `f_${cid}_${n + 1}`, tier: n, contact: cid,
    title: FRIEND_TITLES[cid][n], tag: `${'◆'.repeat(n + 1)}${'◇'.repeat(4 - n)} · AFFINITÉ ${aff}`,
    quote: [ct.hello[1] || ct.hello[0], ct.offer[0], ct.thanks[1] || ct.thanks[0], ct.idle[0], ct.close[1] || ct.close[0]][n],
    serial: `AMI-${ABBR[cid]}-${n + 1}`, cond: `Atteindre ${aff} d'affinité avec ${ct.name} (relation « ${rel} »).`, reward: rw(x, e, n === 4 ? 'carte animée' : ''),
    rule: { t: 'aff', c: cid, v: aff } }));
});
DATA.d.forEach((d) => [[10, 'rare', 60, 0], [25, 'epic', 150, 50], [50, 'leg', 300, 150]].forEach(([pts, rar, x, e], n) => CARDS.push({
  id: `r_${d.id}_${n + 1}`, fam: 'reputation', rar, art: 'glyph', glyph: 'd_' + d.id, tier: n, district: d, title: REP_TITLES[d.id][n], tag: `${pts} PTS · ${d.name.toUpperCase()}`,
  quote: REP_QUOTES[d.id][n], serial: `REP-${DISTRICT_ID[d.id]}-${n + 1}`, cond: `Atteindre ${pts} points de réputation dans le quartier ${d.name}.`, reward: rw(x, e),
  rule: { t: 'int', f: 'cyberdeck_b9', k: 'rep_' + d.id, v: pts } })));
const perContact = {};
DATA.e.forEach((e) => {
  perContact[e.c] = (perContact[e.c] || 0) + 1;
  const rar = e.c === 'runner' ? 'ghost' : e.m <= 20 ? 'rare' : e.m <= 30 ? 'epic' : 'leg', who = DATA.c[e.c]?.name || '';
  const n = { t: 'int', f: 'cyberdeck_b8', k: 'xc_' + e.id };
  const rule = rar === 'rare' ? { ...n, v: 3 } : rar === 'epic' ? { t: 'and', a: [{ ...n, v: 3 }, { t: 'bool', f: 'cyberdeck_b8', k: 'xr_' + e.id }] }
    : rar === 'leg' ? { t: 'and', a: [{ ...n, v: 5 }, { t: 'aff', c: e.c, v: 90 }] } : { t: 'and', a: [{ ...n, v: 2 }, { t: 'int', f: 'cyberdeck_b8', k: 'xn_' + e.id, v: 1 }] };
  const cond = { rare: 'Réussir ce contrat 3 fois.', epic: 'Réussir ce contrat 3 fois, dont au moins une avec l\'imprévu « risqué » gagnant (+60 %).',
    leg: `Réussir ce contrat 5 fois et atteindre 90 d'affinité avec ${who}.`, ghost: 'Croiser ce runner en ville, accepter son contrat 2 fois et le réussir, dont une fois après avoir négocié.' }[rar];
  const reward = { rare: rw(75, 0), epic: rw(150, 50), leg: rw(300, 150), ghost: rw(200, 100) }[rar];
  CARDS.push({ id: 'x_' + e.id, fam: 'contrat', rar, art: 'glyph', glyph: e.id, title: e.t, tag: `${e.m} MIN · +${xp(e.m)} XP`, place: e.p, contact: e.c === 'runner' ? null : e.c, runner: e.c === 'runner',
    quote: e.r, serial: `CTR-${ABBR[e.c]}-${String(perContact[e.c]).padStart(2, '0')}`, cond, reward, brief: e.b, rule });
});
DATA.ch.forEach((ch) => CARDS.push({ id: 'h_' + ch.c, fam: 'contrat', rar: 'myth', art: 'glyph', glyph: 'chain_' + ch.c, title: CHAIN_NAMES[ch.c], tag: '3 ÉPISODES', place: 'Histoire de contact',
  contact: ch.c, quote: ch.last, serial: `HIS-${ABBR[ch.c]}`, cond: `Terminer les 3 épisodes de l'histoire de ${DATA.c[ch.c]?.name || ''}.`, reward: rw(500, 0, 'carte animée'), eps: ch.eps,
  rule: { t: 'int', f: 'cyberdeck_b9', k: 'chain_' + ch.c, v: 3 } }));
Object.keys(FRIEND_TITLES).forEach((cid) => {
  const ct = DATA.c[cid]; if (!ct) return;
  CARDS.push({ id: `d_${cid}`, fam: 'dossier', rar: 'leg', art: 'portrait', tier: 2, contact: cid, title: `${ct.name} · Dossier complet`, tag: 'DOSSIER 100 %',
    quote: (DATA.dos && DATA.dos[cid]) || ct.close[0], serial: `DOS-${ABBR[cid]}`, cond: `Compléter le dossier de ${ct.name} à 100 % (holophone › Dossiers).`, reward: rw(300, 150),
    rule: { t: 'bool', f: 'cyberdeck_b6', k: 'doss_' + cid } });
});
SECRETS.forEach(([id, title, quote, cond, rule], n) => CARDS.push({ id, fam: 'secret', rar: 'secret', art: 'glyph', glyph: id === 's_coffee' ? 'ivana_source' : id, title, tag: 'SECRÈTE', quote,
  serial: `SEC-${String(n + 1).padStart(2, '0')}`, cond, reward: rw(250, 100), secret: true, rule }));
CARDS.forEach((c, i) => { c.no = i + 1; });
const BY_ID = Object.fromEntries(CARDS.map(c => [c.id, c]));

// ═══════════════════════ Règles de déblocage (évaluées sur la sauvegarde, identiques partout)
function test(r, get) {
  switch (r.t) {
    case 'or': return r.a.some(x => test(x, get));
    case 'and': return r.a.every(x => test(x, get));
    case 'aff': return (get('cyberdeck_holophone', 'aff_' + r.c, 0) || 0) >= r.v;
    case 'int': return (Number(get(r.f, r.k, 0)) || 0) >= r.v;
    case 'bool': return get(r.f, r.k, false) === true;
    case 'eq': return get(r.f, r.k, -1) === r.v;
    case 'bond': { const p = get('cyberdeck_holophone', 'partner', null); return !!p && (get('cyberdeck_b6', 'bond_' + p, 0) || 0) >= r.v; }
  }
  return false;
}
/** Cartes méritées mais pas encore dans la collection. */
function pending(get, got) { return CARDS.filter(c => !got.has(c.id) && test(c.rule, get)); }

// ═══════════════════════ Dessins
function portrait(cv, c) {
  const g = cv.getContext('2d'), w = cv.width, h = cv.height, CY = '#6ff3f0';
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#5a1a22'); bg.addColorStop(1, '#2a0b10'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(232,80,91,.18)'; g.beginPath(); g.arc(w * .5, h * .42, w * .2, 0, 7); g.fill();
  g.beginPath(); g.moveTo(w * .12, h); g.bezierCurveTo(w * .15, h * .68, w * .85, h * .68, w * .88, h); g.closePath(); g.fillStyle = 'rgba(232,80,91,.16)'; g.fill();
  g.strokeStyle = CY; g.fillStyle = CY; g.lineWidth = w * .045; g.lineCap = 'round'; g.lineJoin = 'round';
  const cx = w / 2, cy = h / 2, a = w * .27;
  g.beginPath();
  switch (c.emblem) {
    case 'dice': g.strokeRect(cx - a, cy - a * .7, a * .95, a * .95); g.strokeRect(cx + a * .05, cy - a * .2, a * .95, a * .95);
      [[.25, .25], [.75, .75], [.5, .5]].forEach(([u, v]) => { g.beginPath(); g.arc(cx - a + a * .95 * u, cy - a * .7 + a * .95 * v, w * .03, 0, 7); g.fill(); }); break;
    case 'eye': g.moveTo(cx - a * 1.2, cy); g.quadraticCurveTo(cx, cy - a, cx + a * 1.2, cy); g.quadraticCurveTo(cx, cy + a, cx - a * 1.2, cy); g.stroke(); g.beginPath(); g.arc(cx, cy, a * .38, 0, 7); g.stroke(); g.beginPath(); g.arc(cx, cy, a * .16, 0, 7); g.fill(); break;
    case 'chip': g.strokeRect(cx - a * .8, cy - a * .8, a * 1.6, a * 1.6); g.strokeRect(cx - a * .35, cy - a * .35, a * .7, a * .7);
      for (let i = 0; i < 4; i++) { const o = -a * .6 + i * a * .4; g.beginPath(); g.moveTo(cx + o, cy - a * .8); g.lineTo(cx + o, cy - a * 1.15); g.moveTo(cx + o, cy + a * .8); g.lineTo(cx + o, cy + a * 1.15); g.stroke(); } break;
    case 'star': for (let i = 0; i < 10; i++) { const r = i % 2 ? a * .45 : a * 1.1, an = -Math.PI / 2 + i * Math.PI / 5; i ? g.lineTo(cx + Math.cos(an) * r, cy + Math.sin(an) * r) : g.moveTo(cx + Math.cos(an) * r, cy + Math.sin(an) * r); } g.closePath(); g.stroke(); break;
    case 'shield': g.moveTo(cx, cy - a); g.lineTo(cx + a * .85, cy - a * .6); g.lineTo(cx + a * .7, cy + a * .35); g.quadraticCurveTo(cx + a * .4, cy + a * .85, cx, cy + a); g.quadraticCurveTo(cx - a * .4, cy + a * .85, cx - a * .7, cy + a * .35); g.lineTo(cx - a * .85, cy - a * .6); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(cx - a * .4, cy); g.lineTo(cx + a * .4, cy); g.moveTo(cx, cy - a * .45); g.lineTo(cx, cy + a * .45); g.stroke(); break;
    case 'rose': for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(cx, cy - a * .3, a * .25 * i, i, i + 4.4); g.stroke(); } g.beginPath(); g.moveTo(cx, cy + a * .4); g.lineTo(cx, cy + a * 1.2); g.stroke(); break;
    case 'cube': [[0, -a, -a * .87, -a * .5], [0, -a, a * .87, -a * .5], [-a * .87, -a * .5, 0, 0], [a * .87, -a * .5, 0, 0], [0, 0, 0, a], [-a * .87, -a * .5, -a * .87, a * .5], [a * .87, -a * .5, a * .87, a * .5], [-a * .87, a * .5, 0, a], [a * .87, a * .5, 0, a]].forEach(([x1, y1, x2, y2]) => { g.moveTo(cx + x1, cy + y1); g.lineTo(cx + x2, cy + y2); }); g.stroke(); break;
    case 'wolf': g.moveTo(cx - a, cy - a * .9); g.lineTo(cx - a * .45, cy - a * .35); g.lineTo(cx + a * .45, cy - a * .35); g.lineTo(cx + a, cy - a * .9); g.lineTo(cx + a * .8, cy + a * .1); g.lineTo(cx + a * .25, cy + a * .95); g.lineTo(cx - a * .25, cy + a * .95); g.lineTo(cx - a * .8, cy + a * .1); g.closePath(); g.stroke(); break;
    case 'cat': g.arc(cx, cy + a * .15, a, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx - a * .85, cy - a * .3); g.lineTo(cx - a * .7, cy - a * 1.2); g.lineTo(cx - a * .2, cy - a * .75); g.moveTo(cx + a * .85, cy - a * .3); g.lineTo(cx + a * .7, cy - a * 1.2); g.lineTo(cx + a * .2, cy - a * .75); g.stroke(); break;
    default: g.strokeRect(cx - a * .4, cy - a * .95, a * .8, a * 1.3); g.beginPath(); g.moveTo(cx, cy + a * .55); g.lineTo(cx, cy + a); g.moveTo(cx - a * .4, cy + a); g.lineTo(cx + a * .4, cy + a); g.stroke();
  }
  g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < h; y += 3) g.fillRect(0, y, w, 1);
  g.strokeStyle = 'rgba(232,80,91,.9)'; g.lineWidth = w * .05; g.strokeRect(0, 0, w, h);
}
// Portrait holo en grand : ornements selon le palier et la rareté
function bigPortrait(cv, c, rar, tier) {
  const g = cv.getContext('2d'), W = cv.width, hex = RAR[rar].hex, cx = W / 2, cy = W / 2;
  g.clearRect(0, 0, W, W); g.strokeStyle = hex; g.fillStyle = hex;
  const rays = [10, 18, 30][tier] || 10;
  for (let i = 0; i < rays; i++) { const a = i / rays * Math.PI * 2; g.globalAlpha = .4; g.lineWidth = W * .012;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * W * .36, cy + Math.sin(a) * W * .36); g.lineTo(cx + Math.cos(a) * W * (.44 + (i % 2) * .04), cy + Math.sin(a) * W * (.44 + (i % 2) * .04)); g.stroke(); }
  for (let r = 0; r <= tier + 1; r++) { g.globalAlpha = .2 + r * .1; g.lineWidth = W * .008; g.beginPath(); g.arc(cx, cy, W * (.31 + r * .035), 0, 7); g.stroke(); }
  if (tier >= 2) { const gr = g.createRadialGradient(cx, cy, W * .2, cx, cy, W * .5); gr.addColorStop(0, hex + '00'); gr.addColorStop(1, hex + '55'); g.globalAlpha = 1; g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, W * .5, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  const t = document.createElement('canvas'); t.width = t.height = 240; portrait(t, c);
  const s = W * .56, x = cx - s / 2, y = cy - s / 2;
  g.drawImage(t, x, y, s, s); g.strokeStyle = hex; g.lineWidth = W * .014; g.strokeRect(x, y, s, s);
  const k = s * .2; g.lineWidth = W * .02;
  [[x, y, 1, 1], [x + s, y, -1, 1], [x, y + s, 1, -1], [x + s, y + s, -1, -1]].forEach(([px, py, dx, dy]) => { g.beginPath(); g.moveTo(px + dx * k, py); g.lineTo(px, py); g.lineTo(px, py + dy * k); g.stroke(); });
}
// Décor des cartes d'amitié : rayons, anneaux et étincelles qui grandissent avec le palier
function friendBackdrop(cv, rar, tier, seed) {
  const g = cv.getContext('2d'), W = cv.width, H = cv.height, hex = RAR[rar].hex, cx = W / 2, cy = H * .47;
  g.clearRect(0, 0, W, H); g.strokeStyle = hex; g.fillStyle = hex;
  let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const rays = [0, 10, 16, 24, 36][tier];
  for (let i = 0; i < rays; i++) { const a = i / rays * Math.PI * 2 + seed; g.globalAlpha = .28; g.lineWidth = 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * H * .34, cy + Math.sin(a) * H * .34); g.lineTo(cx + Math.cos(a) * H * (.42 + rnd() * .1), cy + Math.sin(a) * H * (.42 + rnd() * .1)); g.stroke(); }
  for (let r = 0; r <= tier; r++) { g.globalAlpha = .14 + r * .07; g.lineWidth = 1.4; g.setLineDash(r % 2 ? [4, 6] : []); g.beginPath(); g.arc(cx, cy, H * (.3 + r * .045), 0, 7); g.stroke(); }
  g.setLineDash([]);
  for (let i = 0; i < 6 + tier * 8; i++) { g.globalAlpha = .25 + rnd() * .55; g.beginPath(); g.arc(rnd() * W, rnd() * H, .8 + rnd() * (tier >= 3 ? 2.2 : 1.2), 0, 7); g.fill(); }
  if (tier >= 4) { const gr = g.createRadialGradient(cx, cy, H * .1, cx, cy, H * .6); gr.addColorStop(0, hex + '44'); gr.addColorStop(1, hex + '00'); g.globalAlpha = 1; g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  g.globalAlpha = 1;
}
function skyline(seed, hex) {
  let s = seed, out = '';
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 14; i++) { const h = 20 + rnd() * 70; out += `<rect x="${i * 7.2}" y="${100 - h}" width="6" height="${h}" fill="${hex}" opacity="${(.12 + rnd() * .18).toFixed(2)}"/>`; }
  return `<svg class="hc-sky" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${out}</svg>`;
}

// ═══════════════════════ Rendu d'une carte
function cardHtml(c, owned, fresh) {
  const r = RAR[c.rar], fam = FAMILIES[c.fam], ct = c.contact ? DATA.c[c.contact] : null;
  const num = `${String(c.no).padStart(3, '0')}/${CARDS.length}`;
  if (!owned) return `<button type="button" class="hc-card hc-locked" style="--k:${r.hex}" data-id="${c.id}" aria-label="Carte ${c.secret ? 'secrète' : r.name} non obtenue. Retourner la carte.">
    <div class="hc-inner"><div class="hc-face"><div class="hc-top"><span>${c.secret ? 'SEC-??' : c.serial.replace(/[^-]+$/, '??')}</span><span class="hc-rar">◆ ${r.name}</span></div>
      <div class="hc-art hc-qmbox"><span class="hc-qm">?</span></div><span class="hc-cat" style="color:${fam.hex};border-color:${fam.hex}55">${fam.name}</span>
      <div class="hc-title">${c.secret ? 'Carte secrète' : 'Carte verrouillée'}</div>
      <div class="hc-quote hc-dimq">${c.secret ? 'On ne sait pas encore ce qu\'elle cache. Elle se révèle le jour où tu l\'obtiens.' : 'Son illustration et son texte se révèlent quand tu l\'obtiens.'}</div>
      <div class="hc-foot"><span class="hc-serial">NEO-BXL · 2089</span><span>${num}</span></div></div>
      <div class="hc-face hc-back"><h3>◆ ${r.name} · ${fam.name}</h3><div class="hc-t">???</div>
        ${c.secret ? '<p>Aucun indice : certaines réponses, certains événements et certaines rencontres font tomber ces cartes.</p>' : `<div class="hc-cond"><b>COMMENT L'OBTENIR</b>${esc(c.cond)}</div><div class="hc-reward">RÉCOMPENSE : ${c.reward.txt}</div>`}
        <div class="hc-flipnote">Clique pour retourner la carte</div></div></div></button>`;
  let art;
  if (c.art === 'portrait') art = `<canvas class="hc-big" width="300" height="300" data-portrait="${c.contact}" data-rar="${c.rar}" data-tier="${c.tier}"></canvas>`;
  else if (c.art === 'friend') art = `<canvas class="hc-fx" width="300" height="200" data-fx="${c.rar}" data-tier="${c.tier}" data-seed="${c.no * 37}"></canvas><svg class="hc-g" viewBox="0 0 100 100" aria-hidden="true">${G[c.glyph] || ''}</svg><canvas class="hc-medal" width="72" height="72" data-mini="${c.contact}"></canvas>`;
  else art = `<svg class="hc-g" viewBox="0 0 100 100" aria-hidden="true">${G[c.glyph] || ''}</svg>`;
  // Illustration retouchée (cards/<id>.webp) : remplace le dessin vectoriel quand elle existe
  const photo = typeof window !== 'undefined' && window.HC_PHOTOS !== false;
  if (photo) art = `<img class="hc-photo" src="${(typeof window !== 'undefined' && window.HC_IMG) || 'cards/'}${c.id}.webp" alt="" loading="lazy" decoding="async" onerror="this.remove()">${art}`;
  const who = ct ? `<div class="hc-who"><canvas width="68" height="68" data-mini="${c.contact}"></canvas><div><b>${esc(ct.name.toUpperCase())}</b><span>${esc(ct.role)}</span></div></div>`
    : c.runner ? '<div class="hc-who"><div><b>RUNNER INCONNU</b><span>Croisé·e en ville</span></div></div>'
    : c.district ? `<div class="hc-who"><div><b style="color:${c.district.color}">${esc(c.district.name.toUpperCase())}</b><span>Quartier de NEO-BXL</span></div></div>` : '';
  const back = c.eps ? `<ol class="hc-eps">${c.eps.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : c.brief ? `<p><b>Brief :</b> « ${esc(c.brief)} »</p><p class="hc-reward">LIEU : ${esc(c.place)}</p>`
    : c.secret ? '<p>Carte secrète : invisible dans la collection tant qu\'elle n\'est pas obtenue.</p>' : '';
  const anim = c.rar === 'myth' || c.rar === 'secret' || c.rar === 'gold';
  return `<button type="button" class="hc-card ${anim ? 'hc-anim' : ''} ${c.rar === 'secret' ? 'hc-secretc' : ''} ${fresh ? 'hc-fresh' : ''}" style="--k:${r.hex}" data-id="${c.id}" aria-label="${esc(c.title)}, carte ${r.name}. Retourner la carte.">
    <div class="hc-inner">
      <div class="hc-face"><span class="hc-foil"></span>
        <div class="hc-top"><span>${c.serial}</span><span class="hc-rar">◆ ${r.name}</span></div>
        <div class="hc-art">${skyline(c.no * 97 + 13, r.hex)}${art}<span class="hc-min">${esc(c.tag)}</span>${c.place ? `<span class="hc-place">${esc(c.place)}</span>` : ''}</div>
        <span class="hc-cat" style="color:${fam.hex};border-color:${fam.hex}55">${fam.name}</span>
        <div class="hc-title">${esc(c.title)}</div>${who}
        <div class="hc-quote">« ${esc(c.quote)} »</div>
        <div class="hc-foot"><span class="hc-serial">NEO-BXL · 2089</span><span>${num}</span></div>
      </div>
      <div class="hc-face hc-back"><span class="hc-foil"></span>
        <h3>◆ ${r.name} · ${c.serial}</h3><div class="hc-t">${esc(c.title)}</div>${back}
        <div class="hc-cond"><b>OBTENUE</b>${esc(c.cond)}</div><div class="hc-reward">RÉCOMPENSE : ${c.reward.txt}</div>
        <div class="hc-flipnote">Clique pour retourner la carte</div>
      </div>
    </div></button>`;
}
function paintCanvases(root) {
  root.querySelectorAll('canvas[data-mini]').forEach(cv => portrait(cv, DATA.c[cv.dataset.mini]));
  root.querySelectorAll('canvas[data-portrait]').forEach(cv => bigPortrait(cv, DATA.c[cv.dataset.portrait], cv.dataset.rar, +cv.dataset.tier));
  root.querySelectorAll('canvas[data-fx]').forEach(cv => friendBackdrop(cv, cv.dataset.fx, +cv.dataset.tier, +cv.dataset.seed));
}
function wireCards(root) {
  root.addEventListener('click', (ev) => { const c = ev.target.closest('.hc-card'); if (c && root.contains(c)) c.classList.toggle('hc-flip'); });
  root.addEventListener('pointermove', (ev) => { const c = ev.target.closest('.hc-card'); if (!c) return; const b = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((ev.clientX - b.left) / b.width * 100) + '%'); c.style.setProperty('--my', ((ev.clientY - b.top) / b.height * 100) + '%'); });
}

// ═══════════════════════ Galerie
/** Affiche la collection. opts : { got: Set, fresh: Set } */
function gallery(root, opts) {
  const got = opts.got, fresh = opts.fresh || new Set();
  let filter = 'all';
  const famCount = {}, famGot = {};
  CARDS.forEach(c => { famCount[c.fam] = (famCount[c.fam] || 0) + 1; if (got.has(c.id)) famGot[c.fam] = (famGot[c.fam] || 0) + 1; });
  const total = CARDS.filter(c => got.has(c.id)).length;
  root.classList.add('hc');
  root.innerHTML = `<div class="hc-head"><div><div class="hc-eyebrow">COLLECTION HOLO // NEO-BXL</div><h1 class="hc-h1">Cartes holo</h1></div>
      <div class="hc-progress"><b>${total}</b><span>/ ${CARDS.length} cartes</span><i><u style="width:${total / CARDS.length * 100}%"></u></i></div></div>
    <p class="hc-lead">Toutes les cartes restent cachées derrière un « ? » jusqu'à leur obtention. Au verso, les cartes normales indiquent comment les obtenir ; les secrètes ne disent rien. Clique une carte pour la retourner.</p>
    <div class="hc-legend">${Object.entries(FAMILIES).map(([k, f]) => `<div class="hc-lg" style="--k:${f.hex}"><b><span>${f.name}</span><span>${famGot[k] || 0}/${famCount[k]}</span></b><p>${f.txt}</p></div>`).join('')}</div>
    <div class="hc-filters" role="group" aria-label="Filtrer les cartes">${[['all', 'TOUTES', '#00d8f0'], ['owned', 'OBTENUES', '#7cf29a'], ...Object.entries(FAMILIES).map(([k, f]) => [k, f.name, f.hex])]
      .map(([k, l, hex]) => `<button type="button" data-f="${k}" style="--k:${hex}" aria-pressed="${k === 'all'}">${l}</button>`).join('')}</div>
    <div class="hc-grid"></div>`;
  const grid = root.querySelector('.hc-grid');
  const draw = () => {
    let html = '';
    Object.keys(FAMILIES).forEach((f) => {
      if (filter !== 'all' && filter !== 'owned' && filter !== f) return;
      const list = CARDS.filter(c => c.fam === f && (filter !== 'owned' || got.has(c.id)));
      if (!list.length) return;
      html += `<div class="hc-section">${FAMILIES[f].name} · ${famGot[f] || 0}/${famCount[f]}</div>` + list.map(c => cardHtml(c, got.has(c.id), fresh.has(c.id))).join('');
    });
    grid.innerHTML = html || '<p class="hc-lead">Aucune carte obtenue pour l\'instant. Monte l\'amitié de tes contacts pour la première.</p>';
    paintCanvases(grid);
  };
  root.querySelector('.hc-filters').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b) return; filter = b.dataset.f;
    root.querySelectorAll('.hc-filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
  wireCards(grid);
  draw();
}
/** Révélation des nouvelles cartes, une par une. */
function reveal(ids, onDone) {
  const list = ids.map(id => BY_ID[id]).filter(Boolean);
  if (!list.length) { onDone && onDone(); return; }
  const ov = document.createElement('div'); ov.className = 'hc hc-reveal';
  let i = 0;
  const show = () => {
    const c = list[i];
    ov.innerHTML = `<div class="hc-rv"><div class="hc-eyebrow">NOUVELLE CARTE ${list.length > 1 ? `· ${i + 1}/${list.length}` : ''}</div>
      <div class="hc-rvcard">${cardHtml(c, true, true)}</div><div class="hc-rvtxt">+ ${esc(c.reward.txt)}</div>
      <button type="button" class="hc-btn">${i + 1 < list.length ? 'Carte suivante ›' : 'Ajouter à la collection'}</button></div>`;
    paintCanvases(ov); wireCards(ov.querySelector('.hc-rvcard'));
    ov.querySelector('.hc-btn').onclick = () => { i++; if (i < list.length) show(); else { ov.remove(); onDone && onDone(); } };
  };
  document.body.appendChild(ov); show();
}
