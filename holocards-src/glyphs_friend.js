// Illustrations des 60 cartes d'amitié (une par carte)
Object.assign(G, {
  // Vasko
  f_vasko_1: `<path ${S} d="M12 58l14-14 12 4 10-8 12 10 10-2 18 14"/><path ${S} d="M38 48l14 14 M48 40l16 16 M30 62l10 10 M44 66l6 6"/>`,
  f_vasko_2: `<path ${S} d="M10 76h80 M18 76V64h64v12"/><path ${S} d="M40 30h20l-4 26h-12Z M50 56v8"/><path ${S} d="M64 36h12v20H64" opacity=".7"/><circle cx="70" cy="30" r="3" fill="currentColor"/>`,
  f_vasko_3: `<path ${S} d="M16 22h68v42H46L30 80V64H16Z"/><path ${S} d="M54 32q-4-4-10-2t-4 6 10 4 4 8-10 2 M50 28v28"/>`,
  f_vasko_4: `<path ${S} d="M14 26h20v14h14v14h14v14h20v10"/><path ${S} d="M14 86h72" opacity=".5"/><path ${S} d="M70 30l10 10-10 10" opacity=".8"/>`,
  f_vasko_5: `<path ${S} d="M16 48 50 20l34 28 M24 42v42h52V42"/><path ${S} d="M50 72 40 62q-5-6 0-10t10 2q5-6 10-2t0 10Z"/>`,
  // Mira
  f_mira_1: `<path ${S} d="M20 80V66 M36 80V54 M52 80V40 M68 80V26 M84 80V14"/><circle cx="20" cy="88" r="2" fill="currentColor"/>`,
  f_mira_2: `<circle ${S} cx="42" cy="42" r="22"/><path ${S} d="M58 58 84 84"/><path ${S} d="M32 36h6 M42 36h12 M30 46h14 M48 46h6" opacity=".8"/>`,
  f_mira_3: `<path ${S} d="M60 14a30 30 0 1 0 26 44 24 24 0 0 1-26-44Z"/><path ${S} d="M24 22l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z M30 64l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"/>`,
  f_mira_4: `<rect ${S} x="16" y="24" width="68" height="50" rx="4"/><path ${S} d="M40 88h20 M50 74v14"/><text x="50" y="56" text-anchor="middle" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="18">03:00</text>`,
  f_mira_5: `<path ${S} d="M50 28v50"/><path ${S} d="M50 36L18 22l6 30 26-4 M50 36l32-14-6 30-26-4 M50 52L28 74l22-6 M50 52l22 22-22-6"/><path ${S} d="M34 32h6 M60 32h6 M30 42h8 M62 42h8" opacity=".6"/>`,
  // Ferrant
  f_ferrant_1: `<path ${S} d="M28 16v22q0 18 16 18t16-18V16 M44 56v12q0 16 16 16t14-14V54"/><circle ${S} cx="74" cy="46" r="8"/><path ${S} d="M22 16h12 M54 16h12"/>`,
  f_ferrant_2: `<rect ${S} x="24" y="18" width="52" height="70" rx="4"/><path ${S} d="M40 14h20v10H40Z"/><path ${S} d="M46 40h8v8h8v8h-8v8h-8v-8h-8v-8h8Z"/><path ${S} d="M34 76h32" opacity=".6"/>`,
  f_ferrant_3: `<path ${S} d="M8 52h20l6-14 10 30 8-38 8 28 6-6h26"/><rect ${S} x="8" y="18" width="84" height="64" rx="6" opacity=".45"/>`,
  f_ferrant_4: `<path ${S} d="M16 34h68v44H16Z M16 50h68"/><path ${S} d="M44 42h12"/><rect ${S} x="26" y="58" width="12" height="10"/><rect ${S} x="44" y="58" width="12" height="10"/><rect ${S} x="62" y="58" width="12" height="10"/><path ${S} d="M30 58v-3 M48 58v-3 M66 58v-3" opacity=".7"/>`,
  f_ferrant_5: `<path ${S} d="M50 84 20 54q-14-16 0-30t30 6q16-20 30-6t0 30Z"/><path ${S} d="M36 44l28 16 M64 44 36 60" opacity=".8"/>`,
  // Lou
  f_lou_1: `<path ${S} d="M14 32h72v12q-8 0-8 8t8 8v12H14V60q8 0 8-8t-8-8Z"/><path ${S} d="M38 32v40" stroke-dasharray="4 4"/><path ${S} d="M52 46h22 M52 56h16"/>`,
  f_lou_2: `<rect ${S} x="10" y="34" width="80" height="40" rx="4"/><circle ${S} cx="32" cy="54" r="12"/><circle ${S} cx="68" cy="54" r="12"/><path ${S} d="M46 42v24 M54 42v24"/><circle cx="32" cy="54" r="2.5" fill="currentColor"/><circle cx="68" cy="54" r="2.5" fill="currentColor"/>`,
  f_lou_3: `<path ${S} d="M14 50v0 M22 40v20 M30 28v44 M38 36v28 M46 18v64 M54 30v40 M62 22v56 M70 38v24 M78 30v40 M86 46v8"/>`,
  f_lou_4: `<path ${S} d="M20 62v-12a30 30 0 0 1 60 0v12"/><rect ${S} x="14" y="58" width="14" height="24" rx="4"/><rect ${S} x="72" y="58" width="14" height="24" rx="4"/><path ${S} d="M36 70q6-6 14 0t14 0" opacity=".7"/>`,
  f_lou_5: `<path ${S} d="M14 50q16-20 26-12 10-8 10 0 0-8 10 0 10-8 26 12-18 22-36 22T14 50Z"/><path ${S} d="M14 50q36 8 72 0"/><path ${S} d="M80 22l4-6 M86 30l7-2" opacity=".7"/>`,
  // Okoro
  f_okoro_1: `<path ${S} d="M14 62q36 10 72 0"/><path ${S} d="M26 60q0-30 24-30t24 30"/><path ${S} d="M32 50h36" opacity=".8"/><path ${S} d="M40 76q10 8 20 0" opacity=".6"/>`,
  f_okoro_2: `<path ${S} d="M34 70V44a16 16 0 0 1 32 0v26Z M26 70h48v10H26Z"/><path ${S} d="M50 20v-8 M28 30l-6-6 M72 30l6-6 M16 50h-6 M84 50h6"/>`,
  f_okoro_3: `<rect ${S} x="16" y="18" width="68" height="64" rx="2"/><rect ${S} x="24" y="26" width="52" height="40"/><circle ${S} cx="50" cy="42" r="8"/><path ${S} d="M36 66q2-12 14-12t14 12"/><path ${S} d="M30 74h40" opacity=".6"/>`,
  f_okoro_4: `<path ${S} d="M14 58h72 M18 46h64 M22 58v20 M78 58v20 M18 46v-6 M82 46v-6"/><path ${S} d="M40 78l10-6 10 6" opacity=".6"/><circle cx="66" cy="34" r="3" fill="currentColor"/>`,
  f_okoro_5: `<path ${S} d="M50 20q-22 0-26 18-12 4-10 18t16 14q4 12 20 10 16 2 20-10 14 0 16-14t-10-18q-4-18-26-18Z"/><path ${S} d="M50 20v60 M36 36q8 6 0 14 M64 36q-8 6 0 14" opacity=".8"/>`,
  // La Veuve
  f_veuve_1: `<path ${S} d="M50 42q-16-2-14-16 14-4 16 8 4-14 18-8 0 14-20 16"/><path ${S} d="M50 42v44"/><path ${S} d="M50 54l-6-4 M50 64l7-4 M50 74l-6-4"/>`,
  f_veuve_2: `<path ${S} d="M28 20l6 40 M50 14v46 M72 20l-6 40"/><path ${S} d="M22 60h24 M38 60h24 M54 60h24"/><path ${S} d="M34 60v20 M50 60v26 M66 60v20"/>`,
  f_veuve_3: `<circle ${S} cx="36" cy="32" r="9"/><circle ${S} cx="58" cy="28" r="9"/><circle ${S} cx="68" cy="46" r="9"/><circle ${S} cx="44" cy="50" r="9"/><path ${S} d="M48 58 50 86 M40 60l10 26 M60 52 50 86"/><path ${S} d="M36 76h28" opacity=".6"/>`,
  f_veuve_4: `<rect ${S} x="28" y="14" width="44" height="74" rx="2"/><path ${S} d="M28 30h44"/><circle cx="62" cy="54" r="3.5" fill="currentColor"/><path ${S} d="M36 22h28" opacity=".6"/><path ${S} d="M18 88h64" opacity=".5"/>`,
  f_veuve_5: `<circle ${S} cx="50" cy="60" r="20"/><path ${S} d="M40 38l10-14 10 14-10 8Z"/><path ${S} d="M42 30h16" opacity=".7"/>`,
  // Kenji
  f_kenji_1: `<path ${S} d="M22 62a32 32 0 0 1 40-40"/><path ${S} d="M28 58 52 34"/><path ${S} d="M40 72l-8 16h24l-8-16"/><path ${S} d="M64 24q10 2 12 12 M68 14q18 4 20 20" opacity=".7"/>`,
  f_kenji_2: `<rect ${S} x="28" y="12" width="44" height="76" rx="3"/><text x="50" y="38" text-anchor="middle" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="18">90</text><path ${S} d="M42 54l8-8 8 8 M42 64l8 8 8-8"/><circle ${S} cx="50" cy="80" r="3"/>`,
  f_kenji_3: `<path ${S} d="M16 50Q50 18 84 50Q50 82 16 50Z"/><circle ${S} cx="50" cy="50" r="10"/><path ${S} d="M20 78h60" stroke-dasharray="2 6"/><path ${S} d="M20 20l60 60" opacity=".4"/>`,
  f_kenji_4: `<path ${S} d="M40 14h20l-4 12h-12Z M44 26l-8 52 14 10 14-10-8-52"/><path ${S} d="M26 14l14 6 M74 14l-14 6"/>`,
  f_kenji_5: `<path ${S} d="M24 30h52 M40 30v-8h20v8 M30 30l4 56h32l4-56"/><path ${S} d="M42 42v34 M58 42v34"/>`,
  // Rook
  f_rook_1: `<circle ${S} cx="50" cy="50" r="32"/><circle ${S} cx="50" cy="50" r="8"/><path ${S} d="M18 50h24 M58 50h24 M50 58v24"/>`,
  f_rook_2: `<path ${S} d="M50 22q-16 18-8 32-10-6-10 8a18 18 0 0 0 36 0q0-14-10-8 8-14-8-32Z"/><path ${S} d="M22 86l56-12 M22 74l56 12"/>`,
  f_rook_3: `<path ${S} d="M50 50m-6 0a6 6 0 1 0 12 0 12 12 0 1 0-24 0 18 18 0 1 0 36 0 24 24 0 1 0-48 0 30 30 0 1 0 60 0"/><path ${S} d="M80 50h10" opacity=".7"/>`,
  f_rook_4: `<path ${S} d="M8 86 30 54l14 18 18-30 30 44Z"/><path ${S} d="M10 30q20-14 40 0t40 0 M10 20q20-14 40 0t40 0" opacity=".7"/>`,
  f_rook_5: `<path ${S} d="M42 14 18 88 M58 14l24 74"/><path ${S} d="M50 22v8 M50 40v10 M50 60v12 M50 80v6"/><circle cx="50" cy="12" r="3" fill="currentColor"/>`,
  // Pixie
  f_pixie_1: `<path ${S} d="M30 46q-4-22 20-22t22 22q2 24-22 26T30 46Z"/><path ${S} d="M50 24V12 M44 12h12"/><circle cx="42" cy="44" r="2.5" fill="currentColor"/><circle cx="58" cy="44" r="2.5" fill="currentColor"/><path ${S} d="M44 56q6 4 12 0"/><path ${S} d="M18 40h10 M72 40h10" opacity=".6"/>`,
  f_pixie_2: `<path ${S} d="M22 28h12v8h8v-8h16v8h8v-8h12v24h-8v8h-8v8h-8v8h-8v-8h-8v-8h-8v-8h-8Z"/><text x="50" y="94" text-anchor="middle" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="11">1UP</text>`,
  f_pixie_3: `<path ${S} d="M14 50h72q-4 30-36 30T14 50Z"/><path ${S} d="M30 50q4-10 10 0t10 0 10 0 10 0"/><path ${S} d="M60 14 74 46 M70 12l8 34"/><path ${S} d="M34 40q0-8 4-12 M46 40q0-8 4-12" opacity=".6"/>`,
  f_pixie_4: `<path ${S} d="M50 14q24 0 24 40 0 32-24 32T26 54q0-40 24-40Z"/><path ${S} d="M34 44h10v10h12V44h10 M50 54v16 M40 70h20"/>`,
  f_pixie_5: `<rect ${S} x="10" y="40" width="36" height="24" rx="12"/><rect ${S} x="54" y="40" width="36" height="24" rx="12"/><path ${S} d="M20 52h8 M24 48v8 M64 52h8 M68 48v8"/><circle cx="38" cy="50" r="2" fill="currentColor"/><circle cx="82" cy="50" r="2" fill="currentColor"/><path ${S} d="M46 52h8" stroke-dasharray="2 3"/>`,
  // Ivana
  f_ivana_1: `<path ${S} d="M26 86q0-30 24-30t24 30"/><path ${S} d="M28 50q0-34 22-34t22 34q-8 8-22 8t-22-8Z"/><path ${S} d="M40 44h20" opacity=".7"/>`,
  f_ivana_2: `<rect ${S} x="14" y="20" width="72" height="62" rx="2"/><path ${S} d="M14 34h72"/><path ${S} d="M22 44h24v18H22Z M54 44h24 M54 52h24 M54 60h18 M22 70h56" opacity=".85"/>`,
  f_ivana_3: `<path ${S} d="M50 12 66 44 50 88 34 44Z"/><path ${S} d="M50 44v20"/><circle cx="50" cy="44" r="4" fill="currentColor"/><path ${S} d="M20 88h24" opacity=".6"/>`,
  f_ivana_4: `<rect ${S} x="22" y="14" width="56" height="72" rx="4"/><path ${S} d="M22 28h56 M32 40h36 M32 50h36 M32 60h24"/><circle ${S} cx="30" cy="21" r="2"/>`,
  f_ivana_5: `<path ${S} d="M30 28h40v28H30Z M34 56l-6 30 M66 56l6 30 M30 70h40"/><path ${S} d="M74 18l8-8 M80 26h8" opacity=".7"/>`,
  // Sora
  f_sora_1: `<path ${S} d="M30 20 46 34 34 50Z M54 24l20 8-8 20Z M40 60l18 4-6 18Z M68 60l10 14-14 4Z" />`,
  f_sora_2: `<path ${S} d="M14 50a36 30 0 0 1 72 0Z M50 50v26q0 8-8 8t-8-8"/><path ${S} d="M22 20v6 M34 12v6 M66 12v6 M78 20v6" opacity=".7"/>`,
  f_sora_3: `<circle ${S} cx="34" cy="50" r="16"/><circle ${S} cx="34" cy="50" r="6"/><path ${S} d="M50 50h38 M74 50v12 M84 50v8"/>`,
  f_sora_4: `<path ${S} d="M56 16a30 30 0 1 0 28 42 24 24 0 0 1-28-42Z"/><path ${S} d="M40 44q0-8 8-8t8 8-8 8v4 M48 64v.5"/>`,
  f_sora_5: `<circle ${S} cx="50" cy="50" r="32"/><path ${S} d="M50 18v14 M50 68v14 M18 50h14 M68 50h14"/><path ${S} d="M40 50l7 7 14-14"/>`,
  // Vex
  f_vex_1: `<path ${S} d="M34 12q32 22 0 38t0 38 M66 12q-32 22 0 38t0 38"/><path ${S} d="M40 24h20 M42 38h16 M42 62h16 M40 76h20" opacity=".7"/>`,
  f_vex_2: `<path ${S} d="M28 14h44 M28 86h44 M32 14q0 26 18 36-18 10-18 36 M68 14q0 26-18 36 18 10 18 36"/><path ${S} d="M40 76h20l-10-10Z"/>`,
  f_vex_3: `<rect ${S} x="16" y="26" width="68" height="48" rx="4"/><circle ${S} cx="34" cy="46" r="8"/><path ${S} d="M22 66q4-8 12-8t12 8 M54 40h22 M54 50h16 M54 60h20"/><path ${S} d="M44 20h12v6H44Z"/>`,
  f_vex_4: `<path ${S} d="M70 14l16 16 M78 22 34 66 M44 56l-14-14 M24 76l10-10 M12 88l12-12"/><path ${S} d="M54 34l12 12" opacity=".7"/>`,
  f_vex_5: `<path ${S} d="M22 86V40q0-22 28-22t28 22v46 M36 86V38 M50 86V30 M64 86V38"/><path ${S} d="M72 28l6-6 8 4-6 8Z" opacity=".9"/><path ${S} d="M78 30q10-4 12 4" opacity=".7"/>`,
});
