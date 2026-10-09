// Ещё 10 стилей (дни 1–3). Каждый по-своему рисует общие сцены из js/scenes.js: те же герои и рождественские сюжеты.
(function () {
  const { T, fit, qr, star5, svg, f, toHsl, fromHsl } = window.STK;
  const W = 320, H = 380;
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const lum = h => { const [r, g, b] = hx(h); return (.2126 * r + .7152 * g + .0722 * b) / 255; };
  const nearest = (h, pal) => {
    const a = hx(h); let best = pal[0], bd = 1e9;
    pal.forEach(c => { const b = hx(c), d = 2 * (a[0] - b[0]) ** 2 + 4 * (a[1] - b[1]) ** 2 + 3 * (a[2] - b[2]) ** 2; if (d < bd) { bd = d; best = c; } });
    return best;
  };
  const P = (d, fill, x = "") => `<path d="${d}" fill="${fill}" ${x}/>`;
  const C = (cx, cy, r, fill, x = "") => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${x}/>`;
  const L = (d, c, w, x = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${x}/>`;
  function rng(seed) { let a = seed; return () => (a = (a * 16807) % 2147483647) / 2147483647; }
  // обход сцены: fn(item, номер слоя) → svg; skipPaper — пропустить фон, нужный только «Бумаге»
  const walk = (sc, fn, skipPaper = true) => sc.layers.map((l, i) => l.filter(it => it.only !== "aqua" && !(skipPaper && it.only === "paper")).map(it => fn(it, i)).join("")).join("");
  const byLayer = (sc, fn, wrap, skipPaper = true) => sc.layers.map((l, i) => wrap(l.filter(it => it.only !== "aqua" && !(skipPaper && it.only === "paper")).map(it => fn(it, i)).join(""), i)).join("");
  const lines = (th, x, y, fs, lh, o) => th.sticker.map((l, i) => T(x, y + i * fs * lh, o.upper ? l.toUpperCase() : l, { ...o, size: fs })).join("");
  const lastY = (th, y, fs, lh) => y + (th.sticker.length - 1) * fs * lh;
  const qrCard = (d, x, y, s, o = {}) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${o.rx ?? 6}" fill="${o.bg || "#fff"}" ${o.extra || ""}/>` + qr(window.dayUrl(d), x + 4, y + 4, s - 8, o.fg || "#141414", o.bg || "#fff");
  const pixelFilter = (id, B) => `<filter id="${id}" x="0" y="0" width="${W}" height="${H}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
    <feFlood x="${B / 2 - .5}" y="${B / 2 - .5}" width="1" height="1"/><feComposite width="${B}" height="${B}"/><feTile result="a"/>
    <feComposite in="SourceGraphic" in2="a" operator="in"/><feMorphology operator="dilate" radius="${B / 2}"/></filter>`;
  const item = (it, fill, extra = "") => it.sw ? L(it.d, fill, it.sw, extra) : P(it.d, fill, extra);

  /* 1 ─── ЧЕРТЁЖ: белые линии на синей миллиметровке, выноски, штамп ─── */
  const CALLOUTS = {
    1: [[86, 170, "самарянка"], [236, 156, "Иисус"], [160, 186, "живая вода"]],
    2: [[160, 118, "ангел"], [62, 214, "пастух"], [178, 250, "овцы"]],
    3: [[196, 84, "голубь"], [100, 204, "Мария"], [290, 200, "свеча"]]
  };
  function renderBlueprint(th, o = {}) {
    const d = th.day, id = `bp${d}`, sc = SCENES[d](), BL = "#1E4F8F", LN = "#EAF2FF", MONO = "'IBM Plex Mono'";
    let s = `<defs><pattern id="${id}-g1" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8,0 V8 H0" fill="none" stroke="${LN}" stroke-width=".25" opacity=".22"/></pattern>
      <pattern id="${id}-g2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40,0 V40 H0" fill="none" stroke="${LN}" stroke-width=".6" opacity=".3"/></pattern>
      <filter id="${id}-pen" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="2" seed="${d}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.1" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
    s += `<rect width="${W}" height="${H}" fill="${BL}"/><rect width="${W}" height="${H}" fill="url(#${id}-g1)"/><rect width="${W}" height="${H}" fill="url(#${id}-g2)"/>`;
    s += `<rect x="10" y="10" width="300" height="360" fill="none" stroke="${LN}" stroke-width="1.2"/><rect x="14" y="14" width="292" height="352" fill="none" stroke="${LN}" stroke-width=".4"/>`;
    let pic = walk(sc, it => it.sw ? L(it.d, LN, it.sw * .6) : it.ink ? P(it.d, "none", `stroke="${LN}" stroke-width="1.1" stroke-linejoin="round"`) : P(it.d, "none", `stroke="${LN}" stroke-width=".7" stroke-dasharray="3 2" opacity=".5"`));
    CALLOUTS[d].forEach(([x, y, t]) => {
      const tx = x + (x > 200 ? -64 : 18), ty = y - 22;
      pic += C(x, y, 1.8, LN) + L(`M${x},${y} L${x + (x > 200 ? -12 : 12)},${ty + 3} H${tx + (x > 200 ? 58 : 0)}`, LN, .7) + T(tx + (x > 200 ? 2 : 2), ty, t, { font: MONO, size: 8, weight: 500, fill: LN });
    });
    s += `<g filter="url(#${id}-pen)"><g transform="translate(18,20) scale(.89)">${pic}</g></g>`;
    // построение звезды циркулем
    s += `<g transform="translate(272,50)">${C(0, 0, 22, "none", `stroke="${LN}" stroke-width=".6" stroke-dasharray="2 2"`)}${L("M-28,0 H28 M0,-28 V28", LN, .4)}${P(star5(0, 0, 20), "none", `stroke="${LN}" stroke-width="1.1" stroke-linejoin="round"`)}</g>`;
    s += T(232, 86, "Вифлеемская звезда", { font: MONO, size: 6.5, fill: LN, op: .85 });
    s += L("M24,264 H296 M24,260 V268 M296,260 V268", LN, .7) + `<rect x="104" y="258" width="112" height="12" fill="${BL}"/>` + T(160, 267, "24 дня до Рождества", { font: MONO, size: 7.5, anchor: "middle", fill: LN });
    // штамп
    s += `<g opacity="${o.text ?? 1}">`;
    s += `<rect x="14" y="276" width="292" height="90" fill="none" stroke="${LN}" stroke-width="1.2"/>` + L("M214,276 V366 M14,290 H214", LN, .8);
    s += T(20, 286.5, `ЛИСТ ${d}/24`, { font: MONO, size: 8, weight: 700, fill: LN }) + T(208, 286.5, "АДВЕНТ · ЧЕРТЁЖ БЛАГОДАРНОСТИ", { font: MONO, size: 6, anchor: "end", fill: LN, op: .8 });
    s += T(20, 306, window.THANKS, { font: MONO, size: 11, weight: 500, fill: LN });
    const fs = fit(th.sticker, 18, 186, .62);
    s += lines(th, 20, 328, fs, 1.08, { font: MONO, weight: 700, fill: "#FFFFFF" });
    s += T(20, lastY(th, 328, fs, 1.08) + 18, th.ref, { font: MONO, size: 9, fill: LN, op: .85 });
    s += qrCard(d, 222, 281, 80, { rx: 2 }) + `</g>`;
    return svg(s, `Наклейка «Чертёж», день ${d}: ${th.topic}`);
  }

  /* 2 ─── ВЫШИВКА КРЕСТИКОМ: сцена крестиками по канве, в пяльцах с бантом ─── */
  const THREAD = ["#B3243A", "#E2574C", "#2F6B4A", "#5C9A4E", "#2E4B8A", "#5C8FD0", "#E2B04A", "#F4D27A", "#6B4226", "#A8724A", "#E9B490", "#F7F2E6", "#3B2A20", "#8A5A9E", "#9FD3E6", "#C9A06A"];
  function renderStitch(th, o = {}) {
    const d = th.day, id = `cs${d}`, sc = SCENES[d](), B = 6;
    let s = `<defs>${pixelFilter(`${id}-px`, B)}
      <pattern id="${id}-x" width="${B}" height="${B}" patternUnits="userSpaceOnUse"><path d="M1,1 L5,5 M5,1 L1,5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></pattern>
      <mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#${id}-x)"/></mask>
      <pattern id="${id}-aida" width="${B}" height="${B}" patternUnits="userSpaceOnUse"><rect width="${B}" height="${B}" fill="#F3EDDF"/><circle cx="0" cy="0" r=".7" fill="#D6CCB4"/><circle cx="${B}" cy="0" r=".7" fill="#D6CCB4"/><circle cx="0" cy="${B}" r=".7" fill="#D6CCB4"/><circle cx="${B}" cy="${B}" r=".7" fill="#D6CCB4"/></pattern>
      <filter id="${id}-th" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx=".4" dy=".6" stdDeviation=".35" flood-color="#3B2A20" flood-opacity=".55"/></filter>
      <clipPath id="${id}-hoop"><circle cx="160" cy="140" r="116"/></clipPath>
      <linearGradient id="${id}-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2B887"/><stop offset="1" stop-color="#A9744A"/></linearGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="#E9E1CF"/>`;
    s += `<circle cx="160" cy="140" r="118" fill="url(#${id}-aida)"/>`;
    const pic = walk(sc, it => item(it, nearest(it.p, THREAD)));
    s += `<g clip-path="url(#${id}-hoop)"><g filter="url(#${id}-th)"><g mask="url(#${id}-m)"><g filter="url(#${id}-px)"><g transform="translate(28,22) scale(.83)">${pic}</g></g></g></g></g>`;
    s += `<circle cx="160" cy="140" r="122" fill="none" stroke="url(#${id}-wood)" stroke-width="10"/><circle cx="160" cy="140" r="117" fill="none" stroke="#8A5A36" stroke-width="1.4"/>`;
    s += `<rect x="150" y="8" width="20" height="14" rx="2" fill="#B8B8C0"/><rect x="146" y="12" width="28" height="5" rx="2" fill="#8E8E98"/>`;
    s += P("M160,14 C144,0 128,6 134,16 C138,22 152,18 160,14Z", "#C8243A") + P("M160,14 C176,0 192,6 186,16 C182,22 168,18 160,14Z", "#C8243A") + P("M157,14 L146,40 L152,38 L156,44 L160,16Z M163,14 L174,40 L168,38 L164,44 L160,16Z", "#A81C30") + C(160, 14, 4, "#E2384E");
    s += P("M118,16 q8,-12 18,-4 q-6,2 -4,8 q-8,-4 -14,-4Z", "#2F6B4A") + P("M202,16 q-8,-12 -18,-4 q6,2 4,8 q8,-4 14,-4Z", "#2F6B4A") + C(128, 22, 2.4, "#C8243A") + C(192, 22, 2.4, "#C8243A");
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(22, 290, window.THANKS, { font: "Caveat", size: 22, weight: 700, fill: "#9E2A36" });
    const fs = fit(th.sticker, 32, 192, .46);
    s += lines(th, 20, 318, fs, .92, { font: "Caveat", weight: 700, fill: "#2A2018" });
    s += T(22, lastY(th, 318, fs, .92) + 20, th.ref, { font: "Caveat", size: 15, weight: 600, fill: "#6B4226" });
    s += qrCard(d, 228, 282, 80, { extra: `stroke="#C8243A" stroke-width="1.6" stroke-dasharray="4 3"` }) + `</g>`;
    return svg(s, `Наклейка «Вышивка», день ${d}: ${th.topic}`);
  }

  /* 3 ─── МОЗАИКА: смальта на золотом фоне, арка с каймой ─── */
  const SMALT = ["#1F3A7A", "#2F55A8", "#6E9AD8", "#A8322E", "#D9573C", "#F2EDE0", "#D9A27A", "#B07A50", "#6B4226", "#2F6B4A", "#7FA85A", "#5A3A6E", "#E2B04A", "#1A1414", "#9FD3E6"];
  function renderMosaic(th, o = {}) {
    const d = th.day, id = `mo${d}`, sc = SCENES[d](), B = 6;
    const ARC = "M24,268 V150 A136,136 0 0 1 296,150 V268Z";
    let s = `<defs>${pixelFilter(`${id}-px`, B)}
      <pattern id="${id}-t" width="${B}" height="${B}" patternUnits="userSpaceOnUse"><rect x=".6" y=".6" width="${B - 1.2}" height="${B - 1.2}" rx=".6" fill="#fff"/></pattern>
      <filter id="${id}-jit" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".35" numOctaves="1" seed="${d}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter>
      <mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#${id}-t)" filter="url(#${id}-jit)"/></mask>
      <linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2D27A"/><stop offset=".5" stop-color="#D9A845"/><stop offset="1" stop-color="#B8862F"/></linearGradient>
      <filter id="${id}-var" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".25" numOctaves="2" seed="${d + 5}"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .8  0 0 0 .9 -.35"/></filter>
      <filter id="${id}-bev" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx=".3" dy=".5" stdDeviation=".3" flood-color="#000" flood-opacity=".6"/></filter>
      <clipPath id="${id}-arc"><path d="${ARC}"/></clipPath></defs>`;
    s += `<rect width="${W}" height="${H}" fill="#1E1714"/>`;
    const pic = `<rect width="${W}" height="${H}" fill="url(#${id}-gold)"/><rect width="${W}" height="${H}" filter="url(#${id}-var)" opacity=".45"/>` +
      `<g transform="translate(24,6) scale(.85)">${walk(sc, it => item(it, nearest(it.p, SMALT)))}</g>`;
    s += `<g clip-path="url(#${id}-arc)"><rect width="${W}" height="${H}" fill="#2A221E"/><g filter="url(#${id}-bev)"><g mask="url(#${id}-m)"><g filter="url(#${id}-px)">${pic}</g></g></g></g>`;
    s += `<path d="${ARC}" fill="none" stroke="#A8322E" stroke-width="9"/><path d="${ARC}" fill="none" stroke="#F2EDE0" stroke-width="9" stroke-dasharray="5 5"/><path d="${ARC}" fill="none" stroke="#E2B04A" stroke-width="1.4" transform="translate(0,0)"/>`;
    s += P(star5(160, 12, 9), "#E2B04A", `stroke="#1E1714" stroke-width="1"`);
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(22, 296, window.THANKS, { font: "'Cormorant SC'", size: 17, weight: 700, fill: "#E2B04A", ls: 1 });
    const fs = fit(th.sticker, 30, 190, .52);
    s += lines(th, 21, 326, fs, .95, { font: "'Cormorant SC'", weight: 700, fill: "#F2EDE0" });
    s += T(22, lastY(th, 326, fs, .95) + 18, th.ref, { font: "'Cormorant SC'", size: 12, weight: 600, fill: "#E2B04A" });
    s += qrCard(d, 226, 282, 82, { rx: 3, extra: `stroke="#E2B04A" stroke-width="2"` }) + `</g>`;
    return svg(s, `Наклейка «Мозаика», день ${d}: ${th.topic}`);
  }

  /* 4 ─── РИЗОГРАФ: две краски (розовая и синяя) со сдвигом и зерном ─── */
  const PINK = "#FF4FA3", BLUE = "#2F6FDB";
  function renderRiso(th, o = {}) {
    const d = th.day, id = `ri${d}`, sc = SCENES[d]();
    let s = `<defs><filter id="${id}-gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${d * 3}"/>
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2 2.25"/></filter>
      <mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff" filter="url(#${id}-gr)"/></mask>
      <filter id="${id}-pap" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .35  0 0 0 0 .3  0 0 0 .35 -.12"/></filter>
      <clipPath id="${id}-pic"><rect x="16" y="16" width="288" height="246"/></clipPath></defs>`;
    s += `<rect width="${W}" height="${H}" fill="#F4EFE6"/><rect width="${W}" height="${H}" filter="url(#${id}-pap)"/>`;
    // доля каждой краски по цвету фигуры: тёплое — розовая, холодное — синяя, тёмное — обе
    const cover = it => {
      const [h, sat, l] = toHsl(it.p), dark = 1 - l, warm = h < 70 || h > 300;
      if (l > .9) return [0, 0];
      const k = Math.min(1, (it.ink ? .5 : .22) + dark * 1.4);
      return [warm ? k : k * .35, warm ? (dark > .55 ? k * .8 : k * .25) : k];
    };
    const plate = k => walk(sc, it => { const c = cover(it)[k]; return c > .04 ? item(it, k ? BLUE : PINK, `opacity="${f(c)}"`) : ""; });
    const tf = "translate(16,14) scale(.9)";
    s += `<g clip-path="url(#${id}-pic)" mask="url(#${id}-m)"><g style="mix-blend-mode:multiply" transform="translate(1.8,-1.4)"><g transform="${tf}">${plate(1)}</g></g><g style="mix-blend-mode:multiply"><g transform="${tf}">${plate(0)}</g></g></g>`;
    s += `<rect x="16" y="16" width="288" height="246" fill="none" stroke="${BLUE}" stroke-width="2" style="mix-blend-mode:multiply"/>`;
    s += `<g style="mix-blend-mode:multiply">${P(star5(276, 40, 16), PINK)}${P(star5(278, 38, 16), "none", `stroke="${BLUE}" stroke-width="1.6"`)}</g>`;
    let flakes = ""; [[30, 274], [292, 276], [212, 300]].forEach(([x, y]) => flakes += L(`M${x - 5},${y} H${x + 5} M${x},${y - 5} V${y + 5} M${x - 3.5},${y - 3.5} L${x + 3.5},${y + 3.5} M${x + 3.5},${y - 3.5} L${x - 3.5},${y + 3.5}`, BLUE, 1));
    s += flakes;
    s += `<g opacity="${o.text ?? 1}" mask="url(#${id}-m)">`;
    s += T(18, 292, window.THANKS.toUpperCase(), { font: "'Rubik Mono One'", size: 10.5, fill: BLUE });
    const fs = fit(th.sticker.map(l => l.toUpperCase()), 19, 196, .86);
    s += `<g style="mix-blend-mode:multiply" transform="translate(1.6,1.2)">${lines(th, 17, 318, fs, 1.1, { font: "'Rubik Mono One'", fill: BLUE, upper: true })}</g>`;
    s += `<g style="mix-blend-mode:multiply">${lines(th, 17, 318, fs, 1.1, { font: "'Rubik Mono One'", fill: PINK, upper: true })}</g>`;
    s += T(18, lastY(th, 318, fs, 1.1) + 20, th.ref, { font: "'Rubik Mono One'", size: 9, fill: BLUE });
    s += `</g>` + `<g opacity="${o.text ?? 1}">` + qrCard(d, 228, 284, 78, { fg: "#1F3E8C", bg: "#F4EFE6", rx: 0 }) + `</g>`;
    return svg(s, `Наклейка «Ризограф», день ${d}: ${th.topic}`);
  }

  /* 5 ─── АР-ДЕКО: изумруд и золото, сияние, ступенчатая рамка ─── */
  const DECO = ["#0A2A24", "#1F5A4C", "#3E8A74", "#D9B26A", "#F3E7CC", "#7A2E2E", "#C98A5A"];
  function renderDeco(th, o = {}) {
    const d = th.day, id = `ad${d}`, sc = SCENES[d](), G = "#D9B26A", CR = "#F3E7CC";
    const WIN = "M30,262 V112 L58,86 V64 L88,40 H232 L262,64 V86 L290,112 V262Z";
    let s = `<defs><linearGradient id="${id}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E3B33"/><stop offset="1" stop-color="#062019"/></linearGradient>
      <clipPath id="${id}-win"><path d="${WIN}"/></clipPath></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>`;
    let rays = ""; for (let i = 0; i < 24; i++) { const a0 = (180 + i * 7.5) * Math.PI / 180, a1 = a0 + 3.2 * Math.PI / 180; rays += P(`M160,262 L${f(160 + Math.cos(a0) * 300)},${f(262 + Math.sin(a0) * 300)} L${f(160 + Math.cos(a1) * 300)},${f(262 + Math.sin(a1) * 300)}Z`, G, `opacity=".1"`); }
    s += `<g clip-path="url(#${id}-win)"><rect width="${W}" height="${H}" fill="#0F4A3F"/>${rays}<g transform="translate(22,22) scale(.86)">${walk(sc, it => item(it, nearest(it.p, DECO), it.ink && !it.sw ? `stroke="${G}" stroke-width=".9"` : ""))}</g></g>`;
    s += `<path d="${WIN}" fill="none" stroke="${G}" stroke-width="2.4"/><path d="M22,270 V108 L50,82 V60 L84,32 H236 L270,60 V82 L298,108 V270Z" fill="none" stroke="${G}" stroke-width=".8"/>`;
    s += L("M10,10 H50 M10,10 V50 M16,16 H40 M16,16 V40 M310,10 H270 M310,10 V50 M304,16 H280 M304,16 V40", G, 1.2);
    s += `<g transform="translate(160,22)">${P("M0,-14 L3,-3 L14,0 L3,3 L0,14 L-3,3 L-14,0 L-3,-3Z", G)}${P("M0,-8 L5,-5 L8,0 L5,5 L0,8 L-5,5 L-8,0 L-5,-5Z", "none", `stroke="${G}" stroke-width=".8"`)}</g>`;
    const fir = x => L(`M${x},258 L${x + 10},240 L${x + 20},258 M${x + 3},248 L${x + 10},234 L${x + 17},248 M${x + 6},238 L${x + 10},228 L${x + 14},238 M${x + 10},258 V264`, G, 1.1);
    s += fir(36) + fir(264);
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(22, 294, window.THANKS.toUpperCase(), { font: "Montserrat", size: 10, weight: 700, ls: 3, fill: G });
    const fs = fit(th.sticker, 32, 192, .5);
    s += lines(th, 20, 326, fs, .95, { font: "'Poiret One'", weight: 400, fill: CR });
    s += T(22, lastY(th, 326, fs, .95) + 18, th.ref.toUpperCase(), { font: "Montserrat", size: 9, weight: 700, ls: 2, fill: G });
    s += qrCard(d, 226, 282, 82, { bg: CR, rx: 0, extra: `stroke="${G}" stroke-width="2"` }) + `</g>`;
    return svg(s, `Наклейка «Ар-деко», день ${d}: ${th.topic}`);
  }

  /* 6 ─── СНЕЖНЫЙ ШАР: сцена в стеклянном шаре со снегом, на деревянной подставке ─── */
  function renderGlobe(th, o = {}) {
    const d = th.day, id = `sg${d}`, sc = SCENES[d]();
    let s = `<defs><radialGradient id="${id}-bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#7A4A6A"/><stop offset="1" stop-color="#26162E"/></radialGradient>
      <radialGradient id="${id}-glass" cx="50%" cy="50%" r="50%"><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset=".97" stop-color="#E9F2FF" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></radialGradient>
      <linearGradient id="${id}-hl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id}-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5236"/><stop offset="1" stop-color="#4A2A1C"/></linearGradient>
      <filter id="${id}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
      <clipPath id="${id}-in"><circle cx="160" cy="128" r="106"/></clipPath></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>`;
    const R = rng(d * 13); let bokeh = "";
    for (let i = 0; i < 16; i++) bokeh += C(R() * 320, R() * 270, 6 + R() * 12, ["#FFD27A", "#FF8A8A", "#9FD3FF", "#B9F5B0"][i % 4], `opacity="${f(.15 + R() * .25)}" filter="url(#${id}-blur)"`);
    s += bokeh;
    s += `<ellipse cx="160" cy="238" rx="100" ry="10" fill="#000" opacity=".35" filter="url(#${id}-blur)"/>`;
    s += `<g clip-path="url(#${id}-in)"><g transform="translate(34,34) scale(.79)">${walk(sc, it => item(it, it.p), false)}</g>`;
    let flakes = ""; for (let i = 0; i < 46; i++) flakes += C(56 + R() * 208, 26 + R() * 196, .8 + R() * 1.8, "#fff", `opacity="${f(.6 + R() * .4)}"`);
    s += flakes + `<ellipse cx="160" cy="236" rx="110" ry="16" fill="#F4F7FF"/></g>`;
    s += C(160, 128, 106, `url(#${id}-glass)`) + C(160, 128, 106, "none", `stroke="#fff" stroke-opacity=".5" stroke-width="1.2"`);
    s += P("M78,96 A90,90 0 0 1 150,36 A84,84 0 0 0 90,104Z", `url(#${id}-hl)`) + `<ellipse cx="226" cy="60" rx="10" ry="5" fill="#fff" opacity=".45" transform="rotate(40 226 60)"/>`;
    s += P("M84,228 H236 L254,264 H66Z", `url(#${id}-wood)`) + P("M84,228 H236 L238,234 H82Z", "#D9B26A") + P("M66,264 H254 V270 H66Z", "#3A2016");
    s += `<rect x="128" y="240" width="64" height="16" rx="2" fill="#E2C27A"/>` + T(160, 251.5, `${d} декабря`, { font: "'Playfair Display'", size: 9, italic: true, weight: 700, anchor: "middle", fill: "#4A2A1C" });
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(20, 298, window.THANKS, { font: "'Marck Script'", size: 22, fill: "#FFE3B0" });
    const fs = fit(th.sticker, 26, 194, .5);
    s += lines(th, 19, 326, fs, 1.02, { font: "'Playfair Display'", italic: true, weight: 700, fill: "#FFFFFF" });
    s += T(20, lastY(th, 326, fs, 1.02) + 18, th.ref, { font: "'Playfair Display'", size: 11, italic: true, weight: 700, fill: "#E2C27A" });
    s += qrCard(d, 228, 284, 80, { rx: 10 }) + `</g>`;
    return svg(s, `Наклейка «Снежный шар», день ${d}: ${th.topic}`);
  }

  /* 7 ─── МЕЛ НА ДОСКЕ: цветные мелки на грифельной доске, QR на приклеенной записке ─── */
  const CHALK = ["#F7F4EC", "#F4A6B8", "#F6E27A", "#9CC8F0", "#A8DCA0", "#F6B27A", "#C9B2F0"];
  function renderChalk(th, o = {}) {
    const d = th.day, id = `ch${d}`, sc = SCENES[d]();
    let s = `<defs><filter id="${id}-ch" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${d}" result="n"/>
        <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in" result="c"/>
        <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="${d + 2}" result="n2"/><feDisplacementMap in="c" in2="n2" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>
      <filter id="${id}-dust" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="3" seed="${d + 7}"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .35 -.12"/></filter>
      <pattern id="${id}-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="1.4" height="4" fill="#fff"/></pattern>
      <linearGradient id="${id}-frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B07A4A"/><stop offset="1" stop-color="#6B4226"/></linearGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="#26302C"/><rect width="${W}" height="${H}" filter="url(#${id}-dust)"/>`;
    const col = h => nearest(h, CHALK);
    let pic = "";
    sc.layers.forEach(l => l.filter(it => it.only !== "aqua" && it.only !== "paper").forEach(it => {
      const c = lum(it.p) > .8 ? CHALK[0] : col(it.p);
      if (it.sw) { pic += L(it.d, c, it.sw * .7); return; }
      pic += P(it.d, c, `opacity="${it.ink ? .22 : .1}"`) + (it.ink ? P(it.d, `url(#${id}-hatch)`, `opacity=".18"`) : "") + P(it.d, "none", `stroke="${c}" stroke-width="${it.ink ? 1.5 : .9}" stroke-linejoin="round" opacity="${it.ink ? 1 : .55}"`);
    }));
    s += `<g filter="url(#${id}-ch)"><g transform="translate(20,22) scale(.875)">${pic}</g>`;
    let bulbs = L("M20,30 Q90,58 160,30 Q230,58 300,30", "#F7F4EC", 1.2);
    for (let t = .1; t < 1; t += .2) [[20, 30, 90, 58, 160, 30], [160, 30, 230, 58, 300, 30]].forEach(([x0, y0, cx, cy, x1, y1], k) => {
      const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
      bulbs += P(`M${f(x - 3.5)},${f(y + 3)} a3.5,5 0 1 0 7,0 a3.5,5 0 1 0 -7,0Z`, CHALK[1 + (Math.round(t * 10) + k) % 5]);
    });
    s += bulbs + P(star5(160, 22, 10), "none", `stroke="${CHALK[2]}" stroke-width="1.6"`) + `</g>`;
    s += `<rect x="5" y="5" width="310" height="370" fill="none" stroke="url(#${id}-frame)" stroke-width="10"/>`;
    s += `<g opacity="${o.text ?? 1}"><g filter="url(#${id}-ch)">`;
    s += T(22, 288, window.THANKS, { font: "Caveat", size: 22, weight: 700, fill: CHALK[1] });
    const fs = fit(th.sticker, 31, 186, .46);
    s += lines(th, 20, 316, fs, .88, { font: "Caveat", weight: 700, fill: CHALK[0] });
    s += T(22, lastY(th, 316, fs, .88) + 18, th.ref, { font: "Caveat", size: 16, weight: 700, fill: CHALK[2] }) + `</g>`;
    s += `<g transform="rotate(3 266 320)"><rect x="222" y="276" width="88" height="88" fill="#FBF8F0"/>${qr(window.dayUrl(d), 228, 282, 76, "#1E1E1E", "#FBF8F0")}<rect x="250" y="270" width="34" height="11" fill="#E9DFC4" opacity=".85" transform="rotate(-6 267 275)"/></g></g>`;
    return svg(s, `Наклейка «Мел», день ${d}: ${th.topic}`);
  }

  /* 8 ─── РЕТРО-ОТКРЫТКА 50-х: палитра середины века, звёзды-«атомы», смещённый контур ─── */
  const MCM = ["#2A8C82", "#1D5E58", "#9CCFC6", "#E8743B", "#E8B23A", "#C8432B", "#F7EEDC", "#3B2A20", "#B98A5A", "#F2C9A0"];
  function renderRetro(th, o = {}) {
    const d = th.day, id = `mc${d}`, sc = SCENES[d](), BR = "#3B2A20";
    let s = `<defs><filter id="${id}-pap" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="${d}"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .4 -.14"/></filter>
      <clipPath id="${id}-pic"><rect x="20" y="20" width="280" height="240" rx="14"/></clipPath></defs>`;
    s += `<rect width="${W}" height="${H}" fill="#F1E6CF"/>`;
    s += `<rect x="8" y="8" width="304" height="364" rx="18" fill="none" stroke="${BR}" stroke-width="1.4" stroke-dasharray="1 4" stroke-linecap="round"/>`;
    const pic = walk(sc, it => it.sw ? L(it.d, BR, it.sw) : P(it.d, nearest(it.p, MCM)) + (it.ink ? P(it.d, "none", `stroke="${BR}" stroke-width="1.1" transform="translate(1.3,1.1)"`) : ""), false);
    s += `<g clip-path="url(#${id}-pic)"><g transform="translate(20,18) scale(.875)">${pic}</g></g>`;
    s += `<rect x="20" y="20" width="280" height="240" rx="14" fill="none" stroke="${BR}" stroke-width="2"/>`;
    const atom = (x, y, r, c) => { let a = ""; for (let i = 0; i < 4; i++) { const t = i * Math.PI / 4; a += L(`M${f(x - Math.cos(t) * r)},${f(y - Math.sin(t) * r)} L${f(x + Math.cos(t) * r)},${f(y + Math.sin(t) * r)}`, c, i % 2 ? .9 : 1.4); } return a + C(x, y, r * .18, c); };
    s += atom(276, 44, 14, "#E8B23A") + atom(44, 236, 9, "#F7EEDC") + atom(256, 82, 6, "#F7EEDC");
    s += P("M22,272 q10,-8 20,0 q-6,4 -4,10 q-8,-6 -16,-10Z", "#1D5E58") + P("M44,272 q10,-8 20,0 q-6,4 -4,10 q-8,-6 -16,-10Z", "#2A8C82") + C(43, 276, 3, "#C8432B") + C(48, 280, 2.6, "#C8432B");
    s += `<rect width="${W}" height="${H}" filter="url(#${id}-pap)"/>`;
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(72, 292, window.THANKS, { font: "Lobster", size: 20, fill: "#C8432B" });
    const fs = fit(th.sticker.map(l => l.toUpperCase()), 28, 190, .5);
    s += lines(th, 22, 324, fs, .98, { font: "Oswald", weight: 700, fill: BR, upper: true });
    s += T(22, lastY(th, 324, fs, .98) + 18, th.ref, { font: "Oswald", size: 11, weight: 600, fill: "#2A8C82" });
    s += qrCard(d, 226, 282, 80, { bg: "#F7EEDC", rx: 10, extra: `stroke="${BR}" stroke-width="1.6"` }) + `</g>`;
    return svg(s, `Наклейка «Ретро-открытка», день ${d}: ${th.topic}`);
  }

  /* 9 ─── ТЕАТР ТЕНЕЙ: чёрные силуэты, светится только свет; бархатный занавес и огоньки ─── */
  const SKIES = {
    1: [["0", "#2B1B4A"], [".45", "#C2456A"], [".75", "#F6A04D"], ["1", "#FFD58A"]],
    2: [["0", "#0B1030"], [".6", "#2A2F6E"], ["1", "#6A4A8E"]],
    3: [["0", "#141A44"], [".6", "#3A2F72"], ["1", "#8A5A9E"]]
  };
  function renderShadow(th, o = {}) {
    const d = th.day, id = `si${d}`, sc = SCENES[d](), INKS = "#140A18";
    let s = `<defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">${SKIES[d].map(([o2, c]) => `<stop offset="${o2}" stop-color="${c}"/>`).join("")}</linearGradient>
      <filter id="${id}-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="${id}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
      <linearGradient id="${id}-vel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A0E18"/><stop offset=".5" stop-color="#9E1C2A"/><stop offset="1" stop-color="#5A0E18"/></linearGradient>
      <clipPath id="${id}-st"><rect x="0" y="22" width="320" height="248"/></clipPath></defs>`;
    s += `<rect width="${W}" height="${H}" fill="#1A0E12"/>`;
    s += `<g clip-path="url(#${id}-st)"><rect width="${W}" height="270" fill="url(#${id}-sky)"/>`;
    if (d === 1) s += C(214, 196, 56, "#FFE3A0", `opacity=".95"`) + C(214, 196, 80, "#FFD27A", `opacity=".35" filter="url(#${id}-blur)"`);
    if (d === 3) s += C(244, 78, 30, "#FFF2CC", `opacity=".9"`) + C(244, 78, 48, "#FFF2CC", `opacity=".25" filter="url(#${id}-blur)"`);
    s += `<g transform="translate(10,20) scale(.94)">` + walk(sc, it => it.glow ? `<g filter="url(#${id}-glow)">${item(it, lum(it.p) > .85 ? "#FFF0C0" : "#FFD27A", it.o ? `opacity="${Math.max(.4, it.o)}"` : "")}</g>` : item(it, INKS)) + `</g></g>`;
    // занавес
    const fold = (x0, sd) => { let c = ""; for (let i = 0; i < 2; i++) { const x = x0 + sd * i * 9; c += P(`M${x},18 C${x + sd * 8},120 ${x - sd * 2},200 ${x + sd * 10},272 L${x + sd * 18},272 C${x + sd * 8},200 ${x + sd * 18},120 ${x + sd * 9},18Z`, `url(#${id}-vel)`); } return c; };
    s += fold(-8, 1) + fold(328, -1);
    s += P("M0,0 H320 V30 C280,44 240,30 200,40 C170,46 150,46 120,40 C80,30 40,44 0,30Z", `url(#${id}-vel)`) + L("M0,30 C40,44 80,30 120,40 C150,46 170,46 200,40 C240,30 280,44 320,30", "#E2B04A", 2);
    for (let i = 0; i < 13; i++) { const x = 12 + i * 24.6, y = 34 + Math.sin(i * 1.3) * 4; s += C(x, y + 6, 3.4, ["#FFD27A", "#FF8A6A", "#FFE9A6"][i % 3], `filter="url(#${id}-glow)"`) + L(`M${f(x)},${f(y)} v3`, "#2A1A12", 1); }
    s += P("M0,268 H320 V276 H0Z", "#3A2016");
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(20, 302, window.THANKS, { font: "'Playfair Display'", size: 16, italic: true, weight: 700, fill: "#E2B04A" });
    const fs = fit(th.sticker, 27, 194, .52);
    s += lines(th, 19, 330, fs, 1.02, { font: "'Playfair Display'", italic: true, weight: 700, fill: "#FBEFD9" });
    s += T(20, lastY(th, 330, fs, 1.02) + 17, th.ref, { font: "'Playfair Display'", size: 11, italic: true, weight: 700, fill: "#E2B04A" });
    s += qrCard(d, 228, 286, 80, { bg: "#FBEFD9", rx: 4 }) + `</g>`;
    return svg(s, `Наклейка «Театр теней», день ${d}: ${th.topic}`);
  }

  /* 10 ─── ПЛАСТИЛИН: объёмные «лепные» фигурки с бликами ─── */
  function renderClay(th, o = {}) {
    const d = th.day, id = `cl${d}`, sc = SCENES[d]();
    const soft = h => { const [hh, s2, l] = toHsl(h); return fromHsl(hh, Math.min(1, s2 * .85 + .12), .5 + l * .42); };
    let s = `<defs><linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBE3D3"/><stop offset="1" stop-color="#F3C6D2"/></linearGradient>
      <filter id="${id}-clay" x="-10%" y="-10%" width="120%" height="130%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>
        <feDiffuseLighting in="b" surfaceScale="3" diffuseConstant="1" lighting-color="#fff" result="df"><feDistantLight azimuth="225" elevation="55"/></feDiffuseLighting>
        <feComposite in="SourceGraphic" in2="df" operator="arithmetic" k1=".62" k2=".42" k3="0" k4="0" result="sh"/>
        <feSpecularLighting in="b" surfaceScale="3.5" specularConstant=".8" specularExponent="22" lighting-color="#fff" result="sp"><feDistantLight azimuth="225" elevation="45"/></feSpecularLighting>
        <feComposite in="sp" in2="SourceAlpha" operator="in" result="spc"/>
        <feComposite in="spc" in2="sh" operator="arithmetic" k1="0" k2=".5" k3="1" k4="0" result="lit"/>
        <feComposite in="lit" in2="SourceAlpha" operator="in" result="litc"/>
        <feDropShadow in="litc" dx="1.4" dy="2.4" stdDeviation="1.8" flood-color="#7A4A5A" flood-opacity=".35"/>
      </filter>
      <clipPath id="${id}-pic"><rect x="16" y="16" width="288" height="246" rx="24"/></clipPath></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>`;
    s += `<g clip-path="url(#${id}-pic)"><g transform="translate(16,14) scale(.9)">` + byLayer(sc, it => item(it, soft(it.p)), (c, i) => c ? `<g filter="url(#${id}-clay)">${c}</g>` : "", false) + `</g></g>`;
    s += `<rect x="16" y="16" width="288" height="246" rx="24" fill="none" stroke="#fff" stroke-width="5" filter="url(#${id}-clay)"/>`;
    let balls = L("M24,24 Q92,52 160,26 Q228,52 296,24", "#7A4A5A", 1.4);
    [[48, 38, "#F26B6B"], [80, 46, "#6BC4A6"], [112, 42, "#F2C14E"], [208, 42, "#6BA4F2"], [240, 46, "#F26B6B"], [272, 38, "#6BC4A6"]].forEach(([x, y, c]) => balls += C(x, y, 7, c));
    s += `<g filter="url(#${id}-clay)">${balls}${P(star5(160, 26, 13), "#F2C14E")}</g>`;
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(20, 296, window.THANKS, { font: "Comfortaa", size: 15, weight: 700, fill: "#9A4A6A" });
    const fs = fit(th.sticker, 26, 194, .64);
    s += lines(th, 19, 324, fs, 1.1, { font: "Comfortaa", weight: 700, fill: "#5A2A4A" });
    s += T(20, lastY(th, 324, fs, 1.1) + 18, th.ref, { font: "Comfortaa", size: 10.5, weight: 700, fill: "#9A4A6A" });
    s += `<g filter="url(#${id}-clay)"><rect x="226" y="282" width="82" height="82" rx="14" fill="#FFFFFF"/></g>` + qr(window.dayUrl(d), 230, 286, 74, "#3A1E30", "#FFFFFF") + `</g>`;
    return svg(s, `Наклейка «Пластилин», день ${d}: ${th.topic}`);
  }

  [
    ["blueprint", "Чертёж", renderBlueprint, "Белые линии на синей миллиметровке: выноски-подписи, построение звезды циркулем, штамп с номером листа."],
    ["stitch", "Вышивка", renderStitch, "Сцена вышита крестиками по канве и натянута в пяльцы с красным бантом и остролистом."],
    ["mosaic", "Мозаика", renderMosaic, "Смальта на золотом фоне, как в древних храмах; арка с красно-белой каймой."],
    ["riso", "Ризограф", renderRiso, "Печать двумя красками — розовой и синей — со сдвигом и зерном; где краски накладываются, получается фиолетовый."],
    ["deco", "Ар-деко", renderDeco, "Изумруд и золото, лучи-сияние, ступенчатое окно и геометрические ёлочки."],
    ["globe", "Снежный шар", renderGlobe, "Сцена внутри стеклянного шара со снегом, на деревянной подставке с табличкой дня, вокруг — огни боке."],
    ["chalk", "Мел", renderChalk, "Цветные мелки на грифельной доске, гирлянда мелом; QR — на приклеенной записке."],
    ["retro", "Ретро-открытка", renderRetro, "Открытка середины XX века: тёплая палитра, звёзды-«атомы», контур со смещением, как при старой печати."],
    ["shadow", "Театр теней", renderShadow, "Чёрные силуэты героев на фоне заката или ночи, светится только свет; бархатный занавес и огоньки."],
    ["clay", "Пластилин", renderClay, "Объёмные «лепные» фигурки с бликами и мягкими тенями, пластилиновая гирлянда."]
  ].forEach(([id, name, render, desc]) => window.STICKER_STYLES.push({ id, name, render, extra: true, days: 3, desc }));
})();
