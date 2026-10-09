// Иллюстрированные стили по референсам: «Аниме» (живописная анимационная иллюстрация)
// и «Флэт» (плоская векторная иллюстрация с зерном и кислотными акцентами). Дни 1–3, наклейка 80×95 мм (320×380).
(function () {
  const { T, fit, qr, star5, svg, f } = window.STK;
  const W = 320, H = 380;
  const P = (d, fill, x = "") => `<path d="${d}" fill="${fill}" ${x}/>`;
  const C = (cx, cy, r, fill, x = "") => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${x}/>`;
  const E = (cx, cy, rx, ry, fill, x = "") => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${x}/>`;
  const L = (d, c, w, x = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${x}/>`;
  function rng(seed) { let a = seed; return () => (a = (a * 16807) % 2147483647) / 2147483647; }
  const lin = (id, x1, y1, x2, y2, stops) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`;
  const rad = (id, cx, cy, r, stops, units = "userSpaceOnUse") => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="${units}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</radialGradient>`;
  // лепесток от точки (x,y) под углом a (град), длина l, ширина w — для перьев, листьев, лучей
  const petal = (x, y, a, l, w) => {
    const r = a * Math.PI / 180, cx = Math.cos(r), sy = Math.sin(r), px = -sy, py = cx;
    const tx = x + cx * l, ty = y + sy * l, mx = x + cx * l * .45, my = y + sy * l * .45;
    return `M${f(x)},${f(y)} Q${f(mx + px * w)},${f(my + py * w)} ${f(tx)},${f(ty)} Q${f(mx - px * w)},${f(my - py * w)} ${f(x)},${f(y)}Z`;
  };
  const sparkle = (x, y, r, c, glow = "") => (glow ? C(x, y, r * .9, c, `opacity=".45" filter="url(#${glow})"`) : "") +
    P(`M${f(x)},${f(y - r)} Q${f(x + r * .1)},${f(y - r * .1)} ${f(x + r)},${f(y)} Q${f(x + r * .1)},${f(y + r * .1)} ${f(x)},${f(y + r)} Q${f(x - r * .1)},${f(y + r * .1)} ${f(x - r)},${f(y)} Q${f(x - r * .1)},${f(y - r * .1)} ${f(x)},${f(y - r)}Z`, c);
  const keyLine = th => { const m = th.sticker[0].match(/^(за)\s+(.+)$/); return m ? { pre: m[1] + " ", key: m[2] } : { pre: "", key: th.sticker[0] }; };

  /* ════════════════════════════ АНИМЕ ════════════════════════════ */

  const NAVY = "#1B2569", CREAM = "#FBF3E2", ORANGE = "#F2A12E";

  // голова в аниме-манере: dir 1 — смотрит вправо (3/4), front — анфас; look — сдвиг зрачков; tilt — наклон
  function animeHead(x, y, s, o) {
    const dir = o.dir || 1, skin = o.skin || "#F6C9A6", shade = o.shade || "#E0A585", ink = "#2A1E2E";
    const eye = (ex, ey, rx, ry) => E(ex, ey, rx, ry, "#FFFFFF") + E(ex + (o.lx || 0) * .6, ey + (o.ly || 0) * .5, rx * .78, ry * .88, o.iris || "#4A6FB8") +
      C(ex + (o.lx || 0) * .6, ey + (o.ly || 0) * .5, rx * .38, "#141428") + C(ex - rx * .3, ey - ry * .35, rx * .26, "#FFFFFF") +
      L(`M${f(ex - rx * 1.1)},${f(ey - ry * .7)} Q${f(ex)},${f(ey - ry * 1.35)} ${f(ex + rx * 1.15)},${f(ey - ry * .8)}`, ink, .9);
    let back = "", front = "", face = "";
    const hair = o.hair || "#5A3A24";
    if (o.style === "long") {
      back += P("M-15,-6 C-20,-22 16,-27 16,-8 C20,8 19,28 15,46 C6,50 -8,50 -18,44 C-21,26 -20,8 -15,-6Z", hair) +
        L("M-12,6 C-14,20 -13,32 -15,42 M10,6 C13,20 13,32 12,42", o.hairHi || "#FFE7A0", 1.2, `opacity=".8"`);
      front += P("M-11.5,-5 C-11,-18 11,-19 12.5,-6 C9,-11 5,-9 2,-13 C-1,-9 -5,-12 -7,-8 C-9,-8 -10,-7 -11.5,-5Z", hair) +
        L("M-6,-14 C-2,-16 3,-16 7,-13", o.hairHi || "#FFE7A0", 1, `opacity=".9"`);
    } else if (o.style === "short") {
      back += P("M-11,-3 C-14,6 -13,13 -9,16 L-6,6Z", hair);
      front += P("M-11.5,-3 C-12.5,-17 11,-19 12.5,-6 C8,-10 2,-12 -4,-10 C-7,-8 -9,-6 -11.5,-3Z", hair) + L("M-6,-13 C-1,-15 4,-14 8,-11", "#8A6040", .8);
      if (o.beard) front += P("M-7,5 C-6,13 0,17 5,15 C9,12 11,7 11,4 C8,9 4,10 0,9.5 C-3,9 -5,7 -7,5Z", hair);
    } else if (o.style === "cloth" || o.style === "veil") {
      back += P("M-14,-4 C-15,-21 13,-23 15,-6 C17,5 16,16 15,26 L-17,28 C-18,14 -16,4 -14,-4Z", o.cloth) +
        P("M-14,-4 C-16,8 -16,18 -17,28 L-9,28 C-11,16 -11,6 -10,-2Z", o.clothShade || "rgba(0,0,0,.18)");
      if (o.beard) front += P("M-7,5 C-6,13 0,17 5,15 C9,12 11,7 11,4 C8,9 4,10 0,9.5 C-3,9 -5,7 -7,5Z", o.beard);
      front += P("M-12.5,-6 C-11,-15 -4,-17 2,-16.5 C-5,-14 -9,-10 -10.5,-2 C-11.5,6 -12,14 -14,22Z", o.cloth);
      if (o.band) front += P("M-12.5,-9 C-6,-14.5 6,-15 13.5,-9.5 L13.8,-6.8 C6,-12 -6,-11.5 -12.2,-6Z", o.band);
      if (o.fringe) front += P("M-9,-8 C-6,-11 0,-12 5,-11 C1,-10 -3,-8 -5,-6Z", o.fringe);
    }
    if (o.front) {
      face += P("M-10,-4 C-10,-15 10,-15 10,-4 C10,4 6,12 0,14 C-6,12 -10,4 -10,-4Z", skin) + P("M-10,-4 C-10,4 -7,10 -3,13 C-6,6 -7,0 -6,-6Z", shade, `opacity=".6"`);
      face += eye(-4.4, 0, 2.5, 3) + eye(4.4, 0, 2.5, 3);
      face += L("M-1.2,7.8 Q0,8.6 1.4,7.8", "#B0605A", .9) + E(-6, 4.2, 2.2, 1.1, "#F29A9A", `opacity=".4"`) + E(6, 4.2, 2.2, 1.1, "#F29A9A", `opacity=".4"`);
    } else {
      face += P("M-10,-4 C-10,-14 10,-15 11,-5 C12,2 9,9 4,13 C1,15 -3,15 -6,12 C-9,9 -10,4 -10,-4Z", skin) +
        P("M-10,-4 C-10,4 -8,9 -5,12 C-7,6 -7,0 -6,-6Z", shade, `opacity=".7"`) + E(-6, 1, 1.9, 2.9, shade);
      face += eye(2.4, 0, 2.5, 3) + eye(8.6, -.4, 1.5, 2.7);
      face += L("M10.4,1.2 l1.1,2.3 l-1.3,.4", shade, .8) + L("M4.6,8 q1.8,.9 3.4,0", "#B0605A", .9) + E(4.2, 4.4, 2.3, 1.1, "#F29A9A", `opacity=".4"`);
    }
    return `<g transform="translate(${f(x)},${f(y)}) rotate(${o.tilt || 0}) scale(${f(dir * s)},${f(s)})">${back}${face}${front}</g>`;
  }

  // облако, подсвеченное со стороны света (dx, dy)
  // кучевое облако с плоским низом: тень сверху-сбоку, подсветка от источника света (dx, dy)
  function cloud(x, y, w, seedN, cols, dx, dy, filt) {
    const R = rng(seedN), n = 6, id = `${filt}-c${seedN}`;
    let b = "";
    const bumps = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), r = w * (.12 + .13 * Math.sin(t * Math.PI)) * (.85 + R() * .35);
      bumps.push([x - w / 2 + w * (.12 + .76 * t) + (R() - .5) * 6, y - r * .55, r]);
    }
    const shape = c => bumps.map(([cx, cy, r]) => C(cx, cy, r, c)).join("") + P(`M${f(x - w * .42)},${f(y - 6)} h${f(w * .84)} v6 h${f(-w * .84)}Z`, c);
    const shift = (k, c, sc) => bumps.map(([cx, cy, r]) => C(cx + dx * r * k, cy + dy * r * k, r * sc, c)).join("");
    b += `<clipPath id="${id}"><rect x="${f(x - w)}" y="${f(y - w)}" width="${f(2 * w)}" height="${f(w)}"/></clipPath>`;
    b += `<g clip-path="url(#${id})" filter="url(#${filt})">${shape(cols.shade)}<g opacity=".9">${shift(.18, cols.mid, .86)}</g><g opacity=".85">${shift(.42, cols.lit, .55)}</g></g>`;
    return b;
  }
  const cypress = (x, y, h, c) => P(`M${f(x)},${f(y - h)} C${f(x + h * .2)},${f(y - h * .6)} ${f(x + h * .18)},${f(y - h * .1)} ${f(x + h * .06)},${f(y)} L${f(x - h * .06)},${f(y)} C${f(x - h * .18)},${f(y - h * .1)} ${f(x - h * .2)},${f(y - h * .6)} ${f(x)},${f(y - h)}Z`, c);
  function town(x0, y0, n, seedN, wall, shade, win, glow) {
    const R = rng(seedN); let s = "";
    for (let i = 0; i < n; i++) {
      const w = 12 + R() * 12, h = 10 + R() * 14, x = x0 + i * 13 + R() * 4, y = y0 + (R() - .5) * 6;
      s += P(`M${f(x)},${f(y)} h${f(w)} v${f(-h)} h${f(-w)}Z`, wall) + P(`M${f(x + w * .62)},${f(y)} h${f(w * .38)} v${f(-h)} h${f(-w * .38)}Z`, shade);
      if (R() < .35) s += P(`M${f(x + w * .2)},${f(y - h)} a${f(w * .3)},${f(w * .3)} 0 0 1 ${f(w * .6)},0Z`, wall);
      if (R() < .75) { const wx = x + w * (.2 + R() * .4), wy = y - h * (.35 + R() * .3); s += C(wx + 1.2, wy + 1.5, 3, glow, `opacity=".5"`) + P(`M${f(wx)},${f(wy)} h2.6 v3.2 h-2.6Z`, win); }
    }
    return s;
  }
  const sheep = (x, y, s, look, hi) => {
    let w = "";
    [[-12, 0, 9], [-4, -6, 10], [6, -5, 10], [13, 0, 8], [2, 3, 10], [-8, 5, 8], [9, 6, 8]].forEach(([dx, dy, r]) => w += C(x + dx * s, y + dy * s, r * s, "#D9D4E6"));
    [[-12, -2, 7], [-4, -8, 8], [6, -7, 8], [12, -2, 6], [1, -1, 7]].forEach(([dx, dy, r]) => w += C(x + dx * s - 1, y + dy * s - 1, r * s, "#F7F4EC"));
    w += C(x + 4 * s, y - 9 * s, 4 * s, hi, `opacity=".7"`);
    const hx = x + look * 16 * s, hy = y - 4 * s;
    w += E(hx - look * 4 * s, hy - 2 * s, 4 * s, 2.2 * s, "#2A2430", `transform="rotate(${look * -30} ${f(hx)} ${f(hy)})"`) +
      E(hx, hy, 6 * s, 7 * s, "#2A2430") + C(hx + look * 1.5 * s, hy - 1.5 * s, 1.6 * s, "#FFFFFF") + C(hx + look * 1.9 * s, hy - 2.2 * s, .8 * s, "#141428");
    return w;
  }

  function animeDefs(id, seedN) {
    return `<filter id="${id}-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="${id}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
      <filter id="${id}-cloud" x="-30%" y="-40%" width="160%" height="180%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="3" seed="${seedN}" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".9"/></filter>
      <filter id="${id}-paint" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${seedN + 3}"/>
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .45 -.2"/></filter>
      <filter id="${id}-rough" x="-10%" y="-40%" width="120%" height="180%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="${seedN}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter>
      ${rad(`${id}-vig`, 160, 130, 230, [[.55, "#000", 0], [1, "#0A0820", .45]])}`;
  }

  const ANIME = {
    // 1. Живая вода: закат, Иисус и самарянка у колодца, из колодца поднимается свет
    1(id) {
      let d = lin(`${id}-sky`, 0, 0, 0, 1, [[0, "#34407E"], [.42, "#7A5CA6"], [.72, "#EE8E7A"], [1, "#FFD28C"]]) +
        rad(`${id}-sun`, 54, 196, 140, [[0, "#FFF0C0", .9], [.4, "#FFC88A", .45], [1, "#FF9A7A", 0]]) +
        lin(`${id}-hill`, 0, 0, 0, 1, [[0, "#9C6E9A"], [1, "#6E5088"]]) + lin(`${id}-ground`, 0, 0, 0, 1, [[0, "#E2A274"], [1, "#B06C52"]]) +
        lin(`${id}-stone`, 0, 0, 1, 0, [[0, "#EAC39E"], [.55, "#C99474"], [1, "#8E5E52"]]) + rad(`${id}-water`, 150, 214, 46, [[0, "#E8FFFF", 1], [.5, "#8FEFFF", .6], [1, "#8FEFFF", 0]]) +
        lin(`${id}-beam`, 0, 1, 0, 0, [[0, "#BFF6FF", .55], [1, "#BFF6FF", 0]]) + lin(`${id}-robeJ`, 1, 0, 0, 0, [[0, "#FBF4E6"], [1, "#D9C7AE"]]);
      let s = P("M0,0 H320 V272 H0Z", `url(#${id}-sky)`) + C(54, 196, 140, `url(#${id}-sun)`) + C(54, 190, 18, "#FFF4CC");
      s += cloud(150, 58, 150, 3, { shade: "#6F5A9E", mid: "#C47AA4", lit: "#FFC08A" }, -.5, 1, `${id}-cloud`) + cloud(282, 92, 90, 7, { shade: "#76609E", mid: "#D88AA0", lit: "#FFC79A" }, -1, .7, `${id}-cloud`) + cloud(36, 46, 70, 11, { shade: "#6A5A9C", mid: "#B884B4", lit: "#FFD0A0" }, 0, 1, `${id}-cloud`);
      s += sparkle(272, 30, 9, "#FFF6D8", `${id}-glow`) + sparkle(240, 18, 3.5, "#FFF6D8") + sparkle(300, 52, 2.6, "#FFF6D8");
      s += P("M0,200 C50,186 100,192 150,190 C200,186 250,168 320,172 V272 H0Z", `url(#${id}-hill)`);
      s += town(208, 178, 8, 5, "#E7A98C", "#A06A88", "#FFE08A", "#FFC860") + cypress(196, 186, 30, "#3E3A5E") + cypress(204, 188, 22, "#3E3A5E") + cypress(312, 172, 26, "#3E3A5E");
      s += P("M0,214 C90,204 220,206 320,216 V272 H0Z", `url(#${id}-ground)`) + P("M0,240 C80,232 160,246 320,236 V272 H0Z", "#9E5E4C", `opacity=".45"`);
      // колодец
      s += P("M112,214 h76 v44 h-76Z", `url(#${id}-stone)`) + L("M112,228 H188 M112,243 H188 M134,214 V228 M164,228 V243 M140,243 V258 M176,214 V228", "#7E4E44", .9, `opacity=".6"`);
      s += E(150, 214, 40, 9, "#F0CCA6") + E(150, 214, 32, 6, "#3A2A44") + E(150, 214, 46, 16, `url(#${id}-water)`, `filter="url(#${id}-soft)"`);
      s += P("M126,214 L136,120 L164,120 L174,214Z", `url(#${id}-beam)`, `filter="url(#${id}-soft)"`);
      const R = rng(9); for (let i = 0; i < 16; i++) s += sparkle(130 + R() * 40, 130 + R() * 80, 1 + R() * 2.4, "#E8FFFF");
      // женщина с кувшином
      s += P("M30,272 C30,228 36,196 52,178 C62,170 80,170 90,178 C100,198 104,236 106,272Z", "#B54A62") + P("M30,272 C30,228 36,196 52,178 C46,206 44,240 48,272Z", "#8E3450") + L("M88,182 C96,200 100,232 102,268", "#FFB08A", 1.4, `opacity=".7"`);
      s += animeHead(70, 156, 1.35, { dir: 1, style: "veil", cloth: "#D9784E", clothShade: "#A9543A", fringe: "#3A2418", iris: "#5A3A28", lx: 1, ly: 0 });
      s += E(92, 230, 13, 16, "#C46A3A") + E(92, 214, 7, 3, "#A9542E") + P("M86,216 C82,210 84,204 88,203", "none", `stroke="#A9542E" stroke-width="2.5"`) + E(88, 226, 3, 7, "#E89060", `opacity=".7"`) + E(80, 222, 4.5, 3.2, "#F6C9A6");
      // Иисус
      s += P("M206,272 C204,226 210,184 224,168 C236,158 252,160 262,170 C276,190 280,232 282,272Z", `url(#${id}-robeJ)`);
      s += P("M226,170 C244,176 262,206 270,272 L250,272 C246,226 236,196 222,178Z", "#2F5EA8") + P("M226,170 C238,178 248,198 254,226 L246,230 C240,206 232,188 222,178Z", "#24488A");
      s += P("M220,180 C206,186 196,192 186,196 L184,204 C196,202 208,198 222,194Z", "#EFE4D2") + E(184, 199, 6, 4, "#F0BE98");
      s += C(182, 192, 7, "#BFF6FF", `opacity=".8" filter="url(#${id}-glow)"`) + C(182, 192, 3, "#FFFFFF");
      s += animeHead(242, 146, 1.35, { dir: -1, style: "short", beard: true, hair: "#4A2E1C", iris: "#4A3020", lx: 1 });
      s += P("M0,0 H320 V272 H0Z", `url(#${id}-vig)`);
      return { defs: d, art: s };
    },

    // 2. Свет во тьме: ангел в сиянии, пастухи смотрят вверх, овцы, Вифлеем на холме
    2(id) {
      let d = lin(`${id}-sky`, 0, 0, 0, 1, [[0, "#15215E"], [.55, "#2D3A8A"], [1, "#5B4E9E"]]) +
        rad(`${id}-halo`, 160, 104, 170, [[0, "#FFF2C4", .85], [.35, "#FFE2A0", .4], [1, "#FFD08A", 0]]) +
        rad(`${id}-ray`, 160, 104, 270, [[0, "#FFF6D2", .7], [1, "#FFF6D2", 0]]) +
        lin(`${id}-hill`, 0, 0, 0, 1, [[0, "#3A3F8C"], [1, "#272C6C"]]) + lin(`${id}-front`, 0, 0, 0, 1, [[0, "#2B5A78"], [1, "#183450"]]) +
        lin(`${id}-wing`, 0, 0, 1, 1, [[0, "#FFFFFF"], [1, "#F4D48E"]]) + lin(`${id}-robe`, 0, 0, 1, 0, [[0, "#E2DDF4"], [.5, "#FFFFFF"], [1, "#EDE6FA"]]) +
        lin(`${id}-shep`, 0, 0, 1, 0, [[0, "#6E2222"], [.7, "#9A3434"], [1, "#C2584A"]]);
      let s = P("M0,0 H320 V272 H0Z", `url(#${id}-sky)`);
      [[40, 30, 4], [92, 56, 2.6], [250, 26, 3.4], [288, 66, 4.4], [214, 54, 2.4], [26, 100, 2.6], [302, 130, 2.2], [120, 22, 2]].forEach(([x, y, r]) => s += sparkle(x, y, r, "#FFF4D6"));
      s += sparkle(160, 18, 15, "#FFF8E0", `${id}-glow`) + sparkle(160, 18, 6, "#FFFFFF");
      s += C(160, 104, 170, `url(#${id}-halo)`);
      s += cloud(52, 122, 120, 4, { shade: "#4E4590", mid: "#9C7BC2", lit: "#FFC4A4" }, 1, .2, `${id}-cloud`) + cloud(270, 108, 110, 8, { shade: "#4E4590", mid: "#A07EC4", lit: "#FFC9A8" }, -1, .3, `${id}-cloud`) + cloud(60, 60, 80, 12, { shade: "#3E3A84", mid: "#7A6AB2", lit: "#E9B4B4" }, 1, .6, `${id}-cloud`);
      s += P("M75,60 A100,100 0 0 1 245,60", "none", `stroke="#FFE7A8" stroke-width="1.3" opacity=".55"`);
      // лучи
      let rays = ""; for (let i = 0; i < 17; i++) { const a = 18 + i * 9 + (i % 2) * 2, w = i % 3 ? 2.2 : 3.6; const r1 = (a - w) * Math.PI / 180, r2 = (a + w) * Math.PI / 180; rays += P(`M160,104 L${f(160 + Math.cos(r1) * 280)},${f(104 + Math.sin(r1) * 280)} L${f(160 + Math.cos(r2) * 280)},${f(104 + Math.sin(r2) * 280)}Z`, `url(#${id}-ray)`); }
      s += P("M0,192 C60,172 120,184 170,180 C230,176 280,160 320,168 V272 H0Z", `url(#${id}-hill)`);
      s += town(232, 172, 7, 3, "#7470AC", "#504C8C", "#FFD27A", "#FFC860") + cypress(222, 182, 28, "#1E2A5A") + cypress(304, 170, 30, "#1E2A5A") + cypress(30, 190, 26, "#1E2A5A");
      s += `<g opacity=".9">${rays}</g>`;
      // крылья
      let wings = "";
      [[-1, 148], [1, 172]].forEach(([sd, ox]) => {
        const ang = a => sd < 0 ? a : 180 - a;      // левое крыло смотрит влево-вверх, правое — зеркально
        [[158, 60], [170, 76], [182, 92], [194, 104], [206, 112], [218, 106]].forEach(([a, l]) => wings += P(petal(ox, 98, ang(a), l, 11), `url(#${id}-wing)`, `stroke="#E8C47E" stroke-width=".6"`));
        [[172, 44], [186, 54], [200, 62], [214, 60]].forEach(([a, l]) => wings += P(petal(ox, 98, ang(a), l, 10), "#FFFDF4", `stroke="#EED39A" stroke-width=".5"`));
        [[190, 30], [208, 34]].forEach(([a, l]) => wings += P(petal(ox, 98, ang(a), l, 9), "#FFFFFF"));
      });
      s += C(160, 100, 60, "#FFF4C8", `opacity=".55" filter="url(#${id}-glow)"`) + wings;
      s += P("M147,94 C130,120 126,162 138,212 C150,222 172,222 184,212 C194,162 190,120 173,94Z", `url(#${id}-robe)`);
      s += P("M152,110 C146,140 146,176 154,214 L160,214 C156,176 154,140 157,112Z", "#CFC6EA", `opacity=".8"`) + P("M168,112 C172,140 174,176 170,214 L176,212 C180,176 178,140 172,110Z", "#D8D0F0", `opacity=".7"`);
      s += P("M150,98 C136,106 124,122 114,140 L126,147 C134,132 144,120 156,112Z", "#FFFFFF") + P("M170,98 C184,106 196,122 206,140 L194,147 C186,132 176,120 164,112Z", "#F3EEFC");
      s += E(118, 144, 6.5, 4, "#F6C9A6", `transform="rotate(-25 118 144)"`) + E(202, 144, 6.5, 4, "#F6C9A6", `transform="rotate(25 202 144)"`);
      s += P("M146,124 Q160,130 174,124", "none", `stroke="#F2C35E" stroke-width="2"`);
      s += C(160, 70, 17, "none", `stroke="#FFE08A" stroke-width="2.2" filter="url(#${id}-soft)"`) + C(160, 70, 17, "none", `stroke="#FFF1C0" stroke-width="1.2"`);
      s += animeHead(160, 78, 1.25, { front: true, style: "long", hair: "#F2B33C", hairHi: "#FFE9A6", iris: "#3E7A9E" });
      s += C(160, 210, 34, "#FFF6D8", `opacity=".6" filter="url(#${id}-glow)"`);
      // передний холм, овцы, пастухи
      s += P("M0,226 C80,208 200,214 320,204 V272 H0Z", `url(#${id}-front)`);
      const R = rng(21); let grass = ""; for (let i = 0; i < 46; i++) { const x = R() * 320, y = 214 + R() * 58; grass += L(`M${f(x)},${f(y)} q${f(-2 + R() * 4)},-6 ${f(-1 + R() * 2)},-${f(7 + R() * 6)}`, R() < .5 ? "#3E7A8E" : "#14304A", 1.1); }
      s += grass;
      s += sheep(146, 250, 1.15, 1, "#FFE6B8") + sheep(196, 258, 1, -1, "#FFE6B8");
      s += L("M36,272 L44,98 C45,84 58,82 62,92 C64,100 58,104 54,100", "#6B4226", 5) + L("M38,272 L46,100", "#9A6A44", 1.6);
      s += P("M0,272 V196 C12,176 34,166 56,168 C80,172 96,192 104,228 L110,272Z", `url(#${id}-shep)`) + P("M0,272 V196 C8,214 12,240 14,272Z", "#5A1A1C");
      s += E(44, 198, 6, 5, "#E9B490");
      s += animeHead(66, 150, 1.6, { dir: 1, tilt: -22, style: "cloth", cloth: "#EFE6D3", clothShade: "#BFB4A0", band: "#1F2E6E", beard: "#3A2416", skin: "#E9B490", shade: "#C88B6A", iris: "#3A2A1E", lx: 1, ly: -1.2 });
      s += P("M222,272 C226,236 240,220 262,218 C286,218 304,234 312,272Z", "#3E6B45") + P("M222,272 C226,240 236,226 248,222 C244,240 242,256 242,272Z", "#2C5034") + L("M262,220 C276,222 292,232 300,250", "#8FC08A", 1.2, `opacity=".6"`);
      s += animeHead(264, 200, 1.25, { dir: -1, tilt: 16, style: "cloth", cloth: "#E9DEC6", clothShade: "#B8AA90", band: "#1F2E6E", fringe: "#5A3A24", iris: "#4A3020", lx: 1, ly: -1.4 });
      s += P("M0,0 H320 V272 H0Z", `url(#${id}-vig)`);
      return { defs: d, art: s };
    },

    // 3. Дух Святой: ночь, Мария у окна смотрит на голубя, луч света, свеча
    3(id) {
      let d = lin(`${id}-wall`, 0, 0, 1, 0, [[0, "#1A1F58"], [1, "#2E3486"]]) + lin(`${id}-win`, 0, 0, 0, 1, [[0, "#22307E"], [.7, "#4048A6"], [1, "#6A5CB0"]]) +
        lin(`${id}-beam`, 1, 0, 0, 1, [[0, "#FFF6C8", .85], [1, "#FFF6C8", 0]]) + lin(`${id}-mantle`, 0, 0, 1, 1, [[0, "#3456C8"], [1, "#1E3290"]]) +
        rad(`${id}-candle`, 288, 206, 60, [[0, "#FFD27A", .6], [1, "#FFD27A", 0]]);
      let s = P("M0,0 H320 V272 H0Z", `url(#${id}-wall)`);
      s += P("M166,240 V84 A68,68 0 0 1 302,84 V240Z", "#2A2050") + P("M178,236 V88 A56,56 0 0 1 290,88 V236Z", `url(#${id}-win)`);
      [[200, 60, 2.4], [262, 54, 3], [278, 120, 2], [192, 120, 2.2], [232, 30, 1.8]].forEach(([x, y, r]) => s += sparkle(x, y, r, "#FFF4D6"));
      s += sparkle(250, 92, 7, "#FFF8E0", `${id}-glow`);
      s += P("M178,236 V200 C200,190 230,196 250,188 C266,182 280,186 290,190 V236Z", "#2A2C6E") + town(186, 214, 7, 13, "#3A3A82", "#2A2A6A", "#FFD27A", "#FFC860") + cypress(282, 206, 28, "#151A48");
      s += L("M234,32 V236 M178,150 H290", "#2A2050", 5);
      s += P("M160,236 h150 v10 h-150Z", "#3A2A5A") + P("M160,236 h150 v3 h-150Z", "#5A4A7E");
      s += C(288, 206, 60, `url(#${id}-candle)`) + P("M282,214 h12 v22 h-12Z", "#F3E9D6") + P("M288,198 C294,206 292,212 288,213 C284,212 282,206 288,198Z", "#FFD27A") + C(288, 208, 7, "#FFE6A0", `opacity=".7" filter="url(#${id}-soft)"`);
      s += P("M22,272 L18,224 h40 l-4,48Z", "#B8643A") + P("M18,224 h40 v6 h-40Z", "#D07A48");
      [[38, 224, -100, 46], [38, 224, -70, 42], [38, 224, -125, 40], [38, 224, -55, 34], [38, 224, -145, 30]].forEach(([x, y, a, l]) => { s += L(`M${x},${y} l${f(Math.cos(a * Math.PI / 180) * l)},${f(Math.sin(a * Math.PI / 180) * l)}`, "#1E4A3A", 1.2); for (let k = 1; k <= 4; k++) { const px = x + Math.cos(a * Math.PI / 180) * l * k / 4.4, py = y + Math.sin(a * Math.PI / 180) * l * k / 4.4; s += P(petal(px, py, a + (k % 2 ? 40 : -40), 11, 3.2), k % 2 ? "#2E7A55" : "#3E9466"); } });
      // луч от голубя к Марии
      s += P("M200,66 L88,132 L132,192Z", `url(#${id}-beam)`, `filter="url(#${id}-soft)"`);
      const R = rng(4); for (let i = 0; i < 22; i++) { const t = R(), x = 200 - t * 92 + (R() - .5) * 26 * t, y = 66 + t * 90 + (R() - .5) * 20 * t; s += sparkle(x, y, .8 + R() * 1.8, "#FFF8D8"); }
      // голубь
      s += C(204, 62, 30, "#FFF6D8", `opacity=".55" filter="url(#${id}-glow)"`);
      s += `<g transform="translate(204,64) scale(1.1)">` + P("M-2,0 C-12,-14 -10,-34 -24,-48 C-4,-42 6,-24 6,-4Z", "#E8EEFA") + P("M4,-2 C10,-20 26,-34 44,-40 C36,-22 26,-8 12,2Z", "#FFFFFF") +
        P("M-30,14 L-16,6 C-4,0 10,-2 20,0 C26,-4 32,-4 34,0 L40,2 L32,4 C28,10 18,14 8,14 C-6,16 -16,16 -24,14 L-36,20Z", "#FFFFFF") + C(29, -0.5, 1.3, "#141428") + `</g>`;
      // Мария
      s += P("M56,272 C44,232 48,192 66,164 C80,142 104,130 124,134 C140,142 144,172 138,204 C150,222 160,250 164,272Z", `url(#${id}-mantle)`);
      s += P("M56,272 C44,232 48,192 66,164 C62,196 62,236 72,272Z", "#16246E") + L("M124,136 C138,146 142,172 138,200 C150,220 158,246 162,268", "#9DB8FF", 1.6, `opacity=".8"`);
      s += P("M120,166 C130,160 140,154 150,148 L154,154 C144,162 134,170 124,176Z", "#F1E8D8") + E(152, 148, 5.5, 4, "#F6C9A6", `transform="rotate(-35 152 148)"`);
      s += animeHead(110, 128, 1.45, { dir: 1, tilt: -26, style: "veil", cloth: "#2F4EC0", clothShade: "#1A2C84", fringe: "#3A2418", iris: "#3A3060", lx: 1, ly: -1.4 });
      s += P("M0,0 H320 V272 H0Z", `url(#${id}-vig)`);
      return { defs: d, art: s };
    }
  };

  function renderAnime(th, o = {}) {
    const d = th.day, id = `an${d}`, sc = ANIME[d](id);
    let s = `<defs>${animeDefs(id, d * 5)}${sc.defs}<clipPath id="${id}-pic"><rect width="320" height="276"/></clipPath></defs>`;
    s += `<g clip-path="url(#${id}-pic)">${sc.art}</g>`;
    s += `<rect width="320" height="276" filter="url(#${id}-paint)" opacity=".12"/>`;
    // кремовая панель с текстом
    s += P("M0,268 C80,262 240,274 320,264 V380 H0Z", CREAM) + P("M0,268 C80,262 240,274 320,264", "none", `stroke="#000" stroke-opacity=".08" stroke-width="2"`);
    s += C(30, 30, 20, CREAM) + T(30, 38, String(d), { font: "Montserrat", size: 22, weight: 800, anchor: "middle", fill: NAVY });
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(16, 294, window.THANKS, { font: "Montserrat", size: 15.5, weight: 800, fill: NAVY });
    const k = keyLine(th), lines = [k.pre + k.key, ...th.sticker.slice(1)], fs = fit(lines, 29, 200, .74);
    s += `<text x="14" y="${f(325)}" font-family="Unbounded" font-weight="900" font-size="${f(fs)}" fill="${NAVY}" letter-spacing="-.5">${k.pre}<tspan fill="${ORANGE}">${k.key}</tspan></text>`;
    th.sticker.slice(1).forEach((l, i) => s += T(14, 325 + (i + 1) * fs * .98, l, { font: "Unbounded", size: fs, weight: 900, fill: NAVY, ls: -.5 }));
    const ry = 325 + (th.sticker.length - 1) * fs * .98 + 20;
    s += T(16, ry, th.ref, { font: "Montserrat", size: 11, weight: 800, fill: NAVY });
    s += P(`M${f(80)},${f(ry - 4)} C130,${f(ry - 9)} 170,${f(ry - 7)} 214,${f(ry - 10)} L214,${f(ry - 7)} C170,${f(ry - 3)} 130,${f(ry - 4)} 82,${f(ry - 1)}Z`, ORANGE, `filter="url(#${id}-rough)" opacity=".9"`);
    s += `<rect x="226" y="284" width="82" height="82" rx="9" fill="#000" opacity=".12" transform="translate(2,3)"/><rect x="226" y="284" width="82" height="82" rx="9" fill="#fff"/>` + qr(window.dayUrl(d), 230, 288, 74, "#141428", "#fff");
    s += `</g>`;
    return svg(s, `Наклейка «Аниме», день ${d}: ${th.topic}`);
  }

  /* ════════════════════════════ ФЛЭТ С ЗЕРНОМ ════════════════════════════ */

  const FB = { navy: "#141A6B", deep: "#1B2390", blue: "#2D3BE0", royal: "#4152F2", violet: "#6A45E0", lav: "#A98BFF", lime: "#D9FF3B", cream: "#F4EEE0", skin: "#F2B08A", skinS: "#D98E6C", terra: "#E07A5F", clay: "#C9774A", green: "#1F6E5A" };
  // профиль без черт лица: смотрит вправо (dir 1); veil — покрывало; up — голова запрокинута
  function flatHead(x, y, s, o) {
    const dir = o.dir || 1;
    let g = "";
    if (o.veil) g += P("M-15,-2 C-16,-19 8,-24 15,-10 C18,-2 16,10 12,22 L-20,30 C-22,16 -19,6 -15,-2Z", o.veil);
    if (o.hair) g += P("M-12,-4 C-14,-17 6,-21 12,-10 C8,-12 2,-12 -2,-9 C-6,-5 -8,2 -9,10 L-14,10 C-15,4 -14,-1 -12,-4Z", o.hair);
    g += P("M-4,-13 C3,-14 9,-10 10,-4 L13,1 L10,2.4 C10.5,6 9,9.5 5,10.5 C2,11.4 -1,10 -3,8 C-6,4 -7,-8 -4,-13Z", FB.skin) + P("M-4,-13 C-7,-8 -6,4 -3,8 C-4,2 -4,-6 -1,-11Z", FB.skinS, `opacity=".7"`);
    g += L("M3.5,-3.5 q1.6,.9 3,0", FB.navy, 1.1);
    if (o.veil) g += P("M-15,-2 C-14,-12 -8,-17 0,-16 C-6,-13 -8,-6 -8,2 C-8,10 -9,18 -12,24Z", o.veil) + (o.veilHi ? L("M-6,-15 C-1,-17 6,-16 10,-12", o.veilHi, 1.2) : "");
    if (o.beard) g += P("M-3,7 C-1,13 6,14 9,9 C9,5 9.5,3 10,2.4 C9,6 6,8 3,8 C1,8 -1,8 -3,7Z", o.beard);
    return `<g transform="translate(${f(x)},${f(y)}) rotate(${o.tilt || 0}) scale(${f(dir * s)},${f(s)})">${g}</g>`;
  }
  const fSpark = (x, y, r, c) => P(`M${f(x)},${f(y - r)} C${f(x + r * .12)},${f(y - r * .2)} ${f(x + r * .2)},${f(y - r * .12)} ${f(x + r)},${f(y)} C${f(x + r * .2)},${f(y + r * .12)} ${f(x + r * .12)},${f(y + r * .2)} ${f(x)},${f(y + r)} C${f(x - r * .12)},${f(y + r * .2)} ${f(x - r * .2)},${f(y + r * .12)} ${f(x - r)},${f(y)} C${f(x - r * .2)},${f(y - r * .12)} ${f(x - r * .12)},${f(y - r * .2)} ${f(x)},${f(y - r)}Z`, c);
  const swoosh = (d, c, w) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const leafFan = (x, y, n, a0, a1, l, c1, c2) => { let s = ""; for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / (n - 1); s += P(petal(x, y, a, l * (.75 + .25 * Math.sin(i)), l * .17), i % 2 ? c1 : c2); } return s; };

  function flatDefs(id, seedN) {
    return `<filter id="${id}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="${seedN}"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .7 -.26"/></filter>
      <filter id="${id}-grainW" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="${seedN + 9}"/>
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .8 -.42"/></filter>
      <filter id="${id}-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
      <filter id="${id}-brush" x="-10%" y="-30%" width="120%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".06 .5" numOctaves="3" seed="${seedN}" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  }

  const FLAT = {
    // 1. Живая вода: сумерки, колодец светится лаймом, самарянка с кувшином и Иисус
    1(id) {
      const d = lin(`${id}-bg`, 0, 0, 0, 1, [[0, FB.blue], [.6, FB.violet], [1, "#8A5CF0"]]) + rad(`${id}-moon`, 236, 84, 80, [[0, "#C9B6FF", .9], [1, "#C9B6FF", 0]]) +
        lin(`${id}-well`, 0, 0, 1, 0, [[0, "#8C6BFF"], [1, FB.deep]]) + rad(`${id}-water`, 150, 212, 50, [[0, FB.lime, .95], [.5, FB.lime, .35], [1, FB.lime, 0]]);
      let s = P("M0,0 H320 V272 H0Z", `url(#${id}-bg)`) + C(236, 84, 80, `url(#${id}-moon)`) + C(236, 84, 30, "#E9E0FF");
      s += P("M0,196 C70,180 130,188 190,184 C240,180 280,168 320,172 V272 H0Z", FB.deep) + town(212, 184, 8, 6, "#232C9E", "#1B2390", FB.lime, FB.lime);
      s += P("M0,222 C90,212 220,214 320,222 V272 H0Z", FB.navy);
      s += P("M112,214 h76 v46 h-76Z", `url(#${id}-well)`) + P("M112,214 h14 v46 h-14Z", "#A98BFF", `opacity=".6"`) + E(150, 214, 40, 9, FB.lav) + E(150, 214, 32, 6, FB.navy);
      s += E(150, 206, 52, 30, `url(#${id}-water)`) + P("M146,213 C145,196 148,178 150,160 C152,178 155,196 154,213Z", FB.lime);
      [[150, 152, 5], [138, 168, 4], [162, 166, 4.4], [128, 184, 3.6], [173, 182, 3.8], [120, 198, 3], [181, 198, 3.2], [144, 140, 2.6], [158, 138, 2.4]].forEach(([x, y, r]) => s += P(`M${x},${y - r * 1.6} C${x + r},${y - r * .3} ${x + r},${y + r} ${x},${y + r} C${x - r},${y + r} ${x - r},${y - r * .3} ${x},${y - r * 1.6}Z`, FB.lime));
      s += E(150, 212, 34, 7, "none", `stroke="${FB.lime}" stroke-width="2"`);
      [[132, 160, 4], [176, 150, 5], [118, 176, 3], [190, 170, 3.4], [154, 136, 3]].forEach(([x, y, r]) => s += fSpark(x, y, r, "#FFFFFF"));
      s += P("M32,272 C32,230 40,196 58,182 C70,174 86,176 94,186 C102,206 106,240 106,272Z", FB.terra) + P("M32,272 C32,230 40,196 58,182 C52,212 50,244 52,272Z", "#B85A44");
      s += flatHead(74, 166, 1.5, { dir: 1, veil: "#F4EEE0", veilHi: "#FFFFFF" });
      s += E(94, 230, 13, 16, FB.clay) + E(94, 214, 7, 3, "#A85C36") + E(90, 224, 3, 7, "#F0A27A", `opacity=".7"`) + E(82, 222, 5, 3.4, FB.skin);
      s += P("M210,272 C208,226 214,186 228,170 C240,160 256,162 266,172 C280,192 284,232 286,272Z", "#FFFFFF") + P("M228,172 C246,180 262,210 270,272 L252,272 C248,226 238,196 224,180Z", FB.navy);
      s += P("M222,182 C208,188 198,194 188,198 L186,206 C198,204 210,200 224,196Z", "#E9E4F8") + E(186, 202, 6, 4, FB.skin) + C(184, 194, 9, FB.lime, `opacity=".7" filter="url(#${id}-glow)"`) + fSpark(184, 192, 5, FB.lime);
      s += flatHead(246, 150, 1.5, { dir: -1, hair: "#3A2418", beard: "#3A2418" });
      s += leafFan(306, 272, 7, -160, -100, 54, FB.green, "#2A8A6E") + leafFan(6, 250, 5, -80, -20, 40, FB.green, "#2A8A6E");
      [[40, 40, 6, FB.lime], [100, 70, 3.5, "#FFFFFF"], [290, 30, 5, FB.lime], [170, 30, 3, "#FFFFFF"]].forEach(([x, y, r, c]) => s += fSpark(x, y, r, c));
      s += swoosh("M206,120 C230,100 262,108 280,90", FB.lime, 2.2) + swoosh("M30,120 C50,110 66,116 80,104", "#FFFFFF", 1.6);
      return { defs: d, art: s };
    },

    // 2. Свет во тьме: ангел и луч-конус, пастухи и овцы на холмах
    2(id) {
      const d = lin(`${id}-bg`, 0, 0, 0, 1, [[0, FB.navy], [.6, FB.deep], [1, FB.royal]]) + lin(`${id}-beam`, 0, 0, 0, 1, [[0, "#F4FFC8", .85], [1, FB.lime, .05]]) +
        lin(`${id}-wing`, 0, 0, 0, 1, [[0, "#FFFFFF"], [1, FB.lav]]);
      let s = P("M0,0 H320 V272 H0Z", `url(#${id}-bg)`);
      [[30, 40, 4, "#fff"], [80, 22, 3, FB.lime], [270, 30, 5, FB.lime], [296, 90, 3, "#fff"], [220, 60, 2.6, "#fff"], [26, 110, 3, FB.lime], [120, 56, 2.4, "#fff"]].forEach(([x, y, r, c]) => s += fSpark(x, y, r, c));
      s += P("M160,96 L60,272 H260Z", `url(#${id}-beam)`) + C(160, 96, 64, FB.lime, `opacity=".28" filter="url(#${id}-glow)"`);
      s += P("M0,200 C60,180 120,190 170,186 C230,182 280,168 320,174 V272 H0Z", FB.deep) + town(234, 178, 7, 4, "#2A35B8", "#1E2898", FB.lime, FB.lime);
      // ангел
      [[-1, 150], [1, 170]].forEach(([sd, ox]) => {
        const ang = a => sd < 0 ? a : 180 - a;
        [[164, 58, FB.lav], [180, 78, "#C9B6FF"], [196, 92, "#E4DAFF"], [212, 96, "#FFFFFF"]].forEach(([a, l, c]) => s += P(petal(ox, 98, ang(a), l, 17), c));
      });
      s += P("M148,92 C138,120 134,160 140,198 L180,198 C186,160 182,120 172,92Z", "#FFFFFF") + P("M148,92 C138,120 134,160 140,198 L152,198 C148,160 148,124 154,96Z", "#DCD2FF");
      s += P("M150,98 C138,106 128,118 120,132 L130,138 C136,126 144,116 156,110Z", "#F2EEFF") + P("M170,98 C182,106 192,118 200,132 L190,138 C184,126 176,116 164,110Z", "#F2EEFF");
      s += E(122, 136, 6, 4, FB.skin) + E(198, 136, 6, 4, FB.skin);
      s += C(160, 70, 16, "none", `stroke="${FB.lime}" stroke-width="2.4"`);
      s += C(160, 78, 11, FB.skin) + P("M149,78 C147,64 173,62 171,78 C169,72 165,70 160,72 C155,70 151,72 149,78Z", "#FFC94A") + P("M148,78 C146,90 150,98 154,100 L150,80Z M172,78 C174,90 170,98 166,100 L170,80Z", "#FFC94A");
      s += L("M154,80 q2,1 4,0 M162,80 q2,1 4,0", FB.navy, 1);
      // холм, овцы, пастухи
      s += P("M0,228 C80,212 200,216 320,206 V272 H0Z", FB.navy);
      const fsheep = (x, y, k) => { let w = ""; [[-10, 0, 9], [-2, -5, 10], [8, -3, 9], [2, 4, 9], [-8, 5, 7]].forEach(([dx, dy, r]) => w += C(x + dx, y + dy, r, "#FFFFFF")); return w + E(x + k * 16, y - 4, 5.5, 7, FB.navy) + C(x + k * 17.5, y - 6, 1.2, FB.lime); };
      s += fsheep(150, 252, 1) + fsheep(198, 258, -1);
      s += L("M40,272 L46,104 C47,92 58,90 62,98 C64,104 58,108 55,104", "#7A4A2A", 4.5);
      s += P("M0,272 V200 C12,180 34,170 58,172 C82,176 98,196 104,232 L110,272Z", FB.clay) + P("M0,272 V200 C8,220 12,244 14,272Z", "#A85C36") + E(46, 200, 6, 5, FB.skin);
      s += flatHead(66, 154, 1.7, { dir: 1, tilt: -24, veil: "#F4EEE0", veilHi: "#FFFFFF", beard: "#3A2418" });
      s += P("M222,272 C226,238 240,222 262,220 C286,220 304,236 312,272Z", FB.violet) + P("M222,272 C226,240 236,228 248,224 C244,242 242,258 242,272Z", "#5434C0");
      s += flatHead(264, 204, 1.3, { dir: -1, tilt: 18, veil: FB.lav, veilHi: "#D8CCFF" });
      s += swoosh("M90,140 C70,120 72,96 90,82", FB.lime, 2) + swoosh("M230,140 C250,120 248,96 230,82", FB.lime, 2);
      return { defs: d, art: s };
    },

    // 3. Дух Святой: Мария у окна, голубь, луч, свеча и растение
    3(id) {
      const d = lin(`${id}-bg`, 0, 0, 1, 1, [[0, FB.blue], [1, FB.navy]]) + lin(`${id}-win`, 0, 0, 0, 1, [[0, FB.deep], [1, FB.violet]]) +
        lin(`${id}-beam`, 0, 0, 1, 1, [[0, "#F6FFD0", .9], [1, FB.lime, 0]]) + lin(`${id}-mantle`, 0, 0, 1, 1, [[0, FB.royal], [1, FB.deep]]);
      let s = P("M0,0 H320 V272 H0Z", `url(#${id}-bg)`);
      s += P("M18,236 V96 A62,62 0 0 1 142,96 V236Z", FB.navy) + P("M30,232 V100 A50,50 0 0 1 130,100 V232Z", `url(#${id}-win)`);
      s += P("M30,232 V196 C52,186 80,194 100,186 C114,182 124,186 130,190 V232Z", FB.navy) + town(36, 214, 6, 9, "#232C9E", "#1B2390", FB.lime, FB.lime);
      s += fSpark(102, 120, 6, "#FFFFFF") + fSpark(60, 80, 3, FB.lime) + L("M80,48 V232 M30,150 H130", FB.navy, 4);
      s += P("M12,236 h150 v9 h-150Z", "#2A2F9E");
      s += P("M20,236 h10 v-18 h-10Z", "#FFF4E0") + P("M25,206 C30,212 29,217 25,218 C21,217 20,212 25,206Z", FB.lime) + C(25, 212, 9, FB.lime, `opacity=".45" filter="url(#${id}-glow)"`);
      s += P("M120,98 L240,150 L194,206Z", `url(#${id}-beam)`);
      s += C(108, 70, 30, "#FFFFFF", `opacity=".35" filter="url(#${id}-glow)"`);
      s += `<g transform="translate(108,72) scale(-1.15,1.15)">` + P("M-2,0 C-12,-14 -10,-34 -24,-48 C-4,-42 6,-24 6,-4Z", "#E4E0FF") + P("M4,-2 C10,-20 26,-34 44,-40 C36,-22 26,-8 12,2Z", "#FFFFFF") +
        P("M-30,14 L-16,6 C-4,0 10,-2 20,0 C26,-4 32,-4 34,0 L40,2 L32,4 C28,10 18,14 8,14 C-6,16 -16,16 -24,14 L-36,20Z", "#FFFFFF") + C(29, -.5, 1.3, FB.navy) + `</g>`;
      // Мария (смотрит влево вверх)
      s += P("M290,272 C302,232 298,192 280,164 C266,142 242,130 222,134 C206,142 202,172 208,204 C196,222 186,250 182,272Z", `url(#${id}-mantle)`) + P("M290,272 C302,232 298,192 280,164 C284,196 284,236 274,272Z", FB.navy);
      s += L("M222,136 C208,146 204,172 208,200", FB.lime, 2, `opacity=".9"`);
      s += P("M226,166 C216,160 206,154 196,148 L192,154 C202,162 212,170 222,176Z", "#F4EEE0") + E(193, 149, 5.5, 4, FB.skin, `transform="rotate(35 193 149)"`);
      s += flatHead(236, 128, 1.7, { dir: -1, tilt: 24, veil: FB.royal, veilHi: FB.lav, hair: "#3A2418" });
      s += P("M262,272 L258,232 h40 l-4,40Z", FB.clay) + leafFan(278, 232, 7, -150, -30, 46, FB.green, "#2A8A6E");
      [[160, 40, 5, FB.lime], [200, 100, 3.5, "#FFFFFF"], [296, 40, 4, FB.lime], [150, 200, 3, FB.lime]].forEach(([x, y, r, c]) => s += fSpark(x, y, r, c));
      s += swoosh("M150,64 C170,52 192,56 206,44", FB.lime, 2.4) + swoosh("M168,120 C176,108 188,104 200,106", "#FFFFFF", 1.6);
      s += P("M294,110 l3,7 l7,1 l-5,5 l1.5,7 l-6.5,-3.5 l-6.5,3.5 l1.5,-7 l-5,-5 l7,-1Z", "none", `stroke="${FB.lime}" stroke-width="1.4" stroke-linejoin="round"`);
      return { defs: d, art: s };
    }
  };

  function renderFlat(th, o = {}) {
    const d = th.day, id = `fl${d}`, sc = FLAT[d](id);
    let s = `<defs>${flatDefs(id, d * 7)}${sc.defs}<clipPath id="${id}-pic"><rect width="320" height="280"/></clipPath></defs>`;
    s += `<g clip-path="url(#${id}-pic)">${sc.art}<rect width="320" height="280" filter="url(#${id}-grain)" opacity=".55"/><rect width="320" height="280" filter="url(#${id}-grainW)" opacity=".35"/></g>`;
    // панель с рваным мазком кисти и цветными мазками
    s += `<g filter="url(#${id}-brush)">` + P("M-6,286 C40,262 70,280 120,268 C170,256 210,274 260,260 C290,252 310,262 330,256 L330,264 C300,270 280,272 250,280 C230,286 236,262 330,276 V390 H-6Z", FB.blue) +
      P("M-6,280 C40,268 80,284 130,272 C180,262 220,280 270,268 C300,262 316,268 330,264 V390 H-6Z", FB.cream) +
      P("M190,372 C230,360 280,362 330,348 L330,390 L180,390Z", FB.blue) + P("M210,366 C250,356 290,358 330,346 L330,354 C292,366 252,364 214,374Z", FB.lime) + `</g>`;
    s += `<g filter="url(#${id}-brush)">` + C(34, 34, 22, FB.lime) + `</g>` + T(34, 42, String(d), { font: "Montserrat", size: 23, weight: 800, anchor: "middle", fill: FB.navy });
    s += L("M60,14 l8,-6 M64,26 l10,-2 M60,38 l8,4", "#FFFFFF", 2);
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(18, 300, window.THANKS, { font: "Montserrat", size: 15.5, weight: 800, fill: FB.navy });
    const k = keyLine(th), lines = [k.pre + k.key, ...th.sticker.slice(1)], fs = fit(lines, 28, 196, .74);
    const kx = 18 + k.pre.length * fs * .62, kw = k.key.length * fs * .74, by = 328;
    s += `<g filter="url(#${id}-brush)">` + P(`M${f(kx - 4)},${f(by - fs * .72)} L${f(kx + kw + 4)},${f(by - fs * .82)} L${f(kx + kw + 2)},${f(by + fs * .1)} L${f(kx - 6)},${f(by + fs * .16)}Z`, FB.lime) + `</g>`;
    s += `<text x="18" y="${by}" font-family="Unbounded" font-weight="900" font-size="${f(fs)}" fill="${FB.navy}" letter-spacing="-.5">${k.pre}${k.key}</text>`;
    th.sticker.slice(1).forEach((l, i) => s += T(18, by + (i + 1) * fs * .96, l, { font: "Unbounded", size: fs, weight: 900, fill: FB.navy, ls: -.5 }));
    s += T(20, by + (th.sticker.length - 1) * fs * .96 + 17, th.ref, { font: "Montserrat", size: 11, weight: 800, fill: FB.navy });
    s += P("M8,310 l2.4,5.6 l6,.6 l-4.6,4 l1.4,6 l-5.2,-3.2 l-5.2,3.2 l1.4,-6 l-4.6,-4 l6,-.6Z", "none", `stroke="${FB.violet}" stroke-width="1.4" stroke-linejoin="round"`);
    s += swoosh("M150,368 C170,362 190,370 212,362", FB.violet, 2);
    s += `<rect x="226" y="286" width="82" height="82" rx="10" fill="${FB.navy}" opacity=".18" transform="translate(2,3)"/><rect x="226" y="286" width="82" height="82" rx="10" fill="#fff"/>` + qr(window.dayUrl(d), 230, 290, 74, "#141428", "#fff");
    s += `</g>`;
    return svg(s, `Наклейка «Флэт», день ${d}: ${th.topic}`);
  }

  window.STICKER_STYLES.push(
    { id: "anime", name: "Аниме", render: renderAnime, illus: true, days: 3 },
    { id: "flat", name: "Флэт", render: renderFlat, illus: true, days: 3 }
  );
})();
