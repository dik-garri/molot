// День 24 — За Самого Христа (2 Кор 9:15; Ин 17:3; Флп 3:8). Образ: раскрытый подарок, из которого
// исходит свет — «неизреченный дар». Финальная, самая светлая наклейка: лучи белилами по тёплой размывке.
COFFEE_ART[24] = (K, C) => {
  const { WC, f, star4 } = C;
  const ox = 166, oy = 166; // центр раскрытого верха
  let s = "";
  // тёплое сияние
  s += K.B(`<circle cx="${ox}" cy="${oy - 46}" r="84"/>`, WC.c1, .42);
  s += K.B(`<circle cx="${ox}" cy="${oy - 30}" r="50"/>`, WC.c1, .3);
  // лучи белилами
  let rays = "";
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (-162 + i * (144 / (n - 1))) * Math.PI / 180, len = i % 2 ? 92 : 118, hw = i % 2 ? .035 : .055;
    const x1 = ox + Math.cos(a - hw) * len, y1 = oy + Math.sin(a - hw) * len, x2 = ox + Math.cos(a + hw) * len, y2 = oy + Math.sin(a + hw) * len;
    rays += `<path d="M${ox - 4},${oy} L${f(x1)},${f(y1)} L${f(x2)},${f(y2)} L${ox + 4},${oy}Z"/>`;
  }
  s += K.W(rays, WC.white, .9);
  s += K.B(`<ellipse cx="${ox}" cy="${oy - 10}" rx="44" ry="26"/>`, WC.white, .95);
  // тонкие лучи тушью — эскизно, не до конца
  let ir = "";
  for (let i = 0; i < 7; i++) { const a = (-150 + i * 20) * Math.PI / 180; ir += `<path d="M${f(ox + Math.cos(a) * 46)},${f(oy + Math.sin(a) * 46)} L${f(ox + Math.cos(a) * (70 + (i % 2) * 14))},${f(oy + Math.sin(a) * (70 + (i % 2) * 14))}"/>`; }
  s += `<g opacity=".3">` + K.I(ir, .7) + `</g>`;

  // крышка — откинута и лежит слева
  const lid = `M34,236 L104,224 L108,238 L38,252Z`, lidTop = `M34,236 L104,224 L100,214 L32,226Z`;
  s += K.W(`<path d="${lid}"/>`, WC.c1, .6) + K.W(`<path d="${lidTop}"/>`, WC.c1, .4);
  s += K.Ws(`M64,230 L66,245`, WC.c2, 7, .5);
  s += K.I(`<g transform="translate(1.2,-1)"><path d="${lid}"/><path d="${lidTop}"/></g>`, 1.1);
  // бант на крышке
  const bow = `M64,220 C50,206 38,214 48,222 C54,226 60,223 64,220 C74,206 88,212 80,221 C74,226 68,223 64,220Z`;
  s += K.Wf(`<path d="${bow}"/>`, WC.c2, .6);
  s += K.I(`<path d="${bow}"/><path d="M64,220 l-8,12 M64,220 l6,13"/><circle cx="64" cy="220" r="2.4"/>`, 1);

  // коробка: передняя грань, боковая, раскрытый верх
  const front = `M112,186 L214,186 L214,258 L112,258Z`;
  const side = `M214,186 L238,172 L238,242 L214,258Z`;
  const top = `M112,186 L214,186 L238,172 L136,172Z`;
  s += K.W(`<path d="M104,256 L220,256 L250,242 L250,252 L226,264 L104,264Z"/>`, WC.c2, .22);
  s += K.W(`<path d="${front}"/>`, WC.c1, .58);
  s += K.W(`<path d="${side}"/>`, WC.c2, .42);
  s += K.W(`<path d="${top}"/>`, WC.c2, .5) + K.W(`<path d="M118,184 L210,184 L232,174 L140,174Z"/>`, WC.c3, .35);
  s += K.B(`<ellipse cx="${ox + 12}" cy="${oy - 10}" rx="42" ry="14"/>`, WC.white, .95) + K.Wf(`<ellipse cx="${ox + 12}" cy="${oy + 6}" rx="36" ry="3.2"/>`, WC.white, .85);
  // лента
  s += K.Ws(`M163,188 L163,256`, WC.c2, 13, .55);
  s += K.Ws(`M226,180 L226,250`, WC.c3, 8, .4);
  s += K.I(`<g transform="translate(1.4,-1.2)"><path d="${front}"/><path d="${side}"/><path d="${top}"/>` +
    `<path d="M156,187 V257 M170,187 V257"/><path d="M222,183 V252 M230,178 V247"/></g>`, 1.2);
  // развязанная лента вьётся по бумаге
  const tail = `M156,258 C136,268 108,262 90,268 C76,272 66,266 58,270`;
  const tail2 = `M172,258 C190,270 220,262 246,268 C262,272 270,262 282,266`;
  s += K.Ws(tail, WC.c2, 5, .5) + K.Ws(tail2, WC.c2, 5, .5);
  s += K.I(`<path d="${tail}"/><path d="${tail2}"/>`, .9);

  // искры
  [[ox - 70, 92, 7], [ox + 76, 82, 9], [ox + 98, 140, 5], [ox - 92, 150, 5], [ox + 6, 62, 6]].forEach(([x, y, r], i) => {
    s += `<path d="${star4(x, y, r)}" fill="${i % 2 ? WC.c2 : WC.c3}" opacity=".7"/>`;
  });
  s += K.splat(24, 8, 30, 60, 300, 200, WC.c2, 1.6);
  return s;
};
