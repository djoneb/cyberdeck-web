// NEURA « Iris » et ses stades d'évolution (même dessin que dans le launcher).
export function drawNeura(canvas, stage = 1, active = true) {
  const g = canvas.getContext('2d');
  let raf;
  const frame = (ms) => {
    const t = ms / 1000;
    const S = canvas.width, c = S / 2, k = S / 2 / 122;
    g.clearRect(0, 0, S, S);
    g.globalCompositeOperation = 'lighter';
    const talk = active ? 0.3 + 0.7 * Math.abs(Math.sin(t * 4) * Math.sin(t * 1.7 + 1)) : 0;
    const arc = (r, a0, a1, col, w) => { g.beginPath(); g.arc(c, c, r, a0, a1); g.strokeStyle = col; g.lineWidth = w; g.stroke(); };
    const gold = stage >= 5;
    // Ascendante : ailes de lumière
    if (stage >= 5) {
      for (const side of [-1, 1]) for (let j = 0; j < 14; j++) {
        const a = -0.9 + j * 0.13, flap = 6 * Math.sin(t * 1.4) * k;
        g.beginPath(); g.moveTo(c + side * 40 * k, c);
        g.quadraticCurveTo(c + side * (80 + j * 3) * k, c + Math.sin(a) * 60 * k - 30 * k - flap, c + side * (112 + j * 1.5) * k, c + Math.sin(a) * 95 * k - flap);
        g.strokeStyle = `rgba(255,200,106,${Math.max(0.08, 0.5 - j * 0.025)})`; g.lineWidth = 1.3 * k; g.stroke();
      }
    }
    // Oracle : arcs runiques, onde vocale, aura
    if (stage >= 4) {
      for (let j = 0; j < 12; j++) { const a0 = j * 0.5236 - t * 0.25; arc(112 * k, a0, a0 + 0.22, 'rgba(185,140,255,.75)', 3 * k); }
      g.beginPath();
      for (let a = 0; a <= 6.3; a += 0.05) { const r = (92 + (5 + 10 * talk) * Math.sin(a * 12 + t * 4) * Math.sin(a * 3 + t)) * k; const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r; a ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.strokeStyle = 'rgba(255,79,216,.6)'; g.lineWidth = 1.4 * k; g.stroke();
    }
    // Halo : plaques hexagonales et scan
    if (stage >= 3) {
      for (let j = 0; j < 18; j++) {
        const a = j * 0.349 + t * 0.15, px = c + Math.cos(a) * 104 * k, py = c + Math.sin(a) * 104 * k;
        g.beginPath(); for (let q = 0; q < 6; q++) { const aa = a + q * 1.047; g.lineTo(px + Math.cos(aa) * 5.5 * k, py + Math.sin(aa) * 5.5 * k); } g.closePath();
        g.strokeStyle = 'rgba(111,243,255,.7)'; g.lineWidth = 1.2 * k; g.stroke();
      }
      g.beginPath(); g.moveTo(c, c); g.arc(c, c, 104 * k, t * 0.9, t * 0.9 + 0.38); g.closePath(); g.fillStyle = 'rgba(111,243,255,.12)'; g.fill();
    }
    // Synapse : nœuds en orbite
    if (stage >= 2) {
      for (let j = 0; j < 3; j++) {
        const a = t * 0.6 + j * 2.094, px = c + Math.cos(a) * 84 * k, py = c + Math.sin(a) * 76 * k;
        g.beginPath(); g.moveTo(c, c); g.lineTo(px, py); g.strokeStyle = 'rgba(111,243,255,.25)'; g.lineWidth = k; g.stroke();
        g.beginPath(); g.arc(px, py, 4.5 * k, 0, 6.28); g.fillStyle = '#cfffff'; g.fill();
      }
      const f = (t * 0.5) % 1; arc((44 + f * 76) * k, 0, 6.29, `rgba(111,243,255,${0.35 * (1 - f)})`, 2 * k);
    }
    // Base : anneaux, couronne, noyau
    for (let i = 0; i < 5; i++) {
      const r = (50 + 16 * i) * k * (1 + 0.015 * Math.sin(t * 1.6)), dir = i % 2 ? -1 : 1, rot = t * (0.1 + 0.035 * i) * dir;
      for (let s = 0; s < 6; s++) arc(r, s * 1.047 + i * 0.4 + rot, s * 1.047 + i * 0.4 + rot + 0.7, `rgba(111,243,255,${Math.min(0.9, 0.15 + 0.12 * i + 0.15 * talk)})`, (1 + 0.4 * i) * k);
    }
    for (let i = 0; i < 90; i++) {
      const a = i / 90 * 6.283 + t * 0.03, w = Math.abs(Math.sin(i * 0.7 + t * 0.6) * Math.sin(i * 0.23 - t * 0.3));
      const l = (6 + 14 * w + 14 * talk * Math.abs(Math.sin(i * 1.3 + t * 9))) * k, r0 = 96 * k;
      g.beginPath(); g.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0); g.lineTo(c + Math.cos(a) * (r0 + l), c + Math.sin(a) * (r0 + l));
      g.strokeStyle = gold ? 'rgba(255,184,74,.7)' : 'rgba(255,90,78,.7)'; g.lineWidth = 1.4 * k; g.stroke();
    }
    const rc = (44 + 6 * talk) * k, core = g.createRadialGradient(c, c, 0, c, c, rc);
    core.addColorStop(0, '#fff'); core.addColorStop(0.25, gold ? '#ffe6a8' : '#9ff8ff'); core.addColorStop(0.6, 'rgba(40,120,255,.6)'); core.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = core; g.beginPath(); g.arc(c, c, rc, 0, 6.28); g.fill();
    for (let i = 0; i < 24; i++) {
      const a = i / 24 * 6.283 + t * 0.25;
      g.beginPath(); g.moveTo(c + Math.cos(a) * 14 * k, c + Math.sin(a) * 14 * k); g.lineTo(c + Math.cos(a) * 34 * k, c + Math.sin(a) * 34 * k);
      g.strokeStyle = 'rgba(200,250,255,.5)'; g.lineWidth = k; g.stroke();
    }
    g.globalCompositeOperation = 'source-over';
    g.beginPath(); g.arc(c, c, 9 * k, 0, 6.28); g.fillStyle = '#04070b'; g.fill();
    if (stage >= 3) for (let q = 0; q < 6; q++) { const a = q * 1.047 + t * 0.8; g.beginPath(); g.moveTo(c, c); g.arc(c, c, 13 * k, a, a + 0.6); g.fillStyle = '#04070b'; g.fill(); }
    if (gold) { g.beginPath(); g.arc(c, c, (3.5 + Math.sin(t * 3)) * k, 0, 6.28); g.fillStyle = '#ffd27a'; g.fill(); }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
