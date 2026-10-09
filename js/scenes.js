// Сцены наклеек дней 1–5: герои и рождественские сюжеты.
// Сцена — это список слоёв от дальнего к ближнему; слой — список фигур. Пространство сцены 320×270.
// Один и тот же список рисуют оба стиля: «Бумага» — как вырезанную бумагу, «Акварель» — размывками кофе и тушью.
//   F(d, цвет, {ink, fine, w, o, only}) — заливка;  S(d, цвет, толщина, {ink, only}) — линия.
//   ink — обвести тушью в акварели; fine — мелкая деталь (меньше растекается); w — тон акварели 1..3 или "paper" (белила);
//   only — фигура только для одного стиля ("paper" | "aqua").
(function () {
  const f = n => +(+n).toFixed(2);
  const F = (d, p, o = {}) => ({ d, p, ...o });
  const S = (d, p, sw, o = {}) => ({ d, p, sw, ...o });
  const circle = (x, y, r) => `M${f(x - r)},${f(y)} a${f(r)},${f(r)} 0 1 0 ${f(2 * r)},0 a${f(r)},${f(r)} 0 1 0 ${f(-2 * r)},0Z`;
  const ellipse = (x, y, rx, ry) => `M${f(x - rx)},${f(y)} a${f(rx)},${f(ry)} 0 1 0 ${f(2 * rx)},0 a${f(rx)},${f(ry)} 0 1 0 ${f(-2 * rx)},0Z`;
  const rect = (x, y, w, h) => `M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)}Z`;
  const SKIN = "#C68B5E", SKIN2 = "#A8724A";

  // человек: x — центр, y — уровень ступней, h — рост
  function person(x, y, h, o) {
    const k = o.kneel ? .66 : 1, top = y - h * .8 * k, w = h * .42 * (o.kneel ? 1.25 : 1);
    const hr = h * .105, hy = top - hr * .72, it = [];
    if (o.halo) it.push(F(circle(x, hy, hr * 1.75), o.halo, { fine: 1, w: "paper" }));
    if (o.wings) {
      const wing = s => `M${f(x + s * w * .08)},${f(top + h * .06)} C${f(x + s * w * 1.15)},${f(top - h * .42)} ${f(x + s * w * 1.35)},${f(top + h * .3)} ${f(x + s * w * .32)},${f(top + h * .48)}Z`;
      it.push(F(wing(-1), o.wings, { ink: 1 }), F(wing(1), o.wings, { ink: 1 }));
    }
    it.push(F(`M${f(x - w * .26)},${f(top)} C${f(x - w * .42)},${f(top + h * .2 * k)} ${f(x - w * .5)},${f(y - h * .18 * k)} ${f(x - w * .54)},${f(y)} L${f(x + w * .54)},${f(y)} C${f(x + w * .5)},${f(y - h * .18 * k)} ${f(x + w * .42)},${f(top + h * .2 * k)} ${f(x + w * .26)},${f(top)} Q${f(x)},${f(top - h * .05)} ${f(x - w * .26)},${f(top)}Z`, o.robe, { ink: 1 }));
    if (o.mantle) it.push(F(`M${f(x - w * .27)},${f(top + 1)} Q${f(x + w * .1)},${f(top + h * .3 * k)} ${f(x + w * .5)},${f(y - h * .26 * k)} L${f(x + w * .53)},${f(y - h * .08 * k)} Q${f(x + w * .05)},${f(top + h * .46 * k)} ${f(x - w * .33)},${f(top + h * .16)}Z`, o.mantle, { ink: 1 }));
    if (o.cloth) {
      it.push(F(`M${f(x - hr * 1.35)},${f(hy + hr * .1)} C${f(x - hr * 1.45)},${f(hy - hr * 1.75)} ${f(x + hr * 1.45)},${f(hy - hr * 1.75)} ${f(x + hr * 1.35)},${f(hy + hr * .1)} L${f(x + w * .36)},${f(top + h * .22 * k)} Q${f(x)},${f(top + h * .28 * k)} ${f(x - w * .36)},${f(top + h * .22 * k)}Z`, o.cloth, { ink: 1 }));
      it.push(F(circle(x + (o.look || 0) * hr * .25, hy + hr * .2, hr * .76), o.skin || SKIN, { ink: 1, fine: 1 }));
    } else {
      it.push(F(circle(x, hy, hr), o.skin || SKIN, { ink: 1, fine: 1 }));
      if (o.hair) it.push(F(`M${f(x - hr * 1.02)},${f(hy + hr * .15)} C${f(x - hr * 1.1)},${f(hy - hr * 1.35)} ${f(x + hr * 1.1)},${f(hy - hr * 1.35)} ${f(x + hr * 1.02)},${f(hy + hr * .15)} Q${f(x)},${f(hy - hr * .5)} ${f(x - hr * 1.02)},${f(hy + hr * .15)}Z`, o.hair, { fine: 1 }));
    }
    if (o.staff) {
      const sx = x + o.staff * w * .62;
      it.push(S(`M${f(sx)},${f(y)} L${f(sx)},${f(top - h * .3)} q0,-9 ${f(o.staff * 7)},-9 q${f(o.staff * 7)},0 ${f(o.staff * 7)},7`, "#5A3A24", 2.6, { ink: 1 }));
    }
    (o.hands || []).forEach(([hx, hy2]) => it.push(F(circle(x + hx * w, top + hy2 * h, hr * .42), o.skin || SKIN, { fine: 1, ink: 1 })));
    return it;
  }

  function sheep(x, y, s = 1) {
    const it = [[-10, 0, 8], [-3, -4, 8], [5, -3, 8], [10, 1, 7], [0, 3, 8]].map(([dx, dy, r]) => F(circle(x + dx * s, y + dy * s, r * s), "#F3EBDD", { w: "paper", fine: 1 }));
    it.unshift(F(rect(x - 9 * s, y + 4 * s, 3 * s, 9 * s), "#3B2A20", { fine: 1 }), F(rect(x + 6 * s, y + 4 * s, 3 * s, 9 * s), "#3B2A20", { fine: 1 }));
    it.push(F(ellipse(x + 15 * s, y - 4 * s, 5 * s, 4 * s), "#3B2A20", { fine: 1, ink: 1 }));
    return it;
  }

  // Вифлеемская звезда с длинным нижним лучом
  const bigStar = (x, y, r, c) => [
    F(`M${f(x)},${f(y - r)} Q${f(x + r * .12)},${f(y - r * .12)} ${f(x + r * .7)},${f(y)} Q${f(x + r * .12)},${f(y + r * .12)} ${f(x)},${f(y + r * 2.3)} Q${f(x - r * .12)},${f(y + r * .12)} ${f(x - r * .7)},${f(y)} Q${f(x - r * .12)},${f(y - r * .12)} ${f(x)},${f(y - r)}Z`, c, { w: "paper", ink: 1 }),
    F(`M${f(x)},${f(y - r * .5)} L${f(x + r * .5)},${f(y)} L${f(x)},${f(y + r * .5)} L${f(x - r * .5)},${f(y)}Z`, c, { w: "paper", fine: 1 })
  ];
  const tinyStars = (pts, c = "#F6E7C1") => pts.map(([x, y, r]) => F(`M${x},${y - r} L${x + r * .3},${y} L${x},${y + r} L${x - r * .3},${y}Z M${x - r},${y} L${x},${y - r * .3} L${x + r},${y} L${x},${y + r * .3}Z`, c, { w: "paper", fine: 1 }));
  const snow = (n, seedN, y0, y1, c = "#FFFFFF") => {
    let a = seedN; const R = () => (a = (a * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: n }, () => F(circle(10 + R() * 300, y0 + R() * (y1 - y0), .8 + R() * 1.6), c, { w: "paper", fine: 1 }));
  };
  const dove = (x, y, s, c = "#FBF8F0") => [
    F(`M${f(x + 6 * s)},${f(y)} C${f(x + 14 * s)},${f(y - 22 * s)} ${f(x + 32 * s)},${f(y - 40 * s)} ${f(x + 52 * s)},${f(y - 46 * s)} C${f(x + 44 * s)},${f(y - 26 * s)} ${f(x + 32 * s)},${f(y - 10 * s)} ${f(x + 20 * s)},${f(y)}Z`, "#E6EEF2", { w: "paper", ink: 1 }),
    F(`M${f(x - 46 * s)},${f(y + 22 * s)} L${f(x - 30 * s)},${f(y + 10 * s)} C${f(x - 14 * s)},${f(y + 4 * s)} ${f(x + 6 * s)},${f(y + 2 * s)} ${f(x + 22 * s)},${f(y - 2 * s)} C${f(x + 28 * s)},${f(y - 10 * s)} ${f(x + 38 * s)},${f(y - 12 * s)} ${f(x + 44 * s)},${f(y - 8 * s)} L${f(x + 54 * s)},${f(y - 6 * s)} L${f(x + 44 * s)},${f(y - 2 * s)} C${f(x + 40 * s)},${f(y + 6 * s)} ${f(x + 30 * s)},${f(y + 12 * s)} ${f(x + 18 * s)},${f(y + 14 * s)} C${f(x)},${f(y + 20 * s)} ${f(x - 18 * s)},${f(y + 22 * s)} ${f(x - 30 * s)},${f(y + 18 * s)} L${f(x - 50 * s)},${f(y + 30 * s)}Z`, c, { w: "paper", ink: 1 }),
    F(`M${f(x - 4 * s)},${f(y + 4 * s)} C${f(x - 18 * s)},${f(y - 18 * s)} ${f(x - 16 * s)},${f(y - 46 * s)} ${f(x - 2 * s)},${f(y - 64 * s)} C${f(x + 4 * s)},${f(y - 44 * s)} ${f(x + 14 * s)},${f(y - 26 * s)} ${f(x + 18 * s)},${f(y - 2 * s)}Z`, "#F1F5F7", { w: "paper", ink: 1 })
  ];
  const fir = (x, y, h, c = "#2E5A3A", snowC = "#F4EEE4") => [
    F(rect(x - 3, y - h * .15, 6, h * .15), "#5A3A24", { fine: 1 }),
    ...[0, 1, 2].map(i => F(`M${f(x)},${f(y - h + i * h * .26)} L${f(x + h * (.2 + i * .1))},${f(y - h * .48 + i * h * .2)} L${f(x - h * (.2 + i * .1))},${f(y - h * .48 + i * h * .2)}Z`, c, { ink: 1 })),
    F(`M${f(x)},${f(y - h)} L${f(x + h * .09)},${f(y - h * .78)} L${f(x - h * .09)},${f(y - h * .78)}Z`, snowC, { fine: 1, w: "paper" })
  ];

  const SCENES = {
    // 1. Живая вода: Иисус и самарянка у колодца; из колодца бьёт свет-вода; над городом — звезда
    1: () => ({
      sky: "day",
      layers: [
        [F(rect(0, 0, 320, 270), "#E7B48A", { only: "paper" })],
        [F(circle(160, 250, 205), "#ECC29C", { only: "paper" })],
        [F(circle(160, 250, 152), "#F1D1B0", { only: "paper" })],
        [F(circle(160, 250, 100), "#F6E0C4", { only: "paper" })],
        [...bigStar(228, 92, 10, "#F4C55A")],
        [F("M0,206 C60,190 120,198 170,196 C230,194 270,184 320,190 V270 H0Z", "#B9A07A"),
          ...[[40, 188], [62, 184], [250, 178], [276, 182]].map(([x, y]) => F(`M${x - 9},${y + 12} V${y} L${x},${y - 8} L${x + 9},${y} V${y + 12}Z`, "#9C8462", { fine: 1 }))],
        [F("M0,238 C80,226 240,226 320,238 V270 H0Z", "#C9A06A")],
        [F(rect(124, 154, 6, 54), "#7A5236", { fine: 1, ink: 1 }), F(rect(190, 154, 6, 54), "#7A5236", { fine: 1, ink: 1 }), F(rect(118, 150, 84, 7), "#6B4426", { fine: 1, ink: 1 }),
          S("M160,157 V178", "#5A3A24", 1.4, { ink: 1 }), F("M153,178 h14 l-2,10 h-10Z", "#8A5E3C", { fine: 1, ink: 1 })],
        [F(rect(126, 206, 68, 40), "#A88B6A", { ink: 1 }), S("M126,219 H194 M126,232 H194 M146,206 V219 M172,219 V232 M150,232 V246", "#8A6E50", 1.2, { only: "paper" }),
          F(ellipse(160, 206, 36, 8), "#BFA27F", { ink: 1 }), F(ellipse(160, 206, 28, 5), "#3E2A1C", { fine: 1 })],
        // живая вода: светлый фонтан и капли
        [F("M156,205 Q154,182 160,160 Q166,182 164,205Z", "#BFE3EE", { w: "paper", ink: 1 }),
          F("M160,160 Q138,158 132,194 Q141,170 160,167Z", "#BFE3EE", { w: "paper", ink: 1, fine: 1 }), F("M160,160 Q182,158 188,194 Q179,170 160,167Z", "#BFE3EE", { w: "paper", ink: 1, fine: 1 }),
          ...[[140, 170, 3], [182, 166, 3.4], [150, 146, 2.4], [172, 142, 2.2], [132, 186, 2.4], [190, 184, 2.6]].map(([x, y, r]) => F(circle(x, y, r), "#D6EEF4", { w: "paper", fine: 1 }))],
        [...person(86, 254, 96, { robe: "#B5545E", cloth: "#E8D6B8", look: 1, hands: [[.38, .34]] }),
          F("M108,206 c-6,0 -9,6 -8,12 c1,8 4,14 10,16 c6,-2 9,-8 10,-16 c1,-6 -2,-12 -8,-12 l0,-5 h-4Z", "#B86A3C", { ink: 1 })],
        [...person(236, 254, 104, { robe: "#F1E6D3", mantle: "#3E6C9A", hair: "#4A2E1C", skin: SKIN2, hands: [[-.5, .3]] })]
      ]
    }),

    // 2. Свет во тьме: пастухи ночью, ангел в сиянии
    2: () => ({
      sky: "night",
      layers: [
        [F(rect(0, 0, 320, 270), "#1C2346", { only: "paper" })],
        [...tinyStars([[40, 60, 3], [74, 34, 2.4], [262, 44, 3], [288, 96, 2.2], [30, 126, 2], [246, 140, 2]])],
        [F(circle(160, 96, 150), "#27305A", { only: "paper" })],
        [F(circle(160, 96, 108), "#3A4678", { only: "paper" })],
        [F(circle(160, 96, 74), "#E8D8A6", { w: "paper", o: .5 })],
        [F(circle(160, 96, 52), "#F5EAC6", { only: "paper" })],
        [...person(160, 150, 92, { robe: "#FFFDF6", wings: "#EFE7D2", halo: "#E2B04A", hair: "#E2B04A", skin: "#E0B088", hands: [[-.55, -.08], [.55, -.08]] })],
        [F("M0,196 C70,178 130,186 180,192 C240,198 280,182 320,186 V270 H0Z", "#2D3B34")],
        [F("M0,226 C80,212 230,214 320,226 V270 H0Z", "#3E5244")],
        [...sheep(126, 248, 1.05), ...sheep(178, 256, .95)],
        [...person(62, 262, 92, { robe: "#7A5A3A", cloth: "#D7C39C", look: 1, staff: -1, hands: [[.34, .22]] })],
        [...person(258, 262, 80, { robe: "#5E6E4A", cloth: "#E5D3AA", look: -1, kneel: 1, hands: [[-.3, .1]] })]
      ]
    }),

    // 3. Дух Святой: Благовещение — Мария, голубь и луч света, свеча и лилия
    3: () => ({
      sky: "day",
      layers: [
        [F(rect(0, 0, 320, 270), "#E6D2B2", { only: "paper" })],
        [F("M150,232 V96 A62,62 0 0 1 274,96 V232Z", "#C7B08E", { only: "paper" })],
        [F("M162,224 V100 A50,50 0 0 1 262,100 V224Z", "#2E4B79", { w: 3, o: .85 }), ...tinyStars([[236, 92, 3], [190, 128, 2], [244, 160, 2.2]]),
          S("M212,52 V224 M162,150 H262", "#C7B08E", 5, { only: "paper" })],
        // луч света от голубя к Марии
        [F("M196,84 L60,206 L132,232 Z", "#F7E7BC", { w: "paper", o: .6 })],
        [...dove(196, 86, .7)],
        [F("M0,232 H320 V270 H0Z", "#B88E62"), S("M0,248 H320 M60,232 L40,270 M140,232 L134,270 M220,232 L228,270", "#A47A50", 1.2, { only: "paper" })],
        [F(rect(250, 190, 26, 42), "#B86A3C", { ink: 1 }), S("M263,190 C262,170 266,150 263,120", "#5C7A3A", 2, { ink: 1 }),
          ...[[263, 118, -20], [256, 134, -60], [271, 140, 40]].map(([x, y, a]) => F(`M${x},${y} q-5,-10 0,-18 q5,8 0,18Z`, "#FBF6EC", { w: "paper", ink: 1, fine: 1 }))],
        [F(rect(286, 206, 9, 26), "#F3EAD8", { ink: 1, fine: 1, w: "paper" }), F("M290.5,192 q6,8 0,13 q-6,-5 0,-13Z", "#F4C55A", { fine: 1, ink: 1, w: 1 })],
        [...person(100, 256, 136, { robe: "#E9DCC4", cloth: "#3E6C9A", look: 1, kneel: 1, hands: [[.12, .28]] })]
      ]
    }),

    // 4. Бог стал человеком: вертеп — Мария, Иосиф, Младенец в яслях, звезда
    4: () => ({
      sky: "night",
      layers: [
        [F(rect(0, 0, 320, 270), "#1F2A4E", { only: "paper" })],
        [F(circle(160, 60, 130), "#28365F", { only: "paper" })],
        [F(circle(160, 60, 80), "#33426F", { only: "paper" })],
        [...tinyStars([[42, 50, 2.6], [70, 96, 2], [266, 40, 2.4], [286, 104, 2], [222, 22, 1.8]])],
        [...bigStar(160, 52, 16, "#F4C55A")],
        [F("M58,252 V130 H262 V252Z", "#6E4A30", { ink: 1 })],
        [F(circle(160, 206, 64), "#E9B96A", { w: "paper", o: .55 })],
        [F("M40,136 L160,90 L280,136 L272,146 L160,104 L48,146Z", "#4E3220", { ink: 1 }), F("M44,134 L160,88 L276,134 L270,128 L160,84 L50,128Z", "#F4EEE4", { w: "paper", fine: 1 }),
          F(rect(62, 140, 8, 112), "#4E3220", { fine: 1 }), F(rect(250, 140, 8, 112), "#4E3220", { fine: 1 })],
        [F("M0,246 C80,238 240,238 320,246 V270 H0Z", "#3D2F27")],
        [...person(108, 254, 92, { robe: "#E9DCC4", cloth: "#3E6C9A", look: 1, kneel: 1, hands: [[.3, .2]] })],
        [...person(214, 254, 104, { robe: "#8A6A3A", mantle: "#6B4226", hair: "#4A2E1C", skin: SKIN2, staff: 1, hands: [[-.36, .26]] })],
        [S("M140,250 L150,232 M180,250 L170,232", "#5A3A24", 3, { ink: 1 }), F("M134,218 L186,218 L180,236 L140,236Z", "#8A5E3C", { ink: 1 }),
          F("M132,218 Q160,206 188,218Z", "#E2C27A", { fine: 1 }), F(circle(150, 210, 13), "#F6D98A", { w: "paper", o: .7, fine: 1 }),
          F(ellipse(162, 212, 15, 6.5), "#FBF5E8", { w: "paper", ink: 1, fine: 1 }), F(circle(149, 210, 5), "#E0B088", { fine: 1, ink: 1 })],
        [...sheep(276, 250, .9)]
      ]
    }),

    // 5. Дружба с Богом: Иисус с фонарём у двери заснеженного дома, дверь открывает ребёнок (Откр 3:20)
    5: () => ({
      sky: "night",
      layers: [
        [F(rect(0, 0, 320, 270), "#22305A", { only: "paper" })],
        [F(circle(70, 60, 18), "#F4EAD0", { w: "paper" }), ...snow(26, 5, 10, 150)],
        [...fir(36, 240, 120, "#2E5A3A")],
        [F("M128,250 V138 H306 V250Z", "#8C5A3C", { ink: 1 })],
        [F("M116,144 L217,82 L318,144 L306,150 L217,96 L128,150Z", "#4A2E22", { ink: 1 }), F("M118,142 L217,80 L316,142 L308,134 L217,76 L126,134Z", "#F4EEE4", { w: "paper", fine: 1 })],
        [F(rect(242, 168, 44, 36), "#F2C46A", { w: "paper", ink: 1 }), S("M264,168 V204 M242,186 H286", "#4A2E22", 2.4, { ink: 1 }),
          F("M160,250 V190 A22,22 0 0 1 204,190 V250Z", "#F6D08A", { w: "paper", ink: 1 })],
        [F(circle(182, 160, 11), "#2E5A3A", { fine: 1, ink: 1 }), F(circle(182, 160, 6), "#8C5A3C", { fine: 1 }), F("M178,168 l4,-3 l4,3 l-2,6 l-2,-3 l-2,3Z", "#B3243A", { fine: 1 })],
        [...person(190, 250, 52, { robe: "#5A6E8A", hair: "#6B4226", hands: [[-.5, .2]] })],
        [F("M0,252 C60,240 140,244 200,250 C250,254 290,246 320,248 V270 H0Z", "#F1ECE3", { w: "paper" })],
        [...person(104, 258, 108, { robe: "#F1E6D3", mantle: "#9A3A2E", hair: "#4A2E1C", skin: SKIN2, hands: [[.48, .2]] }),
          S("M132,180 V190", "#3B2A20", 1.4, { ink: 1 }), F(circle(132, 200, 14), "#F6D08A", { w: "paper", o: .55 }), F(rect(126, 190, 12, 16), "#F2C46A", { ink: 1, fine: 1, w: "paper" })],
        [...snow(22, 11, 30, 250)]
      ]
    })
  };

  window.SCENES = SCENES;
  window.SCENE_KIT = { F, S, circle, ellipse, rect, person, sheep, bigStar, tinyStars, snow, dove, fir };
})();
