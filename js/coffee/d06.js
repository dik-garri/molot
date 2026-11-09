// День 6 — За свободу от власти греха («за силу сказать греху „нет“»). Образ: цепь лежала вокруг чашки —
// теперь она разорвана: звено лопнуло посередине, половинки разошлись, а пар над чашкой свободно уходит вверх.
COFFEE_ART[6] = (K, C) => {
  const { WC, cup, f } = C;
  // звено цепи по осевой: L — длина, r — полуширина; t — толщина металла
  const stad = (L, r) => `M${f(-L / 2 + r)},${f(-r)} H${f(L / 2 - r)} A${f(r)},${f(r)} 0 0 1 ${f(L / 2 - r)},${f(r)} H${f(-L / 2 + r)} A${f(r)},${f(r)} 0 0 1 ${f(-L / 2 + r)},${f(-r)}Z`;
  // gap — разрыв [начало, длина] в процентах длины контура (0 — левый верх, 25…45 — правый торец, 75…95 — левый)
  const link = (x, y, a, L, r, o = {}) => {
    const t = o.t || 7.5;
    const dash = o.gap ? ` pathLength="100" stroke-dasharray="${100 - o.gap[1]} ${o.gap[1]}" stroke-dashoffset="${-(o.gap[0] + o.gap[1])}"` : "";
    let s = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(a)})">`;
    s += K.Wf(`<path d="${stad(L, r)}" fill="none" stroke="${WC.c2}" stroke-width="${t}" stroke-linecap="round"${dash}/>`, WC.c2, o.op || .6);
    s += K.Wf(`<path d="${stad(L, r)}" fill="none" stroke="${WC.c3}" stroke-width="${f(t * .45)}" stroke-linecap="round" transform="translate(.8,1.6)"${dash}/>`, WC.c3, .4);
    s += `</g><g transform="translate(${f(x + 1.4)},${f(y - 1.3)}) rotate(${f(a)})">`;
    s += K.I(`<path d="${stad(L + t, r + t / 2)}"${dash}/>` + (r - t / 2 > 1 ? `<path d="${stad(L - t, r - t / 2)}"${dash}/>` : ""), 1.15);
    return s + `</g>`;
  };
  // цепь от места разрыва (P[0]) наружу вдоль кубической кривой: звенья через равный шаг,
  // чередуются «ребром» и «плашмя»
  const chain = (P, n, step, L, r) => {
    const pt = (u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * P[0][k] + 3 * v * v * u * P[1][k] + 3 * v * u * u * P[2][k] + u * u * u * P[3][k]); };
    const pts = []; let prev = pt(0), acc = 0; pts.push(prev);
    for (let i = 1; i <= 400 && pts.length < n; i++) {
      const q = pt(i / 400); acc += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q;
      if (acc >= step) { pts.push(q); acc = 0; }
    }
    let s = "";
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i], nb = pts[i + 1] || p, pb = pts[i - 1] || p;
      const a = Math.atan2(nb[1] - pb[1], nb[0] - pb[0]) * 180 / Math.PI;
      s += i % 2 ? link(p[0], p[1], a, L, r) : link(p[0], p[1], a, L, 3.4, { t: 7, op: .72 });
    }
    return { s, p: pts[0], ang: Math.atan2(pts[0][1] - pts[1][1], pts[0][0] - pts[1][0]) };
  };

  let s = K.ring(262, 98, 26, .4);
  s += K.B(`<ellipse cx="160" cy="214" rx="104" ry="34"/>`, WC.c1, .2);

  // пар — свободный, высокий, уходит вверх и раскрывается
  s += K.Ws(`M146,128 C130,110 156,98 142,80 C132,68 120,64 114,54`, WC.c1, 11, .3);
  s += K.Ws(`M178,126 C194,108 170,94 186,78 C198,66 210,64 216,54`, WC.c1, 11, .28) + K.Ws(`M162,124 C172,106 152,92 164,72 C170,62 162,56 164,50`, WC.white, 7, .5);
  s += K.I(`<path d="M146,128 C130,110 156,98 142,80 C132,68 120,64 114,54"/>` +
    `<path d="M162,124 C172,106 152,92 164,72 C172,60 156,58 162,50"/>` +
    `<path d="M178,126 C194,108 170,94 186,78 C198,66 210,64 216,54"/>`, 1.25);

  s += cup(K, 160, 138, 86);

  // две половины цепи лежат перед чашкой и разорваны посередине
  const Lc = 34, rc = 9.5, step = 25;
  const left = chain([[104, 250], [72, 247], [44, 232], [28, 208]], 4, step, Lc, rc);
  const right = chain([[216, 250], [248, 247], [276, 232], [292, 208]], 4, step, Lc, rc);
  // лопнувшее звено: каждая половинка висит на своей цепи, разогнута и отскочила вверх, разрыв к центру
  const half = (ch, sign, gap) => {
    const a = ch.ang, x = ch.p[0] + Math.cos(a) * 21, y = ch.p[1] + Math.sin(a) * 21;
    return { x, y, s: link(x, y - 2, a * 180 / Math.PI - sign * 14, Lc, rc, { gap }) };
  };
  const hl = half(left, 1, [21, 24]), hr = half(right, -1, [71, 24]);
  s += left.s + right.s + hl.s + hr.s;
  // искры разрыва
  const gx = (hl.x + hr.x) / 2, gy = (hl.y + hr.y) / 2 - 4;
  s += K.I(`<path d="M${f(gx - 6)},${f(gy - 10)} l-4,-7"/><path d="M${f(gx + 6)},${f(gy - 10)} l4,-7"/><path d="M${f(gx)},${f(gy - 13)} v-8"/>` +
    `<path d="M${f(gx - 7)},${f(gy + 10)} l-4,5"/><path d="M${f(gx + 7)},${f(gy + 10)} l4,5"/>`, 1.1);

  s += K.splat(6, 8, 30, 56, 120, 150, WC.c2);
  return s;
};
