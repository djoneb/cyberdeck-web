import * as S from './save.js';

// ═══════════════════════ CIRCUITS : tourne les pistes pour alimenter tous les nœuds
export function circuits(root, toast, onEnd) {
  const n = 5;
  const N = 1, E = 2, Sd = 4, W = 8;
  const rot = (m) => ((m << 1) | (m >> 3)) & 15;
  // arbre couvrant depuis le centre
  const mask = new Array(n * n).fill(0), seen = new Array(n * n).fill(false);
  const st = [Math.floor(n / 2) * n + Math.floor(n / 2)]; seen[st[0]] = true;
  const dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0], bit = [N, E, Sd, W];
  while (st.length) {
    const cur = st[st.length - 1], cx = cur % n, cy = Math.floor(cur / n);
    const opts = [0, 1, 2, 3].filter(d => { const x = cx + dx[d], y = cy + dy[d]; return x >= 0 && y >= 0 && x < n && y < n && !seen[y * n + x]; });
    if (!opts.length) { st.pop(); continue; }
    const d = opts[Math.floor(Math.random() * opts.length)], nx = (cy + dy[d]) * n + cx + dx[d];
    mask[cur] |= bit[d]; mask[nx] |= bit[(d + 2) % 4]; seen[nx] = true; st.push(nx);
  }
  const cells = mask.map(m => { let r = m; for (let i = Math.floor(Math.random() * 4); i > 0; i--) r = rot(r); return r; });
  const src = Math.floor(n / 2) * n + Math.floor(n / 2);
  const start = Date.now();
  let done = false;
  const lit = () => {
    const on = new Set([src]), q = [src];
    while (q.length) {
      const c = q.shift(), x = c % n, y = Math.floor(c / n);
      for (let d = 0; d < 4; d++) {
        if (!(cells[c] & bit[d])) continue;
        const nx = x + dx[d], ny = y + dy[d]; if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
        const o = ny * n + nx; if (on.has(o) || !(cells[o] & bit[(d + 2) % 4])) continue;
        on.add(o); q.push(o);
      }
    }
    return on;
  };
  root.innerHTML = `<div class="label">CIRCUITS · relie la source à tous les nœuds</div><div class="center"><canvas width="500" height="500" style="width:min(500px,90vw);cursor:pointer"></canvas><p class="dim" id="cinfo"></p></div>`;
  const cv = root.querySelector('canvas'), g = cv.getContext('2d'), info = root.querySelector('#cinfo');
  const draw = () => {
    const on = lit(), cs = 500 / n;
    g.fillStyle = '#05090d'; g.fillRect(0, 0, 500, 500);
    cells.forEach((m, i) => {
      const x = (i % n) * cs, y = Math.floor(i / n) * cs, cx = x + cs / 2, cy = y + cs / 2;
      g.strokeStyle = 'rgba(255,255,255,.06)'; g.strokeRect(x + 2, y + 2, cs - 4, cs - 4);
      g.strokeStyle = on.has(i) ? '#00d8f0' : '#2c4050'; g.lineWidth = 10; g.lineCap = 'round';
      for (let d = 0; d < 4; d++) if (m & bit[d]) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + dx[d] * cs / 2, cy + dy[d] * cs / 2); g.stroke(); }
      g.beginPath(); g.arc(cx, cy, i === src ? 16 : 8, 0, 6.28); g.fillStyle = i === src ? '#f6b35c' : (on.has(i) ? '#00d8f0' : '#2c4050'); g.fill();
    });
    info.textContent = `${on.size}/${n * n} nœuds alimentés`;
    if (on.size === n * n && !done) {
      done = true;
      const sec = Math.round((Date.now() - start) / 1000), xp = 25 + (sec <= 30 ? 12 : 0);
      S.addXp(xp); S.setI('cyberdeck_b7', 'circ_solved', S.get('cyberdeck_b7', 'circ_solved', 0) + 1); S.persist();
      info.innerHTML = `<b style="color:#7cf29a">CIRCUIT RÉPARÉ en ${sec} s · +${xp} XP</b>`;
      toast(`+${xp} XP`); onEnd();
    }
  };
  cv.onclick = (e) => {
    if (done) return;
    const r = cv.getBoundingClientRect(), cs = r.width / n;
    const i = Math.floor((e.clientY - r.top) / cs) * n + Math.floor((e.clientX - r.left) / cs);
    if (i !== src) { cells[i] = rot(cells[i]); draw(); }
  };
  draw();
}

// ═══════════════════════ INFILTRATION : cônes de caméras en temps réel
export function infiltration(root, toast, onEnd) {
  const W = 7, H = 9, lvl = Math.max(1, S.get('cyberdeck_b9', 'infil_level', 1));
  // Murs aléatoires, en garantissant un chemin du départ au terminal.
  let walls;
  const reachable = (ws) => { const seen = new Set([(H - 1) * W]), q = [(H - 1) * W];
    while (q.length) { const c = q.shift(); if (c === W - 1) return true; const x = c % W, y = Math.floor(c / W);
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) { const o = ny * W + nx;
        if (nx >= 0 && ny >= 0 && nx < W && ny < H && !ws.has(o) && !seen.has(o)) { seen.add(o); q.push(o); } } }
    return false; };
  do {
    walls = new Set();
    for (let k = 0; k < 12; k++) { const x = Math.floor(Math.random() * W), y = 1 + Math.floor(Math.random() * (H - 2)); if (!(x === 0 && y === H - 1)) walls.add(y * W + x); }
  } while (!reachable(walls));
  const isWall = (x, y) => x < 0 || y < 0 || x >= W || y >= H || walls.has(Math.floor(y) * W + Math.floor(x));
  const nCams = Math.min(6, Math.max(2, 1 + Math.floor(lvl / 2)));
  const cams = [];
  const cand = [...Array(W * H).keys()].filter(i => !walls.has(i) && Math.floor(i / W) >= 1 && Math.floor(i / W) <= H - 2 && !((i % W) <= 1 && Math.floor(i / W) >= H - 2) && !((i % W) >= W - 2 && Math.floor(i / W) <= 1)).sort(() => Math.random() - 0.5);
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
  const half = 24 * Math.PI / 180, range = 2.8, speed = 0.55 + lvl * 0.06, t0 = performance.now();
  let pos = (H - 1) * W, steps = 0, state = 0;
  const goal = W - 1;
  const angle = (i, t) => { const c = cams[i]; const f = (Math.sin((t - t0) / 1000 * speed * (0.8 + i * 0.13) + i * 1.7) + 1) / 2; return c.from + (c.to - c.from) * f; };
  const ray = (ox, oy, a, max) => { for (let d = 0.05; d < max; d += 0.05) if (isWall(ox + Math.cos(a) * d, oy + Math.sin(a) * d)) return d; return max; };
  const seen = (cell, t) => cams.some((c, i) => {
    const cx = c.x + .5, cy = c.y + .5, px = cell % W + .5, py = Math.floor(cell / W) + .5, d = Math.hypot(px - cx, py - cy);
    if (d < .1 || d > range) return false;
    const a = Math.atan2(py - cy, px - cx); let diff = a - angle(i, t);
    while (diff > Math.PI) diff -= 2 * Math.PI; while (diff < -Math.PI) diff += 2 * Math.PI;
    return Math.abs(diff) <= half && ray(cx, cy, a, range) >= d - 0.05;
  });
  root.innerHTML = `<div class="label">INFILTRATION · NIVEAU ${lvl} · ${cams.length} CAMÉRAS</div><div class="center"><canvas width="420" height="540" style="width:min(420px,90vw);cursor:pointer"></canvas><p class="dim" id="iinfo">Clique une case voisine pour avancer jusqu'au terminal ▣.</p></div>`;
  const cv = root.querySelector('canvas'), g = cv.getContext('2d'), info = root.querySelector('#iinfo'), cs = 60;
  const camCells = new Set(cams.map(c => c.y * W + c.x));
  let raf;
  const frame = (t) => {
    if (state === 0 && steps > 0 && seen(pos, t)) {
      state = 2; S.setI('cyberdeck_b9', 'infil_level', 1); S.persist();
      info.innerHTML = '<b style="color:#ff3b4e">REPÉRÉ · retour au niveau 1</b>'; onEnd();
    }
    g.fillStyle = '#04080c'; g.fillRect(0, 0, 420, 540);
    for (let i = 0; i < W * H; i++) { g.fillStyle = '#07121a'; g.fillRect((i % W) * cs + 1.5, Math.floor(i / W) * cs + 1.5, cs - 3, cs - 3); }
    cams.forEach((c, i) => {
      const ox = c.x + .5, oy = c.y + .5, a0 = angle(i, t);
      g.beginPath(); g.moveTo(ox * cs, oy * cs);
      for (let k = 0; k <= 14; k++) { const a = a0 - half + 2 * half * k / 14, l = ray(ox, oy, a, range); g.lineTo((ox + Math.cos(a) * l) * cs, (oy + Math.sin(a) * l) * cs); }
      g.closePath(); g.fillStyle = 'rgba(255,59,78,.3)'; g.fill(); g.strokeStyle = 'rgba(255,59,78,.7)'; g.stroke();
    });
    walls.forEach(i => { g.fillStyle = '#1c2a35'; g.fillRect((i % W) * cs + 1, Math.floor(i / W) * cs + 1, cs - 2, cs - 2); });
    cams.forEach(c => { g.beginPath(); g.arc((c.x + .5) * cs, (c.y + .5) * cs, 10, 0, 6.28); g.fillStyle = '#ff3b4e'; g.fill(); });
    g.strokeStyle = '#f6b35c'; g.lineWidth = 3; g.strokeRect((goal % W + .25) * cs, .25 * cs, cs / 2, cs / 2); g.lineWidth = 1;
    g.beginPath(); g.arc((pos % W + .5) * cs, (Math.floor(pos / W) + .5) * cs, 13, 0, 6.28); g.fillStyle = state === 2 ? '#ff3b4e' : '#7cf29a'; g.fill();
    if (state === 0) raf = requestAnimationFrame(frame);
  };
  cv.onclick = (e) => {
    if (state) return;
    const r = cv.getBoundingClientRect(), k = r.width / W;
    const x = Math.floor((e.clientX - r.left) / k), y = Math.floor((e.clientY - r.top) / k), i = y * W + x;
    if (Math.abs(pos % W - x) + Math.abs(Math.floor(pos / W) - y) !== 1 || walls.has(i) || camCells.has(i)) return;
    pos = i; steps++;
    if (i === goal) {
      state = 1; S.setI('cyberdeck_b9', 'infil_level', lvl + 1); S.setI('cyberdeck_b9', 'infil_best', S.get('cyberdeck_b9', 'infil_best', 0) + 1);
      S.addXp(40); S.addEddies(25); S.unlock('infiltrator');
      info.innerHTML = '<b style="color:#7cf29a">TERMINAL ATTEINT · +40 XP · +25 €$</b>'; toast('+40 XP · +25 €$'); onEnd();
    }
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
