import * as S from './save.js';
import { rankOf, nextRank, level, levelProgress, avatarFile, AVATARS, CONTACTS, relation, NEURA_STAGES } from './data.js';
import { drawNeura } from './neura.js';
import { circuits, infiltration } from './games.js';

const view = document.getElementById('view');
const nav = document.getElementById('nav');
const fileInput = document.getElementById('file');
let stop = null;

const TABS = [['profil', 'PROFIL'], ['neura', 'NEURA'], ['jeux', 'JEUX'], ['holophone', 'HOLOPHONE'], ['sauvegarde', 'SAUVEGARDE']];

function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2400);
}
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function stageOwned() { let n = 1; for (const i of ['neura_evo2', 'neura_evo3', 'neura_evo4', 'neura_evo5']) { if (S.owned(i)) n++; else break; } return n; }

function go(tab) {
  if (stop) { stop(); stop = null; }
  if (!S.hasSave() && tab !== 'sauvegarde') tab = 'accueil';
  nav.innerHTML = S.hasSave() ? TABS.map(([k, l]) => `<button class="${k === tab ? 'on' : ''}" data-k="${k}">${l}</button>`).join('') : '';
  nav.querySelectorAll('button').forEach(b => b.onclick = () => go(b.dataset.k));
  document.getElementById('savestate').textContent = S.hasSave() ? 'PARTIE CHARGÉE' : 'AUCUNE PARTIE';
  const pages = { accueil, profil, neura, jeux, holophone, sauvegarde };
  (pages[tab] || profil)();
  location.hash = tab;
}

function accueil() {
  view.innerHTML = `
  <div class="identity"><div><h1 class="glitch">CYBERDECK WEB</h1>
  <p class="dim">La partie Netrunner de ton deck, sur ordinateur : profil, NEURA, jeux et contacts.</p></div></div>
  <div class="label">REPRENDRE TA PARTIE</div>
  <div class="grid">
    <div class="panel"><h3>Importer ma sauvegarde</h3><p class="dim">Dans le launcher : Paramètres → Sauvegarde → Exporter, puis ouvre le fichier ici.</p>
      <button class="btn main" id="imp">Importer un fichier</button></div>
    <div class="panel" style="--accent:var(--amber)"><h3>Scanner avec le téléphone</h3><p class="dim">Transfert par QR code : bientôt disponible (relais chiffré).</p>
      <button class="btn" disabled>Bientôt</button></div>
    <div class="panel" style="--accent:var(--violet)"><h3>Nouvelle partie</h3><p class="dim">Pour essayer sans téléphone.</p>
      <button class="btn" id="new">Commencer</button></div>
  </div>`;
  view.querySelector('#imp').onclick = () => fileInput.click();
  view.querySelector('#new').onclick = () => { S.newGame(prompt('Ton nom de netrunner ?') || 'NETRUNNER'); go('profil'); };
}

function profil() {
  const xp = S.xp(), r = rankOf(xp), nx = nextRank(xp), lv = level(xp), f = levelProgress(xp);
  const C = 2 * Math.PI * 76;
  view.innerHTML = `
  <div class="identity">
    <div class="ring">
      <svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="76" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="8"/>
      <circle cx="85" cy="85" r="76" fill="none" stroke="#00d8f0" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C * f} ${C}" transform="rotate(-90 85 85)"/></svg>
      <img src="${avatarFile(S.avatar())}" alt="Avatar"><span class="pct">${Math.round(f * 100)} %</span><span class="lvl">NIV ${lv}</span>
    </div>
    <div><h1 class="glitch">${esc(S.name().toUpperCase())}</h1>
      <div style="color:var(--cy);font-weight:700;letter-spacing:.2em">${esc(r[1].toUpperCase())}</div>
      <div class="mono dim" style="font-size:13px">${xp} XP${nx ? ` · ${nx[0] - xp} avant « ${esc(nx[1])} »` : ' · rang maximum'}</div>
      <div class="chips"><span class="chip" style="color:var(--amber)">€$ ${S.eddies()}</span><span class="chip" style="color:var(--cy)">✦ ${S.achievements().length} succès</span>
      ${S.streak() ? `<span class="chip" style="color:#ff7a2e">🔥 ${S.streak()} j</span>` : ''}</div></div>
  </div>
  <div class="label">ACCÈS</div>
  <div class="grid">
    ${door('neura', '◈', 'NEURA', 'stade ' + stageOwned() + ' · ' + NEURA_STAGES[stageOwned() - 1], 'var(--cy)')}
    ${door('jeux', '⌗', 'JEUX', 'circuits · infiltration', 'var(--cy)')}
    ${door('holophone', '☎', 'HOLOPHONE', 'contacts · relations', 'var(--red)')}
    ${door('sauvegarde', '⇅', 'SAUVEGARDE', 'exporter vers le téléphone', 'var(--amber)')}
  </div>
  <p class="notice" style="margin-top:22px">Les gigs liés au téléphone (applis, radar, focus) restent à faire sur le launcher.</p>`;
  view.querySelectorAll('[data-go]').forEach(d => d.onclick = () => go(d.dataset.go));
}
const door = (k, ic, t, s, col) => `<div class="panel" data-go="${k}" style="--accent:${col};cursor:pointer;min-height:110px"><div style="font-size:28px;color:${col}">${ic}</div><h2>${t}</h2><div class="mono dim" style="font-size:12px">${s}</div></div>`;

function neura() {
  const st = stageOwned();
  view.innerHTML = `<div class="label">NEURA // STADE ${st} · ${NEURA_STAGES[st - 1].toUpperCase()}</div>
  <div class="center"><canvas width="560" height="560" style="width:min(460px,88vw)"></canvas>
  <p class="dim" style="max-width:560px;text-align:center">« Liaison établie depuis un terminal fixe. Je préfère ton téléphone, mais je m'adapte, ${esc(S.name())}. »</p>
  <p class="mono dim" style="font-size:12px">Les stades suivants s'achètent au marché noir du launcher.</p></div>`;
  stop = drawNeura(view.querySelector('canvas'), st, true);
}

function jeux() {
  view.innerHTML = `<div class="label">JEUX</div><div class="grid">
    ${door('g-circ', '⌬', 'CIRCUITS', 'relie le courant · +25 XP', 'var(--cy)')}
    ${door('g-infil', '◈', 'INFILTRATION', `niveau ${Math.max(1, S.get('cyberdeck_b9', 'infil_level', 1))} · +40 XP`, 'var(--red)')}
  </div><div id="game" style="margin-top:20px"></div>`;
  const zone = view.querySelector('#game');
  const refresh = () => document.getElementById('savestate').textContent = `${S.xp()} XP · €$ ${S.eddies()}`;
  view.querySelector('[data-go="g-circ"]').onclick = () => { if (stop) stop(); stop = null; circuits(zone, toast, refresh); };
  view.querySelector('[data-go="g-infil"]').onclick = () => { if (stop) stop(); stop = infiltration(zone, toast, refresh); };
}

function holophone() {
  view.innerHTML = `<div class="label">HOLOPHONE // CONTACTS</div><div class="grid">${CONTACTS.map(([id, n, role, em]) => {
    const a = S.affinity(id);
    return `<div class="panel" style="--accent:var(--red)"><div class="contact"><div class="em">${em}</div><div style="flex:1">
      <h3 style="color:var(--red)">${esc(n.toUpperCase())}</h3><div class="dim" style="font-size:14px">${esc(role)}</div>
      <div class="mono" style="font-size:12px;margin-top:4px">${relation(a)} · ${a}/100</div><div class="bar" style="--accent:var(--red)"><i style="width:${a}%"></i></div></div></div></div>`;
  }).join('')}</div><p class="notice" style="margin-top:18px">Appels, gigs et conversations : dans une prochaine version du site.</p>`;
}

function sauvegarde() {
  view.innerHTML = `<div class="label">SAUVEGARDE</div><div class="grid">
    <div class="panel"><h3>Renvoyer au téléphone</h3><p class="dim">Télécharge ta progression, puis dans le launcher : Paramètres → Sauvegarde → Restaurer une progression.</p>
      <button class="btn main" id="exp" ${S.hasSave() ? '' : 'disabled'}>Télécharger la sauvegarde</button></div>
    <div class="panel" style="--accent:var(--amber)"><h3>Importer une sauvegarde</h3><p class="dim">Remplace la partie de ce navigateur.</p>
      <button class="btn" id="imp">Choisir un fichier</button></div>
    <div class="panel" style="--accent:var(--red)"><h3>Effacer de ce navigateur</h3><p class="dim">La partie reste sur ton téléphone.</p>
      <button class="btn red" id="del" ${S.hasSave() ? '' : 'disabled'}>Effacer</button></div>
  </div>
  <p class="notice" style="margin-top:18px">Un seul appareil à la fois : renvoie ta partie au téléphone avant d'y rejouer, sinon la dernière version restaurée écrase l'autre.</p>`;
  view.querySelector('#imp').onclick = () => fileInput.click();
  const e = view.querySelector('#exp'); if (e) e.onclick = () => {
    const blob = new Blob([S.exportJson()], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `cyberdeck-progression-web-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    toast('Sauvegarde téléchargée');
  };
  view.querySelector('#del').onclick = () => { if (confirm('Effacer la partie de ce navigateur ?')) { localStorage.removeItem('cyberdeck-web-save'); location.reload(); } };
}

fileInput.onchange = async () => {
  const f = fileInput.files[0]; if (!f) return;
  try { S.importJson(await f.text()); toast('Partie chargée'); go('profil'); }
  catch (err) { toast(err.message || 'Fichier invalide'); }
  fileInput.value = '';
};

S.load();
go((location.hash || '#profil').slice(1) || 'profil');
