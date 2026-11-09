// День 23 — За то, что Он несёт нашу боль (Ис 53:4–5). Образ: чашка была разбита — трещины
// бережно скреплены светлыми швами (как кинцуги), и она снова цела и полна, над ней пар.
COFFEE_ART[23] = (K, C) => {
  const { WC, f } = C;
  let s = K.ring(258, 92, 26, .35);
  s += K.B(`<ellipse cx="160" cy="170" rx="96" ry="78"/>`, WC.c1, .16);
  const x = 158, y = 128, w = 146, h = w * .7, ry = 17;
  const body = `M${x - w / 2},${y} C${x - w / 2},${f(y + h * .8)} ${f(x - w * .3)},${f(y + h)} ${x},${f(y + h)} C${f(x + w * .3)},${f(y + h)} ${x + w / 2},${f(y + h * .8)} ${x + w / 2},${y}`;
  const shade = `M${f(x + w * .16)},${y} L${x + w / 2},${y} C${x + w / 2},${f(y + h * .8)} ${f(x + w * .32)},${f(y + h)} ${f(x + w * .1)},${f(y + h)}Z`;
  const handle = `M${f(x + w * .47)},${f(y + h * .18)} C${f(x + w * .8)},${f(y + h * .08)} ${f(x + w * .8)},${f(y + h * .66)} ${f(x + w * .34)},${f(y + h * .76)}`;
  const sy = f(y + h + 3);
  s += K.W(`<ellipse cx="${x}" cy="${sy}" rx="${f(w * .72)}" ry="${f(w * .11)}"/>`, WC.c1, .5);
  s += K.Ws(handle, WC.c1, w * .09, .6);
  s += K.W(`<path d="${body}Z"/><ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${ry}"/>`, WC.c1, .5);
  s += K.W(`<path d="${shade}"/>`, WC.c2, .34);
  // полна до краёв
  s += K.W(`<ellipse cx="${x}" cy="${y + 1}" rx="${w / 2 - 6}" ry="${ry - 4}"/>`, WC.c3, .88);
  s += K.Wf(`<ellipse cx="${x + 22}" cy="${y}" rx="18" ry="3.6"/>`, WC.white, .45);
  // швы: где была трещина — теперь светлая скреплённая линия
  const seams = [
    `M126,143 L133,160 L124,178 L137,196 L131,214`,
    `M124,178 L108,186 L101,200`,
    `M198,142 L191,158 L201,174 L195,186`,
    `M201,174 L214,180`
  ];
  seams.forEach((d, i) => { const m = i % 2 ? .75 : 1; s += K.Ws(d, WC.white, 8 * m, .95) + K.Ws(d, WC.c2, 2.8 * m, .85); });
  const sd = seams.join(" ");
  s += `<g opacity=".8">` + K.I(`<g transform="translate(-3,-.6)"><path d="${sd}"/></g>`, .7) + `</g>`;
  s += `<g opacity=".55">` + K.I(`<g transform="translate(3,.8)"><path d="${sd}"/></g>`, .6) + `</g>`;
  // мелкие «скрепки» белилами — точки на изломах
  [[133, 160], [124, 178], [137, 196], [191, 158], [201, 174]].forEach(([a, b]) => s += `<circle cx="${a}" cy="${b}" r="1.7" fill="${WC.white}"/>`);
  s += K.I(`<g transform="translate(1.6,-1.4)"><path d="${body}"/><ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${ry}"/><path d="${handle}"/>` +
    `<path d="M${f(x - w * .7)},${f(y + h + 5)} Q${x},${f(y + h + w * .19)} ${f(x + w * .72)},${f(y + h + 3)}"/></g>`);
  // пар
  s += K.I(`<path d="M${x - 18},${y - 12} c-8,-12 8,-18 0,-30"/><path d="M${x},${y - 14} c-8,-13 8,-22 0,-38"/><path d="M${x + 18},${y - 12} c-8,-12 8,-18 0,-30"/>`, 1.2);
  s += K.splat(23, 8, 30, 60, 300, 268, WC.c2, 1.8);
  return s;
};
