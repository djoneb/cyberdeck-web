// Carte de netrunner à partager (même mise en page que le launcher) : image JPEG 1080×1350 avec QR code.
import * as S from './save.js';
import * as Wd from './world.js';
import { rankOf, nextRank, level, levelProgress, avatarFile } from './data.js';
import { ACHIEVEMENTS } from './quests.js';

const W = 1080, H = 1350, WEB = 'https://cyberdeck.eu1z.com';
const loadImg = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });

export async function renderCard() {
  await document.fonts?.ready;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00d8f0';
  const cyan = '#00d8f0', red = '#e8505b', amber = '#f6b35c', dim = '#7f9aa2', tx = '#e8f4f8';
  const DISP = 'Rajdhani, sans-serif', MONO = '"Share Tech Mono", monospace';
  const rgba = (hex, a) => { const n = parseInt(hex.replace('#', ''), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  // fond
  let gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0b1720'); gr.addColorStop(1, '#04080c'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(0,216,240,.055)'; c.lineWidth = 1;
  for (let g = 0; g < W; g += 40) { c.beginPath(); c.moveTo(g, 0); c.lineTo(g, H); c.stroke(); }
  for (let g = 0; g < H; g += 40) { c.beginPath(); c.moveTo(0, g); c.lineTo(W, g); c.stroke(); }
  gr = c.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * .9); gr.addColorStop(0, rgba(accent, .24)); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
  // cadre
  const m = 34, cut = 54;
  c.beginPath(); c.moveTo(m, m); c.lineTo(W - m - cut, m); c.lineTo(W - m, m + cut); c.lineTo(W - m, H - m); c.lineTo(m + cut, H - m); c.lineTo(m, H - m - cut); c.closePath();
  c.strokeStyle = accent; c.lineWidth = 3; c.stroke(); c.lineWidth = 8; c.beginPath(); c.moveTo(m, m + 80); c.lineTo(m, m + 300); c.stroke();
  const text = (s, x, y, size, color, font, { sp = 0, align = 'left', maxW = 0, weight = '' } = {}) => {
    c.font = `${weight} ${size}px ${font}`; c.fillStyle = color; c.textAlign = align; c.letterSpacing = `${sp * size}px`;
    let t = String(s); if (maxW) while (c.measureText(t).width > maxW && t.length > 3) t = t.slice(0, -2) + '…';
    c.fillText(t, x, y); c.letterSpacing = '0px'; c.textAlign = 'left';
  };
  const label = (s, y, end = W - 80) => {
    text(s, 80, y, 26, dim, MONO, { sp: .25 }); c.font = `26px ${MONO}`; c.letterSpacing = `${.25 * 26}px`; const w = c.measureText(s).width; c.letterSpacing = '0px';
    c.strokeStyle = 'rgba(255,255,255,.16)'; c.lineWidth = 2; c.beginPath(); c.moveTo(80 + w + 18, y - 9); c.lineTo(end, y - 9); c.stroke();
  };
  const name = S.name(), xp = S.xp();
  let h = 0; for (const ch of name) h = (Math.imul(h, 31) + ch.charCodeAt(0)) | 0;
  text('CYBERDECK // CARTE NETRUNNER', 80, 112, 26, dim, MONO, { sp: .22 });
  text(`ID-${(h & 0xffff).toString(16).toUpperCase().padStart(4, '0')} · ${new Date().toISOString().slice(0, 10)}`, W - 80, 112, 22, accent, MONO, { sp: .12, align: 'right' });
  // avatar + anneau
  const lv = level(xp), prog = levelProgress(xp), r = rankOf(xp), nx = nextRank(xp);
  const ax = 80, ay = 160, asz = 300, cx = ax + asz / 2, cy = ay + asz / 2;
  c.lineWidth = 12; c.strokeStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(cx, cy, asz / 2 - 6, 0, 7); c.stroke();
  c.strokeStyle = cyan; c.lineCap = 'round'; c.beginPath(); c.arc(cx, cy, asz / 2 - 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * prog); c.stroke(); c.lineCap = 'butt';
  const img = await loadImg(S.avatarPhoto() || avatarFile(S.avatar()));
  if (img) {
    const rr = asz / 2 - 36;
    c.save(); c.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; c.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } c.closePath(); c.clip();
    c.drawImage(img, cx - rr, cy - rr, rr * 2, rr * 2); c.fillStyle = 'rgba(0,0,0,.16)'; for (let y = cy - rr; y < cy + rr; y += 5) c.fillRect(cx - rr, y, rr * 2, 2); c.restore();
  }
  c.fillStyle = cyan; c.fillRect(cx - 70, ay + asz - 18, 140, 40); text(`NIV ${lv}`, cx, ay + asz + 12, 30, '#04080c', MONO, { sp: .1, align: 'center' });
  const nxX = ax + asz + 50, nW = W - 80 - nxX;
  text(name.toUpperCase(), nxX - 4, 268, 92, 'rgba(255,59,78,.6)', DISP, { sp: .04, maxW: nW, weight: 700 });
  text(name.toUpperCase(), nxX + 4, 268, 92, 'rgba(0,216,240,.6)', DISP, { sp: .04, maxW: nW, weight: 700 });
  text(name.toUpperCase(), nxX, 268, 92, tx, DISP, { sp: .04, maxW: nW, weight: 700 });
  text(r[1].toUpperCase(), nxX, 322, 40, cyan, DISP, { sp: .16, maxW: nW, weight: 700 });
  text(`${xp} XP` + (nx ? ` · ${nx[0] - xp} avant « ${nx[1]} »` : ' · rang maximum'), nxX, 366, 26, dim, MONO, { sp: .06, maxW: nW });
  // chiffres clés
  const cards = (S.get('cyberdeck_b7', 'hc_got', []) || []).length;
  const stats = [[S.eddies(), 'EDDIES'], [`${S.achievements().length}/${ACHIEVEMENTS.length}`, 'SUCCÈS'], [cards, 'CARTES HOLO'], [S.get('cyberdeck_b8', 'completed', 0), 'EXPÉDITIONS'], [`${S.streak()} j`, 'SÉRIE']];
  const sy = 510, sw = (W - 160 - 4 * 14) / 5, scol = [amber, accent, '#ff4fd8', cyan, '#ff7a2e'];
  stats.forEach(([v, l], k) => { const x = 80 + k * (sw + 14);
    c.fillStyle = 'rgba(255,255,255,.11)'; c.fillRect(x, sy, sw, 118); c.fillStyle = scol[k]; c.fillRect(x, sy, 6, 118);
    text(v, x + 22, sy + 64, 48, tx, DISP, { maxW: sw - 30, weight: 700 }); text(l, x + 22, sy + 100, 19, dim, MONO, { sp: .12, maxW: sw - 30 }); });
  // réputation
  label('RÉPUTATION · QUARTIERS', 700);
  Wd.DISTRICTS.forEach((d, k) => { const x = 80 + (k % 2) * 470, y = 750 + Math.floor(k / 2) * 92, rp = Wd.rep(d.id), t = Wd.tier(rp), goal = [10, 25, 50, 50][t];
    text(d.name.toUpperCase(), x, y, 26, d.color, MONO, { sp: .12 }); text(Wd.TIER_NAMES[t], x + 440, y, 26, tx, DISP, { align: 'right', weight: 600 });
    c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x, y + 16, 440, 10); c.fillStyle = d.color; c.fillRect(x, y + 16, 440 * Math.min(1, rp / goal), 10); });
  // relations
  label('RELATIONS', 970, 790);
  const partner = S.get('cyberdeck_holophone', 'partner', null);
  Wd.CONTACTS.map(ct => [ct, Wd.affinity(ct.id)]).sort((a, b) => b[1] - a[1]).slice(0, 3).forEach(([ct, a], k) => { const y = 1018 + k * 58;
    text(ct.name.toUpperCase(), 80, y, 30, red, DISP, { sp: .04, maxW: 290, weight: 700 });
    text(Wd.relation(a, ct.romance, partner === ct.id), 385, y, 26, a >= 60 ? amber : dim, DISP, { maxW: 210, weight: 600 });
    c.fillStyle = 'rgba(232,80,91,.16)'; c.fillRect(610, y - 14, 180, 10); c.fillStyle = a >= 60 ? amber : red; c.fillRect(610, y - 14, 180 * a / 100, 10); });
  // exploits
  label('EXPLOITS', 1210, 790);
  const un = S.achievements(); let wins = ACHIEVEMENTS.filter(a => un.includes(a.id)).slice(-2); if (!wins.length) wins = [{ title: 'Premiers pas dans le Net' }];
  wins.forEach((a, k) => text(`✦ ${a.title}`, 80, 1256 + k * 40, 30, k === 0 ? tx : amber, DISP, { maxW: 640, weight: 600 }));
  // QR code vers le site
  if (window.qrcode) {
    const q = qrcode(0, 'M'); q.addData(WEB); q.make(); const n = q.getModuleCount(), qx = W - 80 - 170, qy = 1100, cell = 150 / n;
    c.fillStyle = '#fff'; c.fillRect(qx, qy, 170, 170); c.fillStyle = '#000';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) c.fillRect(qx + 10 + x * cell, qy + 10 + y * cell, Math.ceil(cell), Math.ceil(cell));
    text('cyberdeck.eu1z.com', qx + 85, qy + 198, 17, accent, MONO, { sp: .06, align: 'center' });
  }
  c.fillStyle = 'rgba(0,0,0,.07)'; for (let y = 0; y < H; y += 4) c.fillRect(0, y, W, 2);
  return cv;
}

/** Ouvre l'aperçu de la carte avec « Partager » (si le navigateur le permet) et « Télécharger ». */
export async function openShare(toast) {
  const cv = await renderCard();
  const blob = await new Promise(ok => cv.toBlob(ok, 'image/jpeg', .92));
  const file = new File([blob], 'carte-netrunner.jpg', { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  const ov = document.createElement('div'); ov.className = 'overlay';
  const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
  ov.innerHTML = `<div class="sharebox"><div class="mono small" style="color:var(--info)">TA CARTE DE NETRUNNER</div><img alt="Carte de netrunner" src="${url}">
    <div class="row">${canShare ? '<button class="btn main" id="shr">⇪ Partager</button>' : ''}<a class="btn ${canShare ? '' : 'main'}" id="dl" href="${url}" download="carte-netrunner.jpg">⭳ Télécharger le JPEG</a><button class="btn" id="cls">Fermer</button></div>
    <p class="dim small">Ton rang, ta réputation, tes relations, tes exploits et un QR code vers la version web.</p></div>`;
  document.body.appendChild(ov);
  const close = () => { ov.remove(); URL.revokeObjectURL(url); };
  ov.querySelector('#cls').onclick = close;
  ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  const s = ov.querySelector('#shr');
  if (s) s.onclick = async () => { try { await navigator.share({ files: [file], title: 'Ma carte de netrunner', text: `Cyberdeck · ${WEB}` }); } catch { /* annulé */ } };
  ov.querySelector('#dl').addEventListener('click', () => toast('Carte téléchargée'));
}
