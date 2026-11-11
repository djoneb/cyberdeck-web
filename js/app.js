import * as S from './save.js';
import { rankOf, nextRank, level, levelProgress, avatarFile, NEURA_STAGES } from './data.js';
import { drawNeura } from './neura.js';
import { GAMES, gameNote, openGame } from './games.js';
import { holophone as holoPage } from './holophone.js';
import { city } from './city.js';
import { phoneGlyph } from './portrait.js';
import * as Wd from './world.js';
import * as So from './social.js';
import { cyberware, market, PALETTES, WEB_THEME_KEY } from './market.js';
import { quetes, succes } from './questsui.js';
import * as Q from './quests.js';
import { cartes, checkCards, cardCount, cardTotal } from './cardsui.js';
import * as Sync from './sync.js';

const view = document.getElementById('view');
const nav = document.getElementById('nav');
const fileInput = document.getElementById('file');
let stop = null, leaves = [];

const TABS = [['profil', 'PROFIL'], ['holophone', 'HOLOPHONE'], ['jeux', 'JEUX'], ['quetes', 'QUÊTES'], ['ville', 'LA VILLE'], ['cyber', 'CYBERWARE'], ['marche', 'MARCHÉ'], ['cartes', 'CARTES'], ['succes', 'SUCCÈS'], ['neura', 'NEURA'], ['sauvegarde', 'SAUVEGARDE']];
const ctx = {
  toast, onLeave: (f) => leaves.push(f), level: () => level(S.xp()),
  changed: () => { if (!S.hasSave()) return; document.getElementById('savestate').textContent = `NIV ${level(S.xp())} · ${S.xp()} XP · €$ ${S.eddies()}`; clearTimeout(ctx.ct); ctx.ct = setTimeout(() => { if (!document.querySelector('.overlay')) checkCards(ctx); }, 600); },
  popup, go: (t, a) => go(t, a), applyTheme: () => applyTheme(),
};
function popup(title, text) {
  const ov = document.createElement('div'); ov.className = 'overlay';
  ov.innerHTML = `<div class="encounter" style="--c:var(--green)"><div class="mono small" style="color:var(--green)">${esc(title)}</div><p>${esc(text)}</p><button class="btn main">OK</button></div>`;
  ov.querySelector('button').onclick = () => ov.remove(); document.body.appendChild(ov);
}

function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2400);
}
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function stageOwned() { let n = 1; for (const i of ['neura_evo2', 'neura_evo3', 'neura_evo4', 'neura_evo5']) { if (S.owned(i)) n++; else break; } return n; }

function go(tab, arg) {
  applyTheme();
  if (stop) { stop(); stop = null; }
  leaves.splice(0).forEach(f => f());
  if (!S.hasSave() && tab !== 'sauvegarde') tab = 'accueil';
  nav.innerHTML = S.hasSave() ? TABS.map(([k, l]) => `<button class="${k === tab ? 'on' : ''}" data-k="${k}">${l}</button>`).join('') : '';
  nav.querySelectorAll('button').forEach(b => b.onclick = () => go(b.dataset.k));
  document.getElementById('savestate').textContent = 'AUCUNE PARTIE'; ctx.changed();
  const pages = { accueil, profil, neura, jeux, holophone: () => holoPage(view, ctx, arg), ville: () => city(view, ctx, arg || 'map'), cyber: () => cyberware(view, ctx), marche: () => market(view, ctx), quetes: () => quetes(view, ctx), succes: () => succes(view), cartes: () => cartes(view, ctx), sauvegarde };
  (pages[tab] || profil)();
  window.scrollTo(0, 0);
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
    <div class="panel" style="--accent:var(--amber)"><h3>Scanner avec le téléphone</h3><p class="dim">Le launcher envoie ta partie, chiffrée, en scannant un QR code.</p>
      <button class="btn main" id="qrin" ${Sync.available() ? '' : 'disabled'}>Afficher le QR code</button></div>
    <div class="panel" style="--accent:var(--violet)"><h3>Nouvelle partie</h3><p class="dim">Pour essayer sans téléphone.</p>
      <button class="btn" id="new">Commencer</button></div>
  </div>`;
  view.querySelector('#imp').onclick = () => fileInput.click();
  view.querySelector('#qrin').onclick = () => qrReceive();
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
  ${neuraStrip()}
  <div class="label">NETRUNNER</div>
  <div class="doors">
    ${door('holophone', '☎', 'HOLOPHONE', 'contacts · messages · ♥', 'var(--info)', holoBadge())}
    ${door('jeux', '⌗', 'JEUX', 'breach · circuits · infiltration', 'var(--primary)')}
    ${door('quetes', '☰', 'QUÊTES', 'défis · récit · cartes holo', 'var(--amber)', Q.challenges().filter(c => Q.challengeDone(c) && !Q.claimed(c.id)).length)}
    ${door('cartes', '◫', 'CARTES HOLO', `${cardCount()}/${cardTotal()} · collection`, '#ff4fd8')}
    ${door('succes', '✦', 'SUCCÈS', `${S.achievements().length} débloqués · secrets`, 'var(--primary)')}
    ${door('neura', '◈', 'NEURA', 'stade ' + stageOwned() + ' · ' + NEURA_STAGES[stageOwned() - 1], '#6ff3ff')}
    ${door('cyber', '⬡', 'CYBERWARE', `implants ${So.equipped().length}/${So.slots()} · marché`, '#b98cff')}
    ${door('marche', '€$', 'MARCHÉ NOIR', `${S.eddies()} €$ · apparences · fonctions`, 'var(--amber)')}
    ${door('sauvegarde', '⇅', 'SAUVEGARDE', 'synchro avec le téléphone', 'var(--amber)')}
    ${door('ville', '⌂', 'LA VILLE', 'lieux · rencontres · expéditions', 'var(--hcyan)', Wd.active().filter(a => Date.now() >= a.end).length, true)}
  </div>
  <p class="notice" style="margin-top:22px">Les gigs liés au téléphone (applis, radar, focus) restent à faire sur le launcher.</p>`;
  view.querySelectorAll('[data-go]').forEach(d => d.onclick = () => go(d.dataset.go));
  const strip = view.querySelector('.nstrip');
  if (strip) { stop = drawNeura(strip.querySelector('canvas'), stageOwned(), false); strip.onclick = () => go(strip.dataset.to, strip.dataset.arg || undefined); }
}
// Bandeau de NEURA : son humeur du moment et ce qu'elle a d'important à dire (comme sur le téléphone).
function neuraStrip() {
  const f = Q.feeling(), cv = So.convoPending(), ce = Q.cityEvent();
  let line = f.line, to = 'neura', arg = '';
  if (cv) { line = `${Wd.contact(cv.contactId)?.name || 'Un contact'} t'a écrit. Ta réponse compte.`; to = 'holophone'; arg = cv.contactId; }
  else if (f.id !== 'alert' && ce && !Q.cityEventDone()) { line = `${ce.name} en cours : ${ce.task.charAt(0).toLowerCase()}${ce.task.slice(1)}.`; to = 'quetes'; }
  return `<button class="nstrip" style="--c:${f.color}" data-to="${to}" data-arg="${arg}"><canvas width="96" height="96"></canvas>
    <span class="nsm"><span class="mono">NEURA // ${f.label}</span><b>${esc(line)}</b></span><span class="nsa">›</span></button>`;
}
const door = (k, ic, t, s, col, badge = 0, wide = false) => `<button class="door ${wide ? 'wide' : ''}" data-go="${k}" style="--c:${col}"><i></i>
  <span class="dic">${ic === '☎' ? phoneGlyph('currentColor', 34) : ic}</span><b>${t}</b><span class="mono dim tiny">${s}</span>${badge ? `<em>${badge}</em>` : ''}</button>`;
const holoBadge = () => So.unreadCount() + Wd.available().filter(id => Wd.gigState(id) === null || Wd.gigState(id) === 'done').length;

function neura() {
  const st = stageOwned();
  view.innerHTML = `<div class="neurapage"><div class="label">NEURA // STADE ${st} · ${NEURA_STAGES[st - 1].toUpperCase()}</div>
  <div class="neuragrid"><canvas width="760" height="760"></canvas>
  <div class="neuratalk"><div class="mono small" style="color:#6ff3ff">LIAISON TERMINAL FIXE // MODE SILENCIEUX</div>
    <p class="nq">« Bonjour, ${esc(S.name())}. Ici, sur ce terminal, je reste en veille : je n'aime pas parler à travers un écran de bureau. Les murs des tours ont des oreilles. »</p>
    <p class="nq">« Si tu veux discuter, prends ton téléphone : c'est là que je vis vraiment. Je t'y attends. »</p>
    <div class="notice">La discussion avec NEURA se fait uniquement sur le téléphone (launcher Cyberdeck).</div>
    <div class="mono dim small" style="margin-top:14px">Ses stades d'évolution s'achètent au marché noir (ici ou sur le téléphone).</div>
    <button class="btn main" data-go="marche" style="margin-top:10px">Marché noir ›</button></div></div></div>`;
  view.querySelector('[data-go]').onclick = () => go('marche');
  stop = drawNeura(view.querySelector('canvas'), st, false);
}

function jeux() {
  view.innerHTML = `<div class="sheethead"><h1 class="glitch" style="color:var(--primary)">JEUX</h1><div class="mono dim small">ENTRAÎNEMENT NETRUNNER · XP À LA CLÉ</div></div>
  <div class="tiles">${GAMES.map(([id, ic, t, sub, , col]) => { const note = gameNote(id);
    return `<button class="tile" data-g="${id}"><span class="tic" style="color:${col}">${ic}</span><b>${t}</b><span class="mono dim tiny">${sub}</span>${note ? `<em>${note}</em>` : ''}</button>`; }).join('')}</div>
  <p class="dim small">Breach, Déchiffre et Réflexes valident aussi les gigs du Holophone acceptés aujourd'hui. Échap ou ✕ pour quitter un jeu.</p>`;
  view.querySelectorAll('[data-g]').forEach(b => b.onclick = () => openGame(b.dataset.g, { toast, changed: () => { ctx.changed(); if (location.hash === '#jeux') jeux(); } }));
}

function sauvegarde() {
  view.innerHTML = `<div class="label">TRANSFERT PAR QR CODE</div><div class="grid">
    <div class="panel"><span class="pic">${phoneGlyph('currentColor', 60)}</span><h3>Recevoir du téléphone</h3><p class="dim">Charge ici la partie du launcher.</p>
      <button class="btn main" id="qrin" ${Sync.available() ? '' : 'disabled'}>QR code de réception</button></div>
    <div class="panel" style="--accent:var(--green)"><span class="pic" style="color:var(--green)">⇅</span><h3>Envoyer au téléphone</h3><p class="dim">Renvoie ta partie du PC vers le launcher.</p>
      <button class="btn main" id="qrout" ${Sync.available() && S.hasSave() ? '' : 'disabled'}>QR code d'envoi</button></div>
  </div>${window.isSecureContext ? '' : '<p class="notice" style="margin-top:12px">Le transfert par QR code a besoin d\'une connexion sécurisée : ouvre le site en https:// (le navigateur bloque le chiffrement en http).</p>'}<div id="qrzone"></div>
  <div class="label">FICHIER</div><div class="grid">
    <div class="panel"><span class="pic">⭳</span><h3>Renvoyer au téléphone</h3><p class="dim">Télécharge ta progression, puis dans le launcher : Paramètres → Sauvegarde → Restaurer une progression.</p>
      <button class="btn main" id="exp" ${S.hasSave() ? '' : 'disabled'}>Télécharger la sauvegarde</button></div>
    <div class="panel" style="--accent:var(--amber)"><span class="pic" style="color:var(--amber)">⭱</span><h3>Importer une sauvegarde</h3><p class="dim">Remplace la partie de ce navigateur.</p>
      <button class="btn" id="imp">Choisir un fichier</button></div>
    <div class="panel" style="--accent:var(--red)"><span class="pic" style="color:var(--red)">✕</span><h3>Effacer de ce navigateur</h3><p class="dim">La partie reste sur ton téléphone.</p>
      <button class="btn red" id="del" ${S.hasSave() ? '' : 'disabled'}>Effacer</button></div>
  </div>
  <p class="notice" style="margin-top:18px">Un seul appareil à la fois : renvoie ta partie au téléphone avant d'y rejouer, sinon la dernière version restaurée écrase l'autre.</p>`;
  view.querySelector('#imp').onclick = () => fileInput.click();
  view.querySelector('#qrin').onclick = () => qrReceive();
  view.querySelector('#qrout').onclick = () => qrSend();
  const e = view.querySelector('#exp'); if (e) e.onclick = () => {
    const blob = new Blob([S.exportJson()], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `cyberdeck-progression-web-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    toast('Sauvegarde téléchargée');
  };
  view.querySelector('#del').onclick = () => { if (confirm('Effacer la partie de ce navigateur ?')) { localStorage.removeItem('cyberdeck-web-save'); location.reload(); } };
}

// ── QR code
function qrBox(text, title, hint) {
  let zone = document.getElementById('qrzone');
  if (!zone) { view.insertAdjacentHTML('beforeend', '<div id="qrzone"></div>'); zone = document.getElementById('qrzone'); }
  const q = qrcode(0, 'M'); q.addData(text); q.make();
  zone.innerHTML = `<div class="panel center" style="--accent:var(--amber);margin-top:16px"><h3>${title}</h3>
    <div style="background:#fff;padding:14px;margin:12px 0">${q.createSvgTag({ cellSize: 6, margin: 0 })}</div>
    <p class="dim" style="text-align:center;max-width:520px">${hint}</p><p class="mono" id="qrstate" style="color:var(--amber)">EN ATTENTE DU TÉLÉPHONE…</p>
    <button class="btn" id="qrcancel">Annuler</button></div>`;
  let cancelled = false;
  zone.querySelector('#qrcancel').onclick = () => { cancelled = true; zone.innerHTML = ''; };
  return { isCancelled: () => cancelled, state: (t) => { const el = document.getElementById('qrstate'); if (el) el.textContent = t; }, close: () => { zone.innerHTML = ''; } };
}
async function qrReceive() {
  const s = Sync.newSession();
  const box = qrBox(Sync.qrPayload('send', s), 'Scanne avec le launcher',
    'Dans le launcher : Paramètres → Version web → « Scanner le QR code du PC », puis scanne ce code. Ta partie arrive chiffrée.');
  try {
    const json = await Sync.waitDownload(s, box.isCancelled);
    if (!json) { box.state('Délai dépassé. Réessaie.'); return; }
    S.importJson(json); box.close(); toast('Partie reçue du téléphone'); go('profil');
  } catch (e) { box.state('Échec : ' + (e.message || e)); }
}
async function qrSend() {
  const s = Sync.newSession();
  let zone = document.getElementById('qrzone');
  if (zone) zone.innerHTML = '<div class="panel center" style="--accent:var(--amber);margin-top:16px"><h3>Chiffrement et envoi de ta partie…</h3></div>';
  try {
    await Sync.upload(s, S.exportJson());
    const box = qrBox(Sync.qrPayload('get', s), 'Scanne avec le launcher pour récupérer ta partie',
      'Dans le launcher : Paramètres → Version web → « Scanner le QR code du PC ». Ta progression du PC remplace celle du téléphone.');
    const ok = await Sync.waitPickedUp(s, box.isCancelled);
    if (ok) { box.state('✓ PARTIE REÇUE PAR LE TÉLÉPHONE'); toast('Partie envoyée au téléphone'); } else box.state('Délai dépassé.');
  } catch (e) {
    toast('Échec : ' + (e.message || e));
    zone = document.getElementById('qrzone');
    if (zone) zone.innerHTML = `<div class="panel center" style="--accent:var(--red);margin-top:16px"><h3 style="color:var(--red)">Envoi impossible</h3><p>${esc(e.message || String(e))}</p><p class="dim">Vérifie ta connexion puis réessaie. Tu peux aussi utiliser « Télécharger la sauvegarde » ci-dessous.</p></div>`;
  }
}

fileInput.onchange = async () => {
  const f = fileInput.files[0]; if (!f) return;
  try { S.importJson(await f.text()); toast('Partie chargée'); go('profil'); }
  catch (err) { toast(err.message || 'Fichier invalide'); }
  fileInput.value = '';
};

// Couleurs du thème choisi dans le launcher (Réglages › Apparence), sinon celles par défaut.
function applyTheme() {
  const hex = (v, d) => typeof v === 'number' ? '#' + ((v >>> 0) & 0xffffff).toString(16).padStart(6, '0') : d;
  const r = document.documentElement.style;
  let pal = null; try { pal = PALETTES[localStorage.getItem(WEB_THEME_KEY)]; } catch { /* indisponible */ }
  r.setProperty('--primary', pal ? pal[0] : hex(S.get('cyberdeck', 'primary'), '#00d8f0'));
  r.setProperty('--cy', pal ? pal[0] : hex(S.get('cyberdeck', 'primary'), '#00d8f0'));
  r.setProperty('--secondary', pal ? pal[1] : hex(S.get('cyberdeck', 'secondary'), '#ff0a3c'));
  r.setProperty('--info', pal ? pal[2] : hex(S.get('cyberdeck', 'info'), '#f5e400'));
}
S.load();
applyTheme();
S.setXpHook((n) => { const c = Q.challenge('xp', n); if (c) toast(`Défi de la semaine réussi : « ${c.text} »`); });
// Fin de rendez-vous : vérifiée régulièrement, même si on est sur une autre page.
setInterval(() => { if (!S.hasSave()) return; const r = So.checkDate(); if (r) { popup(r.title, r.text); ctx.changed(); } }, 15000);
go((location.hash || '#profil').slice(1) || 'profil');
