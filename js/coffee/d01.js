// День 1 — За прощение грехов. Образ: чек из кофейни со штампом «ОПЛАЧЕНО» — долг закрыт полностью;
// рядом чашка и след от неё на бумаге.
COFFEE_ART[1] = (K, C) => {
  const { WC, cup, f } = C;
  let s = K.ring(232, 236, 44, .55);
  // чек: бумажная лента с зубчатым низом, чуть повёрнута
  const paper = `M62,70 L170,70 L170,250 L165.5,256 L161,250 L156.5,256 L152,250 L147.5,256 L143,250 L138.5,256 L134,250 L129.5,256 L125,250 L120.5,256 L116,250 L111.5,256 L107,250 L102.5,256 L98,250 L93.5,256 L89,250 L84.5,256 L80,250 L75.5,256 L71,250 L66.5,256 L62,250Z`;
  let r = `<g transform="rotate(-6 116 160)">`;
  r += K.W(`<path d="${paper}"/>`, WC.c1, .22) + K.W(`<path d="M62,70 h108 v14 h-108Z"/>`, WC.c1, .35);
  // строки чека: позиции и цены тушью
  let lines = "";
  [98, 112, 126, 140, 154, 168].forEach((y, i) => {
    lines += `<path d="M72,${y} q8,-2 16,0 t16,0 t${10 + (i * 7) % 14},0"/><path d="M${142 - (i % 3) * 4},${y} h${18 + (i % 3) * 4}"/>`;
  });
  lines += `<path d="M70,186 H162" stroke-dasharray="2 3"/><path d="M72,202 q10,-2 22,0"/><path d="M134,202 h28" stroke-width="2"/>`;
  r += K.I(`<path d="${paper}"/>` + lines, 1.1);
  r += `<text x="116" y="81" text-anchor="middle" font-family="Lora" font-style="italic" font-size="8" fill="${WC.c3}">кофейня «Благодать»</text>`;
  r += `<text x="76" y="205" font-family="Lora" font-style="italic" font-weight="600" font-size="9" fill="${WC.c3}">итого</text>`;
  // штамп «ОПЛАЧЕНО» — размывка и тушь
  r += `<g transform="rotate(-14 118 226)">` + K.Wf(`<rect x="78" y="212" width="82" height="26" rx="4"/>`, WC.c2, .18) +
    `<rect x="78" y="212" width="82" height="26" rx="4" fill="none" stroke="${WC.c2}" stroke-width="2.2" opacity=".85"/>` +
    `<rect x="81" y="215" width="76" height="20" rx="3" fill="none" stroke="${WC.c2}" stroke-width=".8" opacity=".7"/>` +
    `<text x="119" y="230.5" text-anchor="middle" font-family="Lora" font-weight="600" font-size="12" letter-spacing="1.6" fill="${WC.c2}" opacity=".9">ОПЛАЧЕНО</text></g>`;
  r += `</g>`;
  s += r;
  s += cup(K, 236, 176, 88);
  s += K.I(`<path d="M222,164 c-7,-11 7,-18 0,-30"/><path d="M238,160 c-7,-12 7,-21 0,-36"/><path d="M254,164 c-7,-11 7,-18 0,-30"/>`, 1.2);
  s += K.splat(5, 10, 40, 60, 290, 268, WC.c2);
  return s;
};
