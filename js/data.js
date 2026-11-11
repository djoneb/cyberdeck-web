export const RANKS = [
  [0, 'Script kiddie'], [50, 'Netrunner débutant'], [150, 'Netrunner'], [400, 'Hacker confirmé'], [800, 'Fixer'],
  [1500, 'Netrunner d\'élite'], [3000, 'Légende de Night City'], [6000, 'Chrome fantôme'], [12000, 'Spectre de la Zone Zéro'],
  [25000, 'Briseur de Kurogane'], [50000, 'Dieu du Net'],
];
export const rankOf = (xp) => RANKS.filter(r => xp >= r[0]).pop();
export const nextRank = (xp) => RANKS.find(r => r[0] > xp);
export const level = (xp) => Math.floor(Math.sqrt(xp / 5)) + 1;
const xpFor = (lv) => 5 * (lv - 1) * (lv - 1);
export function levelProgress(xp) { const l = level(xp), a = xpFor(l), b = xpFor(l + 1); return Math.min(1, Math.max(0, (xp - a) / Math.max(1, b - a))); }

// Portraits (mêmes identifiants que dans le launcher)
export const AVATARS = {
  a0: ['00', 'Brasier'], a1: ['01', 'Vétéran'], a2: ['02', 'Pulse'], a3: ['03', 'Givre'], a4: ['04', 'Ambre'], a5: ['05', 'Néon'],
  a7: ['07', 'Vipère'], a8: ['08', 'Onyx'], a9: ['09', 'Oracle'], a10: ['10', 'Azur'], a12: ['12', 'Améthyste'], a13: ['13', 'Valkyrie'],
};
export function avatarFile(id) {
  const map = { a6: 'a1', a11: 'a1', a14: 'a9' };
  const a = AVATARS[map[id] || id] || AVATARS.a0;
  return `assets/avatars/avatar_${a[0]}.webp`;
}

export const CONTACTS = [
  ['vasko', 'Vasko', 'Fixer · gare Zéro', '⚄'], ['mira', 'Mira Kade', 'Netrunneuse', '◉'], ['ferrant', 'Doc Ferrant', 'Charcudoc · Bazar Néon', '▣'],
  ['lou', 'Lou « Néon » Batista', 'DJ · club Ondes', '✦'], ['okoro', 'Sergent Okoro', 'Ex-flic · indic', '⛨'], ['veuve', 'La Veuve', 'Cheffe des Roses Noires', '❀'],
  ['kenji', 'Kenji Arata', 'Informateur corpo', '◈'], ['rook', 'Rook', 'Nomade · convoyeur', '▲'], ['pixie', 'Pixie', 'Gamine hackeuse', '☻'],
  ['ivana', 'Ivana Morel', 'Journaliste indépendante', '◎'], ['sora', 'Sora', 'Fragment libre de HAKONE', '▣'], ['vex', 'Dr Eliane Vex', 'Ex-chercheuse Kurogane', '⛨'],
];
export function relation(aff) {
  if (aff >= 90) return 'Proche'; if (aff >= 60) return 'Ami·e'; if (aff >= 30) return 'Allié·e'; if (aff >= 10) return 'Contact'; return 'Inconnu·e';
}
export const NEURA_STAGES = ['Iris', 'Synapse', 'Halo', 'Oracle', 'Ascendante'];
