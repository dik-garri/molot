// День 2 — За мир с Богом (Рим 5:1, 5:10). Образ: две чашки, когда-то «по разные стороны», теперь рядом;
// между ними, через оба блюдца, лежит оливковая ветвь — знак мира. Пар из обеих чашек спокойный и ровный.
COFFEE_ART[2] = (K, C) => {
  const { WC, cup, f } = C;
  // точка и угол касательной на квадратичной кривой
  const q = (p0, p1, p2, t) => {
    const u = 1 - t;
    return {
      x: u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
      y: u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
      a: Math.atan2(2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]), 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]))
    };
  };
  // оливковый лист: узкий, заострённый, от точки (x, y) под углом ang (градусы)
  const leaf = (x, y, ang, L, w) => `<path transform="translate(${f(x)},${f(y)}) rotate(${f(ang)})" d="M0,0 C${f(L * .22)},${f(-w)} ${f(L * .68)},${f(-w * .95)} ${f(L)},0 C${f(L * .68)},${f(w * .85)} ${f(L * .22)},${f(w * .95)} 0,0Z"/>`;
  const vein = (x, y, ang, L) => `<path transform="translate(${f(x)},${f(y)}) rotate(${f(ang)})" d="M2,0 Q${f(L * .5)},-.7 ${f(L * .86)},0"/>`;

  let s = K.ring(246, 206, 36, .38);
  // две чашки: ручки наружу, лицом друг к другу
  s += cup(K, 94, 136, 76, { dir: -1 });
  s += cup(K, 226, 136, 76, { dir: 1 });
  // ровный, спокойный пар: по два тонких завитка, чуть клонятся друг к другу
  const steam = [
    "M86,124 c-6,-11 6,-19 0,-30 c-5,-9 5,-15 2,-25 c-3,-8 3,-12 5,-17",
    "M102,122 c-6,-10 6,-17 1,-27 c-4,-8 5,-13 6,-20",
    "M234,124 c6,-11 -6,-19 0,-30 c5,-9 -5,-15 -2,-25 c3,-8 -3,-12 -5,-17",
    "M218,122 c6,-10 -6,-17 -1,-27 c4,-8 -5,-13 -6,-20"
  ];
  s += K.Ws(steam.join(" "), WC.c1, 6, .2);
  s += K.I(steam.map(d => `<path d="${d}"/>`).join(""), 1.15);

  // оливковая ветвь: лежит перед чашками, мостом через оба блюдца
  const P0 = [26, 240], P1 = [160, 200], P2 = [296, 230];
  const stem = `M${P0[0]},${P0[1]} Q${P1[0]},${P1[1]} ${P2[0]},${P2[1]}`;
  let dark = "", light = "", veins = "";
  const N = 17;
  for (let i = 0; i < N; i++) {
    const t = .05 + i * (.88 / (N - 1)), p = q(P0, P1, P2, t), deg = p.a * 180 / Math.PI;
    const side = i % 2 ? 1 : -1, L = 36 - Math.abs(t - .45) * 22, ang = deg + side * (34 + (i * 7) % 15);
    const lf = leaf(p.x, p.y, ang, L, L * .19);
    if (i % 3 === 1) light += lf; else dark += lf;
    veins += vein(p.x, p.y, ang, L);
  }
  // кончик ветви — молодой лист вперёд
  const tip = q(P0, P1, P2, .99);
  dark += leaf(tip.x, tip.y, tip.a * 180 / Math.PI - 4, 22, 4.2);
  veins += vein(tip.x, tip.y, tip.a * 180 / Math.PI - 4, 22);
  // маслины: на коротких черешках под ветвью
  const OL = [[.33, 1, 12, 0], [.4, 1, 17, 30], [.6, 1, 13, -10], [.67, -1, 13, 20]];
  let olives = "", olivesI = "", hl = "";
  OL.forEach(([t, side, d, rot]) => {
    const p = q(P0, P1, P2, t), nx = -Math.sin(p.a) * side * d, ny = Math.cos(p.a) * side * d;
    const ox = p.x + nx, oy = p.y + ny, r = f(p.a * 180 / Math.PI + rot);
    olives += `<ellipse cx="${f(ox)}" cy="${f(oy)}" rx="6.4" ry="5" transform="rotate(${r} ${f(ox)} ${f(oy)})"/>`;
    olivesI += `<path d="M${f(p.x)},${f(p.y)} L${f(ox - nx * .4)},${f(oy - ny * .4)}"/><ellipse cx="${f(ox)}" cy="${f(oy)}" rx="6.4" ry="5" transform="rotate(${r} ${f(ox)} ${f(oy)})"/>`;
    hl += `<ellipse cx="${f(ox - 2)}" cy="${f(oy - 1.8)}" rx="1.8" ry="1.1" fill="${WC.white}" opacity=".9"/>`;
  });
  s += K.Ws(stem, WC.c2, 3.4, .6);
  s += K.Wf(dark, WC.c2, .62) + K.Wf(light, WC.c1, .9);
  s += `<g fill="${WC.c3}" opacity=".55">${olives}</g>` + K.Wf(olives, WC.c3, .9);
  s += K.I(`<g transform="translate(1.4,-1.2)"><path d="${stem}"/>${dark}${light}${olivesI}</g>`, 1.1);
  s += K.I(`<g transform="translate(1.4,-1.2)">${veins}</g>`, .7);
  s += hl;
  s += K.splat(2, 9, 30, 44, 296, 252, WC.c2);
  return `<g transform="translate(0,14)">${s}</g>`;
};
