// Collection de cartes holo sur le site : même moteur que le launcher (js/holocards.js), même sauvegarde.
import * as S from './save.js';
const B7 = 'cyberdeck_b7';
const H = () => window.HoloCards;
const got = () => new Set(S.get(B7, 'hc_got', []) || []);
let busy = false, lastFresh = new Set();

/** Ajoute les cartes méritées à la collection, verse les récompenses et les révèle une par une. */
export function checkCards(ctx) {
  if (busy || !S.hasSave() || !H()) return [];
  const have = got(), fresh = H().pending((f, k, d) => S.get(f, k, d), have);
  if (!fresh.length) return [];
  busy = true;
  fresh.forEach(c => { have.add(c.id); if (c.reward.xp) S.addXp(c.reward.xp); if (c.reward.ed) S.addEddies(c.reward.ed); });
  S.setSet(B7, 'hc_got', [...have]); S.persist();
  lastFresh = new Set(fresh.map(c => c.id));
  H().reveal(fresh.map(c => c.id), () => { busy = false; ctx.changed(); if (location.hash === '#cartes') ctx.go('cartes'); });
  return fresh;
}

export function cartes(view, ctx) {
  if (!H()) { view.innerHTML = '<p class="notice">La collection n\'a pas pu se charger. Recharge la page.</p>'; return; }
  checkCards(ctx);
  H().gallery(view, { got: got(), fresh: lastFresh });
}
export const cardCount = () => got().size;
export const cardTotal = () => H()?.CARDS.length || 0;
