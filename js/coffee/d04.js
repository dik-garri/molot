// День 4 — За открытый вход к Богу (Евр 10:19–20, Еф 2:18). Образ: тяжёлая завеса разорвана сверху донизу,
// края разрыва повторяют друг друга; в проёме — свет (белила), он ложится на пол; у порога стоит чашка.
COFFEE_ART[4] = (K, C) => {
  const { WC, cup, rng, f } = C;
  const R = rng(404);
  const TOP = 62, BOT = 246, L0 = 36, R0 = 284;
  // профиль разрыва: одинаковый у обеих половин (это одна ткань)
  const n = 16, jag = [];
  for (let i = 0; i <= n; i++) jag.push(i === 0 ? 0 : (i % 2 ? 1 : -1) * (2 + R() * 4.5) + (R() - .5) * 3);
  const edge = (xTop, xBot) => jag.map((o, i) => { const t = i / n, y = TOP + t * (BOT - TOP); return [xTop + (xBot - xTop) * Math.pow(t, 1.25) + o, y]; });
  const le = edge(157, 104), re = edge(163, 216);
  const pts = a => a.map(p => `${f(p[0])},${f(p[1])}`).join(" L");
  // низ ткани чуть волной
  const leftC = `M${L0},${TOP} L${pts(le)} Q${f((L0 + 104) / 2)},${BOT + 8} ${L0 - 2},${BOT + 2}Z`;
  const rightC = `M${R0},${TOP} L${pts(re)} Q${f((R0 + 216) / 2)},${BOT + 8} ${R0 + 2},${BOT + 2}Z`;

  let s = "";
  // проём: свет за завесой
  const gap = `M157,${TOP} L${pts(re)} L${pts(le.slice().reverse())}Z`;
  s += K.B(`<path d="${gap}"/><ellipse cx="160" cy="214" rx="70" ry="40"/>`, WC.white, .95);
  // лучи из глубины проёма
  let rays = "";
  for (let i = 0; i < 11; i++) {
    const a = (-90 + (i - 5) * 8.5) * Math.PI / 180, r0 = 30 + (i % 3) * 8, r1 = 190;
    rays += `<path stroke-width="${i % 2 ? .8 : 1.3}" d="M${f(160 + Math.cos(a) * r0)},${f(206 + Math.sin(a) * r0)} L${f(160 + Math.cos(a) * r1)},${f(206 + Math.sin(a) * r1)}"/>`;
  }
  s += `<clipPath id="${K.id}-gap"><path d="${gap}"/></clipPath>`;
  s += `<g clip-path="url(#${K.id}-gap)" stroke="${WC.c1}" opacity=".85" stroke-linecap="round">${rays}</g>`;
  // пол и свет, упавший из проёма
  s += K.W(`<path d="M20,${BOT} L300,${BOT} L304,272 L16,272Z"/>`, WC.c1, .28);
  s += K.B(`<path d="M106,${BOT} L214,${BOT} L246,272 L74,272Z"/>`, WC.white, 1);
  s += K.B(`<path d="M106,${BOT} L214,${BOT} L246,272 L74,272Z"/>`, WC.white, .8);

  // две половины завесы: размывка, тени складок, тушь
  const folds = (xa, xb, tearTop, tearBot, k) => {
    let fl = "", sh = "";
    for (let i = 1; i <= k; i++) {
      const t = i / (k + 1), x1 = xa + (tearTop - xa) * t, x2 = xa + (tearBot - xa) * t, w = (i % 2 ? 1 : -1) * 2.5;
      fl += `<path d="M${f(x1)},${TOP + 4} C${f(x1 + w)},${TOP + 60} ${f(x2 - w)},${BOT - 70} ${f(x2)},${BOT + 3}"/>`;
      if (i % 2) sh += `<path d="M${f(x1 - 4)},${TOP + 2} L${f(x1 + 4)},${TOP + 2} L${f(x2 + 6)},${BOT + 4} L${f(x2 - 6)},${BOT + 4}Z"/>`;
    }
    return { fl, sh };
  };
  const fL = folds(L0, L0, 157, 104, 5), fR = folds(R0, R0, 163, 216, 5);
  s += K.W(`<path d="${leftC}"/><path d="${rightC}"/>`, WC.c2, .55);
  s += K.Wf(fL.sh + fR.sh, WC.c3, .32);
  // тень у разорванных краёв — ткань там темнее, свет за ней ярче
  s += K.Wf(`<path d="M${pts(le)} L${f(le[n][0] - 14)},${BOT} L${f(le[0][0] - 10)},${TOP}Z"/><path d="M${pts(re)} L${f(re[n][0] + 14)},${BOT} L${f(re[0][0] + 10)},${TOP}Z"/>`, WC.c3, .35);
  // свет переливается через рваные края
  s += K.Ws(`M${pts(le)} M${pts(re)}`, WC.white, 3.5, .75);
  s += K.I(`<g transform="translate(1.4,-1.2)"><path d="${leftC}"/><path d="${rightC}"/>${fL.fl}${fR.fl}</g>`, 1.15);
  // карниз с кольцами
  let rings = "";
  for (let i = 0; i <= 12; i++) rings += `<circle cx="${f(L0 + 4 + i * ((R0 - L0 - 8) / 12))}" cy="${TOP - 1}" r="3.2"/>`;
  s += K.Ws(`M${L0 - 10},${TOP - 4} L${R0 + 10},${TOP - 4}`, WC.c3, 4, .6);
  s += K.I(`<path d="M${L0 - 10},${TOP - 4} L${R0 + 10},${TOP - 4}"/><circle cx="${L0 - 13}" cy="${TOP - 4}" r="3.6"/><circle cx="${R0 + 13}" cy="${TOP - 4}" r="3.6"/>${rings}`, 1.2);
  // порог
  s += K.I(`<path d="M22,${BOT + 1} L104,${BOT + 1}"/><path d="M216,${BOT + 1} L298,${BOT + 1}"/><path d="M104,${BOT + 1} L216,${BOT + 1}" stroke-dasharray="3 5"/>`, 1);
  // чашка у порога, в потоке света
  s += cup(K, 160, 214, 52);
  s += K.I(`<path d="M152,204 c-5,-8 5,-13 0,-22"/><path d="M166,202 c-5,-9 5,-15 0,-25"/>`, 1.1);
  s += K.splat(4, 8, 30, 70, 296, 268, WC.c2);
  return s;
};
