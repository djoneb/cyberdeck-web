// La Ville : carte holographique isométrique, lieux, rencontres et expéditions (comme dans le launcher).
import * as S from './save.js';
import * as Wd from './world.js';
import { RInt, hashCode } from './krand.js';
import { portraitCanvas } from './portrait.js';
import { DOSSIERS } from './gamedata.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/\n/g, '<br>');
const C = { red: '#e8505b', cyan: '#6ff3f0', amber: '#f6b35c', green: '#7cf29a', dim: '#7f9aa2', primary: '#ff3b4e' };
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

const LANDMARKS = { bar: [0.045, 0.05, 'sign'], roofs: [0.05, 0.34, 'antenna'], market: [0.07, 0.02, 'stalls'], laundry: [0.04, 0.05, 'sign'],
  lab: [0.07, 0.03, 'cross'], club: [0.055, 0.08, 'beams'], arcade: [0.045, 0.06, 'sign'], port: [0.06, 0.02, 'crane'], bunker: [0.05, 0.02, 'hazard'] };
const NEONS = ['#ff2e9a', '#39e6ff', '#b98cff', '#ffb13b', '#7cf29a'];
let TOWERS = null;
function towers() {
  if (TOWERS) return TOWERS;
  const r = RInt(2089), n = 12, out = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i % 3 === 0 || j % 3 === 0) continue;
    const u = (i + 0.5) / n, v = (j + 0.5) / n;
    if (Wd.SPOTS.some(s => Math.abs(s.x - u) < 0.075 && Math.abs(s.y - v) < 0.075)) continue;
    if (r.nextIntUntil(100) < 12) continue;
    const tall = r.nextIntUntil(100) < 22;
    const s = 0.028 + r.nextFloat() * 0.01, h = tall ? 0.18 + r.nextFloat() * 0.22 : 0.03 + r.nextFloat() * 0.09;
    out.push({ u, v, s, h, neon: NEONS[r.nextIntUntil(5)], seed: r.nextInt(), spot: null });
  }
  return (TOWERS = out);
}

export function city(view, ctx, tab = 'map') {
  let raf = null, tick = null;
  const stop = () => { cancelAnimationFrame(raf); clearInterval(tick); };
  ctx.onLeave(stop);

  function render() {
    stop();
    const running = Wd.active().length;
    view.innerHTML = `<div class="citypage"><div class="cityhead"><div><div class="mono dim small">NEO-BXL // SORTIR</div><h1 class="glitch" style="color:var(--primary)">LA VILLE</h1></div>
      <span class="mono" style="color:var(--amber)">${S.eddies()} €$</span></div>
      <div class="tabs"><button class="${tab === 'map' ? 'on' : ''}" data-t="map">⌂ CARTE</button><button class="${tab === 'exp' ? 'on' : ''}" data-t="exp">⌖ EXPÉDITIONS${running ? ' · ' + running : ''}</button></div>
      <div id="cbody"></div></div>`;
    view.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { tab = b.dataset.t; render(); });
    const body = view.querySelector('#cbody');
    if (tab === 'exp') expeditions(body); else map(body);
  }

  // ─────────────── Carte
  function map(body) {
    body.innerHTML = `<p class="dim small">Choisis un lieu. On y croise des contacts, des inconnus… et des runners avec des contrats.</p>
      <div class="map"><canvas></canvas><div class="maplabels"></div>
      ${(() => { const ph = Wd.phase(), we = Wd.weather(), pb = Wd.phaseBonus(ph), wb = Wd.WEATHER_BONUS[we];
        return `<span class="mono tiny maptag skytag" style="left:8px"><span style="color:${['#ffb07a', C.amber, '#ff7a5a', '#b98cff'][ph]}">${['◒', '☀', '◓', '☾'][ph]} ${Wd.PHASES[ph]}${pb ? ' · +' + pb + ' %' : ''}</span>
          <span style="color:${[C.amber, '#7cf2c8', '#bfd8ff', '#f2c27b', '#5cffb0'][we]}">${Wd.WEATHER_ICONS[we]} ${Wd.WEATHERS[we]}${wb ? ' · +' + wb + ' %' : ''} · jusqu'à ${String(Wd.weatherEnd()).padStart(2, '0')} h</span>${we ? `<span style="color:${C.dim}">${Wd.WEATHER_FX[we]}</span>` : ''}</span>`; })()}
      <span class="mono tiny maptag" style="right:8px;color:${C.amber}">● contact sur place</span></div>
      <div id="expreminder"></div><div class="reps"></div><p class="dim small" id="reptxt"></p><div class="mono dim small" style="margin:14px 0 6px">ZONES DE NEO-BXL</div><div class="mono dim small zhint"></div><div class="zones"></div>
      <div class="mono dim small" style="margin:16px 0 6px">LIEUX · ${Wd.visits()} VISITE(S)</div><div class="places"></div>`;
    const wrap = body.querySelector('.map'), cv = wrap.querySelector('canvas'), g = cv.getContext('2d'), labels = wrap.querySelector('.maplabels');
    const bunker = Wd.bunkerUnlocked(), spots = Wd.SPOTS.filter(s => s.placeId !== 'bunker' || bunker);
    // Projection isométrique ; en paysage (écran d'ordinateur) la ville est centrée dans un cadre plus large que haut.
    let W = 0, H = 0, A = 0, SW = 0, OY = 0;
    const proj = (_W, _H, u, v, z = 0) => [W / 2 + (u - v) * A, OY + (u + v) * A * 0.55 - z * SW];
    const layout = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = wrap.clientWidth; const land = W > 720; H = land ? Math.min(W * 0.46, window.innerHeight * 0.62) : W / 0.95; wrap.style.height = H + 'px';
      A = land ? Math.min(W * 0.42, H * 0.58) : W * 0.46; SW = A / 0.46; OY = land ? H * 0.97 - 1.1 * A : H * 0.30;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; g.setTransform(dpr, 0, 0, dpr, 0, 0);
      labels.innerHTML = '';
      spots.forEach(sp => {
        const pl = Wd.place(sp.placeId), lm = LANDMARKS[sp.placeId] || [0.05, 0.05, 'sign'];
        const base = proj(W, H, sp.x, sp.y + lm[0]), topY = proj(W, H, sp.x, sp.y, lm[1])[1];
        const open = Wd.isOpen(sp), left = Wd.cooldownLeft(sp.placeId);
        const hit = document.createElement('button'); hit.className = 'maphit'; hit.title = pl.name;
        Object.assign(hit.style, { left: (base[0] - 26) + 'px', top: (topY - 10) + 'px', height: Math.max(30, base[1] - topY + 16) + 'px' });
        const lab = document.createElement('button'); lab.className = 'maplabel';
        Object.assign(lab.style, { left: (base[0] - 50) + 'px', top: (base[1] + 2) + 'px' });
        lab.innerHTML = `<b style="color:${open ? '#e8f4f8' : C.dim}">${esc(pl.name)}</b><span class="mono" style="color:${!open ? C.red : left > 0 ? C.dim : pl.color}">${!open ? 'FERMÉ' : left > 0 ? '↻ ' + Wd.fmtLeft(left) : Wd.hoursLabel(sp)}</span>`;
        hit.onclick = lab.onclick = () => go(sp.placeId);
        labels.append(hit, lab);
      });
    };
    layout();
    const ro = new ResizeObserver(() => { if (Math.abs(wrap.clientWidth - W) > 2) layout(); }); ro.observe(wrap); ctx.onLeave(() => ro.disconnect());
    const items = [...towers(), ...spots.map(sp => { const lm = LANDMARKS[sp.placeId] || [0.05, 0.05, 'sign']; return { u: sp.x, v: sp.y, s: lm[0], h: lm[1], neon: Wd.place(sp.placeId).color, seed: hashCode(sp.placeId), spot: sp.placeId }; })]
      .sort((a, b) => (a.u + a.v) - (b.u + b.v));
    const frame = (ms) => {
      const t = ms / 1000, phase = Wd.phase(), weather = Wd.weather(), night = phase === 3, now = Date.now(), clear = weather === 0;
      const P = (u, v, z = 0) => proj(W, H, u, v, z);
      const quad = (pts, fill, stroke, lw = 1) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } };
      const line = (a, b, col, lw, dash) => { g.strokeStyle = col; g.lineWidth = lw; if (dash) { g.setLineDash(dash[0]); g.lineDashOffset = dash[1]; } g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]); };
      const circle = (p, r, col, stroke) => { g.beginPath(); g.arc(p[0], p[1], r, 0, 7); if (stroke) { g.strokeStyle = col; g.lineWidth = stroke; g.stroke(); } else { g.fillStyle = col; g.fill(); } };
      // ciel : cycle du soleil (lever, après-midi, soirée, nuit), assombri ou ensablé selon la météo
      const mix = (hex, to, k) => { const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16), c = (sh) => Math.round(((a >> sh) & 255) * (1 - k) + ((b >> sh) & 255) * k); return `rgb(${c(16)},${c(8)},${c(0)})`; };
      const tint = (hex) => weather === 1 ? mix(hex, '#1c2630', 0.4) : weather === 2 ? mix(hex, '#1c2630', 0.6) : weather === 3 ? mix(hex, '#b7792f', 0.45) : weather === 4 ? mix(hex, '#1a0b3a', 0.45) : hex;
      const cols = [['#f29e6b', '#6a4c93', '#0e1e33'], ['#3e86c4', '#123050', '#07131c'], ['#ff6b3d', '#7a2c5e', '#140a26'], ['#0a0418', '#03090e']][phase].map(tint);
      const sky = g.createLinearGradient(0, 0, 0, H); cols.forEach((c, k) => sky.addColorStop(k / (cols.length - 1), c));
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      if (phase === 3) {
        const gl = g.createLinearGradient(0, 0, 0, H * 0.35); gl.addColorStop(0, 'rgba(42,11,58,.6)'); gl.addColorStop(1, 'rgba(42,11,58,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H * 0.35);
        if (clear) { for (let k = 0; k < 30; k++) { const rr = RInt(k * 7); const a = 0.2 + rr.nextFloat() * 0.3; circle([rr.nextFloat() * W, rr.nextFloat() * H * 0.25], 1.2, `rgba(255,255,255,${a})`); }
          circle([W * 0.18, H * 0.08], SW * 0.03, 'rgba(232,240,255,.8)'); }
      } else if (phase !== 1) {
        const sx = phase === 0 ? W * 0.16 : W * 0.84, sy = phase === 0 ? H * 0.17 : H * 0.19, sc = phase === 0 ? '#ffc27a' : '#ff5a36';
        const sun = g.createRadialGradient(sx, sy, 0, sx, sy, SW * 0.24); sun.addColorStop(0, rgba(sc, clear ? 0.85 : 0.35)); sun.addColorStop(1, rgba(sc, 0));
        g.fillStyle = sun; g.fillRect(sx - SW * 0.24, sy - SW * 0.24, SW * 0.48, SW * 0.48);
        if (clear) circle([sx, sy], SW * 0.04, sc);
        for (let k = 0; k < 4; k++) { const rr = RInt(k * 29); const cy = H * (0.05 + rr.nextFloat() * 0.14), cx = ((rr.nextFloat() + t * 0.003) % 1) * W;
          g.fillStyle = rgba(phase === 0 ? '#ffb0c8' : '#ff8a5c', 0.22); g.beginPath(); g.ellipse(cx, cy + H * 0.009, W * 0.1, H * 0.009, 0, 0, 7); g.fill(); }
      } else {
        const gl = g.createLinearGradient(0, 0, 0, H * 0.4); gl.addColorStop(0, 'rgba(143,211,255,.55)'); gl.addColorStop(1, 'rgba(143,211,255,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H * 0.4);
        const sun = g.createRadialGradient(W * 0.82, H * 0.08, 0, W * 0.82, H * 0.08, W * 0.14); sun.addColorStop(0, `rgba(255,244,192,${clear ? 0.7 : 0.3})`); sun.addColorStop(1, 'rgba(255,244,192,0)');
        g.fillStyle = sun; g.fillRect(W * 0.6, 0, W * 0.4, H * 0.3);
        for (let k = 0; k < 5; k++) { const rr = RInt(k * 13); const cx = ((rr.nextFloat() + t * 0.004 * (1 + k % 2)) % 1) * W, cy = H * (0.04 + rr.nextFloat() * 0.16);
          g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(cx, cy, W * 0.08, H * 0.012, 0, 0, 7); g.fill(); }
      }
      quad([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], ((c) => weather === 3 ? mix(c, '#5a3a1a', 0.35) : c)(['#1a2438', '#15324a', '#1c1430', '#07131c'][phase]));
      Wd.DISTRICTS.forEach(d => {
        const pts = spots.filter(s => s.district === d.id); if (!pts.length) return;
        const c = P(pts.reduce((a, s) => a + s.x, 0) / pts.length, pts.reduce((a, s) => a + s.y, 0) / pts.length);
        g.save(); g.translate(c[0], c[1]); g.scale(1, 0.54);
        const rg = g.createRadialGradient(0, 0, 0, 0, 0, SW * 0.26); rg.addColorStop(0, rgba(d.color, 0.2)); rg.addColorStop(1, rgba(d.color, 0));
        g.fillStyle = rg; g.beginPath(); g.arc(0, 0, SW * 0.26, 0, 7); g.fill(); g.restore();
      });
      quad([P(0, 0.30), P(0.06, 0.30), P(0.06, 1), P(0, 1)], '#0b2a55'); line(P(0.06, 0.30), P(0.06, 1), 'rgba(61,123,255,.5)', 1.5);
      const n = 12;
      for (let i = 0; i <= n; i += 3) {
        const u = i / n + 0.5 / n; if (u > 1) continue;
        quad([P(u - 0.025, 0), P(u + 0.025, 0), P(u + 0.025, 1), P(u - 0.025, 1)], '#111e28');
        quad([P(0, u - 0.025), P(1, u - 0.025), P(1, u + 0.025), P(0, u + 0.025)], '#111e28');
        line(P(u, 0), P(u, 1), 'rgba(255,59,78,.18)', 1, [[8, 10], t * 25]); line(P(0, u), P(1, u), 'rgba(255,59,78,.18)', 1, [[8, 10], t * 25]);
      }
      for (let k = 0; k < 14; k++) {
        const lane = (k % 5) * 3 / n + 0.5 / n, p = (t * (0.04 + (k % 4) * 0.012) + k * 0.17) % 1;
        circle(k % 2 === 0 ? P(lane - 0.008, p) : P(1 - p, lane + 0.008), 2.2, k % 3 === 0 ? '#ff3b3b' : '#fff2c0');
      }
      const home = P(0.5, 0.97); circle(home, 5, C.green); circle(home, 5 + (t * 12) % 14, 'rgba(124,242,154,.4)', 2);
      for (const b of items) {
        const s = b.s, z = b.h, sp = b.spot ? Wd.spot(b.spot) : null, open = sp ? Wd.isOpen(sp) : true, glow = b.spot && !open ? C.dim : b.neon;
        const fl = P(b.u - s, b.v + s), fr = P(b.u + s, b.v + s), br = P(b.u + s, b.v - s);
        quad([fl, fr, P(b.u + s, b.v + s, z), P(b.u - s, b.v + s, z)], '#0e1c27');
        quad([fr, br, P(b.u + s, b.v - s, z), P(b.u + s, b.v + s, z)], '#15283a');
        quad([P(b.u - s, b.v - s, z), P(b.u + s, b.v - s, z), P(b.u + s, b.v + s, z), P(b.u - s, b.v + s, z)], '#1b3346', rgba(glow, b.spot ? 0.9 : 0.25), b.spot ? 2 : 1);
        const rows = Math.max(1, Math.min(14, Math.floor(z * SW / 9))), wr = RInt(b.seed);
        for (let row = 0; row < rows; row++) for (let col = 0; col < 3; col++) {
          if (wr.nextIntUntil(100) < 35) continue;
          const f = (col + 0.5) / 3, zz = z * (row + 0.6) / (rows + 0.4), o = P(b.u - s + 2 * s * f, b.v + s, zz);
          const on = Math.sin(t * 0.7 + wr.nextFloat() * 50) > -0.6, warm = wr.nextBoolean();
          if (on) line(o, [o[0] + 3, o[1] + 1.5], rgba(warm ? b.neon : '#ffe6a8', 0.55), 2);
        }
        const top = P(b.u, b.v, z), pulse = 0.5 + 0.5 * Math.sin(t * 3 + b.u * 10);
        const style = b.spot ? (LANDMARKS[b.spot] || [])[2] : null;
        if (style === 'antenna') { const tip = [top[0], top[1] - SW * 0.08]; line(top, tip, '#8899aa', 2); circle(tip, 3.5, rgba(C.red, Math.floor(t * 2) % 2 === 0 ? 1 : 0.2)); }
        else if (style === 'beams') for (let k = 0; k < 3; k++) { const ang = Math.sin(t * 1.3 + k * 2) * 0.6; line(top, [top[0] + ang * SW * 0.25, top[1] - SW * 0.35], rgba(glow, 0.25), 6); }
        else if (style === 'stalls') ['#ff4fa3', '#f6b35c', '#39e6ff', '#7cf29a'].forEach((c, k) => { const o = P(b.u - s * 0.6 + k * s * 0.4, b.v + s * 0.2, z + 0.012); g.fillStyle = rgba(c, 0.8); g.fillRect(o[0] - 5, o[1] - 3, 10, 5); });
        else if (style === 'crane') { const bc = P(b.u + s * 0.5, b.v - s * 0.5, z), tc = [bc[0], bc[1] - SW * 0.12]; line(bc, tc, C.amber, 2.5); line(tc, [tc[0] - SW * 0.09, tc[1] + 4], C.amber, 2.5); line([tc[0] - SW * 0.07, tc[1] + 3], [tc[0] - SW * 0.07, tc[1] + SW * 0.05], rgba(C.amber, 0.6), 1); }
        else if (style === 'cross') { g.fillStyle = C.red; g.fillRect(top[0] - 2, top[1] - 12, 4, 14); g.fillRect(top[0] - 7, top[1] - 7, 14, 4); }
        else if (style === 'hazard') circle([top[0], top[1] - 6], 6, rgba(C.red, 0.4 + 0.5 * pulse));
        else if (style === 'sign') { g.fillStyle = rgba(glow, 0.6 + 0.4 * pulse); g.fillRect(top[0] - 12, top[1] - 12, 24, 7); }
        if (b.spot) { circle(P(b.u, b.v + s + 0.01), 16, rgba(glow, 0.15 + 0.2 * pulse)); Wd.present(b.spot).forEach((_, k) => circle([top[0] + 14 + k * 9, top[1] - 20], 4, C.amber)); }
        else if (b.h > 0.2) line(P(b.u - s, b.v + s, z), P(b.u + s, b.v + s, z), rgba(b.neon, 0.7), 2);
      }
      // météo par-dessus la ville
      if (weather === 1 || weather === 2) {
        const heavy = weather === 2;
        g.fillStyle = `rgba(10,20,32,${heavy ? 0.28 : 0.15})`; g.fillRect(0, 0, W, H);
        g.lineWidth = 1.2;
        for (let k = 0; k < (heavy ? 140 : 80); k++) {
          const rr = RInt(k * 61), sp = 0.6 + rr.nextFloat() * 0.8, y = ((rr.nextFloat() + t * sp * (heavy ? 0.9 : 0.6)) % 1) * (H + 60) - 30, x = rr.nextFloat() * W + y * (heavy ? 0.25 : 0.1);
          g.strokeStyle = rgba(heavy ? '#bfd8ff' : '#7cf2c8', 0.25 + rr.nextFloat() * 0.25); g.beginPath(); g.moveTo(x, y); g.lineTo(x - (heavy ? 7 : 3), y - 18 * sp); g.stroke();
        }
        if (heavy) { const cyc = t % 7; if (cyc < 0.25) {
          g.fillStyle = `rgba(255,255,255,${(0.25 - cyc) * 1.6})`; g.fillRect(0, 0, W, H);
          const rr = RInt(Math.floor(t / 7)); let p0 = [W * (0.2 + rr.nextFloat() * 0.6), 0];
          for (let k = 0; k < 6; k++) { const p1 = [p0[0] + (rr.nextFloat() - 0.5) * W * 0.12, p0[1] + H * 0.07]; line(p0, p1, '#eaf4ff', 2.5); p0 = p1; } } }
      } else if (weather === 4) {
        // aurores magnétiques ondulantes et arcs électriques
        for (let b = 0; b < 4; b++) {
          const base = H * (0.06 + b * 0.06); g.strokeStyle = rgba(b % 2 ? '#b98cff' : '#5cffb0', 0.35); g.lineWidth = H * 0.03; g.beginPath();
          for (let x = 0; x <= W; x += W / 40) { const y = base + Math.sin(x / W * 6 + t * (0.6 + b * 0.2) + b) * H * 0.03; x ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.stroke();
        }
        if (t % 3 < 0.15) { const rr = RInt(Math.floor(t / 3) + 99); let p0 = [rr.nextFloat() * W, H * 0.3 + rr.nextFloat() * H * 0.4];
          for (let k = 0; k < 5; k++) { const p1 = [p0[0] + (rr.nextFloat() - 0.5) * W * 0.1, p0[1] + (rr.nextFloat() - 0.5) * H * 0.08]; line(p0, p1, '#b98cff', 2); p0 = p1; } }
      } else if (weather === 3) {
        const sd = g.createLinearGradient(0, 0, 0, H); sd.addColorStop(0, 'rgba(201,138,60,.35)'); sd.addColorStop(1, 'rgba(138,90,43,.25)'); g.fillStyle = sd; g.fillRect(0, 0, W, H);
        g.lineWidth = 1.4;
        for (let k = 0; k < 120; k++) {
          const rr = RInt(k * 43), sp = 0.5 + rr.nextFloat(), x = ((rr.nextFloat() + t * sp * 0.35) % 1) * (W + 40) - 20, y = rr.nextFloat() * H + Math.sin(t * 2 + k) * 6;
          g.strokeStyle = rgba('#f2c27b', 0.25 + rr.nextFloat() * 0.3); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10 * sp, y + 1); g.stroke();
        }
      }
      const a = Wd.active()[0];
      if (a) {
        const tg = Wd.targetSpot(a, spots), to = P(tg.x, tg.y);
        line(home, to, 'rgba(111,243,240,.7)', 3, [[14, 10], t * 30]);
        const pr = Wd.progress(a, now), pos = [home[0] + (to[0] - home[0]) * pr, home[1] + (to[1] - home[1]) * pr];
        circle(pos, 14, 'rgba(111,243,240,.3)'); circle(pos, 7, C.cyan);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    // rappel de l'expédition, réputation, liste des lieux
    const a = Wd.active()[0];
    if (a) {
      const r = body.querySelector('#expreminder'); r.className = 'reminder';
      const upd = () => { const done = Date.now() >= a.end; r.innerHTML = `<b>⌖ ${esc(a.exp.title)}</b><span class="mono" style="color:${done ? C.green : C.cyan}">${done ? 'À ENCAISSER ›' : Wd.fmtLeft(a.end - Date.now()) + ' ›'}</span>`; };
      upd(); tick = setInterval(upd, 1000); r.onclick = () => { tab = 'exp'; render(); };
    }
    body.querySelector('.reps').innerHTML = Wd.DISTRICTS.map(d => { const r = Wd.rep(d.id), tr = Wd.tier(r), next = [10, 25, 50, 50][tr];
      return `<button class="repd" data-d="${d.id}" style="--c:${d.color}"><span class="mono tiny" style="color:${d.color}">${esc(d.name.toUpperCase())}</span><b>${Wd.TIER_NAMES[tr]}</b><i><u style="width:${Math.min(100, r / next * 100)}%"></u></i><span class="mono tiny" style="color:${d.color}">ⓘ ${Math.min(100, r * 2)} %</span></button>`; }).join('');
    body.querySelectorAll('.repd').forEach(b => b.onclick = () => districtPage(b.dataset.d));
    const openZ = Wd.ZONES.filter(z => !Wd.zoneLock(z.id)), hiddenZ = Wd.ZONES.length - openZ.length;
    body.querySelector('.zhint').textContent = !hiddenZ ? '' : openZ.length ? `▒▒▒ ${hiddenZ} zone(s) encore inconnue(s)…` : '▒▒▒ Des zones inconnues existent au-delà des quartiers. Ta réputation les révélera…';
    body.querySelector('.zones').innerHTML = openZ.map(z => { const lk = Wd.zoneLock(z.id), pct = lk ? Wd.zoneUnlockPercent(z.id) : Math.min(100, Wd.rep(z.id) * 2);
      return `<button class="zcard ${lk ? 'locked' : ''}" data-z="${z.id}" style="--c:${z.color}"><b>${lk ? '🔒' : '◆'} ${esc(z.name.toUpperCase())}</b>
        <span class="mono tiny dim">${lk ? 'Accès' : 'Réputation'} ${pct} %</span><i><u style="width:${pct}%"></u></i></button>`; }).join('');
    body.querySelectorAll('.zcard').forEach(b => b.onclick = () => districtPage(b.dataset.z));
    body.querySelector('#reptxt').textContent = Wd.bunkerUnlocked() ? '☢ Le Bunker Zéro t\'est ouvert : récompenses +50 %.' : `Réputation totale ${Wd.totalRep()}/40 : un lieu secret attend les légendes…`;
    body.querySelector('.places').innerHTML = Wd.PLACES.filter(p => p.id !== 'bunker' || bunker).map(pl => {
      const sp = Wd.spot(pl.id), open = !sp || Wd.isOpen(sp), left = Wd.cooldownLeft(pl.id);
      return `<div class="pwrapc"><button class="place ${left > 0 || !open ? 'cool' : ''}" data-p="${pl.id}" style="--c:${pl.color}"><span class="pic">${pl.icon}</span><b>${esc(pl.name)}</b><span class="dim tiny">${esc(pl.desc)}</span>
        <em class="mono tiny" style="color:${!open ? C.red : left > 0 ? C.dim : pl.color}">${!open ? 'FERMÉ · ' + Wd.hoursLabel(sp) : left > 0 ? '↻ ' + Wd.fmtLeft(left) : 'ENTRER ›'}</em></button><button class="pinfo mono tiny" data-file="${pl.id}" style="--c:${pl.color}">ⓘ INFORMATIONS<span>${filePct(pl.id)} %</span></button></div>`;
    }).join('');
    body.querySelectorAll('.place').forEach(b => b.onclick = () => go(b.dataset.p));
    body.querySelectorAll('.pinfo').forEach(b => b.onclick = () => placeFile(b.dataset.file));
  }

  // Fiche d'un lieu (wiki) : se complète avec tes passages et la réputation du quartier (mêmes règles que l'appli)
  function fileLines(id) {
    const d = DOSSIERS.lieux?.[id]; if (!d) return [];
    const L = DOSSIERS.lieuxNiveaux, met = S.get('cyberdeck_b8', 'met_' + id, 0), sp = Wd.spot(id), rep = sp ? Wd.rep(sp.district) : 0;
    const at = (k, label, text) => ({ label, text: met >= L[k] ? text : null, how: `${L[k]} passage${L[k] > 1 ? 's' : ''} ici` });
    return [{ label: 'Quartier', text: d.quartier }, at('ambiance', 'Ambiance', d.ambiance), at('hist1', 'Les origines', d.hist[0]), at('hist2', 'Les habitués', d.hist[1]),
      at('hist3', 'Ce qu\'on raconte', d.hist[2]), { label: 'Secret du lieu', text: rep >= L.secretRep ? d.secret : null, how: `${L.secretRep} de réputation dans le quartier` }];
  }
  function filePct(id) { const l = fileLines(id); return l.length ? Math.floor(l.filter(x => x.text).length * 100 / l.length) : 0; }
  // Page d'un quartier : réputation vers les 100 %, son histoire et tous ses lieux
  function districtPage(did) {
    const d = Wd.district(did), q = DOSSIERS.quartiers?.[did]; if (!d) return;
    const zone = Wd.isZone(did), zlock = zone ? Wd.zoneLock(did) : null;
    const rep = Wd.rep(did), pct = Math.min(100, rep * 2), tr = Wd.tier(rep), bunker = Wd.bunkerUnlocked();
    const needs = [10, 25, 50], labels = ['Les origines', 'Ses règles', 'Ce qu\'il cache'];
    const lines = q ? [{ label: 'Le quartier', text: q.desc }, ...needs.map((n, i) => ({ label: labels[i], text: rep >= n ? q.hist[i] : null, how: `${n} de réputation` }))] : [];
    const places = [...Wd.PLACES, ...Wd.ZONE_PLACES].filter(p => Wd.spot(p.id)?.district === did);
    const ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = `<div class="encounter dpage" style="--c:${d.color}"><div class="mono small dim">${zone ? `ZONE · BONUS +${Wd.ZONE_BONUS[did] || 0} % DANS SES LIEUX` : 'QUARTIER DE NEO-BXL'}</div><h2 class="glitch" style="color:${d.color};margin:0">${esc(d.name.toUpperCase())}</h2>
      ${zlock ? `<div class="zlock"><b style="color:${d.color}">🔒 ZONE VERROUILLÉE · ${Wd.zoneUnlockPercent(did)} %</b><div>${esc(zlock)}</div></div>` : ''}
      <div class="dzone"><b style="color:${d.color}">${pct} %</b><div><div class="mono tiny dim">RÉPUTATION DE LA ZONE</div><div>${Wd.TIER_NAMES[tr]} · ${rep} / 50 points</div></div></div>
      <div class="psybar"><i style="width:${pct}%;background:${d.color}"></i></div>
      <div class="mono tiny dsteps">${[[10, 'Connu·e'], [25, 'Respecté·e'], [50, 'Légende']].map(([n, l]) => `<span style="color:${rep >= n ? d.color : C.dim}">${rep >= n ? '✓' : '○'} ${l} (${n})</span>`).join('')}</div>
      <div class="dim small">Gagne de la réputation en visitant les lieux du quartier et en y bouclant des expéditions.</div>
      <div class="mono small" style="color:${d.color};margin-top:12px">// INFORMATIONS</div>
      ${lines.map(l => `<div class="dline ${l.text ? '' : 'lock'}"><div class="mono tiny" style="color:${l.text ? d.color : C.dim}">${esc(l.label.toUpperCase())}</div>
        ${l.text ? `<div>${esc(l.text)}</div>` : `<div><span class="redact">█████ ███ ████</span> <span class="mono tiny dim">🔒 ${esc(l.how)}</span></div>`}</div>`).join('')}
      <div class="mono small dim" style="margin-top:12px">LIEUX DU QUARTIER</div>
      ${places.map(pl => { const secret = (pl.id === 'bunker' && !bunker) || !!zlock, sp = Wd.spot(pl.id), open = !sp || Wd.isOpen(sp);
        return `<div class="dplace"><button class="place ${zlock ? 'cool' : ''}" data-go="${secret ? '' : pl.id}" style="--c:${pl.color}"><span class="pic">${secret && !zlock ? '?' : pl.icon}</span><b>${secret && !zlock ? 'Lieu secret' : esc(pl.name)}</b>
          <span class="dim tiny">${zlock ? esc(pl.desc) : secret ? 'Réservé aux légendes' : `${S.get('cyberdeck_b8', 'met_' + pl.id, 0)} passage(s) · ${sp ? Wd.hoursLabel(sp) : ''}`}</span>
          ${secret ? '' : `<em class="mono tiny" style="color:${open ? pl.color : C.red}">${open ? 'ENTRER ›' : 'FERMÉ'}</em>`}</button>
          ${secret ? '' : `<button class="pinfo mono tiny" data-file="${pl.id}" style="--c:${pl.color}">ⓘ INFORMATIONS<span>fiche ${filePct(pl.id)} %</span></button>`}</div>`; }).join('')}
      <button class="btn" id="dclose">Fermer</button></div>`;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.querySelector('#dclose').onclick = close; ov.onclick = (e) => { if (e.target === ov) close(); };
    ov.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { if (!b.dataset.go) { ctx.toast(zlock ? 'Zone verrouillée : ' + zlock : 'Lieu secret : il faut 40 de réputation au total'); return; } close(); go(b.dataset.go); });
    ov.querySelectorAll('.pinfo').forEach(b => b.onclick = () => placeFile(b.dataset.file));
  }
  function placeFile(id) {
    const pl = Wd.place(id), d = DOSSIERS.lieux?.[id]; if (!pl || !d) return;
    const met = S.get('cyberdeck_b8', 'met_' + id, 0), lines = fileLines(id);
    const pct = Math.floor(lines.filter(l => l.text).length * 100 / lines.length);
    const ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = `<div class="encounter" style="--c:${pl.color}"><div class="mono small" style="color:${pl.color}">${pl.icon}  ${esc(pl.name.toUpperCase())}</div>
      <div class="mono tiny" style="color:${pl.color}">Fiche complétée à ${pct} % · ${met} passage(s)</div>
      ${lines.map(l => `<div class="dline ${l.text ? '' : 'lock'}"><div class="mono tiny" style="color:${l.text ? pl.color : C.dim}">${esc(l.label.toUpperCase())}</div>
        ${l.text ? `<div>${esc(l.text)}</div>` : `<div><span class="redact">█████ ███ ████</span> <span class="mono tiny dim">🔒 ${esc(l.how)}</span></div>`}</div>`).join('')}
      <button class="btn" id="pfclose">Fermer</button></div>`;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.querySelector('#pfclose').onclick = close; ov.onclick = (e) => { if (e.target === ov) close(); };
  }

  function go(id) {
    const r = Wd.visit(id);
    if (r.error) { ctx.toast(r.error); return; }
    encounter(id, r.encounter);
  }

  function encounter(placeId, e) {
    const pl = Wd.place(placeId);
    const ov = document.createElement('div'); ov.className = 'overlay';
    const c = e.contactId ? Wd.contact(e.contactId) : null;
    ov.innerHTML = `<div class="encounter" style="--c:${pl.color}"><div class="mono small" style="color:${pl.color}">${pl.icon}  ${esc(pl.name.toUpperCase())}</div>
      <div class="ehead"><span class="eface"></span><div><b>${esc(e.who)}</b><div class="mono tiny dim">${e.kind === 'contact' ? 'CONTACT · HABITUÉ·E DU LIEU' : e.kind === 'runner' ? 'RUNNER · CONTRAT' : 'RENCONTRE'}</div></div></div>
      <p>${esc(e.text)}</p><div class="echoices"></div></div>`;
    if (c) ov.querySelector('.eface').appendChild(portraitCanvas(c, 54));
    else ov.querySelector('.eface').innerHTML = `<span class="noface">${e.kind === 'runner' ? '⌖' : '?'}</span>`;
    const ch = ov.querySelector('.echoices');
    const closeOv = () => { ov.remove(); document.removeEventListener('keydown', escK); render(); ctx.changed(); };
    const escK = (ev) => { if (ev.key === 'Escape') closeOv(); };
    document.addEventListener('keydown', escK);
    e.choices.forEach((x, i) => {
      const bits = [x.xp > 0 && `+${x.xp} XP`, x.eddies > 0 && `+${x.eddies} €$`, x.aff > 0 && `affinité +${x.aff}`].filter(Boolean).join(' · ');
      const b = document.createElement('button'); b.className = 'echoice';
      b.innerHTML = `<b>› ${esc(x.label)}</b>${bits ? `<span class="mono tiny dim">${bits}</span>` : ''}`;
      b.onclick = () => {
        const r = Wd.choose(placeId, e, i);
        if (r.error) { ctx.toast(r.error); return; }
        const res = r.result;
        const out = [res.xp > 0 && `+${res.xp} XP`, res.eddies && `${res.eddies > 0 ? '+' : ''}${res.eddies} €$`, res.aff > 0 && `affinité +${res.aff}`, res.started && 'expédition lancée'].filter(Boolean).join(' · ');
        ch.innerHTML = `<div class="eres">« ${esc(res.result)} »</div><div class="mono small" style="color:${C.green}">${out}</div><button class="btn main" style="align-self:flex-end;background:${pl.color};border-color:${pl.color}">CONTINUER ›</button>`;
        ch.querySelector('button').onclick = closeOv;
        ctx.changed();
      };
      ch.appendChild(b);
    });
    const leave = document.createElement('button'); leave.className = 'leave mono small'; leave.textContent = 'Partir sans rien dire'; leave.onclick = closeOv; ch.appendChild(leave);
    document.body.appendChild(ov);
  }

  // ─────────────── Épisodes d'histoire : décisions, message d'ouverture et clôture
  function storyBox(a, now) {
    const ep = Wd.storyForExp(a); if (!ep) return '';
    const pend = Wd.storyPending(a, now), done = ep.beats.filter((_, b) => Wd.storyAnswer(a, b) >= 0).length;
    return `<div class="expev story"><div class="mono tiny" style="color:${C.amber}">✦ HISTOIRE · DÉCISIONS ${done}/3</div>
      ${ep.beats.map((bt, b) => { const ans = Wd.storyAnswer(a, b);
        if (ans >= 0) return `<div class="sbdone"><span class="dim small">${esc(bt.t)}</span><span class="small">› ${esc(bt.c[ans][0])} — ${esc(bt.c[ans][2])}</span></div>`;
        if (b === pend) return `<b>${esc(bt.t)}</b>${bt.c.map((c, i) => `<button data-sb="${b}:${i}" style="--c:${C.cyan}">› ${esc(c[0])}</button>`).join('')}`;
        return `<div class="mono tiny dim">◌ Décision ${b + 1} : à ${(b + 1) * 25} % du trajet</div>`; }).join('')}</div>`;
  }
  function storyIntro(cid) {
    const n = Wd.chainProgress(cid), ep = Wd.storyEp(cid, n), ch = Wd.CHAINS[cid]?.[n], c = Wd.contact(cid);
    if (!ch || !c) return;
    if (Wd.active().length) { ctx.toast('Une seule expédition à la fois : termine celle en cours'); return; }
    const ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = `<div class="encounter" style="--c:${C.amber}"><div class="mono small" style="color:${C.amber}">MESSAGE DE ${esc(c.name.toUpperCase())}</div>
      <div class="shead"><span class="pf"></span><div><div class="mono tiny" style="color:${C.amber}">ÉPISODE ${n + 1}/3</div><b>${esc(ch.title)}</b><div class="mono tiny dim">${esc(ch.place)} · ${ch.minutes} min</div></div></div>
      <p>« ${esc(ep?.intro || ch.brief)} »</p><div class="dim small">Pendant l'expédition, tu devras prendre 3 décisions. Elles décideront de la réussite de l'épisode.</div>
      <button class="btn main" id="sgo">Accepter la mission</button><button class="btn" id="sno">Plus tard</button></div>`;
    ov.querySelector('.pf').appendChild(portraitCanvas(c, 64));
    document.body.appendChild(ov);
    ov.querySelector('#sno').onclick = () => ov.remove();
    ov.querySelector('#sgo').onclick = () => { ov.remove(); const err = Wd.startChainEp(cid); ctx.toast(err || `En route : ${ch.place} · ${ch.minutes} min`); ctx.changed(); render(); };
  }
  function storyEnd(r) {
    const c = Wd.contact(r.contactId);
    const ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = `<div class="encounter" style="--c:${r.win ? C.green : C.red}"><div class="mono small" style="color:${r.win ? C.green : C.red}">${r.win ? (r.last ? 'HISTOIRE TERMINÉE' : 'ÉPISODE RÉUSSI') : 'ÉPISODE RATÉ'}</div>
      <div class="shead"><span class="pf"></span><b style="color:${r.win ? C.green : C.red}">${esc(c?.name.toUpperCase() || '')}</b></div>
      <p>« ${esc(r.text)} »</p><div class="mono small" style="color:${C.amber}">${esc(r.rewards)}</div>
      ${r.win ? '' : '<div class="dim small">Récompense réduite de moitié. Tu peux retenter l\'épisode.</div>'}<button class="btn main" id="sok">Fermer</button></div>`;
    if (c) ov.querySelector('.pf').appendChild(portraitCanvas(c, 64, r.win && r.last));
    document.body.appendChild(ov);
    ov.querySelector('#sok').onclick = () => ov.remove();
  }

  // ─────────────── Expéditions
  function expeditions(body) {
    const paint = () => {
      const now = Date.now(), act = Wd.active();
      body.innerHTML = `<div class="exppanel"><div class="exphead"><span>EXPÉDITIONS</span><span>${act.length}/1 EN COURS</span></div>
        ${act.map(a => { const done = now >= a.end, who = Wd.contact(a.exp.contactId)?.name || a.runner || 'Runner', evs = Wd.expEventState(a, now), ev = Wd.expEvent(a);
          return `<div class="active"><div class="arow"><div><b>${esc(a.exp.title)}</b><div class="mono tiny dim">${esc(who)} · ${esc(a.exp.place)}</div></div>
            ${done ? `<button class="claim" data-claim="${a.exp.id}">+${Wd.expXp(a.exp)} XP ›</button>` : `<span class="mono" style="color:${C.cyan}">${Wd.fmtLeft(a.end - now)}</span>`}</div>
            <i class="pbar"><u style="width:${Wd.progress(a, now) * 100}%;background:${done ? C.green : C.cyan}"></u></i>
            ${evs === 1 ? `<div class="expev"><div class="mono tiny" style="color:${C.amber}">⚠ IMPRÉVU</div><b>${esc(ev.text)}</b>
              <button data-ev="0" style="--c:${C.cyan}">› ${esc(ev.safe)} (prudent · +10 %)</button><button data-ev="1" style="--c:${C.red}">› ${esc(ev.risky)} (risqué · +60 % ou −30 %)</button></div>` : ''}${storyBox(a, now)}</div>`; }).join('')}
        <div class="mono tiny dim" style="margin-top:14px">CONTRATS DU JOUR</div>
        ${Wd.offers().map(e => { const c = Wd.contact(e.contactId), taken = Wd.takenToday(e.id);
          return `<div class="offer"><span class="pf" data-c="${e.contactId}"></span><div class="om"><b style="color:${taken ? C.dim : '#e8f4f8'}">${esc(e.title)}</b>
            <div class="mono tiny dim">${esc(c?.name || '')} · ${e.minutes} min · +${Wd.expXp(e)} XP · +${Wd.expEddies(e)} €$</div>${taken ? '' : `<div class="dim small">${esc(e.brief)}</div>`}</div>
            ${taken ? `<span style="color:${C.green}">✓</span>` : `<button class="go" data-go="${e.id}">PARTIR</button>`}</div>`; }).join('')}
        <div class="mono tiny dim" style="margin-top:14px">HISTOIRES DE CONTACTS</div>
        ${Object.entries(Wd.CHAINS).map(([cid, eps]) => { const c = Wd.contact(cid), n = Wd.chainProgress(cid), aff = Wd.affinity(cid);
          const fin = n >= eps.length, lock = !fin && aff < Wd.CHAIN_NEED[n];
          return `<div class="offer"><span class="pf small" data-c="${cid}"></span><div class="om"><b style="color:${fin ? C.dim : '#e8f4f8'}">${fin ? `${esc(c.name)} · histoire terminée` : `${esc(c.name)} · épisode ${n + 1}/${eps.length} : ${esc(eps[n].title)}`}</b>
            <div class="mono tiny dim">${fin ? '✓ +150 XP · +200 €$ encaissés' : lock ? `🔒 affinité ${Wd.CHAIN_NEED[n]} requise (${aff})` : `${eps[n].minutes} min · ${esc(eps[n].place)}`}</div></div>
            ${!fin && !lock ? `<button class="go amber" data-chain="${cid}">JOUER</button>` : ''}</div>`; }).join('')}
        <p class="dim small" style="margin-top:10px">Lance une expédition, vis ta vie, reviens encaisser. Le temps tourne même onglet fermé. Les runners croisés en ville en proposent d'autres.</p></div>`;
      body.querySelectorAll('.pf').forEach(p => { const c = Wd.contact(p.dataset.c); if (c) p.appendChild(portraitCanvas(c, p.classList.contains('small') ? 34 : 38)); });
      body.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const e = Wd.offers().find(x => x.id === b.dataset.go); const err = Wd.startExpedition(e); ctx.toast(err || `En route : ${e.place} · ${e.minutes} min`); ctx.changed(); render(); });
      body.querySelectorAll('[data-chain]').forEach(b => b.onclick = () => storyIntro(b.dataset.chain));
      body.querySelectorAll('[data-claim]').forEach(b => b.onclick = () => { const a = Wd.active().find(x => x.exp.id === b.dataset.claim); const r = a && Wd.claimExpedition(a);
        if (!r) return; if (r.error) { ctx.toast(r.error); return; }
        if (r.story) storyEnd(r); else ctx.popup(r.title, r.text); ctx.changed(); render(); });
      body.querySelectorAll('[data-sb]').forEach(b => b.onclick = () => { const a = Wd.active()[0]; const [bt, i] = b.dataset.sb.split(':').map(Number); Wd.storyChoose(a, bt, i); paint(); });
      body.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => { const a = Wd.active()[0]; ctx.toast(Wd.resolveExpEvent(a, b.dataset.ev === '1')); paint(); });
    };
    paint();
    // Le compte à rebours avance ; on ne redessine pas pendant qu'un imprévu attend une réponse.
    tick = setInterval(() => { const a = Wd.active()[0]; if (a && Wd.expEventState(a) !== 1 && Wd.storyPending(a) === null) paint(); else if (a) { const s = body.querySelector('.arow .mono'); if (s) s.textContent = Wd.fmtLeft(a.end - Date.now()); } }, 1000);
  }

  render();
}
