// Pages Quêtes et Succès.
import * as S from './save.js';
import * as Q from './quests.js';
import * as Wd from './world.js';
import { portraitCanvas } from './portrait.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/\n/g, '<br>');

export function quetes(view, ctx) {
  const fresh = Q.checkCards(); if (fresh.length) ctx.toast(`${fresh.length} nouvelle(s) carte(s) holo !`);
  const paint = () => {
    const ch = Q.challenges(), ce = Q.cityEvent(), act = Wd.active()[0], st = Q.storyUnlocked();
    const owned = Q.cards().filter(k => Q.cardOwned(k.id)).length;
    view.innerHTML = `<div class="sheethead"><h1 class="glitch" style="color:var(--amber)">QUÊTES</h1><div class="mono dim small">DÉFIS · ÉVÉNEMENTS · RÉCIT · CARTES HOLO</div></div>
    <div class="qgrid">
      <section class="qcard" style="--c:var(--amber)"><h3>DÉFIS DE LA SEMAINE</h3><div class="mono tiny dim">Nouveaux défis chaque lundi · +40 XP et +20 €$ chacun · les 3 : +150 XP et +100 €$</div>
        ${ch.map(c => { const p = Math.min(c.goal, Q.progress(c.id)), done = Q.challengeDone(c), cl = Q.claimed(c.id);
          return `<div class="chal"><div class="cm"><b>${esc(c.text)}</b><i class="pbar"><u style="width:${p / c.goal * 100}%;background:${done ? 'var(--green)' : 'var(--amber)'}"></u></i>
            <span class="mono tiny dim">${p}/${c.goal}</span></div>${cl ? '<span class="mono small" style="color:var(--green)">✓ ENCAISSÉ</span>' : done ? `<button class="claim" data-claim="${c.id}">ENCAISSER</button>` : ''}</div>`; }).join('')}
      </section>
      <section class="qcard" style="--c:${ce ? ce.color : 'var(--dim)'}"><h3>ÉVÉNEMENT DE VILLE</h3>
        ${ce ? `<b style="font-size:22px;color:${ce.color}">${esc(ce.name)}</b><p>${esc(ce.desc)}</p><div class="mono small">${Q.cityEventDone() ? '<span style="color:var(--green)">✓ MISSION RÉUSSIE</span>' : `› ${esc(ce.task)} · +${ce.xp} XP`}</div>
          ${ce.event === 'breach' && !Q.cityEventDone() ? '<button class="btn main" data-go="jeux">Aller au Breach ›</button>' : ce.event !== 'breach' && !Q.cityEventDone() ? '<div class="dim small">Cette mission se fait sur le téléphone.</div>' : ''}`
          : '<p class="dim">Calme plat à NEO-BXL aujourd\'hui. Les événements arrivent environ un jour sur trois.</p>'}
      </section>
      <section class="qcard" style="--c:var(--hcyan)"><h3>EXPÉDITIONS</h3>
        ${act ? `<b>${esc(act.exp.title)}</b><div class="mono small dim">${esc(act.exp.place)} · ${Date.now() >= act.end ? '<span style="color:var(--green)">À ENCAISSER</span>' : Wd.fmtLeft(act.end - Date.now())}</div>` : '<p class="dim">Aucune expédition en cours. Trois contrats t\'attendent aujourd\'hui.</p>'}
        <button class="btn main" data-go="ville" data-arg="exp">Voir les expéditions ›</button>
        <div class="mono tiny dim" style="margin-top:10px">HISTOIRES DE CONTACTS : ${Object.keys(Wd.CHAINS).filter(id => Wd.chainProgress(id) >= Wd.CHAINS[id].length).length}/${Object.keys(Wd.CHAINS).length} terminées</div>
      </section>
    </div>
    <div class="label">RÉCIT · PROJET LÉTHÉ · CHAPITRE ${Math.min(st, Q.CHAPTERS.length)}/${Q.CHAPTERS.length}</div>
    <p class="dim small">Chaque chapitre se déchiffre en accomplissant de vraies actions dans le launcher (et parfois ici).</p>
    <div class="chapters">${Q.CHAPTERS.map(c => { const open = c.id <= st;
      return `<details class="chapter ${open ? 'open' : ''}" ${c.id === st ? 'open' : ''}><summary><span class="mono small">CHAPITRE ${c.id}</span><b>${open ? esc(c.title) : '████████'}</b>
        <span class="mono tiny" style="color:${c.id < st ? 'var(--green)' : open ? 'var(--amber)' : 'var(--dim)'}">${c.id < st ? '✓ ACCOMPLI' : open ? '› ' + esc(c.goal) : '🔒 ' + esc(c.goal)}</span></summary>
        ${open ? `<p>${esc(c.text)}</p>` : '<p class="dim">Chapitre chiffré. Termine le chapitre précédent pour le déverrouiller.</p>'}</details>`; }).join('')}</div>
    <div class="label">CARTES HOLO · ${owned}/${Q.cards().length}</div>
    <p class="dim small">Une carte bronze à 30 d'affinité, argent à 60, or à 90.</p>
    <div class="cards">${Q.cards().map(k => `<div class="hcard t${k.tier} ${Q.cardOwned(k.id) ? 'own' : ''}" data-c="${k.c.id}"><span class="pf"></span><b>${Q.cardOwned(k.id) ? esc(k.c.name) : '???'}</b>
      <span class="mono tiny">${Q.TIER_NAMES[k.tier - 1]}</span>${Q.cardOwned(k.id) ? `<em>« ${esc(Q.quote(k.c, k.tier))} »</em>` : `<em class="dim">affinité ${Q.TIERS[k.tier - 1]}</em>`}</div>`).join('')}</div>`;
    view.querySelectorAll('.hcard').forEach(h => h.querySelector('.pf').appendChild(portraitCanvas(Wd.contact(h.dataset.c), 64, h.classList.contains('t3') && h.classList.contains('own'))));
    view.querySelectorAll('[data-claim]').forEach(b => b.onclick = () => { const m = Q.claim(Q.challenges().find(c => c.id === b.dataset.claim)); if (m) ctx.toast(m); ctx.changed(); paint(); });
    view.querySelectorAll('[data-go]').forEach(b => b.onclick = () => ctx.go(b.dataset.go, b.dataset.arg));
  };
  paint();
}

export function succes(view) {
  const un = S.achievements(), found = Q.SECRETS_LIST.filter(s => Q.secretFound(s.id)).length;
  const hintable = Q.SECRETS_LIST.filter(s => !Q.secretFound(s.id)).slice(0, 3).map(s => s.id);
  view.innerHTML = `<div class="sheethead"><h1 class="glitch" style="color:var(--primary)">SUCCÈS</h1><div class="mono dim small">${un.filter(id => Q.ACHIEVEMENTS.some(a => a.id === id)).length}/${Q.ACHIEVEMENTS.length} DÉBLOQUÉS · ${found}/${Q.SECRETS_LIST.length} SECRETS</div></div>
    <div class="achs">${Q.ACHIEVEMENTS.map(a => { const ok = un.includes(a.id);
      return `<div class="ach ${ok ? 'ok' : ''}"><span class="aic">${ok ? '✦' : '◇'}</span><div><b>${esc(a.title)}</b><span class="dim small">${esc(a.desc)}</span></div></div>`; }).join('')}</div>
    <div class="label">SECRETS · ${found}/${Q.SECRETS_LIST.length}</div>
    <p class="dim small">Des secrets sont cachés dans le deck (sur le téléphone). Chacun rapporte +25 XP ; tous trouvés : +200 €$.</p>
    <div class="achs">${Q.SECRETS_LIST.map((s, i) => { const ok = Q.secretFound(s.id);
      return `<div class="ach secret ${ok ? 'ok' : ''}"><span class="aic">${ok ? '◆' : '◇'}</span><div><b>${ok ? esc(s.title) : 'Secret n°' + (i + 1)}</b>
        <span class="dim small">${ok || hintable.includes(s.id) ? esc(s.hint) : '???'}</span>${ok ? `<em>« ${esc(s.reveal)} »</em>` : ''}</div></div>`; }).join('')}</div>`;
}
