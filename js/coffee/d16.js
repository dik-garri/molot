// День 16 — За то, что мы — одно тело (1 Кор 12:21, 27). Образ: кофейные зёрна разной формы, размера и обжарки
// складываются в одно сердце. Одно место на краю пока пустует — и зерно рядом катится в него: в теле нужен каждый.
COFFEE_ART[16] = (K, C) => {
  const { WC, rng, f } = C;
  const R = rng(1612);
  const hx = 158, hy = 138, sc = 5.7;                          // сердце: центр и масштаб
  const P = t => [hx + 16 * Math.pow(Math.sin(t), 3) * sc,
    hy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * sc];
  // контур сердца — многоугольник для проверки «внутри»
  const poly = [];
  for (let i = 0; i < 240; i++) poly.push(P(i / 240 * Math.PI * 2));
  const inside = (x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const beans = [];
  // 1) зёрна по контуру — вдоль касательной, через равные промежутки
  let acc = 0, prev = P(0), gap = null;
  const edge = [];
  for (let i = 1; i <= 720; i++) {
    const t = i / 720 * Math.PI * 2, p = P(t);
    acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p;
    if (acc >= 19.5) { acc = 0; const q = P(t + .01); edge.push([p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI, t]); }
  }
  edge.forEach(([x, y, rot, t]) => {
    if (!gap && t > .82) { gap = [x, y, rot]; return; }       // пустое место на верху правой половинки
    beans.push({ x, y, rot: rot + (R() - .5) * 24, l: 8.6 + R() * 2, round: false });
  });
  // 2) внутри — плотная раскладка с разными размерами
  for (let row = 0, py = hy - 80; py < hy + 100; row++, py += 12.5) {
    for (let px = hx - 100 + (row % 2) * 7; px < hx + 100; px += 14) {
      const x = px + (R() - .5) * 5, y = py + (R() - .5) * 5;
      if (!inside(x, y)) continue;
      if (beans.some(b => Math.hypot(b.x - x, b.y - y) < 13)) continue;
      if (Math.hypot(gap[0] - x, gap[1] - y) < 16) continue;
      beans.push({ x, y, rot: Math.floor(R() * 180), l: 6.8 + R() * 3.6, round: R() < .16 });
    }
  }
  beans.forEach(b => { b.wd = b.round ? b.l * .8 : b.l * .62; if (b.round) b.l *= .86; });

  let s = K.ring(234, 210, 42, .4);
  // общая подложка — одно целое
  s += K.B(poly.length ? `<path d="M${poly.map(p => f(p[0]) + "," + f(p[1])).join(" L")}Z"/>` : "", WC.c1, .32);
  // зёрна: размывки трёх обжарок
  const tones = [[WC.c1, .8], [WC.c2, .72], [WC.c3, .78]];
  const layer = [[], [], []], inks = [];
  let hl = "";
  beans.forEach((b, i) => {
    const t = Math.floor(R() * 3);
    layer[t].push(`<g transform="translate(${f(b.x)},${f(b.y)}) rotate(${f(b.rot)})"><ellipse rx="${f(b.l)}" ry="${f(b.wd)}"/></g>`);
    const crease = `M${f(-b.l * .78)},0 C${f(-b.l * .3)},${f(-b.wd * .34)} ${f(b.l * .3)},${f(b.wd * .34)} ${f(b.l * .78)},0`;
    inks.push(`<g transform="translate(${f(b.x + 1.1)},${f(b.y - .9)}) rotate(${f(b.rot)})">` +
      (R() < .55 ? `<ellipse rx="${f(b.l)}" ry="${f(b.wd)}" stroke-width=".75"/>` : `<path d="M${f(-b.l)},0 A${f(b.l)},${f(b.wd)} 0 0 1 ${f(b.l)},0" stroke-width=".75"/>`) +
      `<path d="${crease}"/></g>`);
    if (i % 3 === 0) hl += `<g transform="translate(${f(b.x)},${f(b.y)}) rotate(${f(b.rot)})"><path d="M${f(-b.l * .5)},${f(-b.wd * .5)} Q0,${f(-b.wd * .9)} ${f(b.l * .45)},${f(-b.wd * .55)}"/></g>`;
  });
  layer.forEach((l, t) => s += K.Wf(l.join(""), tones[t][0], tones[t][1]));
  s += `<g fill="none" stroke="${WC.white}" stroke-width="1.5" stroke-linecap="round" opacity=".55">${hl}</g>`;
  s += K.I(inks.join(""), 1.05);
  // пустое место: пунктирный след зерна
  const [gx, gy, gr] = gap;
  s += K.I(`<g transform="translate(${f(gx)},${f(gy)}) rotate(${f(gr)})"><ellipse rx="9.4" ry="6" stroke-dasharray="2 2.6" stroke-width=".8"/></g>`);
  // зерно, которое катится на своё место
  const lx = gx + 52, ly = gy - 8;
  s += K.Wf(`<g transform="translate(${f(lx)},${f(ly)}) rotate(-24)"><ellipse rx="11" ry="7.2"/></g>`, WC.c2, .8);
  s += K.I(`<g transform="translate(${f(lx + 1.1)},${f(ly - .9)}) rotate(-24)"><ellipse rx="11" ry="7.2" stroke-width=".8"/><path d="M-8.6,0 C-3.3,-2.5 3.3,2.5 8.6,0"/></g>` +
    `<path d="M${f(lx + 16)},${f(ly - 6)} q6,-1 12,-4 M${f(lx + 17)},${f(ly + 1)} q5,0 10,-2"/>`, 1.05);
  s += K.splat(16, 8, 30, 64, 296, 264, WC.c2);
  return s;
};
