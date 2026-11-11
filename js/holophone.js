// Holophone : liste des contacts et holocall, comme dans le launcher.
import * as S from './save.js';
import * as Wd from './world.js';
import { portraitCanvas, drawPortrait, phoneGlyph } from './portrait.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function holophone(view, ctx, callId = null) {
  let timers = [], glitchT = null;
  const clear = () => { timers.forEach(clearTimeout); timers = []; clearInterval(glitchT); };
  ctx.onLeave(clear);

  function list() {
    clear();
    const avail = Wd.available();
    view.innerHTML = `<div class="holo">
      <div class="holohead">${phoneGlyph('#6ff3f0', 34)}<div style="flex:1"><div class="mono small" style="color:rgba(232,80,91,.7)">TRN_HOLO_${String(ctx.level()).padStart(4, '0')}</div>
      <h2 class="glitch" style="color:var(--hcyan)">CONTACTS</h2></div></div><div class="redline"></div>
      <div class="mono small" style="color:var(--amber);margin:8px 0">${avail.filter(id => Wd.gigState(id) === null).length} gig(s) disponible(s) aujourd'hui · ${S.eddies()} €$</div>
      <div class="contacts"></div>
      <p class="dim small">Sur le site, les gigs de mini-jeux (Breach, Déchiffre, Réflexes) se valident en jouant. Les autres se font sur le téléphone. Rappelle ensuite le contact pour être payé·e.</p></div>`;
    const box = view.querySelector('.contacts');
    Wd.CONTACTS.forEach(c => box.appendChild(row(c)));
  }

  function row(c) {
    const gig = Wd.gigFor(c), st = Wd.gigState(c.id), aff = Wd.affinity(c.id), partner = Wd.partner() === c.id;
    let status, col;
    if (gig && st === null) [status, col] = ['● Gig disponible', 'var(--hcyan)'];
    else if (st === 'accepted') [status, col] = [`◐ Gig en cours : ${gig?.desc || ''}`, 'var(--amber)'];
    else if (st === 'done') [status, col] = ['✓ Terminé · rappelle pour être payé', 'var(--green)'];
    else if (st === 'claimed') [status, col] = ['Payé aujourd\'hui', 'var(--dim)'];
    else [status, col] = ['En ligne', 'var(--dim)'];
    const hi = (gig && st === null) || st === 'done';
    const r = document.createElement('button');
    r.className = 'crow' + (hi ? ' hi' : '');
    r.innerHTML = `<span class="pwrap"></span><span class="cmid"><b>${esc(c.name.toUpperCase())}</b><span class="dim">${esc(c.role)}</span><span class="mono small" style="color:${col}">${esc(status)}</span></span>
      <span class="cright"><span style="color:${aff >= 60 ? 'var(--amber)' : 'var(--dim)'}">${Wd.relation(aff, c.romance, partner)}</span>
      <span class="affbar"><i style="width:${aff}%;background:${aff >= 60 ? 'var(--amber)' : 'var(--hred)'}"></i></span>${hi ? '<span class="mono" style="color:var(--hcyan)">☎</span>' : ''}</span>`;
    const pw = r.querySelector('.pwrap'); pw.appendChild(portraitCanvas(c, 56, aff >= 90 || partner));
    if (partner || aff >= 60) pw.insertAdjacentHTML('beforeend', `<em>${partner ? '♥' : '★'}</em>`);
    r.onclick = () => call(c);
    return r;
  }

  function call(c) {
    clear();
    const gig = Wd.gigFor(c), partner = Wd.partner() === c.id;
    let step = 0, connected = false;
    const lines = [];
    view.innerHTML = `<div class="holo">
      <div class="holohead">${phoneGlyph('#6ff3f0', 34)}<div style="flex:1"><div class="mono small" style="color:rgba(232,80,91,.7)">TRN_HOLO_${String(ctx.level()).padStart(4, '0')}</div>
      <h2 class="glitch" style="color:var(--hcyan)">HOLOCALL</h2></div><button class="x" id="back" title="Retour">‹</button></div><div class="redline"></div>
      <div class="callhead"><div class="mono tiny" style="color:var(--hred);line-height:1.1">4846181<br>4150185<br>0001364<br>3361213</div>
        <div><div class="mono small" id="cst" style="color:var(--hred);letter-spacing:.2em">CONNECTING</div><h2 style="color:var(--hcyan)">${esc(c.name.toUpperCase())}</h2></div></div>
      <div class="callinfo"><canvas width="300" height="300" class="bigp"></canvas><div>
        <div class="dim">${esc(c.role)}</div><div class="mono small" id="crel" style="color:var(--amber);margin-top:4px"></div>
        ${gig ? `<div class="small" style="color:var(--hcyan);margin-top:4px">Gig : ${esc(gig.desc)}${Wd.WEB_GIGS.includes(gig.event) ? '' : ' <span class="dim">(sur le téléphone)</span>'}</div>` : ''}
        <div class="mono tiny" style="color:rgba(111,243,240,.7);margin-top:10px">0029 ${String(Math.abs(c.id.length * 7919) % 10000).padStart(4, '0')} 1227 833</div></div></div>
      <div class="calllog"></div><div class="choices"></div></div>`;
    view.querySelector('#back').onclick = list;
    const cv = view.querySelector('.bigp'), g = cv.getContext('2d');
    const rel = () => { const a = Wd.affinity(c.id); view.querySelector('#crel').textContent = `Relation : ${Wd.relation(a, c.romance, partner)} (${a}/100)`; };
    rel();
    glitchT = setInterval(() => { drawPortrait(g, c, 300, 300, Wd.affinity(c.id) >= 90 || partner, !connected); if (!connected) {
      g.strokeStyle = 'rgba(232,80,91,.5)'; g.lineWidth = 1; for (let i = 0; i < 40; i++) { g.beginPath(); g.moveTo(Math.random() * 300, 0); g.lineTo(Math.random() * 300, 300); g.stroke(); } } }, 90);
    const log = view.querySelector('.calllog'), choices = view.querySelector('.choices');
    const tile = (name, me) => `<span class="ctile ${me ? 'me' : ''}"><b>${esc(name.split(' ')[0])}</b><i>CALL</i></span>`;
    const addLine = (fromContact, text) => {
      lines.push(text);
      log.insertAdjacentHTML('beforeend', fromContact ? `<div class="cline">${tile(c.name)}<p style="color:var(--hcyan)">${esc(text)}</p></div>`
        : `<div class="cline me"><p style="color:var(--amber)">${esc(text)}</p>${tile('Toi', true)}</div>`);
      log.scrollTop = log.scrollHeight;
    };
    const say = (me, reply) => { addLine(false, me); addLine(true, reply); };
    const choice = (text, color, fn) => { const b = document.createElement('button'); b.className = 'choice'; b.style.setProperty('--c', color); b.textContent = text; b.onclick = () => { if (fn() !== false) renderChoices(); }; choices.appendChild(b); };
    function renderChoices() {
      choices.innerHTML = ''; rel(); ctx.changed();
      const st = Wd.gigState(c.id);
      if (gig && st === null && step === 0) choice('« Qu\'est-ce que t\'as pour moi ? »', 'var(--hcyan)', () => { say('Qu\'est-ce que t\'as pour moi ?', `${Wd.dayPick(c.offer, 2)} → ${gig.desc} (+${gig.xp} XP)`); step = 1; });
      else if (gig && st === null && step === 1) {
        choice('« J\'accepte. »', 'var(--green)', () => { Wd.setGigState(c.id, 'accepted'); say('J\'accepte.', 'Parfait. Rappelle-moi quand c\'est fait.' + (Wd.WEB_GIGS.includes(gig.event) ? '' : '  [à faire sur le téléphone]')); step = 2; });
        choice('« Pas aujourd\'hui. »', 'var(--hcyan)', () => { Wd.setGigState(c.id, 'declined'); say('Pas aujourd\'hui.', 'Dommage. Une autre fois.'); step = 2; });
      } else if (st === 'accepted' && step === 0) choice('« J\'y travaille. »', 'var(--hcyan)', () => { say('J\'y travaille.', `Je compte sur toi : ${gig?.desc || 'le gig'}.`); step = 2; });
      else if (st === 'done' && step === 0 && gig) choice('« C\'est fait. »', 'var(--green)', () => { const pay = Wd.claimGig(c, gig); say('C\'est fait.', `${Wd.dayPick(c.thanks, 3)}  [${pay}]`); ctx.toast(pay); step = 2; });
      if (step < 3 && !Wd.chattedToday(c.id)) choice('« Je passais juste dire bonjour. »', 'var(--hcyan)', () => {
        Wd.markChat(c.id); Wd.addAffinity(c.id, 3); say('Je passais juste dire bonjour.', `${Wd.dayPick(c.idle, 4)}  [affinité +3]`); step = 3; });
      choice('Raccrocher', 'var(--hred)', () => { list(); return false; });
    }
    timers.push(setTimeout(() => {
      connected = true; view.querySelector('#cst').textContent = 'CONNECTÉ';
      addLine(true, partner ? 'Salut toi… tu m\'as manqué.' : Wd.dayPick(c.hello, 1));
      renderChoices();
    }, 1300));
  }

  if (callId && Wd.contact(callId)) call(Wd.contact(callId)); else list();
}
