// «Акварель кофе» — выбранный стиль для тиража: рисунок как будто написан кофе по хлопковой бумаге,
// без персонажей и без отдельного рождественского декора. Наклейка 80×95 мм → SVG 320×380.
// Это основа (фильтры, кисти, вёрстка подписи и QR). Рисунок каждого дня — в js/coffee/dNN.js:
//   COFFEE_ART[N] = (K, C) => "<svg-фрагмент>"
// K — кисти конкретной наклейки, C — общие помощники и палитра (см. ниже). Рисовать в зоне C.ZONE.
(function () {
  const { T, fit, qr, svg, f } = window.STK;
  const W = 320, H = 380;
  const WC = { paper: "#F8F2E7", white: "#FFFCF4", c1: "#D6AE82", c2: "#A26B3B", c3: "#5A361D", ink: "#3B2414" };
  // зона рисунка: между датой сверху и подписью снизу
  const ZONE = { x0: 14, y0: 48, x1: 306, y1: 274, cx: 160, cy: 161 };

  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const heart = (cx, cy, w) => { const k = w / 2; return `M${f(cx)},${f(cy + k * .9)} C${f(cx - k * 1.35)},${f(cy + k * .05)} ${f(cx - k * .95)},${f(cy - k)} ${f(cx)},${f(cy - k * .38)} C${f(cx + k * .95)},${f(cy - k)} ${f(cx + k * 1.35)},${f(cy + k * .05)} ${f(cx)},${f(cy + k * .9)}Z`; };
  const drop = (x, y, h) => `M${f(x)},${f(y - h / 2)} C${f(x)},${f(y - h / 2)} ${f(x + h * .36)},${f(y)} ${f(x + h * .36)},${f(y + h * .16)} A${f(h * .36)},${f(h * .36)} 0 0 1 ${f(x - h * .36)},${f(y + h * .16)} C${f(x - h * .36)},${f(y)} ${f(x)},${f(y - h / 2)} ${f(x)},${f(y - h / 2)}Z`;
  const star4 = (cx, cy, r) => { const i = r * .2; return `M${f(cx)},${f(cy - r)} Q${f(cx + i)},${f(cy - i)} ${f(cx + r)},${f(cy)} Q${f(cx + i)},${f(cy + i)} ${f(cx)},${f(cy + r)} Q${f(cx - i)},${f(cy + i)} ${f(cx - r)},${f(cy)} Q${f(cx - i)},${f(cy - i)} ${f(cx)},${f(cy - r)}Z`; };
  // семечко одуванчика тушью
  function seed(x, y, rot, sc, c = WC.ink) {
    let fan = "";
    for (let i = -3; i <= 3; i++) { const a = (i * 22 - 90) * Math.PI / 180, ex = Math.cos(a) * 8, ey = -11 + Math.sin(a) * 8; fan += `<line x1="0" y1="-11" x2="${f(ex)}" y2="${f(ey)}"/><circle cx="${f(ex)}" cy="${f(ey)}" r=".8" fill="${c}" stroke="none"/>`; }
    return `<g transform="translate(${f(x)},${f(y)}) rotate(${rot}) scale(${sc})" stroke="${c}" stroke-width="1.3" fill="none"><line x1="0" y1="0" x2="0" y2="-11"/>${fan}<ellipse cx="0" cy="2" rx="1.3" ry="2.6" fill="${c}" stroke="none"/></g>`;
  }

  function defs(id, d) {
    const wash = (fid, scale, erode, blur, seedN) => `
      <filter id="${id}-${fid}" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".028" numOctaves="4" seed="${seedN}" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="d" stdDeviation="${blur}" result="b"/>
        <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="3" result="g"/>
        <feColorMatrix in="g" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.62" result="ga"/>
        <feComposite in="b" in2="ga" operator="in" result="gran"/>
        <feMorphology in="b" operator="erode" radius="${erode}" result="er"/>
        <feComposite in="b" in2="er" operator="out" result="edge"/>
        <feMerge><feMergeNode in="gran"/><feMergeNode in="edge"/></feMerge>
      </filter>`;
    return `<defs>${wash("wc", 13, 2.2, 1.1, d * 7)}${wash("wcf", 4, 1.1, .6, d * 7 + 1)}
      <filter id="${id}-bloom" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" seed="${d * 11}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="5"/></filter>
      <filter id="${id}-ink" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="${d}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>
      <filter id="${id}-ring" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="${d * 13}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".5"/></filter>
      <filter id="${id}-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="4" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .5 -.2"/></filter>
      <radialGradient id="${id}-vig" cx="50%" cy="45%" r="75%"><stop offset=".6" stop-color="#C9A97F" stop-opacity="0"/><stop offset="1" stop-color="#C9A97F" stop-opacity=".28"/></radialGradient>
    </defs>`;
  }

  // кисти: W — размывка (крупная), Wf — размывка для мелочей, Ws — мазок-линия, B — растёкшееся пятно, I — тушь,
  // ring — след от чашки, splat — брызги. Цвета — только из палитры C.WC (монохром кофе + белила).
  function kit(id) {
    return {
      id,
      W: (c, color, op) => `<g filter="url(#${id}-wc)" fill="${color}" opacity="${op}">${c}</g>`,
      Wf: (c, color, op) => `<g filter="url(#${id}-wcf)" fill="${color}" opacity="${op}">${c}</g>`,
      Ws: (d, color, w, op) => `<g filter="url(#${id}-wc)" opacity="${op}"><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/></g>`,
      B: (c, color, op) => `<g filter="url(#${id}-bloom)" fill="${color}" opacity="${op}">${c}</g>`,
      I: (c, w = 1.3) => `<g filter="url(#${id}-ink)" fill="none" stroke="${WC.ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${c}</g>`,
      ring: (cx, cy, r, op) => `<g filter="url(#${id}-ring)" opacity="${op}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#C08A55" fill-opacity=".09"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#9C6436" stroke-width="2.4" stroke-dasharray="${f(r * 4.6)} ${f(r * .5)} ${f(r * .8)} ${f(r * .4)}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="#9C6436" stroke-width=".8" stroke-opacity=".6"/></g>`,
      splat: (seedN, n, x0, y0, x1, y1, color, rMax = 2.2) => {
        const R = rng(seedN); let s = "";
        for (let i = 0; i < n; i++) s += `<circle cx="${f(x0 + R() * (x1 - x0))}" cy="${f(y0 + R() * (y1 - y0))}" r="${f(.4 + R() * rMax)}" fill="${color}" opacity="${f(.35 + R() * .5)}"/>`;
        return s;
      }
    };
  }

  // чашка сбоку: (x, y) — центр ободка, w — ширина; o.dir — ручка вправо (1) или влево (-1)
  function cup(K, x, y, w, o = {}) {
    const h = w * .72, dir = o.dir || 1;
    const body = `M${f(x - w / 2)},${f(y)} L${f(x + w / 2)},${f(y)} C${f(x + w / 2)},${f(y + h * .78)} ${f(x + w * .3)},${f(y + h)} ${f(x)},${f(y + h)} C${f(x - w * .3)},${f(y + h)} ${f(x - w / 2)},${f(y + h * .78)} ${f(x - w / 2)},${f(y)}Z`;
    const shade = `M${f(x + w * .14)},${f(y)} L${f(x + w / 2)},${f(y)} C${f(x + w / 2)},${f(y + h * .78)} ${f(x + w * .32)},${f(y + h)} ${f(x + w * .1)},${f(y + h)}Z`;
    const handle = `M${f(x + dir * w * .46)},${f(y + h * .16)} C${f(x + dir * w * .8)},${f(y + h * .06)} ${f(x + dir * w * .82)},${f(y + h * .66)} ${f(x + dir * w * .33)},${f(y + h * .76)}`;
    let s = "";
    if (o.saucer !== false) s += K.W(`<ellipse cx="${x}" cy="${f(y + h + 2)}" rx="${f(w * .76)}" ry="${f(w * .12)}"/>`, WC.c1, .55);
    s += K.Ws(handle, WC.c1, w * .09, .6);
    s += K.W(`<path d="${body}"/>`, WC.c1, .5);
    s += K.W(`<path d="${shade}"/>`, WC.c2, .38);
    if (o.coffee !== false) s += K.W(`<ellipse cx="${x}" cy="${f(y + 1)}" rx="${f(w / 2 - w * .06)}" ry="${f(w * .085)}"/>`, WC.c3, .85);
    s += K.I(`<g transform="translate(1.6,-1.4)"><path d="${body}"/><ellipse cx="${x}" cy="${y}" rx="${f(w / 2)}" ry="${f(w * .12)}"/><path d="${handle}"/>` +
      (o.saucer !== false ? `<path d="M${f(x - w * .72)},${f(y + h + 4)} Q${x},${f(y + h + w * .2)} ${f(x + w * .74)},${f(y + h + 2)}"/>` : "") + `</g>`);
    return s;
  }

  const C = { WC, ZONE, rng, heart, drop, star4, seed, cup, f };
  window.COFFEE = C;
  window.COFFEE_ART = window.COFFEE_ART || {};

  function renderCoffee(th, o = {}) {
    const d = th.day, id = `kf${d}`, K = kit(id);
    let s = defs(id, d);
    s += `<rect width="${W}" height="${H}" fill="${WC.paper}"/><rect width="${W}" height="${H}" filter="url(#${id}-paper)"/>`;
    const art = window.COFFEE_ART[d];
    s += art ? art(K, C) : `<text x="160" y="170" text-anchor="middle" font-family="Lora" font-style="italic" font-size="14" fill="${WC.c2}">рисунок в работе</text>`;
    s += `<rect width="${W}" height="${H}" fill="url(#${id}-vig)"/>`;
    s += T(22, 38, `${d} декабря`, { font: "Marck Script", size: 23, fill: WC.c2 });
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(22, 300, window.THANKS, { font: "Marck Script", size: 22, fill: WC.ink });
    const fs = fit(th.sticker, 26, 196, .58);
    th.sticker.forEach((l, i) => s += T(21, 328 + i * fs * 1.04, l, { font: "Lora", size: fs, weight: 600, italic: true, fill: WC.ink }));
    const refs = th.verses ? th.verses.map(v => v.ref).join("; ") : th.ref;
    s += T(22, 328 + (th.sticker.length - 1) * fs * 1.04 + 21, refs.length > 30 ? th.verses[0].ref : refs, { font: "Lora", size: 10.5, italic: true, fill: WC.c2 });
    s += qr(window.dayUrl(d), 238, 288, 68, WC.ink, WC.paper) + `</g>`;
    return svg(s, `Наклейка «Акварель кофе», день ${d}: ${th.topic}`);
  }

  // current: рисуется по актуальному списку тем (THEMES), а не по образцам первой версии
  window.STICKER_STYLES.push({ id: "coffee", name: "Акварель кофе", render: renderCoffee, current: true, days: 24 });
})();
