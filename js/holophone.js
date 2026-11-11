// Holophone : contacts, messages, conversations, holocall, romance et piratage de dossiers, comme dans le launcher.
import * as S from './save.js';
import * as Wd from './world.js';
import * as So from './social.js';
import { portraitCanvas, drawPortrait, phoneGlyph } from './portrait.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };

export function holophone(view, ctx, callId = null) {
  let timers = [], glitchT = null, tab = callId === 'sms' ? 'sms' : 'contacts';
  const clear = () => { timers.forEach(clearTimeout); timers = []; clearInterval(glitchT); };
  ctx.onLeave(clear);
  const head = (title, back) => `<div class="holohead">${phoneGlyph('#6ff3f0', 34)}<div style="flex:1"><div class="mono small" style="color:rgba(232,80,91,.7)">TRN_HOLO_${String(ctx.level()).padStart(4, '0')}</div>
    <h2 class="glitch" style="color:var(--hcyan)">${title}</h2></div>${back ? '<button class="x" id="back" title="Retour">‹</button>' : ''}</div><div class="redline"></div>`;

  // ─────────────── Liste : contacts ou messages
  function list() {
    clear();
    const avail = Wd.available(), unread = So.unreadCount();
    view.innerHTML = `<div class="holo">${head('CONTACTS')}
      <div class="row" style="margin-top:8px"><button class="btn ${tab === 'contacts' ? 'main' : ''}" data-tab="contacts">CONTACTS</button>
      <button class="btn ${tab === 'sms' ? 'main' : ''}" data-tab="sms">MESSAGES${unread ? ` (${unread})` : ''}</button></div>
      <div class="mono small" style="color:var(--amber);margin:4px 0 8px">${avail.filter(id => Wd.gigState(id) === null).length} gig(s) disponible(s) aujourd'hui · ${S.eddies()} €$</div>
      ${dateBanner()}<div class="contacts"></div>
      <p class="dim small">Sur le site, les gigs de mini-jeux (Breach, Déchiffre, Réflexes) se valident en jouant. Les autres se font sur le téléphone. Rappelle ensuite le contact pour être payé·e.</p></div>`;
    view.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; list(); });
    const box = view.querySelector('.contacts');
    if (tab === 'sms') { box.classList.add('one'); inbox(box); } else Wd.CONTACTS.forEach(c => box.appendChild(row(c)));
    const cd = view.querySelector('#cancelDate'); if (cd) cd.onclick = () => { So.cancelDate(); ctx.toast('Rendez-vous annulé'); list(); };
  }
  function dateBanner() {
    const id = So.dateWith(); if (!id) return '';
    const c = Wd.contact(id), p = So.datePlace();
    return `<div class="datebar">♥ Rendez-vous avec ${esc(c.name)} · ${esc(p?.name || '')} · fin dans ${Wd.fmtLeft(So.dateUntil() - Date.now())} <button class="go" id="cancelDate">ANNULER</button></div>`;
  }

  function row(c) {
    const gig = Wd.gigFor(c), st = Wd.gigState(c.id), aff = Wd.affinity(c.id), partner = So.partner() === c.id;
    const convoWaiting = So.convoPending()?.contactId === c.id;
    let status, col;
    if (convoWaiting) [status, col] = ['✉ Message en attente de réponse', 'var(--hcyan)'];
    else if (gig && st === null) [status, col] = ['● Gig disponible', 'var(--hcyan)'];
    else if (st === 'accepted') [status, col] = [`◐ Gig en cours : ${gig?.desc || ''}`, 'var(--amber)'];
    else if (st === 'done') [status, col] = ['✓ Terminé · rappelle pour être payé', 'var(--green)'];
    else if (st === 'claimed') [status, col] = ['Payé aujourd\'hui', 'var(--dim)'];
    else [status, col] = ['En ligne', 'var(--dim)'];
    const hi = (gig && st === null) || st === 'done' || convoWaiting;
    const r = document.createElement('button');
    r.className = 'crow' + (hi ? ' hi' : '');
    r.innerHTML = `<span class="pwrap"></span><span class="cmid"><b>${esc(c.name.toUpperCase())}</b><span class="dim">${esc(c.role)}</span><span class="mono small" style="color:${col}">${esc(status)}</span></span>
      <span class="cright"><span style="color:${aff >= 60 ? 'var(--amber)' : 'var(--dim)'}">${Wd.relation(aff, c.romance, partner)}</span>
      <span class="affbar"><i style="width:${aff}%;background:${aff >= 60 ? 'var(--amber)' : 'var(--hred)'}"></i></span>${hi ? '<span class="mono" style="color:var(--hcyan)">☎</span>' : ''}</span>`;
    const pw = r.querySelector('.pwrap'); pw.appendChild(portraitCanvas(c, 76, aff >= 90 || partner));
    if (partner || aff >= 60) pw.insertAdjacentHTML('beforeend', `<em>${partner ? '♥' : '★'}</em>`);
    r.onclick = () => call(c);
    return r;
  }

  // ─────────────── Boîte de réception
  function inbox(box) {
    const convo = So.convoPending();
    const msgs = So.smsReceived().slice().reverse().filter(m => So.smsReplied(m.key) < 0);
    if (convo) box.appendChild(convoCard(convo, list));
    if (!msgs.length && !convo) box.insertAdjacentHTML('beforeend', '<p class="dim">Aucun nouveau message. Tes contacts écrivent plusieurs fois par jour (vers 9 h, 13 h et 19 h).</p>');
    msgs.forEach(m => {
      const c = Wd.contact(m.contactId);
      const r = el(`<button class="crow sms ${S.get('cyberdeck_b6', 'sms_' + m.key, false) ? '' : 'hi'}"><span class="pwrap"></span><span class="cmid">
        <span class="smstop"><b>${esc(c.name.toUpperCase())}</b><span class="mono tiny dim">${String(m.hour).padStart(2, '0')}:00</span></span>
        <span class="smstext">${esc(m.text)}</span><span class="mono tiny" style="color:var(--hcyan);align-self:flex-end">RÉPONDRE ›</span></span></button>`);
      r.querySelector('.pwrap').appendChild(portraitCanvas(c, 56));
      r.onclick = () => call(c);
      box.appendChild(r);
    });
    timers.push(setTimeout(() => msgs.forEach(m => So.markRead(m.key)), 1500));
  }

  function convoCard(cv, after) {
    const ct = Wd.contact(cv.contactId), ans = So.convoAnswered(cv.id);
    const card = el(`<div class="convo ${ans < 0 ? 'wait' : ''}"><div class="chead"><span class="pf"></span><div><b>${esc(ct.name.toUpperCase())}</b>
      <div class="mono tiny" style="color:${ans < 0 ? 'var(--hcyan)' : 'var(--dim)'}">${ans < 0 ? '✉ ATTEND TA RÉPONSE' : '✓ CONVERSATION TERMINÉE'}</div></div></div>
      <div class="bubble">${esc(cv.text)}</div><div class="cbody"></div></div>`);
    card.querySelector('.pf').appendChild(portraitCanvas(ct, 40));
    const body = card.querySelector('.cbody');
    if (ans < 0) cv.choices.forEach((ch, i) => {
      const b = el(`<button class="choice" style="--c:var(--hcyan)">› ${esc(ch.me)}</button>`);
      b.onclick = () => { So.answerConvo(cv, i); ctx.changed(); after(); }; body.appendChild(b);
    });
    else { const ch = cv.choices[ans];
      body.innerHTML = `<div class="bubble me">${esc(ch.me)}</div><div class="bubble">${esc(ch.reply)}</div>
        <div class="mono small" style="color:${ch.aff >= 0 ? 'var(--green)' : 'var(--red)'}">+${ch.xp} XP · affinité ${ch.aff >= 0 ? '+' : ''}${ch.aff}</div>`; }
    return card;
  }

  function smsThread(c, m, after) {
    const ans = So.smsReplied(m.key); So.markRead(m.key);
    const t = el(`<div class="smsthread"><div class="mono tiny dim">SMS · ${String(m.hour).padStart(2, '0')}:00</div><div class="bubble">${esc(m.text)}</div><div class="sbody"></div></div>`);
    const body = t.querySelector('.sbody');
    if (ans < 0) So.SMS_QUICK.forEach((q, i) => { const b = el(`<button class="choice" style="--c:var(--hcyan)">› ${esc(q)}</button>`);
      b.onclick = () => { const r = So.replySms(m, i); if (r) ctx.toast(r); ctx.changed(); after(); }; body.appendChild(b); });
    else body.innerHTML = `<div class="bubble me">${esc(So.SMS_QUICK[ans] || '')}</div><div class="bubble">${esc(So.smsBack(m))}</div>`;
    return t;
  }

  // ─────────────── Holocall
  function call(c) {
    clear();
    const gig = Wd.gigFor(c);
    let step = 0, connected = false;
    view.innerHTML = `<div class="holo">${head('HOLOCALL', true)}
      <div class="callhead"><div class="mono tiny" style="color:var(--hred);line-height:1.1">4846181<br>4150185<br>0001364<br>3361213</div>
        <div><div class="mono small" id="cst" style="color:var(--hred);letter-spacing:.2em">CONNECTING</div><h2 style="color:var(--hcyan)">${esc(c.name.toUpperCase())}</h2></div></div>
      <div class="callinfo"><canvas width="440" height="440" class="bigp"></canvas><div id="cinfo"></div></div>
      <div class="calllog"><div id="extra"></div></div><div class="choices"></div></div>`;
    view.querySelector('#back').onclick = list;
    const isPartner = () => So.partner() === c.id;
    const info = () => {
      const a = Wd.affinity(c.id), b = So.bond(c.id);
      view.querySelector('#cinfo').innerHTML = `<div class="dim">${esc(c.role)}</div>
        <div class="mono small" style="color:var(--amber);margin-top:4px">Relation : ${Wd.relation(a, c.romance, isPartner())} (${a}/100)</div>
        ${gig ? `<div class="small" style="color:var(--hcyan);margin-top:4px">Gig : ${esc(gig.desc)}${Wd.WEB_GIGS.includes(gig.event) ? '' : ' <span class="dim">(sur le téléphone)</span>'}</div>` : ''}
        ${isPartner() ? `<div class="mono small" style="color:var(--amber);margin-top:4px">♥ Lien niv ${So.bondLevel(b)} · ${esc(So.bondTitle(b))}</div><i class="pbar" style="background:rgba(246,179,92,.2)"><u style="width:${So.bondProgress(b) * 100}%;background:var(--amber)"></u></i>` : ''}
        ${So.hackUnlocked(c.id) ? `<button class="linkbtn mono small" id="dossier">🔓 Dossier piraté</button>` : ''}
        <div class="mono tiny" style="color:rgba(111,243,240,.7);margin-top:10px">0029 ${String(Math.abs(c.id.length * 7919) % 10000).padStart(4, '0')} 1227 833</div>`;
      const d = view.querySelector('#dossier'); if (d) d.onclick = () => ctx.popup(`DOSSIER · ${c.name.toUpperCase()}`, So.SECRETS[c.id]);
    };
    info();
    const cv = view.querySelector('.bigp'), g = cv.getContext('2d');
    glitchT = setInterval(() => { drawPortrait(g, c, 440, 440, Wd.affinity(c.id) >= 90 || isPartner(), !connected); if (!connected) {
      g.strokeStyle = 'rgba(232,80,91,.5)'; g.lineWidth = 1; for (let i = 0; i < 40; i++) { g.beginPath(); g.moveTo(Math.random() * 440, 0); g.lineTo(Math.random() * 440, 440); g.stroke(); } } }, 90);
    const log = view.querySelector('.calllog'), choices = view.querySelector('.choices'), extra = view.querySelector('#extra');
    const paintExtra = () => {
      extra.innerHTML = '';
      const cvd = So.convoReceived(); if (cvd && cvd.contactId === c.id) extra.appendChild(convoCard(cvd, () => { paintExtra(); renderChoices(); }));
      So.smsForContact(c.id).forEach(m => extra.appendChild(smsThread(c, m, () => { paintExtra(); renderChoices(); })));
    };
    paintExtra();
    const tile = (name, me) => `<span class="ctile ${me ? 'me' : ''}"><b>${esc(name.split(' ')[0])}</b><i>CALL</i></span>`;
    const addLine = (fromContact, text) => {
      log.insertAdjacentHTML('beforeend', fromContact ? `<div class="cline">${tile(c.name)}<p style="color:var(--hcyan)">${esc(text)}</p></div>`
        : `<div class="cline me"><p style="color:var(--amber)">${esc(text)}</p>${tile('Toi', true)}</div>`);
      log.scrollTop = log.scrollHeight;
    };
    const say = (me, reply) => { addLine(false, me); addLine(true, reply); };
    const choice = (text, color, fn) => { const b = document.createElement('button'); b.className = 'choice'; b.style.setProperty('--c', color); b.textContent = text;
      b.onclick = () => { if (fn() !== false) renderChoices(); }; choices.appendChild(b); };
    function renderChoices() {
      choices.innerHTML = ''; info(); ctx.changed();
      const st = Wd.gigState(c.id), a = Wd.affinity(c.id), lv = ctx.level();
      if (gig && st === null && step === 0) choice('« Qu\'est-ce que t\'as pour moi ? »', 'var(--hcyan)', () => { say('Qu\'est-ce que t\'as pour moi ?', `${Wd.dayPick(c.offer, 2)} → ${gig.desc} (+${gig.xp} XP)`); step = 1; });
      else if (gig && st === null && step === 1) {
        choice('« J\'accepte. »', 'var(--green)', () => { Wd.setGigState(c.id, 'accepted'); say('J\'accepte.', 'Parfait. Rappelle-moi quand c\'est fait.' + (Wd.WEB_GIGS.includes(gig.event) ? '' : '  [à faire sur le téléphone]')); step = 2; });
        choice('« Pas aujourd\'hui. »', 'var(--hcyan)', () => { Wd.setGigState(c.id, 'declined'); say('Pas aujourd\'hui.', 'Dommage. Une autre fois.'); step = 2; });
      } else if (st === 'accepted' && step === 0) choice('« J\'y travaille. »', 'var(--hcyan)', () => { say('J\'y travaille.', `Je compte sur toi : ${gig?.desc || 'le gig'}.`); step = 2; });
      else if (st === 'done' && step === 0 && gig) choice('« C\'est fait. »', 'var(--green)', () => { const pay = Wd.claimGig(c, gig); say('C\'est fait.', `${Wd.dayPick(c.thanks, 3)}  [${pay}]`); ctx.toast(pay); step = 2; });
      if (step < 3 && !Wd.chattedToday(c.id)) choice('« Je passais juste dire bonjour. »', 'var(--hcyan)', () => {
        Wd.markChat(c.id); Wd.addAffinity(c.id, 3); say('Je passais juste dire bonjour.', `${Wd.dayPick(c.idle, 4)}  [affinité +3]`); step = 3; });
      // ── Romance : flirt (niv 5, affinité 60), couple (niv 6, affinité 75), rendez-vous, cadeaux
      if (c.romance && !So.partner() && a >= 60 && lv >= 5 && !So.flirted(c.id)) choice('« Tu sais que tu me plais ? » ♥', 'var(--amber)', () => say('Tu sais que tu me plais ?', So.flirt(c.id)));
      if (c.romance && a >= 75 && lv >= 6 && !So.partner()) choice('« Et si on se voyait plus souvent, toi et moi ? » ♥', 'var(--amber)', () => {
        So.becomeCouple(c.id); say('Et si on se voyait plus souvent, toi et moi ?', '… J\'attendais que tu le dises. Oui. Mille fois oui.  [♥ En couple · +50 XP]'); });
      if (c.romance && !So.partner() && (a < 60 || lv < 5)) choices.insertAdjacentHTML('beforeend', `<div class="dim small">♥ Romance possible avec ${esc(c.name.split(' ')[0])} : affinité 60 et niveau 5 (actuellement ${a}/60 · niveau ${lv}).</div>`);
      if (isPartner()) {
        const gift = So.giftToday(c.id);
        if (gift && !So.giftClaimed()) choice('🎁 Ouvrir son cadeau', 'var(--amber)', () => { const r = So.claimGift(c); if (r) { say('Un cadeau, pour moi ?', `Je l'ai vu et j'ai pensé à toi. Ne dis rien, souris.  [${r.gift.name}]`); ctx.toast(r.msg); } });
        if (So.dateWith() === c.id) choice('♥ Rendez-vous en cours… (annuler)', 'var(--hred)', () => { So.cancelDate(); });
        else if (So.datedToday(c.id)) choices.insertAdjacentHTML('beforeend', '<div class="dim small">♥ Vous vous êtes déjà vus aujourd\'hui.</div>');
        else if (step === 10) So.DATE_PLACES.forEach(pl => choice(`📍 ${pl.name} · ${pl.minutes} min · +${pl.xp} XP`, 'var(--amber)', () => {
          const err = So.startDate(c.id, pl); if (err) { ctx.toast(err); return; }
          say(`On se retrouve : ${pl.name} ?`, `J'y serai. ${pl.desc}… J'ai hâte.`); ctx.toast(`♥ Rendez-vous avec ${c.name} : ${pl.name} (${pl.minutes} min)`); step = 3; }));
        else if (!So.dateWith()) choice('♥ Proposer un rendez-vous', 'var(--amber)', () => { step = 10; });
      }
      if (!So.hackUnlocked(c.id) && So.hackTriesLeft(c.id) > 0) choice(`◈ Pirater son dossier (${So.hackTriesLeft(c.id)} essai(s))`, 'var(--amber)', () => { hack(c, renderChoices); return false; });
      choice('Raccrocher', 'var(--hred)', () => { list(); return false; });
    }
    timers.push(setTimeout(() => {
      connected = true; view.querySelector('#cst').textContent = 'CONNECTÉ';
      addLine(true, isPartner() ? 'Salut toi… tu m\'as manqué.' : Wd.dayPick(c.hello, 1));
      renderChoices();
    }, 1300));
  }

  // ─────────────── Piratage du dossier : séquence de 4 cases en 20 s
  function hack(c, after) {
    const codes = ['1C', '55', 'BD', 'E9', '7A', 'FF', '3F', 'C4'];
    const grid = [...Array(16)].map(() => codes[Math.floor(Math.random() * 8)]);
    const target = [...Array(16).keys()].sort(() => Math.random() - 0.5).slice(0, 4);
    let step = 0, result = null; const t0 = Date.now();
    const ov = el(`<div class="overlay game"><div class="ovin"><div class="ovhead"><div><div class="mono small" style="color:var(--hred)">INTRUSION // DOSSIER ${esc(c.name.toUpperCase())}</div>
      <h2 class="glitch" style="color:var(--hcyan)">PIRATAGE</h2></div><button class="x">✕</button></div>
      <p class="dim hint">Clique les cases dans l'ordre de la séquence avant la fin du chrono. Une erreur, et la glace se referme.</p>
      <div class="hseq"></div><div class="hgrid"></div><div class="hres"></div></div></div>`);
    document.body.appendChild(ov); document.body.classList.add('noscroll');
    let tk;
    const close = () => { clearInterval(tk); ov.remove(); document.body.classList.remove('noscroll'); document.removeEventListener('keydown', esc2); ctx.changed(); after(); };
    const esc2 = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc2);
    ov.querySelector('.x').onclick = close;
    const finish = (ok) => {
      result = ok; So.finishHack(c.id, ok); paint();
      ov.querySelector('.hres').innerHTML = (ok ? `<div class="mono" style="color:#3dff8e">> DOSSIER DÉCHIFFRÉ · +30 XP · affinité +5</div><p style="font-size:17px">${esc(So.SECRETS[c.id] || '')}</p>`
        : `<div class="mono" style="color:var(--hred)">> ÉCHEC // glace refermée · essais restants aujourd'hui : ${Math.max(0, So.hackTriesLeft(c.id))}</div>`) + '<button class="btn">Fermer</button>';
      ov.querySelector('.hres button').onclick = close;
    };
    const paint = () => {
      const left = Math.max(0, 20 - Math.floor((Date.now() - t0) / 1000));
      ov.querySelector('.hseq').innerHTML = `<span class="mono" style="color:var(--amber)">SÉQUENCE :</span>${target.map((idx, i) => `<span class="mono" style="color:${i < step ? '#3dff8e' : i === step ? 'var(--hcyan)' : 'var(--dim)'}">${grid[idx]}#${idx + 1}</span>`).join('')}
        <span class="mono" style="margin-left:auto;color:${left <= 5 ? 'var(--hred)' : 'var(--hcyan)'};font-size:18px">${left} s</span>`;
      ov.querySelector('.hgrid').innerHTML = grid.map((v, i) => `<button data-i="${i}" class="${target.slice(0, step).includes(i) ? 'ok' : ''}"><b>${v}</b><span>#${i + 1}</span></button>`).join('');
      ov.querySelectorAll('.hgrid button').forEach(b => b.onclick = () => {
        if (result !== null) return;
        if (+b.dataset.i === target[step]) { step++; if (step === target.length) finish(true); else paint(); } else finish(false);
      });
    };
    tk = setInterval(() => { if (result !== null) return; if (Date.now() - t0 >= 20000) finish(false); else { const s = ov.querySelector('.hseq span:last-child'); if (s) s.textContent = Math.max(0, 20 - Math.floor((Date.now() - t0) / 1000)) + ' s'; } }, 250);
    paint();
  }

  if (callId && callId !== 'sms' && Wd.contact(callId)) call(Wd.contact(callId)); else list();
}
