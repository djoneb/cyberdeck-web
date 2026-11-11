// Cyberware (implants à équiper) et marché noir, comme dans le launcher.
import * as S from './save.js';
import * as So from './social.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Palettes exclusives (mêmes couleurs que le launcher) : primaire, secondaire, info
export const PALETTES = { pal_omni: ['#e8173a', '#e9c46a', '#f4f1de'], pal_kuro: ['#5ce1e6', '#ff2bd6', '#b8c0ff'], pal_helix: ['#3ddc97', '#f5f5f5', '#7bdff2'],
  pal_tokyo: ['#b388ff', '#ff7eb6', '#5ce1e6'], pal_blood: ['#ff1f3d', '#ececec', '#ff8a00'] };
export const WEB_THEME_KEY = 'cyberdeck-web-theme';

export function cyberware(view, ctx) {
  const paint = () => {
    const eq = So.equipped(), slots = So.slots(), lv = ctx.level();
    view.innerHTML = `<div class="sheethead"><h1 class="glitch" style="color:#b98cff">CYBERWARE</h1><div class="mono dim small">IMPLANTS · ${eq.length}/${slots} ÉQUIPÉS · NIVEAU ${lv}</div></div>
      <div class="chromebox"><div class="mono small" style="color:var(--primary)">EMPLACEMENTS CYBERWARE // ${eq.length}/${slots}</div>
      <div class="slots">${[0, 1, 2, 3, 4, 5].map(i => { const open = i < slots, c = open && eq[i] ? So.CHROMES.find(x => x.id === eq[i]) : null;
        return `<button class="slot ${c ? 'on' : ''} ${open ? '' : 'locked'}" ${open ? '' : 'data-market'}>${!open ? '🔒 MARCHÉ' : c ? esc(c.name) : '— vide —'}</button>`; }).join('')}</div>
      <div class="chromes">${So.CHROMES.map(c => { const on = eq.includes(c.id), locked = lv < c.level;
        return `<button class="chrome ${on ? 'on' : ''} ${locked ? 'locked' : ''}" data-c="${c.id}"><span class="check">${on ? '✓' : ''}</span>
          <span class="cm"><b>${esc(c.name)}</b><span class="dim small">${esc(c.desc)}</span></span><span class="mono tiny" style="color:${on ? 'var(--primary)' : 'var(--dim)'}">${locked ? '🔒 NIV ' + c.level : on ? 'ÉQUIPÉ' : ''}</span></button>`; }).join('')}</div></div>
      <p class="dim small">Les implants agissent aussi sur le site : gigs payés, Breach, expéditions et rencontres en ville. Effets liés au téléphone (focus) : sur le launcher.</p>`;
    view.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const err = So.toggleChrome(b.dataset.c); if (err) ctx.toast(err); ctx.changed(); paint(); });
    view.querySelectorAll('[data-market]').forEach(b => b.onclick = () => ctx.go('marche'));
  };
  paint();
}

export function market(view, ctx) {
  const paint = () => {
    let webTheme = null; try { webTheme = localStorage.getItem(WEB_THEME_KEY); } catch { /* indisponible */ }
    view.innerHTML = `<div class="sheethead"><h1 class="glitch" style="color:var(--amber)">MARCHÉ NOIR</h1><div class="mono dim small">APPARENCES · FONCTIONS · EMPLACEMENTS</div></div>
      <div class="chromebox"><div style="font-size:30px;font-weight:700;color:var(--info)">${S.eddies()} €$</div>
      <div class="dim small">Gagne des eddies : gigs, expéditions, rencontres en ville, infiltration… et sur le téléphone (missions, focus, contrats).</div>
      ${So.boostActive() ? '<div style="color:var(--secondary)">⚡ Stim XP active : XP doublée</div>' : ''}</div>
      ${[['evolution', 'ÉVOLUTION NEURA'], ['look', 'APPARENCE'], ['fonction', 'FONCTIONS'], ['identite', 'IDENTITÉ'], ['slot', 'EMPLACEMENTS CYBERWARE']].map(([k, label]) => `<div class="label">${label}</div>
        ${So.ITEMS.filter(i => i.kind === k).map(item => {
          const owned = !item.consumable && So.owned(item.id), on = owned && So.itemActive(item.id), lock = !owned && So.lockedReason(item);
          let act;
          if (k === 'identite') act = `<button class="btn ${S.eddies() >= item.price ? 'main' : ''}" data-id-edit="${item.id}">${item.price} €$</button>`;
          else if (owned && (k === 'slot' || k === 'evolution')) act = '<span class="mono small" style="color:var(--info)">INSTALLÉ</span>';
          else if (lock) act = `<span title="${esc(lock)}">🔒</span>`;
          else if (owned && item.id.startsWith('pal_')) act = `<button class="btn ${webTheme === item.id ? 'main' : ''}" data-theme="${item.id}">${webTheme === item.id ? 'SUR LE SITE ✓' : 'APPLIQUER AU SITE'}</button>`;
          else if (owned) act = `<button class="btn ${on ? 'main' : ''}" data-eq="${item.id}">${on ? 'ÉQUIPÉ' : 'ÉQUIPER'}</button>`;
          else act = `<button class="btn ${S.eddies() >= item.price ? 'main' : ''}" data-buy="${item.id}">${item.price} €$</button>`;
          const pal = PALETTES[item.id];
          return `<div class="item ${on ? 'on' : ''}"><div class="im"><b>${esc(item.name)}</b><span class="dim small">${esc(item.desc)}</span>
            ${pal ? `<span class="swatch">${pal.map(c => `<i style="background:${c}"></i>`).join('')}</span>` : ''}</div>${act}</div>`; }).join('')}`).join('')}
      <p class="dim small">Les palettes et sons s'appliquent sur le téléphone (Réglages › Couleurs, Sons). Sur le site, une palette achetée peut colorer l'interface.</p>`;
    view.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
      const item = So.ITEMS.find(i => i.id === b.dataset.buy), err = So.buy(item);
      ctx.toast(err || `Transaction validée : ${item.name}`); ctx.changed(); paint();
    });
    view.querySelectorAll('[data-id-edit]').forEach(b => b.onclick = () => identity(b.dataset.idEdit));
    view.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { So.setEquipped(b.dataset.eq, !So.itemActive(b.dataset.eq)); paint(); });
    view.querySelectorAll('[data-theme]').forEach(b => b.onclick = () => {
      try { if (localStorage.getItem(WEB_THEME_KEY) === b.dataset.theme) localStorage.removeItem(WEB_THEME_KEY); else localStorage.setItem(WEB_THEME_KEY, b.dataset.theme); } catch { /* indisponible */ }
      ctx.applyTheme(); paint();
    });
  };
  // Fenêtre de choix : nouveau nom ou nouveau genre, payé à la validation
  const identity = (id) => {
    const item = So.ITEMS.find(i => i.id === id);
    if (S.eddies() < item.price) { ctx.toast(`Pas assez d'eddies (${S.eddies()} €$)`); return; }
    let gender = S.pronoun();
    const ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = `<div class="encounter" style="--c:var(--amber)"><div class="mono small" style="color:var(--amber)">${esc(item.name.toUpperCase())}</div><p>${esc(item.desc)}</p>
      ${id === 'id_name' ? `<input id="idname" class="idinput" maxlength="24" value="${esc(S.name())}" aria-label="Nouveau nom">`
        : [['il', '♂ IL'], ['elle', '♀ ELLE'], ['android', '⌬ ANDROÏDE']].map(([k, l]) => `<button class="echoice" data-g="${k}" aria-pressed="${k === gender}"><b>${l}${S.pronoun() === k ? '  (actuel)' : ''}</b></button>`).join('')}
      <button class="btn main" id="idok">Payer ${item.price} €$ et valider</button><button class="btn" id="idno">Annuler</button>
      <div class="dim small">Solde : ${S.eddies()} €$ · achetable autant de fois que tu veux.</div></div>`;
    document.body.appendChild(ov);
    ov.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { gender = b.dataset.g; ov.querySelectorAll('[data-g]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    ov.querySelector('#idno').onclick = () => ov.remove();
    ov.querySelector('#idok').onclick = () => {
      const err = So.buyIdentity(id, id === 'id_name' ? ov.querySelector('#idname').value : gender);
      if (err) { ctx.toast(err); return; }
      ov.remove(); ctx.toast(id === 'id_name' ? 'Nouvelle identité enregistrée' : 'Identité reconfigurée'); ctx.changed(); paint();
    };
  };
  paint();
}
