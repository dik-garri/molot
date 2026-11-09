// День 5 — За вечную жизнь (Ин 3:16, 1 Ин 5:11–12). Образ: вечнозелёная ветка кофейного дерева с ягодами
// поднимается слева; пар над чашкой не рассеивается, а уходит в знак бесконечности ∞.
COFFEE_ART[5] = (K, C) => {
  const { WC, cup, f } = C;
  const q = (p0, p1, p2, t) => {
    const u = 1 - t;
    return {
      x: u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
      y: u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
      a: Math.atan2(2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]), 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]))
    };
  };
  const tr = (x, y, ang) => `transform="translate(${f(x)},${f(y)}) rotate(${f(ang)})"`;
  // широкий заострённый лист кофе с волнистым краем
  const leafD = (L, w) => `M0,0 C${f(L * .12)},${f(-w * .9)} ${f(L * .45)},${f(-w * 1.15)} ${f(L * .7)},${f(-w * .7)} Q${f(L * .78)},${f(-w * .58)} ${f(L * .84)},${f(-w * .42)} Q${f(L * .94)},${f(-w * .18)} ${f(L)},0 Q${f(L * .9)},${f(w * .3)} ${f(L * .8)},${f(w * .52)} C${f(L * .5)},${f(w * 1.12)} ${f(L * .12)},${f(w * .9)} 0,0Z`;
  const leaf = (x, y, ang, L, w) => `<path ${tr(x, y, ang)} d="${leafD(L, w)}"/>`;
  // тень на одной половине листа и глянцевый блик
  const half = (x, y, ang, L, w) => `<path ${tr(x, y, ang)} d="M0,0 C${f(L * .12)},${f(-w * .9)} ${f(L * .45)},${f(-w * 1.1)} ${f(L * .7)},${f(-w * .68)} Q${f(L * .9)},${f(-w * .3)} ${f(L)},0 Q${f(L * .5)},${f(-w * .1)} 0,0Z"/>`;
  const gloss = (x, y, ang, L, w) => `<path ${tr(x, y, ang)} d="M${f(L * .22)},${f(w * .42)} Q${f(L * .45)},${f(w * .6)} ${f(L * .66)},${f(w * .36)}"/>`;
  const veins = (x, y, ang, L, w) => {
    let v = `M2,0 Q${f(L * .5)},${f(-w * .08)} ${f(L * .94)},0`;
    for (let k = 1; k <= 4; k++) { const px = L * k * .17; v += ` M${f(px)},0 Q${f(px + L * .08)},${f(-w * .4)} ${f(px + L * .17)},${f(-w * .7)} M${f(px)},0 Q${f(px + L * .08)},${f(w * .4)} ${f(px + L * .17)},${f(w * .7)}`; }
    return `<path ${tr(x, y, ang)} d="${v}"/>`;
  };

  let s = K.ring(252, 254, 28, .35);
  // ветка кофейного дерева: из левого нижнего угла вверх, к пару
  const P0 = [52, 270], P1 = [56, 186], P2 = [124, 122];
  const stem = `M${P0[0]},${P0[1]} Q${P1[0]},${P1[1]} ${P2[0]},${P2[1]}`;
  let dark = "", light = "", shade = "", gl = "", vv = "", ripe = "", young = "", berriesI = "", hl = "";
  const nodes = [.12, .38, .62, .84];
  nodes.forEach((t, j) => {
    const p = q(P0, P1, P2, t), deg = p.a * 180 / Math.PI, L = 58 - j * 9, w = L * .32;
    // пара супротивных листьев: наружу и внутрь
    const A = [[deg - 42 + j * 2, L], [deg + 58 - j * 4, L * .9]];
    A.forEach(([ang, l], k) => {
      const lf = leaf(p.x, p.y, ang, l, l * .32);
      if ((j + k) % 2) light += lf; else dark += lf;
      shade += half(p.x, p.y, ang, l, l * .32);
      gl += gloss(p.x, p.y, ang, l, l * .32);
      vv += veins(p.x, p.y, ang, l, l * .32);
    });
    // гроздь ягод у узла (кроме верхнего)
    if (j < 3) {
      const cnt = 5 - j;
      for (let b = 0; b < cnt; b++) {
        const side = b % 2 ? 1 : -1, off = 7 + Math.floor(b / 2) * 8;
        const bx = p.x + Math.cos(p.a + side * 1.45) * off + Math.cos(p.a) * (b === 4 ? 9 : 0);
        const by = p.y + Math.sin(p.a + side * 1.45) * off + Math.sin(p.a) * (b === 4 ? 9 : 0) + 2;
        const r = 6.2 - (b % 3) * .5;
        const c = `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(r)}"/>`;
        if ((b + j) % 3 === 2) young += c; else ripe += c;
        berriesI += `<circle cx="${f(bx + 1)}" cy="${f(by - .8)}" r="${f(r)}"/><path d="M${f(bx + .6)},${f(by + r * .55)} l1.3,-1.7"/>`;
        hl += `<circle cx="${f(bx - r * .38)}" cy="${f(by - r * .38)}" r="1.5" fill="${WC.white}" opacity=".9"/>`;
      }
    }
  });
  // верхушка: молодой лист
  const tip = q(P0, P1, P2, 1), ta = tip.a * 180 / Math.PI - 8;
  light += leaf(tip.x, tip.y, ta, 30, 9);
  vv += veins(tip.x, tip.y, ta, 30, 9);
  s += K.Ws(stem, WC.c2, 4.5, .65);
  s += K.W(dark, WC.c2, .62) + K.W(light, WC.c1, .9) + K.Wf(shade, WC.c3, .26);
  s += `<g fill="none" stroke="${WC.white}" stroke-width="2.2" stroke-linecap="round" opacity=".7">${gl}</g>`;
  s += `<g fill="${WC.c3}" opacity=".5">${ripe}</g>` + K.Wf(ripe, WC.c3, .9) + K.Wf(young, WC.c2, .85);
  s += K.I(`<g transform="translate(1.5,-1.3)"><path d="${stem}"/>${dark}${light}${berriesI}</g>`, 1.15);
  s += K.I(`<g transform="translate(1.5,-1.3)">${vv}</g>`, .6);
  s += hl;

  // чашка справа
  s += cup(K, 210, 192, 84);
  // пар → знак бесконечности: лемниската через центр (cx, cy); пар входит в неё снизу справа
  const cx = 198, cy = 98, a = 56;
  const lem = t => { const d = 1 + Math.sin(t) ** 2; return [cx + a * Math.cos(t) / d, cy + a * Math.sin(t) * Math.cos(t) / d]; };
  let inf = "";
  for (let i = 0; i <= 96; i++) { const p = lem(Math.PI / 2 + i * 2 * Math.PI / 96); inf += (i ? " L" : "M") + f(p[0]) + "," + f(p[1]); }
  const rise = `M216,180 C208,168 226,158 218,144 C214,130 210,114 ${cx},${cy}`;
  s += K.Ws(rise + " " + inf, WC.c1, 10, .28);
  s += K.Ws(inf, WC.c2, 3.2, .45);
  s += K.I(`<path d="${rise}"/><path d="${inf}"/>`, 1.35);
  // вторая лёгкая струйка
  s += K.I(`<path d="M198,180 c-5,-9 5,-15 0,-24 c-3,-6 2,-10 1,-14"/>`, 1);
  s += K.splat(5, 9, 60, 56, 300, 262, WC.c2);
  return s;
};
