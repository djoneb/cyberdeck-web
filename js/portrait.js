// Portraits des contacts : même dessin que le launcher (duotone rouge / cyan, emblème, cadre à coins).
const RED = '#e8505b', CYAN = '#6ff3f0';
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

export function portraitCanvas(c, size = 56, gold = false) {
  const cv = document.createElement('canvas');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = cv.height = Math.round(size * dpr); cv.style.width = cv.style.height = size + 'px';
  cv.className = 'portrait';
  drawPortrait(cv.getContext('2d'), c, cv.width, cv.height, gold);
  return cv;
}

export function drawPortrait(g, c, w, h, gold = false, glitch = 0) {
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#5a1a22'); bg.addColorStop(1, '#2a0b10');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = rgba(RED, 0.18); g.beginPath(); g.arc(w * 0.5, h * 0.42, w * 0.2, 0, 7); g.fill();
  g.fillStyle = rgba(RED, 0.16); g.beginPath(); g.moveTo(w * 0.12, h); g.bezierCurveTo(w * 0.15, h * 0.68, w * 0.85, h * 0.68, w * 0.88, h); g.closePath(); g.fill();
  emblem(g, c.emblem, w, h, w * 0.035);
  g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < h; y += 3) g.fillRect(0, y, w, 1);
  if (glitch) { g.fillStyle = rgba(CYAN, 0.25); for (let i = 0; i < 5; i++) g.fillRect(Math.random() * w * 0.4, Math.random() * h, w * (0.2 + Math.random() * 0.6), 2); }
  g.strokeStyle = gold ? 'rgba(255,210,122,.9)' : rgba(RED, 0.9); g.lineWidth = w * 0.025; g.strokeRect(0, 0, w, h);
  const k = w * 0.14; g.strokeStyle = CYAN; g.lineWidth = w * 0.03; g.lineCap = 'butt';
  for (const [ox, oy] of [[0, 0], [w, 0], [0, h], [w, h]]) {
    const dx = ox === 0 ? k : -k, dy = oy === 0 ? k : -k;
    g.beginPath(); g.moveTo(ox + dx, oy); g.lineTo(ox, oy); g.lineTo(ox, oy + dy); g.stroke();
  }
}

function emblem(g, kind, w, h, sw) {
  const cx = w * 0.5, cy = h * 0.5, col = CYAN;
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = sw; g.lineCap = 'round'; g.lineJoin = 'round';
  const line = (x1, y1, x2, y2, lw = sw) => { g.lineWidth = lw; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.lineWidth = sw; };
  const dot = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const ring = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); };
  // Arc façon Compose : angles en degrés, dans le rectangle (x, y, sw, sh)
  const arc = (start, sweep, x, y, ew, eh) => { g.beginPath(); g.ellipse(x + ew / 2, y + eh / 2, ew / 2, eh / 2, 0, start * Math.PI / 180, (start + sweep) * Math.PI / 180); g.stroke(); };
  const rr = (x, y, s, r) => { g.beginPath(); g.roundRect ? g.roundRect(x, y, s, s, r) : g.rect(x, y, s, s); g.stroke(); };
  switch (kind) {
    case 'dice': {
      const a = w * 0.26;
      rr(cx - a * 1.05, cy - a * 0.75, a, a * 0.18); rr(cx + a * 0.05, cy - a * 0.2, a, a * 0.18);
      [[.25, .25], [.75, .75], [.5, .5]].forEach(([u, v]) => dot(cx - a * 1.05 + a * u, cy - a * 0.75 + a * v, sw * 1.2));
      [[.25, .25], [.75, .25], [.25, .75], [.75, .75]].forEach(([u, v]) => dot(cx + a * 0.05 + a * u, cy - a * 0.2 + a * v, sw * 1.2));
      break;
    }
    case 'eye': {
      const a = w * 0.34;
      g.beginPath(); g.moveTo(cx - a, cy); g.quadraticCurveTo(cx, cy - a * 0.9, cx + a, cy); g.quadraticCurveTo(cx, cy + a * 0.9, cx - a, cy); g.closePath(); g.stroke();
      ring(cx, cy, a * 0.32); dot(cx, cy, a * 0.13);
      g.strokeStyle = rgba(col, 0.6);
      for (let i = 0; i < 9; i++) { const an = Math.PI + i * Math.PI / 8; line(cx + Math.cos(an) * a * 0.55, cy + Math.sin(an) * a * 0.62, cx + Math.cos(an) * a * 0.75, cy + Math.sin(an) * a * 0.85, sw * 0.6); }
      g.strokeStyle = col; break;
    }
    case 'chip': {
      const a = w * 0.22;
      g.strokeRect(cx - a, cy - a, a * 2, a * 2); g.strokeRect(cx - a * 0.45, cy - a * 0.45, a * 0.9, a * 0.9);
      for (let i = 0; i < 5; i++) { const o = -a + a * 2 * (i + 0.5) / 5;
        line(cx + o, cy - a, cx + o, cy - a * 1.4); line(cx + o, cy + a, cx + o, cy + a * 1.4);
        line(cx - a, cy + o, cx - a * 1.4, cy + o); line(cx + a, cy + o, cx + a * 1.4, cy + o); }
      break;
    }
    case 'star': {
      const r = w * 0.32; g.beginPath();
      for (let i = 0; i < 10; i++) { const q = i % 2 === 0 ? r : r * 0.42, an = -Math.PI / 2 + i * Math.PI / 5; const x = cx + Math.cos(an) * q, y = cy + Math.sin(an) * q; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.closePath(); g.stroke(); g.strokeStyle = rgba(col, 0.5); g.lineWidth = sw * 0.6; ring(cx, cy, r * 1.15); g.strokeStyle = col; g.lineWidth = sw; break;
    }
    case 'shield': {
      const a = w * 0.3; g.beginPath(); g.moveTo(cx, cy - a); g.lineTo(cx + a * 0.85, cy - a * 0.65); g.lineTo(cx + a * 0.7, cy + a * 0.35);
      g.quadraticCurveTo(cx + a * 0.4, cy + a * 0.85, cx, cy + a); g.quadraticCurveTo(cx - a * 0.4, cy + a * 0.85, cx - a * 0.7, cy + a * 0.35);
      g.lineTo(cx - a * 0.85, cy - a * 0.65); g.closePath(); g.stroke();
      line(cx - a * 0.4, cy, cx + a * 0.4, cy); line(cx, cy - a * 0.45, cx, cy + a * 0.45); break;
    }
    case 'rose': {
      for (let i = 1; i <= 4; i++) arc(i * 70, 250, cx - w * 0.05 * i, cy - h * 0.08 - w * 0.05 * i, w * 0.1 * i, w * 0.1 * i);
      line(cx, cy + w * 0.14, cx, cy + w * 0.38);
      g.beginPath(); g.moveTo(cx, cy + w * 0.26); g.quadraticCurveTo(cx + w * 0.16, cy + w * 0.16, cx + w * 0.2, cy + w * 0.26); g.quadraticCurveTo(cx + w * 0.1, cy + w * 0.3, cx, cy + w * 0.26); g.stroke();
      break;
    }
    case 'cube': {
      const a = w * 0.26, P = (x, y) => [cx + x, cy + y];
      const top = P(0, -a), l = P(-a * 0.87, -a * 0.5), r = P(a * 0.87, -a * 0.5), c = P(0, 0), bl = P(-a * 0.87, a * 0.5), br = P(a * 0.87, a * 0.5), bot = P(0, a);
      [[top, l], [top, r], [l, c], [r, c], [c, bot], [l, bl], [r, br], [bl, bot], [br, bot]].forEach(([p, q]) => line(p[0], p[1], q[0], q[1]));
      break;
    }
    case 'wolf': {
      const a = w * 0.3; g.beginPath(); g.moveTo(cx - a, cy - a * 0.9); g.lineTo(cx - a * 0.45, cy - a * 0.35); g.lineTo(cx + a * 0.45, cy - a * 0.35);
      g.lineTo(cx + a, cy - a * 0.9); g.lineTo(cx + a * 0.8, cy + a * 0.1); g.lineTo(cx + a * 0.25, cy + a * 0.95);
      g.lineTo(cx - a * 0.25, cy + a * 0.95); g.lineTo(cx - a * 0.8, cy + a * 0.1); g.closePath(); g.stroke();
      line(cx - a * 0.5, cy, cx - a * 0.18, cy + a * 0.1, sw * 1.3); line(cx + a * 0.5, cy, cx + a * 0.18, cy + a * 0.1, sw * 1.3);
      dot(cx, cy + a * 0.62, sw * 1.6); break;
    }
    case 'cat': {
      const a = w * 0.27; ring(cx, cy + a * 0.15, a);
      g.beginPath(); g.moveTo(cx - a * 0.85, cy - a * 0.3); g.lineTo(cx - a * 0.7, cy - a * 1.2); g.lineTo(cx - a * 0.2, cy - a * 0.75); g.stroke();
      g.beginPath(); g.moveTo(cx + a * 0.85, cy - a * 0.3); g.lineTo(cx + a * 0.7, cy - a * 1.2); g.lineTo(cx + a * 0.2, cy - a * 0.75); g.stroke();
      arc(200, 140, cx - a * 0.6, cy - a * 0.05, a * 0.4, a * 0.3); arc(200, 140, cx + a * 0.2, cy - a * 0.05, a * 0.4, a * 0.3);
      g.lineWidth = sw * 0.7; ring(cx, cy - a * 0.75, a * 0.12); g.lineWidth = sw; break;
    }
    default: { // micro
      const a = w * 0.13;
      g.beginPath(); g.roundRect ? g.roundRect(cx - a, cy - a * 2.4, a * 2, a * 3.2, a) : g.rect(cx - a, cy - a * 2.4, a * 2, a * 3.2); g.stroke();
      arc(0, 180, cx - a * 1.7, cy - a * 1.2, a * 3.4, a * 2.8);
      line(cx, cy + a * 1.6, cx, cy + a * 2.4); line(cx - a, cy + a * 2.4, cx + a, cy + a * 2.4);
      g.strokeStyle = rgba(col, 0.5); g.lineWidth = sw * 0.6;
      for (let i = 1; i <= 3; i++) arc(-40, 80, cx + a * 0.5, cy - a * (1.5 + i * 0.5), a * (1.6 + i), a * (1.6 + i));
      g.strokeStyle = col; g.lineWidth = sw;
    }
  }
}

// Icônes dessinées du launcher : téléphone holographique et carte de tarot.
export function phoneGlyph(color, size = 32) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">
    <rect x="9" y="2" width="56" height="96" rx="10" fill="${color}" opacity=".18"/>
    <defs><linearGradient id="pg${color.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".55"/><stop offset="1" stop-color="${color}" stop-opacity=".08"/></linearGradient></defs>
    <rect x="19" y="20" width="36" height="62" rx="5" fill="url(#pg${color.slice(1)})"/>
    <rect x="12" y="5" width="50" height="90" rx="9" fill="none" stroke="${color}" stroke-width="7"/>
    <path d="M70 30 q14 20 0 40 M80 22 q22 28 0 56" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>`;
}
