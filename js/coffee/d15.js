// День 15 — За Царство вместо тьмы (Кол 1:12–13). Образ: тёмная ночная комната, густая кофейная размывка,
// а в ней — арочное окно с крестом переплёта, за которым встаёт солнце. Свет из окна прорезает тьму
// и ложится полосой на пол; на подоконнике — чашка. Тьма отступает, свет — нетронутая бумага и белила.
COFFEE_ART[15] = (K, C) => {
  const { WC, cup, f } = C;
  const wx0 = 104, wx1 = 216, wcx = 160, ar = 56, wy = 122, wb = 210;   // окно: края, центр, радиус арки, низ
  let s = "";
  // тьма: силуэт с «замочной скважиной» — окно и луч света на полу остаются бумагой
  const dark = `M36,84 C26,70 36,56 56,58 C84,50 112,58 136,53 C170,48 196,56 222,52 C250,48 280,52 288,68 C300,90 290,120 294,150 C298,184 288,214 292,238 C294,256 280,266 262,264 L248,264 L${wx1 - 2},${wb + 16} L${wx1},${wy} A${ar},${ar} 0 0 0 ${wx0},${wy} L${wx0 + 2},${wb + 16} L72,264 L58,264 C40,268 28,254 30,236 C32,206 24,180 28,150 C32,120 22,100 36,84 Z`;
  // тьма гуще по краям и редеет к окну — радиальный градиент одного тона c3
  s += `<defs><radialGradient id="${K.id}-dk" gradientUnits="userSpaceOnUse" cx="${wcx}" cy="150" r="170">` +
    `<stop offset=".3" stop-color="${WC.c3}" stop-opacity=".35"/><stop offset=".62" stop-color="${WC.c3}" stop-opacity=".8"/><stop offset="1" stop-color="${WC.c3}" stop-opacity="1"/></radialGradient></defs>`;
  s += K.B(`<path d="${dark}"/>`, WC.c2, .3);
  s += K.W(`<path d="${dark}" fill="url(#${K.id}-dk)"/>`, WC.c3, .85);
  // гаснущие звёзды ночи — дальше от окна
  s += K.Wf(`<path d="${C.star4(58, 88, 5)}"/><path d="${C.star4(80, 136, 3)}"/><path d="${C.star4(262, 84, 4)}"/><path d="${C.star4(274, 150, 2.6)}"/><path d="${C.star4(48, 190, 2.6)}"/>`, WC.white, .7);
  // лучи из окна пробивают тьму — клинья белил
  let beams = "";
  [[200, 70, 132], [224, 70, 118], [318, 70, 118], [340, 70, 132]].forEach(([a, r0, r1]) => {
    const t = a * Math.PI / 180, n = t + Math.PI / 2, cx = wcx + Math.cos(t), cy = wy;
    const p0x = wcx + Math.cos(t) * r0, p0y = cy + Math.sin(t) * r0, p1x = wcx + Math.cos(t) * r1, p1y = cy + Math.sin(t) * r1;
    beams += `<path d="M${f(p0x - Math.cos(n) * 2)},${f(p0y - Math.sin(n) * 2)} L${f(p1x - Math.cos(n) * 9)},${f(p1y - Math.sin(n) * 9)} L${f(p1x + Math.cos(n) * 9)},${f(p1y + Math.sin(n) * 9)} L${f(p0x + Math.cos(n) * 2)},${f(p0y + Math.sin(n) * 2)}Z"/>`;
  });
  [[150, 66, 112], [168, 66, 120], [12, 66, 120], [30, 66, 112]].forEach(([a, r0, r1]) => {
    const t = a * Math.PI / 180, n = t + Math.PI / 2, oy = 168;
    const p0x = wcx + Math.cos(t) * r0, p0y = oy + Math.sin(t) * r0 * .5, p1x = wcx + Math.cos(t) * r1, p1y = oy + Math.sin(t) * r1 * .5;
    beams += `<path d="M${f(p0x)},${f(p0y - 2)} L${f(p1x)},${f(p1y - 9)} L${f(p1x)},${f(p1y + 9)} L${f(p0x)},${f(p0y + 2)}Z"/>`;
  });
  s += K.B(`<ellipse cx="${wcx}" cy="150" rx="84" ry="98"/>`, WC.white, .3);
  s += K.Wf(beams, WC.white, .28);
  // небо в окне: тёплый рассвет сверху, к горизонту — белое
  s += K.W(`<path d="M${wx0},${wy} A${ar},${ar} 0 0 1 ${wx1},${wy} L${wx1},${wy + 8} Q${wcx},${wy - 4} ${wx0},${wy + 8}Z"/>`, WC.c1, .35);
  // солнце встаёт над холмами — белила и лучи
  const sx = 190, sy = 202;
  s += K.Wf(`<circle cx="${sx}" cy="${sy}" r="22"/>`, WC.white, .95);
  let rays = "";
  for (let a = 196; a <= 344; a += 18) {
    const r = a * Math.PI / 180;
    rays += `<path d="M${f(sx + Math.cos(r) * 27)},${f(sy + Math.sin(r) * 27)} L${f(sx + Math.cos(r) * 37)},${f(sy + Math.sin(r) * 37)}"/>`;
  }
  s += K.I(`<path d="M${sx - 22},${sy} A22,22 0 0 1 ${sx + 22},${sy}"/>` + rays, .9);
  // холмы горизонта
  s += K.W(`<path d="M${wx0},${wb - 12} Q130,${wb - 22} 152,${wb - 14} T${wx1},${wb - 10} L${wx1},${wb} L${wx0},${wb}Z"/>`, WC.c1, .55);
  s += K.I(`<path d="M${wx0 + 2},${wb - 13} Q130,${wb - 23} 152,${wb - 15} T${wx1 - 2},${wb - 11}"/>`, .9);
  // две птицы летят к свету
  s += K.I(`<path d="M126,108 q4,-4 8,0 q4,-4 8,0"/><path d="M146,94 q3,-3 6,0 q3,-3 6,0"/>`, 1.1);
  // рама и переплёт-крест
  const frameOut = `M${wx0 - 6},${wb} L${wx0 - 6},${wy} A${ar + 6},${ar + 6} 0 0 1 ${wx1 + 6},${wy} L${wx1 + 6},${wb}`;
  s += K.Ws(frameOut, WC.c2, 7, .55);
  s += K.Wf(`<rect x="${wcx - 3}" y="${wy - ar + 4}" width="6" height="${wb - wy + ar - 4}"/><rect x="${wx0}" y="${wy - 8}" width="${wx1 - wx0}" height="6"/>`, WC.c2, .55);
  s += K.I(`<g transform="translate(1.4,-1.2)"><path d="M${wx0},${wb} L${wx0},${wy} A${ar},${ar} 0 0 1 ${wx1},${wy} L${wx1},${wb}"/>` +
    `<path d="M${wx0 - 7},${wb} L${wx0 - 7},${wy} A${ar + 7},${ar + 7} 0 0 1 ${wx1 + 7},${wy} L${wx1 + 7},${wb}"/>` +
    `<path d="M${wcx - 3},${wy - ar + 1} V${wb} M${wcx + 3},${wy - ar + 1} V${wb}"/><path d="M${wx0},${wy - 8} H${wcx - 3} M${wcx + 3},${wy - 8} H${wx1} M${wx0},${wy - 2} H${wcx - 3} M${wcx + 3},${wy - 2} H${wx1}"/></g>`, 1.2);
  // подоконник
  s += K.W(`<path d="M${wx0 - 16},${wb} L${wx1 + 16},${wb} L${wx1 + 12},${wb + 9} L${wx0 - 12},${wb + 9}Z"/>`, WC.c2, .6);
  s += K.I(`<g transform="translate(1.2,-1)"><path d="M${wx0 - 16},${wb} L${wx1 + 16},${wb} L${wx1 + 12},${wb + 9} L${wx0 - 12},${wb + 9}Z"/></g>`, 1.2);
  // чашка на подоконнике и пар в свете
  s += cup(K, 128, wb - 30, 40, { saucer: false });
  s += K.I(`<path d="M122,${wb - 36} c-4,-7 4,-11 0,-18"/><path d="M133,${wb - 38} c-4,-7 4,-12 0,-20"/>`, 1);
  s += K.splat(15, 7, 40, 70, 290, 262, WC.c3, 1.6);
  return s;
};
