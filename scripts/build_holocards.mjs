// Assemble la collection de cartes holo (js/holocards.js) à partir des sources et des données du jeu.
// Le même fichier est copié dans le launcher (app/src/main/assets/holocards/) : mêmes cartes, mêmes règles.
// Utilisation : node scripts/build_holocards.mjs [dossier-assets-du-launcher]
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
const root = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
const m = await import(url.pathToFileURL(path.join(root, 'js/gamedata.js')).href);
const DATA = {
  c: Object.fromEntries(m.CONTACTS.map(x => [x.id, { name: x.name, role: x.role, emblem: x.emblem, hello: x.hello, thanks: x.thanks, close: x.close, idle: x.idle, offer: x.offer }])),
  e: m.EXPEDITIONS.map(x => ({ id: x.id, c: x.contactId, t: x.title, p: x.place, m: x.minutes, b: x.brief, r: x.report })),
  ch: Object.entries(m.CHAINS).map(([k, v]) => ({ c: k, eps: v.map(x => x.title), last: v[v.length - 1].report })),
  d: m.DISTRICTS,
  dos: Object.fromEntries(Object.entries(m.DOSSIERS.contacts).map(([k, v]) => [k, v.citation])),
};
const src = (f) => fs.readFileSync(path.join(root, 'holocards-src', f), 'utf8');
const out = `// Généré par scripts/build_holocards.mjs : ne pas modifier à la main (sources dans holocards-src/).
(function () {
const DATA = ${JSON.stringify(DATA)};
${src('glyphs_base.js')}
${src('glyphs_friend.js')}
${src('engine.js')}
window.HoloCards = { CARDS, BY_ID, RAR, FAMILIES, pending, gallery, reveal };
})();
`;
fs.writeFileSync(path.join(root, 'js/holocards.js'), out);
const dest = process.argv[2];
if (dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'holocards.js'), out);
  fs.copyFileSync(path.join(root, 'holocards.css'), path.join(dest, 'holocards.css'));
}
console.log('cartes holo :', out.length, 'octets');
