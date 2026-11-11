// La Ville : carte holographique isométrique, lieux, rencontres et expéditions (comme dans le launcher).
import * as S from './save.js';
import * as Wd from './world.js';
import { RInt, hashCode } from './krand.js';
import { portraitCanvas } from './portrait.js';

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
      <span class="mono tiny maptag" style="left:8px;color:${Wd.isNight() ? '#b98cff' : C.amber}">${Wd.isNight() ? '☾ NUIT · récompenses +25 %' : '☀ JOUR'}</span>
      <span class="mono tiny maptag" style="right:8px;color:${C.amber}">● contact sur place</span></div>
      <div id="expreminder"></div><div class="reps"></div><p class="dim small" id="reptxt"></p>
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
      const t = ms / 1000, night = Wd.isNight(), now = Date.now();
      const P = (u, v, z = 0) => proj(W, H, u, v, z);
      const quad = (pts, fill, stroke, lw = 1) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } };
      const line = (a, b, col, lw, dash) => { g.strokeStyle = col; g.lineWidth = lw; if (dash) { g.setLineDash(dash[0]); g.lineDashOffset = dash[1]; } g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]); };
      const circle = (p, r, col, stroke) => { g.beginPath(); g.arc(p[0], p[1], r, 0, 7); if (stroke) { g.strokeStyle = col; g.lineWidth = stroke; g.stroke(); } else { g.fillStyle = col; g.fill(); } };
      // ciel
      const sky = g.createLinearGradient(0, 0, 0, H);
      if (night) { sky.addColorStop(0, '#0a0418'); sky.addColorStop(1, '#03090e'); } else { sky.addColorStop(0, '#3e86c4'); sky.addColorStop(0.5, '#123050'); sky.addColorStop(1, '#07131c'); }
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      if (night) {
        const gl = g.createLinearGradient(0, 0, 0, H * 0.35); gl.addColorStop(0, 'rgba(42,11,58,.6)'); gl.addColorStop(1, 'rgba(42,11,58,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H * 0.35);
        for (let k = 0; k < 30; k++) { const rr = RInt(k * 7); const a = 0.2 + rr.nextFloat() * 0.3; circle([rr.nextFloat() * W, rr.nextFloat() * H * 0.25], 1.2, `rgba(255,255,255,${a})`); }
      } else {
        const gl = g.createLinearGradient(0, 0, 0, H * 0.4); gl.addColorStop(0, 'rgba(143,211,255,.55)'); gl.addColorStop(1, 'rgba(143,211,255,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H * 0.4);
        const sun = g.createRadialGradient(W * 0.82, H * 0.08, 0, W * 0.82, H * 0.08, W * 0.14); sun.addColorStop(0, 'rgba(255,244,192,.7)'); sun.addColorStop(1, 'rgba(255,244,192,0)');
        g.fillStyle = sun; g.fillRect(W * 0.6, 0, W * 0.4, H * 0.3);
        for (let k = 0; k < 5; k++) { const rr = RInt(k * 13); const cx = ((rr.nextFloat() + t * 0.004 * (1 + k % 2)) % 1) * W, cy = H * (0.04 + rr.nextFloat() * 0.16);
          g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(cx, cy, W * 0.08, H * 0.012, 0, 0, 7); g.fill(); }
      }
      quad([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], night ? '#07131c' : '#15324a');
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
      return `<div style="--c:${d.color}"><span class="mono tiny" style="color:${d.color}">${esc(d.name.toUpperCase())}</span><b>${Wd.TIER_NAMES[tr]}</b><i><u style="width:${Math.min(100, r / next * 100)}%"></u></i></div>`; }).join('');
    body.querySelector('#reptxt').textContent = Wd.bunkerUnlocked() ? '☢ Le Bunker Zéro t\'est ouvert : récompenses +50 %.' : `Réputation totale ${Wd.totalRep()}/40 : un lieu secret attend les légendes…`;
    body.querySelector('.places').innerHTML = Wd.PLACES.filter(p => p.id !== 'bunker' || bunker).map(pl => {
      const sp = Wd.spot(pl.id), open = !sp || Wd.isOpen(sp), left = Wd.cooldownLeft(pl.id);
      return `<button class="place ${left > 0 || !open ? 'cool' : ''}" data-p="${pl.id}" style="--c:${pl.color}"><span class="pic">${pl.icon}</span><b>${esc(pl.name)}</b><span class="dim tiny">${esc(pl.desc)}</span>
        <em class="mono tiny" style="color:${!open ? C.red : left > 0 ? C.dim : pl.color}">${!open ? 'FERMÉ · ' + Wd.hoursLabel(sp) : left > 0 ? '↻ ' + Wd.fmtLeft(left) : 'ENTRER ›'}</em></button>`;
    }).join('');
    body.querySelectorAll('.place').forEach(b => b.onclick = () => go(b.dataset.p));
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
              <button data-ev="0" style="--c:${C.cyan}">› ${esc(ev.safe)} (prudent · +10 %)</button><button data-ev="1" style="--c:${C.red}">› ${esc(ev.risky)} (risqué · +60 % ou −30 %)</button></div>` : ''}</div>`; }).join('')}
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
      body.querySelectorAll('[data-chain]').forEach(b => b.onclick = () => { const err = Wd.startChainEp(b.dataset.chain); ctx.toast(err || 'Épisode lancé'); ctx.changed(); render(); });
      body.querySelectorAll('[data-claim]').forEach(b => b.onclick = () => { const a = Wd.active().find(x => x.exp.id === b.dataset.claim); const r = a && Wd.claimExpedition(a);
        if (r) { ctx.popup(r.title, r.text); ctx.changed(); render(); } });
      body.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => { const a = Wd.active()[0]; ctx.toast(Wd.resolveExpEvent(a, b.dataset.ev === '1')); paint(); });
    };
    paint();
    // Le compte à rebours avance ; on ne redessine pas pendant qu'un imprévu attend une réponse.
    tick = setInterval(() => { const a = Wd.active()[0]; if (a && Wd.expEventState(a) !== 1) paint(); else if (a) { const s = body.querySelector('.arow .mono'); if (s) s.textContent = Wd.fmtLeft(a.end - Date.now()); } }, 1000);
  }

  render();
}
