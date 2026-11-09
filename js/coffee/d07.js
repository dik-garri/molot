// День 7 — За Духа Святого (Утешитель, Ин 14:16–17). Образ: пар над чашкой закручивается
// и становится голубем с раскрытыми крыльями — тихое, тёплое присутствие, которое «с вами пребывает».
COFFEE_ART[7] = (K, C) => {
  const { WC, cup, f } = C;
  // голубь анфас, голова вверх; локальные координаты, (0,0) — середина тела. Правое крыло, левое — зеркально
  const N = 7, P = [];
  for (let i = 0; i <= N; i++) { const t = i / N; P.push([100 - 86 * t, -52 + 58 * t + 14 * Math.sin(Math.PI * t)]); }
  let wing = `M8,-20 C22,-40 56,-56 ${f(P[0][0])},${f(P[0][1])}`, quills = "";
  for (let i = 1; i <= N; i++) {
    const [ax, ay] = P[i - 1], [bx, by] = P[i], mx = (ax + bx) / 2 + .51 * 6, my = (ay + by) / 2 + .86 * 6;
    wing += ` Q${f(mx)},${f(my)} ${f(bx)},${f(by)}`;
    if (i < N) { const len = 8 + 14 * Math.sin(Math.PI * i / N); quills += `M${f(bx)},${f(by)} l${f(-.62 * len)},${f(-.78 * len)} `; }
  }
  wing += ` C10,4 6,-8 8,-20Z`;
  const coverts = `M14,-14 C30,-26 52,-36 78,-40`;
  const shadeW = `M${f(P[1][0])},${f(P[1][1])} ` + P.slice(2).map(p => `L${f(p[0])},${f(p[1])}`).join(" ") + ` L22,-14 C50,-26 70,-32 ${f(P[1][0] - 8)},${f(P[1][1] - 6)}Z`;
  const body = `M-14,-37 L-7,-39 C-6,-42 -3,-44 0,-44 C6,-44 9,-39 8,-34 C8,-31 7,-29 9,-27 C14,-22 16,-10 15,4 C14,16 8,24 0,26 C-8,24 -14,16 -15,4 C-16,-10 -13,-22 -8,-28 C-8,-30 -8,-32 -7,-33 L-14,-37Z`;
  const DX = 160, DY = 106, SC = .92;
  const g = (c) => `<g transform="translate(${DX},${DY}) scale(${SC})">${c}</g>`;
  const gi = (c) => `<g transform="translate(${DX + 1.6},${DY - 1.4}) scale(${SC})">${c}</g>`;
  const both = (c) => c + `<g transform="scale(-1,1)">${c}</g>`;

  let s = K.ring(252, 232, 30, .4);
  // тёплое сияние вокруг голубя
  s += K.B(`<ellipse cx="${DX}" cy="${DY - 4}" rx="112" ry="56"/>`, WC.c1, .3);

  // пар поднимается от чашки колышущейся лентой и сам становится хвостом голубя
  const y0 = 194, y1 = DY + 22 * SC;
  const sx = (y, k) => { const u = (y0 - y) / (y0 - y1); return 160 + 10 * Math.sin(u * 2.1 * Math.PI + .5) * (1 - u * .75) + k * (2 + u * u * 7); };
  const strand = (k) => { let d = ""; for (let y = y0; y >= y1 - .1; y -= 3.5) d += `${d ? " L" : "M"}${f(sx(y, k))},${f(y)}`; return d; };
  let rib = "", ribB = "";
  for (let y = y0; y >= y1 - .1; y -= 3.5) { rib += `${rib ? " L" : "M"}${f(sx(y, -1.5))},${f(y)}`; ribB = ` L${f(sx(y, 1.5))},${f(y)}` + ribB; }
  s += K.Wf(`<path d="${rib}${ribB}Z"/>`, WC.c1, .5) + K.Ws(strand(0), WC.white, 5, .7);
  s += K.I(`<path d="${strand(-1)}"/><path d="${strand(1)}"/><path d="${strand(0)}" stroke-width=".8"/>` +
    `<path d="M140,188 C133,180 143,173 135,164" stroke-width=".9"/><path d="M180,188 C187,180 177,173 185,164" stroke-width=".9"/>`, 1.2);

  // голубь: размывки белилами по тёплому сиянию, тени светлым и средним кофе
  s += g(both(K.W(`<path d="${wing}"/>`, WC.white, .95)));
  s += g(both(K.Wf(`<path d="${shadeW}"/>`, WC.c1, .45)));
  s += g(K.W(`<path d="${body}"/>`, WC.white, .98) + K.Wf(`<path d="M5,-20 C12,-8 12,10 4,22 C8,10 8,-6 5,-20Z"/>`, WC.c1, .45));
  s += gi(K.I(both(`<path d="${wing}"/>`) + `<path d="${body}"/>`, 1.25));
  s += gi(K.I(both(`<path d="${quills}"/><path d="${coverts}"/>`), .8));
  s += g(`<circle cx="-2" cy="-36" r="1.5" fill="${WC.ink}"/>`);

  s += cup(K, 160, 200, 80);
  s += K.splat(7, 9, 30, 160, 300, 262, WC.c2);
  return s;
};
