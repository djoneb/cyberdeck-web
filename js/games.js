// Mini-jeux : mêmes règles, mêmes récompenses et mêmes records que dans le launcher.
import * as S from './save.js';
import * as Wd from './world.js';
import { R, today, epochDay } from './krand.js';

export const GAMES = [
  ['breach', '⌗', 'Breach', 'matrice de codes', '+25 XP', 'var(--primary)'],
  ['decrypt', '#', 'Déchiffre', 'code à 4 chiffres', '+15 XP', 'var(--primary)'],
  ['reflex', '◎', 'Réflexes', 'cibles éclair', '+XP', 'var(--primary)'],
  ['circuits', '⌬', 'Circuits', 'relie le courant', null, 'var(--primary)'],
  ['signal', '∿', 'Décodeur', 'accorde le signal', null, 'var(--info)'],
  ['firewall', '⛨', 'Pare-feu', 'stoppe les virus', null, 'var(--info)'],
  ['memory', '◈', 'Mémoire', 'séquence de NEURA', null, 'var(--info)'],
  ['term', '>_', 'Terminal', 'trouve le mot de passe', null, 'var(--info)'],
  ['sort', '⇄', 'Tri de données', 'route les paquets', null, 'var(--info)'],
  ['infil', '◈', 'Infiltration', 'évite les caméras', '+40 XP', 'var(--red)'],
];
export function gameNote(id) {
  if (id === 'circuits') return `${S.get('cyberdeck_b7', 'circ_solved', 0)} réparés`;
  if (id === 'infil') return `niveau ${Math.max(1, S.get('cyberdeck_b9', 'infil_level', 1))}`;
  const b = S.get('cyberdeck_b7', 'mg_best_' + id, 0);
  return GAMES.find(g => g[0] === id)[4] || (b ? `record ${b}` : null);
}

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };

// ── Sons (bips du deck)
let actx;
function tone(freq, dur = 0.12, vol = 0.12, type = 'square') {
  try {
    actx = actx || new AudioContext();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + dur);
  } catch { /* audio indisponible */ }
}
const sfx = { click: () => tone(880, 0.05, 0.05), ok: () => { tone(660, 0.1); setTimeout(() => tone(990, 0.15), 90); }, err: () => tone(160, 0.2, 0.1, 'sawtooth') };

/** Ouvre un jeu en plein écran. ctx = { toast, changed } */
export function openGame(id, ctx) {
  const g = GAMES.find(x => x[0] === id); if (!g) return;
  const ov = el(`<div class="overlay game"><div class="ovin">
    <div class="ovhead"><div><div class="mono dim small">NETRUN // ENTRAÎNEMENT</div><h2 class="glitch">${g[2].toUpperCase()}</h2><div class="mono dim small" id="gsub"></div></div>
    <button class="x" title="Fermer (Échap)">✕</button></div><div class="gbody"></div></div></div>`);
  document.body.appendChild(ov); document.body.classList.add('noscroll');
  const body = ov.querySelector('.gbody'), sub = ov.querySelector('#gsub');
  const cleanups = [];
  const api = {
    sub: (t) => { sub.textContent = t; },
    onClose: (f) => cleanups.push(f),
    toast: ctx.toast,
    /** XP, record et gigs du jour liés au jeu. */
    reward(ev) { const done = ev ? Wd.questEvent(ev) : []; done.forEach(c => ctx.toast(`Gig de ${c.name} bouclé : rappelle-le pour être payé·e`)); ctx.changed(); },
    result(ok, title, line, again) {
      const box = el(`<div class="result ${ok ? 'ok' : 'ko'}"><div class="mono">${title}</div><b>${line}</b><button class="btn main">Rejouer ›</button></div>`);
      box.querySelector('button').onclick = again; body.appendChild(box); box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    },
  };
  const close = () => { cleanups.forEach(f => f()); ov.remove(); document.body.classList.remove('noscroll'); document.removeEventListener('keydown', esc); ctx.changed(); };
  const esc = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', esc);
  ov.querySelector('.x').onclick = close;
  const start = () => { cleanups.splice(0).forEach(f => f()); body.innerHTML = ''; IMPL[id](body, api, start); };
  start();
}

// ═══════════════════════ BREACH PROTOCOL
function breach(body, api, again) {
  const CODES = ['1C', 'BD', '55', 'E9', '7A', 'FF'], N = 5, BUF = 6, LIMIT = 45;
  const grid = [...Array(N)].map(() => [...Array(N)].map(() => CODES[rnd(6)]));
  const path = []; let row = 0, col = rnd(N); path.push([row, col]); let vert = true;
  while (path.length < BUF) {
    if (vert) row = shuffle([...Array(N).keys()].filter(r => !path.some(p => p[0] === r && p[1] === col)))[0];
    else col = shuffle([...Array(N).keys()].filter(c => !path.some(p => p[0] === row && p[1] === c)))[0];
    path.push([row, col]); vert = !vert;
  }
  const seq = path.map(([r, c]) => grid[r][c]);
  const daemons = [seq.slice(1, 3), seq.slice(2, 5)].filter((d, i, a) => a.findIndex(x => x.join() === d.join()) === i);
  const has = (buf, d) => { for (let i = 0; i + d.length <= buf.length; i++) if (d.every((x, k) => buf[i + k] === x)) return true; return false; };
  let buffer = [], used = new Set(), isRow = true, line = 0, left = LIMIT, started = false, result = null;
  api.sub('MATRICE DE CODES // 45 S');
  body.innerHTML = `<div class="timer"><span class="mono dim">TEMPS</span><div class="tbar"><i></i></div><span class="mono" id="tl">45.0</span></div>
    <div class="mono dim small">TAMPON</div><div class="buffer"></div><div class="matrix"></div>
    <div class="mono dim small" style="margin-top:14px">DAEMONS À INJECTER</div><div class="daemons"></div><p class="dim hint">Choisis un code dans la ligne surlignée, puis dans la colonne, en alternant.</p>`;
  const render = () => {
    body.querySelector('.buffer').innerHTML = [...Array(BUF)].map((_, i) => `<span class="${i < buffer.length ? 'on' : ''}">${buffer[i] || ''}</span>`).join('');
    body.querySelector('.matrix').innerHTML = grid.map((r, ri) => r.map((v, ci) => {
      const act = result === null && (isRow ? ri === line : ci === line), u = used.has(ri * N + ci);
      return `<button class="${act ? 'act' : ''} ${u ? 'used' : ''}" data-r="${ri}" data-c="${ci}">${u ? '[ ]' : v}</button>`;
    }).join('')).join('');
    body.querySelector('.daemons').innerHTML = daemons.map((d, i) => { const ok = has(buffer, d);
      return `<div class="daemon ${ok ? 'ok' : ''}">${d.map(x => `<span>${x}</span>`).join('')}<em>${i === 0 ? 'DATAMINE_V1' : 'ICEPICK'}${ok ? ' ✓' : ''}</em></div>`; }).join('');
    body.querySelectorAll('.matrix button').forEach(b => b.onclick = () => pick(+b.dataset.r, +b.dataset.c));
  };
  const finish = (win) => {
    result = win; render(); win ? sfx.ok() : sfx.err();
    if (win) { S.addXp(25); S.unlock('breach_win'); if (LIMIT - left < 10) S.unlock('breach_fast'); api.reward('breach'); }
    api.result(win, win ? '> ACCÈS AUTORISÉ' : '> ÉCHEC DE LA BRÈCHE', win ? '+25 XP' : 'Le tampon est plein ou le temps est écoulé.', again);
  };
  const pick = (r, c) => {
    if (result !== null) return;
    if (!(isRow ? r === line : c === line) || used.has(r * N + c)) { sfx.err(); return; }
    started = true; sfx.click(); buffer.push(grid[r][c]); used.add(r * N + c);
    if (isRow) { isRow = false; line = c; } else { isRow = true; line = r; }
    const done = daemons.filter(d => has(buffer, d)).length;
    if (done === daemons.length) finish(true); else if (buffer.length >= BUF) finish(done > 0); else render();
  };
  const tick = setInterval(() => {
    if (!started || result !== null) return;
    left = Math.max(0, left - 0.1);
    body.querySelector('#tl').textContent = left.toFixed(1);
    const bar = body.querySelector('.tbar i'); bar.style.width = (left / LIMIT * 100) + '%'; bar.classList.toggle('low', left < 10);
    if (left <= 0) finish(false);
  }, 100);
  api.onClose(() => clearInterval(tick));
  render();
}

// ═══════════════════════ DÉCHIFFREMENT
function decrypt(body, api, again) {
  const secret = [...Array(4)].map(() => 1 + rnd(6)), guesses = []; let cur = [], over = false;
  api.sub('CODE ICE // 4 CHIFFRES DE 1 À 6 // 8 ESSAIS');
  const score = (g) => { const ex = g.filter((d, i) => d === secret[i]).length; let common = 0; for (let d = 1; d <= 6; d++) common += Math.min(g.filter(x => x === d).length, secret.filter(x => x === d).length); return [ex, common - ex]; };
  const render = () => {
    body.innerHTML = guesses.map(g => { const [ok, near] = score(g);
      return `<div class="guess">${g.map(d => `<span>${d}</span>`).join('')}<b class="ok">${'✓'.repeat(ok)}</b><b class="near">${'~'.repeat(near)}</b>${!ok && !near ? '<b class="dim">×</b>' : ''}</div>`; }).join('') +
      (over ? '' : `<div class="guess cur">${[0, 1, 2, 3].map(i => `<span>${cur[i] ?? '_'}</span>`).join('')}</div>
      <div class="keys">${[1, 2, 3, 4, 5, 6].map(d => `<button data-d="${d}">${d}</button>`).join('')}</div>
      <div class="row"><button class="btn" id="del">⌫</button><button class="btn ${cur.length === 4 ? 'main' : ''}" id="go">Injecter</button></div>
      <p class="dim hint">Essai ${guesses.length + 1}/8 · ✓ bon chiffre bien placé · ~ bon chiffre mal placé. Clavier : 1 à 6, Entrée, Retour.</p>`);
    if (over) return;
    body.querySelectorAll('.keys button').forEach(b => b.onclick = () => add(+b.dataset.d));
    body.querySelector('#del').onclick = () => { cur.pop(); render(); };
    body.querySelector('#go').onclick = inject;
  };
  const add = (d) => { if (cur.length < 4) { cur.push(d); sfx.click(); render(); } };
  const inject = () => {
    if (cur.length !== 4) return;
    const g = cur; guesses.push(g); cur = [];
    if (g.join() === secret.join()) { over = true; render(); sfx.ok(); S.addXp(15); S.unlock('decrypt_win'); api.reward('decrypt'); api.result(true, '> CODE CASSÉ', '+15 XP', again); }
    else if (guesses.length >= 8) { over = true; render(); sfx.err(); api.result(false, '> ÉCHEC', `Le code était ${secret.join('')}`, again); }
    else render();
  };
  const key = (e) => { if (over) return; if (e.key >= '1' && e.key <= '6') add(+e.key); else if (e.key === 'Backspace') { cur.pop(); render(); } else if (e.key === 'Enter') inject(); };
  document.addEventListener('keydown', key); api.onClose(() => document.removeEventListener('keydown', key));
  render();
}

// ═══════════════════════ RÉFLEXES
function reflex(body, api, again) {
  const ROUNDS = 20; let target = -1, hits = 0, miss = 0, round = 0, shown = 0, total = 0, running = false, timer;
  api.sub(`CIBLES ÉCLAIR // ${ROUNDS} CIBLES`);
  body.innerHTML = `<div class="stats"><span style="color:var(--primary)" id="h">TOUCHÉES 0</span><span style="color:var(--red)" id="m">RATÉES 0</span><span style="color:var(--info)" id="ms">— ms</span></div>
    <div class="reflex">${[...Array(16)].map((_, i) => `<button data-i="${i}"></button>`).join('')}</div><div id="rf"><button class="btn main" id="go">Démarrer</button></div>`;
  const cells = [...body.querySelectorAll('.reflex button')];
  const upd = () => { body.querySelector('#h').textContent = `TOUCHÉES ${hits}`; body.querySelector('#m').textContent = `RATÉES ${miss}`; body.querySelector('#ms').textContent = hits ? `${Math.round(total / hits)} ms` : '— ms'; cells.forEach((c, i) => c.classList.toggle('on', i === target)); };
  const next = () => {
    clearTimeout(timer); target = -1; upd();
    if (round >= ROUNDS) {
      running = false; sfx.ok();
      const xp = hits >= 12 ? 10 : 0; if (xp) S.addXp(xp); if (hits >= 18) S.unlock('reflex_pro');
      api.reward('reflex');
      api.result(hits >= 12, `> RÉSULTAT : ${hits}/${ROUNDS}`, xp ? `+${xp} XP` : 'Il faut 12 cibles pour gagner de l\'XP', again); return;
    }
    timer = setTimeout(() => {
      target = rnd(16); shown = performance.now(); upd();
      timer = setTimeout(() => { if (running && target >= 0) { miss++; round++; next(); } }, 900);
    }, 350 + rnd(750));
  };
  cells.forEach((c, i) => c.onclick = () => {
    if (!running) return;
    if (i === target) { sfx.click(); hits++; total += performance.now() - shown; round++; next(); } else { sfx.err(); miss++; upd(); }
  });
  body.querySelector('#go').onclick = () => { body.querySelector('#rf').innerHTML = '<p class="dim">Clique la case qui s\'allume !</p>'; running = true; next(); };
  api.onClose(() => clearTimeout(timer));
}

// ═══════════════════════ CIRCUITS (grille identique au téléphone, défi du jour compris)
const rot = (m) => ((m << 1) | (m >> 3)) & 15;
const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0], BIT = [1, 2, 4, 8];
const ones = (m) => (m & 1) + ((m >> 1) & 1) + ((m >> 2) & 1) + ((m >> 3) & 1);
function genCircuit(n, seed) {
  const r = R(seed), mask = new Array(n * n).fill(0), seen = new Array(n * n).fill(false);
  const start = Math.floor(n / 2) * n + Math.floor(n / 2), st = [start]; seen[start] = true;
  while (st.length) {
    const cur = st[st.length - 1], cx = cur % n, cy = Math.floor(cur / n);
    const opts = [0, 1, 2, 3].filter(d => { const x = cx + DX[d], y = cy + DY[d]; return x >= 0 && y >= 0 && x < n && y < n && !seen[y * n + x] && ones(mask[cur]) < 3; });
    if (!opts.length) { st.pop(); continue; }
    const d = opts[r.nextIntUntil(opts.length)], nx = (cy + DY[d]) * n + cx + DX[d];
    mask[cur] |= BIT[d]; mask[nx] |= BIT[(d + 2) % 4]; seen[nx] = true; st.push(nx);
  }
  for (let i = 0; i < n * n; i++) if (!seen[i]) {
    const cx = i % n, cy = Math.floor(i / n);
    for (let d = 0; d < 4; d++) { const x = cx + DX[d], y = cy + DY[d];
      if (x >= 0 && y >= 0 && x < n && y < n && seen[y * n + x]) { mask[i] |= BIT[d]; mask[y * n + x] |= BIT[(d + 2) % 4]; seen[i] = true; break; } }
  }
  return mask;
}
function litCells(m, n) {
  const on = new Array(n * n).fill(false), s = Math.floor(n / 2) * n + Math.floor(n / 2), q = [s]; on[s] = true;
  while (q.length) {
    const c = q.shift(), x = c % n, y = Math.floor(c / n);
    for (let d = 0; d < 4; d++) {
      if (!(m[c] & BIT[d])) continue;
      const nx = x + DX[d], ny = y + DY[d]; if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
      const o = ny * n + nx; if (!on[o] && (m[o] & BIT[(d + 2) % 4])) { on[o] = true; q.push(o); }
    }
  }
  return on;
}
let circSize = 4, circDaily = false;
function circuits(body, api, again) {
  const daily = circDaily;
  const n = daily ? 6 : circSize, seed = daily ? epochDay() * 7777 : Date.now() * 1000 + rnd(1000);
  const m = genCircuit(n, seed), r = R(seed);
  do { for (let i = 0; i < m.length; i++) { const k = r.nextIntUntil(4); for (let j = 0; j < k; j++) m[i] = rot(m[i]); } } while (litCells(m, n).every(Boolean));
  const dailyDone = () => S.get('cyberdeck_b7', 'daily_circuit', '') === today();
  const t0 = Date.now(); let moves = 0, won = null, raf;
  api.sub('RÉSEAU ÉLECTRIQUE // RELIE LA SOURCE À TOUS LES NŒUDS');
  body.innerHTML = `<p class="dim hint">Clique une case pour faire pivoter sa piste (clic droit : sens inverse). Relie la source ◉ à tous les nœuds pour rétablir le courant.</p>
    <div class="row">${[[4, 'FACILE'], [5, 'MOYEN'], [6, 'EXPERT']].map(([s, l]) => `<button class="btn ${s === n && !daily ? 'main' : ''}" data-s="${s}">${l} ${s}×${s}</button>`).join('')}
    <button class="btn ${daily ? 'main' : ''}" id="daily">${dailyDone() ? '✓ DÉFI DU JOUR RÉUSSI' : '★ DÉFI DU JOUR · +50 XP'}</button></div>
    <div class="stats"><span style="color:var(--info)" id="ct">⏱ 0 s · 0 coups</span><span style="color:var(--amber)" id="cl"></span></div>
    <canvas class="circ" width="600" height="600"></canvas>
    <div id="cres"></div><p class="mono dim small" id="crec"></p>`;
  body.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { circSize = +b.dataset.s; circDaily = false; again(); });
  body.querySelector('#daily').onclick = () => { circDaily = true; again(); };
  const cv = body.querySelector('canvas'), g = cv.getContext('2d'), cs = 600 / n, src = Math.floor(n / 2) * n + Math.floor(n / 2);
  const rec = () => { const b = S.get('cyberdeck_b7', 'circ_best_' + n, 0); body.querySelector('#crec').textContent = `Circuits réparés : ${S.get('cyberdeck_b7', 'circ_solved', 0)} · record ${n}×${n} : ${b ? b + ' s' : '—'}`; };
  rec();
  const draw = (ms) => {
    const on = litCells(m, n), t = ms / 1000;
    g.clearRect(0, 0, 600, 600);
    for (let i = 0; i < n * n; i++) {
      const x = (i % n) * cs, y = Math.floor(i / n) * cs, cx = x + cs / 2, cy = y + cs / 2, lit = on[i];
      g.fillStyle = lit ? 'rgba(0,216,240,.08)' : '#0a1219'; g.fillRect(x + 3, y + 3, cs - 6, cs - 6);
      g.strokeStyle = lit ? 'rgba(0,216,240,.5)' : 'rgba(255,255,255,.1)'; g.lineWidth = 1.5; g.strokeRect(x + 3, y + 3, cs - 6, cs - 6);
      const col = lit ? '#00d8f0' : '#3a4a55', sw = cs * 0.13;
      g.lineCap = 'butt';
      for (let d = 0; d < 4; d++) if (m[i] & BIT[d]) {
        const ex = cx + DX[d] * cs / 2, ey = cy + DY[d] * cs / 2;
        if (lit) { g.strokeStyle = 'rgba(0,216,240,.25)'; g.lineWidth = sw * 2.6; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ex, ey); g.stroke(); }
        g.strokeStyle = col; g.lineWidth = sw; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ex, ey); g.stroke();
      }
      const circle = (r, c) => { g.fillStyle = c; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); };
      if (i === src) { const p = 0.85 + 0.15 * Math.sin(t * 4); circle(cs * 0.34 * p, 'rgba(246,179,92,.3)'); circle(cs * 0.22, '#f6b35c'); circle(cs * 0.08, '#fff'); }
      else if (ones(m[i]) === 1) { circle(cs * 0.2, col); circle(cs * 0.12, '#05080c'); if (lit) circle(cs * 0.06, '#fff'); }
      else circle(sw * 0.6, col);
    }
    body.querySelector('#cl').textContent = `${on.filter(Boolean).length}/${n * n} alimentés`;
    if (!won) body.querySelector('#ct').textContent = `⏱ ${Math.floor((Date.now() - t0) / 1000)} s · ${moves} coups`;
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  api.onClose(() => cancelAnimationFrame(raf));
  const turn = (e, back) => {
    e.preventDefault(); if (won) return;
    const b = cv.getBoundingClientRect(), k = b.width / n;
    const i = Math.floor((e.clientY - b.top) / k) * n + Math.floor((e.clientX - b.left) / k);
    if (i < 0 || i >= n * n) return;
    m[i] = back ? rot(rot(rot(m[i]))) : rot(m[i]); moves++; sfx.click();
    if (litCells(m, n).every(Boolean)) {
      const s = Math.floor((Date.now() - t0) / 1000);
      const base = n === 4 ? 15 : n === 5 ? 25 : 40, fast = s <= n * 6 ? Math.floor(base / 2) : 0;
      let xp = base + fast;
      S.setI('cyberdeck_b7', 'circ_solved', S.get('cyberdeck_b7', 'circ_solved', 0) + 1);
      const best = S.get('cyberdeck_b7', 'circ_best_' + n, 0); if (!best || s < best) S.setI('cyberdeck_b7', 'circ_best_' + n, s);
      if (daily && !dailyDone()) { S.setS('cyberdeck_b7', 'daily_circuit', today()); xp += 50; }
      S.addXp(xp); won = [s, xp]; sfx.ok(); api.reward(null); rec();
      body.querySelector('#ct').textContent = `⏱ ${s} s · ${moves} coups`;
      const box = el(`<div class="result ok"><div class="mono">> COURANT RÉTABLI</div><b>${s} s · ${moves} coups · +${xp} XP</b><button class="btn main">Circuit suivant ›</button></div>`);
      box.querySelector('button').onclick = () => { circDaily = false; again(); }; body.querySelector('#cres').appendChild(box);
    }
  };
  cv.onclick = (e) => turn(e, false);
  cv.oncontextmenu = (e) => turn(e, true);
}

// ═══════════════════════ DÉCODEUR DE SIGNAL
function signal(body, api, again) {
  const target = [...Array(4)].map(() => 1 + rnd(9)), dials = [5, 5, 5, 5], t0 = Date.now(); let done = null, raf;
  api.sub('SIGNAL // ACCORDE TES 4 FRÉQUENCES · 60 S');
  body.innerHTML = `<div class="wave"><canvas width="900" height="220"></canvas><span class="mono small" id="match"></span><span class="mono small" id="left"></span></div>
    <div class="dials">${[0, 1, 2, 3].map(i => `<div><button class="btn" data-i="${i}" data-d="1">▲</button><b id="d${i}">5</b><button class="btn" data-i="${i}" data-d="-1">▼</button></div>`).join('')}</div>
    <p class="dim hint">L'onde rouge est le signal capté : rapproche ton onde cyan jusqu'à 100 %.</p>`;
  const cv = body.querySelector('canvas'), g = cv.getContext('2d');
  const left = () => 60 - Math.floor((Date.now() - t0) / 1000);
  const match = () => Math.round(dials.reduce((a, d, i) => a + 1 - Math.abs(d - target[i]) / 8, 0) / 4 * 100);
  const wave = (f, col, t) => { g.strokeStyle = col; g.lineWidth = 3; g.beginPath();
    for (let i = 0; i <= 120; i++) { const x = i / 120; let y = 0; f.forEach((v, k) => { y += Math.sin(x * (v + k * 0.5) * 2 * Math.PI + t * (1 + k * 0.3)) / (k + 1); });
      const px = x * 900, py = 110 + y * 48; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); };
  const frame = (ms) => {
    g.clearRect(0, 0, 900, 220); wave(target, 'rgba(232,80,91,.55)', ms / 1000); wave(dials, '#00d8f0', ms / 1000);
    const mm = match(), l = Math.max(0, left());
    body.querySelector('#match').textContent = `CORRESPONDANCE ${mm} %`; body.querySelector('#match').style.color = mm === 100 ? 'var(--green)' : 'var(--info)';
    body.querySelector('#left').textContent = `${l} s`; body.querySelector('#left').style.color = l <= 10 ? 'var(--red)' : 'var(--dim)';
    if (done === null && l <= 0) { done = -1; sfx.err(); Wd.finishGame('signal', 0, 0); api.result(false, '> SIGNAL PERDU', `Fréquences : ${target.join('-')}`, again); }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame); api.onClose(() => cancelAnimationFrame(raf));
  body.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
    if (done !== null) return;
    const i = +b.dataset.i; dials[i] = (dials[i] + (+b.dataset.d) + 10) % 10; body.querySelector('#d' + i).textContent = dials[i]; sfx.click();
    if (dials.join() === target.join()) { done = left(); const xp = 20 + Math.floor(done / 3); Wd.finishGame('signal', done, xp); sfx.ok(); api.reward(null);
      api.result(true, '> SIGNAL DÉCODÉ', `${done} s restantes · +${xp} XP`, again); }
  });
}

// ═══════════════════════ PARE-FEU
function firewall(body, api, again) {
  let hp = 5, score = 0, over = false, viruses = [], spawn = 0, last = performance.now(), raf; const t0 = performance.now();
  api.sub('CLIQUE LES VIRUS AVANT LE NOYAU · 60 S');
  body.innerHTML = `<div class="stats"><span id="hp"></span><span style="color:var(--info)" id="fs"></span></div><div class="lanes">${[0, 1, 2, 3, 4].map(() => '<div></div>').join('')}<i class="core"></i></div>`;
  const lanes = [...body.querySelectorAll('.lanes div')];
  const frame = (now) => {
    const dt = (now - last) / 1000; last = now;
    const tl = 60 - Math.floor((now - t0) / 1000);
    if (now > spawn) { const v = { lane: rnd(5), y: 0, speed: 0.12 + Math.random() * 0.1 + (60 - tl) * 0.004 }; v.el = el('<button class="virus">✖</button>');
      v.el.onclick = () => { if (!over && !v.dead) { v.dead = true; v.el.remove(); score++; sfx.click(); } }; lanes[v.lane].appendChild(v.el); viruses.push(v); spawn = now + Math.max(320, 900 - (60 - tl) * 9); }
    viruses.forEach(v => { if (v.dead) return; v.y += v.speed * dt; v.el.style.top = (v.y * 92) + '%'; if (v.y >= 1) { v.dead = true; v.el.remove(); hp--; sfx.err(); } });
    viruses = viruses.filter(v => !v.dead);
    body.querySelector('#hp').textContent = 'NOYAU ' + '■'.repeat(Math.max(0, hp)) + '□'.repeat(Math.max(0, 5 - hp));
    body.querySelector('#hp').style.color = hp <= 2 ? 'var(--red)' : 'var(--green)';
    body.querySelector('#fs').textContent = `${score} · ${Math.max(0, tl)} s`;
    if (hp <= 0 || tl <= 0) {
      over = true; viruses.forEach(v => v.el.remove());
      const win = hp > 0, xp = win ? 20 + Math.floor(score / 2) : Math.floor(score / 3);
      Wd.finishGame('firewall', score, xp); api.reward(null); win ? sfx.ok() : sfx.err();
      api.result(win, win ? '> PARE-FEU TENU' : '> NOYAU COMPROMIS', `${score} virus éliminés · +${xp} XP · record ${S.get('cyberdeck_b7', 'mg_best_firewall', 0)}`, again);
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame); api.onClose(() => cancelAnimationFrame(raf));
}

// ═══════════════════════ MÉMOIRE NEURALE
function memory(body, api, again) {
  const PADS = [['#6ff3ff', 523], ['#ff5a4e', 659], ['#f6b35c', 784], ['#b98cff', 988]];
  const seq = [rnd(4)]; let showing = true, pos = 0, over = false, timers = [];
  api.sub('NEURA // REPRODUIS LA SÉQUENCE');
  body.innerHTML = `<div class="mono" style="color:var(--info)" id="ms"></div><div class="mono dim small" id="ml"></div>
    <div class="pads">${PADS.map(([c], i) => `<button data-i="${i}" style="--c:${c}"></button>`).join('')}</div>`;
  const pads = [...body.querySelectorAll('.pads button')];
  const status = () => { body.querySelector('#ms').textContent = over ? 'Séquence ratée' : showing ? 'NEURA transmet…' : `À toi : ${pos}/${seq.length}`;
    body.querySelector('#ml').textContent = `Niveau ${seq.length} · record ${S.get('cyberdeck_b7', 'mg_best_memory', 0)}`; };
  const play = () => {
    showing = true; status(); let t = 600;
    seq.forEach(i => { timers.push(setTimeout(() => { pads[i].classList.add('lit'); tone(PADS[i][1], 0.35, 0.12, 'sine'); }, t)); t += 420; timers.push(setTimeout(() => pads[i].classList.remove('lit'), t)); t += 160; });
    timers.push(setTimeout(() => { showing = false; pos = 0; status(); }, t));
  };
  pads.forEach((p, i) => p.onclick = () => {
    if (showing || over) return;
    tone(PADS[i][1], 0.15, 0.12, 'sine'); p.classList.add('lit'); setTimeout(() => p.classList.remove('lit'), 150);
    if (seq[pos] === i) { pos++; status(); if (pos === seq.length) { seq.push(rnd(4)); setTimeout(play, 500); } }
    else { over = true; status(); const lvl = seq.length - 1; Wd.finishGame('memory', lvl, lvl * 3); api.reward(null); sfx.err();
      api.result(lvl > 3, '> LIAISON PERDUE', `Niveau atteint : ${lvl} · +${lvl * 3} XP`, again); }
  });
  api.onClose(() => timers.forEach(clearTimeout));
  play();
}

// ═══════════════════════ PIRATAGE DE TERMINAL
const WORDS = ['NEURAL', 'SIGNAL', 'CORTEX', 'BINARY', 'MATRIX', 'SECTOR', 'VECTOR', 'CIPHER', 'GLITCH', 'SERVER',
  'SOCKET', 'KERNEL', 'PACKET', 'BUFFER', 'MEMORY', 'DEVICE', 'SYSTEM', 'TOWERS', 'CHROME', 'STATIC'];
function term(body, api, again) {
  const words = shuffle(WORDS).slice(0, 10), secret = words[rnd(10)], tries = []; let res = null;
  const like = (w) => [...w].filter((ch, i) => ch === secret[i]).length;
  api.sub('PIRATAGE // TROUVE LE MOT DE PASSE · 4 ESSAIS');
  const render = () => {
    body.innerHTML = `<div class="mono" style="color:var(--info)">Essais restants : ${'▮'.repeat(4 - tries.length)}${'▯'.repeat(tries.length)}</div>
      <div class="words">${words.map(w => `<button class="${tries.some(t => t[0] === w) ? 'tried' : ''}">${w}</button>`).join('')}</div>
      <div class="log">${tries.map(([w, l]) => `<div class="mono small" style="color:${l === 6 ? 'var(--green)' : 'var(--dim)'}">> ${w} … similarité ${l}/6</div>`).join('')}</div>
      <p class="dim hint">Chaque essai indique combien de lettres sont à la bonne place.</p>`;
    body.querySelectorAll('.words button').forEach(b => b.onclick = () => {
      const w = b.textContent; if (res !== null || tries.some(t => t[0] === w)) return;
      tries.push([w, like(w)]); sfx.click();
      if (w === secret) { res = true; const xp = 25 + (4 - tries.length) * 5; Wd.finishGame('term', 5 - tries.length, xp); render(); sfx.ok(); api.reward(null); api.result(true, '> ACCÈS AUTORISÉ', `Mot de passe : ${secret} · +${xp} XP`, again); }
      else if (tries.length >= 4) { res = false; Wd.finishGame('term', 0, 5); render(); sfx.err(); api.reward(null); api.result(false, '> TERMINAL VERROUILLÉ', `Le mot de passe était ${secret}`, again); }
      else render();
    });
  };
  render();
}

// ═══════════════════════ TRI DE DONNÉES
function sort(body, api, again) {
  const TYPES = [['IMG', '▣', '#6ff3ff'], ['AUD', '♪', '#ff5a4e'], ['TXT', '≡', '#f6b35c']];
  let cur = rnd(3), score = 0, errors = 0, ended = false; const t0 = Date.now();
  api.sub('ROUTE CHAQUE PAQUET VERS SON PORT · 30 S');
  body.innerHTML = `<div class="stats"><span style="color:var(--info)" id="ss"></span><span id="sl"></span></div><div class="packet"></div>
    <div class="ports">${TYPES.map(([n, ic, c], i) => `<button data-i="${i}" style="--c:${c}"><b>${ic}</b><span>PORT ${n}</span><em>${i + 1}</em></button>`).join('')}</div>
    <p class="dim hint">Clavier : touches 1, 2, 3.</p>`;
  const pk = body.querySelector('.packet');
  const show = (flash) => { const [n, ic, c] = TYPES[cur]; pk.style.setProperty('--c', c); pk.className = 'packet' + (flash === true ? ' good' : flash === false ? ' bad' : ''); pk.innerHTML = `<b>${ic}</b><span>PAQUET .${n}</span>`;
    body.querySelector('#ss').textContent = `✓ ${score}  ✖ ${errors}`; };
  const route = (i) => { if (ended) return; const ok = i === cur; ok ? (score++, sfx.click()) : (errors++, sfx.err()); cur = rnd(3); show(ok); };
  body.querySelectorAll('.ports button').forEach(b => b.onclick = () => route(+b.dataset.i));
  const key = (e) => { if (['1', '2', '3'].includes(e.key)) route(+e.key - 1); };
  document.addEventListener('keydown', key);
  const tick = setInterval(() => {
    const l = 30 - Math.floor((Date.now() - t0) / 1000); const sl = body.querySelector('#sl'); sl.textContent = `${Math.max(0, l)} s`; sl.style.color = l <= 5 ? 'var(--red)' : 'var(--dim)';
    if (l <= 0 && !ended) { ended = true; clearInterval(tick); const xp = Math.floor(Math.max(0, score - errors) / 2); Wd.finishGame('sort', score, xp); api.reward(null);
      api.result(score > errors * 2, '> TRANSFERT TERMINÉ', `${score} paquets routés · ${errors} erreurs · +${xp} XP · record ${S.get('cyberdeck_b7', 'mg_best_sort', 0)}`, again); }
  }, 200);
  api.onClose(() => { clearInterval(tick); document.removeEventListener('keydown', key); });
  show(null);
}

// ═══════════════════════ INFILTRATION (cônes de caméras en temps réel)
function infil(body, api, again) {
  const W = 7, H = 9, lvl = Math.max(1, S.get('cyberdeck_b9', 'infil_level', 1));
  let walls;
  const reachable = (ws) => { const seen = new Set([(H - 1) * W]), q = [(H - 1) * W];
    while (q.length) { const c = q.shift(); if (c === W - 1) return true; const x = c % W, y = Math.floor(c / W);
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) { const o = ny * W + nx;
        if (nx >= 0 && ny >= 0 && nx < W && ny < H && !ws.has(o) && !seen.has(o)) { seen.add(o); q.push(o); } } }
    return false; };
  do { walls = new Set(); for (let k = 0; k < 12; k++) { const x = rnd(W), y = 1 + rnd(H - 2); if (!(x === 0 && y === H - 1)) walls.add(y * W + x); } } while (!reachable(walls));
  const isWall = (x, y) => x < 0 || y < 0 || x >= W || y >= H || walls.has(Math.floor(y) * W + Math.floor(x));
  const nCams = Math.min(6, Math.max(2, 1 + Math.floor(lvl / 2))), cams = [];
  const cand = shuffle([...Array(W * H).keys()].filter(i => !walls.has(i) && Math.floor(i / W) >= 1 && Math.floor(i / W) <= H - 2 && !((i % W) <= 1 && Math.floor(i / W) >= H - 2) && !((i % W) >= W - 2 && Math.floor(i / W) <= 1)));
  for (const cell of cand) {
    if (cams.length >= nCams) break;
    const x = cell % W, y = Math.floor(cell / W);
    if (cams.some(c => Math.abs(c.x - x) + Math.abs(c.y - y) < 3)) continue;
    const free = [...Array(36).keys()].map(k => { const a = k * Math.PI / 18; for (let d = 0.1; d < 1.2; d += 0.1) if (isWall(x + 0.5 + Math.cos(a) * d, y + 0.5 + Math.sin(a) * d)) return false; return true; });
    let bs = 0, bl = 0;
    for (let s0 = 0; s0 < 36; s0++) { if (!free[s0] || free[(s0 + 35) % 36]) continue; let l = 0; while (l < 36 && free[(s0 + l) % 36]) l++; if (l > bl) { bl = l; bs = s0; } }
    if (!bl && free.every(f => f)) { bs = 0; bl = 36; }
    if (bl < 4) continue;
    cams.push({ x, y, from: (bs + 2) * Math.PI / 18, to: Math.max(bs + 2, bs + bl - 3) * Math.PI / 18 });
  }
  const half = 24 * Math.PI / 180, range = 2.8, speed = 0.55 + lvl * 0.06, t0 = performance.now(), goal = W - 1;
  let pos = (H - 1) * W, steps = 0, state = 0, raf;
  const angle = (i, t) => { const c = cams[i]; const f = (Math.sin((t - t0) / 1000 * speed * (0.8 + i * 0.13) + i * 1.7) + 1) / 2; return c.from + (c.to - c.from) * f; };
  const ray = (ox, oy, a, max) => { for (let d = 0.05; d < max; d += 0.05) if (isWall(ox + Math.cos(a) * d, oy + Math.sin(a) * d)) return d; return max; };
  const seen = (cell, t) => cams.some((c, i) => {
    const cx = c.x + .5, cy = c.y + .5, px = cell % W + .5, py = Math.floor(cell / W) + .5, d = Math.hypot(px - cx, py - cy);
    if (d < .1 || d > range) return false;
    const a = Math.atan2(py - cy, px - cx); let diff = a - angle(i, t);
    while (diff > Math.PI) diff -= 2 * Math.PI; while (diff < -Math.PI) diff += 2 * Math.PI;
    return Math.abs(diff) <= half && ray(cx, cy, a, range) >= d - 0.05;
  });
  api.sub(`NIVEAU ${lvl} · ${cams.length} CAMÉRAS · RECORD ${S.get('cyberdeck_b9', 'infil_best', 0)}`);
  body.innerHTML = `<p class="dim hint">Clique une case voisine (ou flèches du clavier) pour avancer jusqu'au terminal ▣ sans entrer dans un cône.</p><canvas class="infil" width="420" height="540"></canvas><div id="ires"></div>`;
  const cv = body.querySelector('canvas'), g = cv.getContext('2d'), cs = 60, camCells = new Set(cams.map(c => c.y * W + c.x));
  const frame = (t) => {
    if (state === 0 && steps > 0 && seen(pos, t)) {
      state = 2; S.setI('cyberdeck_b9', 'infil_level', 1); S.persist(); sfx.err(); api.reward(null);
      api.result(false, '> REPÉRÉ', 'Retour au niveau 1', again);
    }
    g.fillStyle = '#04080c'; g.fillRect(0, 0, 420, 540);
    for (let i = 0; i < W * H; i++) { g.fillStyle = '#07121a'; g.fillRect((i % W) * cs + 1.5, Math.floor(i / W) * cs + 1.5, cs - 3, cs - 3); }
    cams.forEach((c, i) => {
      const ox = c.x + .5, oy = c.y + .5, a0 = angle(i, t);
      g.beginPath(); g.moveTo(ox * cs, oy * cs);
      for (let k = 0; k <= 14; k++) { const a = a0 - half + 2 * half * k / 14, l = ray(ox, oy, a, range); g.lineTo((ox + Math.cos(a) * l) * cs, (oy + Math.sin(a) * l) * cs); }
      g.closePath(); g.fillStyle = 'rgba(232,80,91,.3)'; g.fill(); g.strokeStyle = 'rgba(232,80,91,.7)'; g.lineWidth = 1; g.stroke();
    });
    walls.forEach(i => { g.fillStyle = '#1c2a35'; g.fillRect((i % W) * cs + 1, Math.floor(i / W) * cs + 1, cs - 2, cs - 2); });
    cams.forEach(c => { g.beginPath(); g.arc((c.x + .5) * cs, (c.y + .5) * cs, 10, 0, 6.28); g.fillStyle = '#e8505b'; g.fill(); });
    g.strokeStyle = '#f6b35c'; g.lineWidth = 3; g.strokeRect((goal % W + .25) * cs, .25 * cs, cs / 2, cs / 2);
    g.beginPath(); g.arc((pos % W + .5) * cs, (Math.floor(pos / W) + .5) * cs, 13, 0, 6.28); g.fillStyle = state === 2 ? '#e8505b' : '#7cf29a'; g.fill();
    if (state === 0) raf = requestAnimationFrame(frame);
  };
  const move = (x, y) => {
    if (state) return;
    const i = y * W + x;
    if (x < 0 || y < 0 || x >= W || y >= H || Math.abs(pos % W - x) + Math.abs(Math.floor(pos / W) - y) !== 1 || walls.has(i) || camCells.has(i)) return;
    pos = i; steps++; sfx.click();
    if (i === goal) {
      state = 1; S.setI('cyberdeck_b9', 'infil_level', lvl + 1); S.setI('cyberdeck_b9', 'infil_best', Math.max(S.get('cyberdeck_b9', 'infil_best', 0), lvl));
      S.addXp(40); S.addEddies(25); S.unlock('infiltrator'); sfx.ok(); api.reward(null);
      const box = el(`<div class="result ok"><div class="mono">> TERMINAL ATTEINT</div><b>+40 XP · +25 €$</b><button class="btn main">Niveau ${lvl + 1} ›</button></div>`);
      box.querySelector('button').onclick = again; body.querySelector('#ires').appendChild(box);
    }
  };
  cv.onclick = (e) => { const r = cv.getBoundingClientRect(), k = r.width / W; move(Math.floor((e.clientX - r.left) / k), Math.floor((e.clientY - r.top) / k)); };
  const key = (e) => { const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key]; if (d) { e.preventDefault(); move(pos % W + d[0], Math.floor(pos / W) + d[1]); } };
  document.addEventListener('keydown', key);
  raf = requestAnimationFrame(frame);
  api.onClose(() => { cancelAnimationFrame(raf); document.removeEventListener('keydown', key); });
}

const IMPL = { breach, decrypt, reflex, circuits, signal, firewall, memory, term, sort, infil };
