// Генератор наклеек: 2 направления («Бумага», «Акварель») × дни 1–5.
// Наклейка 80×95 мм → SVG 320×380. Рисунок берётся из js/scenes.js (герои и рождественские сюжеты).
(function () {
  const W = 320, H = 380;
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const f = n => +(+n).toFixed(2);

  function T(x, y, s, o) {
    return `<text x="${f(x)}" y="${f(y)}" font-family="${o.font}" font-size="${f(o.size)}"` +
      (o.weight ? ` font-weight="${o.weight}"` : "") + (o.italic ? ` font-style="italic"` : "") +
      (o.anchor ? ` text-anchor="${o.anchor}"` : "") + (o.ls ? ` letter-spacing="${o.ls}"` : "") +
      (o.op ? ` opacity="${o.op}"` : "") + ` fill="${o.fill}">${esc(s)}</text>`;
  }
  // Размер шрифта, при котором самая длинная строка влезает в maxW (k — средняя ширина знака в em)
  const fit = (lines, max, maxW, k) => Math.min(max, maxW / (Math.max(...lines.map(l => l.length)) * k));

  function qr(text, x, y, size, fg, bg) {
    const q = qrcode(0, "L");
    q.addData(text); q.make();
    const n = q.getModuleCount(), pad = 2.5, s = size / (n + pad * 2);
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
    return `<g transform="translate(${f(x)},${f(y)})"><rect width="${size}" height="${size}" rx="${f(size * 0.07)}" fill="${bg}"/>` +
      `<path transform="translate(${f(pad * s)},${f(pad * s)}) scale(${f(s)})" d="${d}" fill="${fg}" shape-rendering="crispEdges"/></g>`;
  }

  const star5 = (x, y, r) => "M" + Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r;
    return `${f(x + Math.cos(a) * rr)},${f(y + Math.sin(a) * rr)}`;
  }).join(" L") + "Z";

  const svg = (body, label) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${body}</svg>`;

  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const lum = h => { const [r, g, b] = hx(h); return (.2126 * r + .7152 * g + .0722 * b) / 255; };

  /* ─────────────────────────── БУМАГА (многослойная бумажная диорама) ─────────────────────────── */

  const PAPER = {
    1: { frame: "#F3E7D3", ink: "#4A2A1A", badge: "#6B3E26" },
    2: { frame: "#1F2645", ink: "#F2E6CF", badge: "#C9A15A", dark: true },
    3: { frame: "#F4E8DA", ink: "#3E2A40", badge: "#3E6C9A" },
    4: { frame: "#2A1E2E", ink: "#F2E6CF", badge: "#C9A15A", dark: true },
    5: { frame: "#EEF1EC", ink: "#23343A", badge: "#9A3A2E" }
  };
  const ARCH = "M26,262 V160 A134,134 0 0 1 294,160 V262 Z";

  function paperDefs(id) {
    return `<defs>
      <clipPath id="${id}-arch"><path d="${ARCH}"/></clipPath>
      <filter id="${id}-pl" x="-10%" y="-10%" width="120%" height="130%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/>
        <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .32 -.07" result="g"/>
        <feComposite in="g" in2="SourceAlpha" operator="in" result="gm"/>
        <feMerge result="t"><feMergeNode in="SourceGraphic"/><feMergeNode in="gm"/></feMerge>
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.2"/><feOffset dy="2.3" result="b"/>
        <feFlood flood-color="#1d0e05" flood-opacity=".45"/><feComposite in2="b" operator="in" result="s"/>
        <feMerge><feMergeNode in="s"/><feMergeNode in="t"/></feMerge>
      </filter>
      <filter id="${id}-fr" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="8" result="n"/>
        <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .3 -.07" result="g"/>
        <feComposite in="g" in2="SourceAlpha" operator="in" result="gm"/>
        <feMerge result="t"><feMergeNode in="SourceGraphic"/><feMergeNode in="gm"/></feMerge>
        <feGaussianBlur in="SourceAlpha" stdDeviation="4"/><feOffset dy="4" result="b"/>
        <feFlood flood-color="#1d0e05" flood-opacity=".55"/><feComposite in2="b" operator="in" result="s"/>
        <feMerge><feMergeNode in="s"/><feMergeNode in="t"/></feMerge>
      </filter>
    </defs>`;
  }

  const paperItem = it => it.only === "aqua" ? "" : it.sw
    ? `<path d="${it.d}" fill="none" stroke="${it.p}" stroke-width="${it.sw}" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="${it.d}" fill="${it.p}"/>`;

  // Рождественская гирлянда по арке: хвоя, ягоды, шары и звезда наверху — два бумажных слоя
  function garland() {
    const needles = [], toys = [];
    for (let a = -174; a <= -6; a += 5) {
      const rad = a * Math.PI / 180, r = 134 + (a % 10 ? -2 : 2), x = 160 + Math.cos(rad) * r, y = 160 + Math.sin(rad) * r;
      [-38, 0, 38].forEach((k, j) => needles.push({ d: `M0,0 Q7,-3.4 15,0 Q7,3.4 0,0Z`, p: j === 1 ? "#3F7A4A" : "#2F5D3A", tf: `translate(${f(x)},${f(y)}) rotate(${f(a + 90 + k + (j === 1 ? 180 : 0))})` }));
    }
    for (let a = -165; a <= -15; a += 15) {
      const rad = a * Math.PI / 180, ball = (a / 15) % 2 === 0;
      const x = 160 + Math.cos(rad) * (ball ? 128 : 137), y = 160 + Math.sin(rad) * (ball ? 128 : 137);
      toys.push(ball ? { d: `M${f(x - 4.5)},${f(y)} a4.5,4.5 0 1 0 9,0 a4.5,4.5 0 1 0 -9,0Z`, p: "#E2B04A" }
        : { d: `M${f(x - 3.2)},${f(y)} a3.2,3.2 0 1 0 6.4,0 a3.2,3.2 0 1 0 -6.4,0Z M${f(x + 1.5)},${f(y + 3.5)} a2.6,2.6 0 1 0 5.2,0 a2.6,2.6 0 1 0 -5.2,0Z`, p: "#B3243A" });
    }
    toys.push({ d: star5(160, 26, 12), p: "#E9B455" });
    return [needles, toys];
  }
  const garlandSvg = layer => layer.map(it => `<path d="${it.d}" fill="${it.p}"${it.tf ? ` transform="${it.tf}"` : ""}/>`).join("");

  function paperText(th, p, L, op = 1, badge = true) {
    const d = th.day;
    let s = badge ? L(`<circle cx="38" cy="38" r="18" fill="${p.badge}"/>`) : "";
    s += T(38, 44, String(d), { font: "Unbounded", size: 15, weight: 700, anchor: "middle", fill: p.dark ? "#1F2645" : "#FFF7EC" });
    s += `<g opacity="${op}">`;
    s += T(26, 292, window.THANKS, { font: "Golos Text", size: 13.5, weight: 500, fill: p.ink, op: 0.85 });
    const fs = fit(th.sticker, 21, 190, 0.76);
    th.sticker.forEach((l, i) => s += T(25, 318 + i * fs * 1.18, l, { font: "Unbounded", size: fs, weight: 600, fill: p.ink }));
    s += T(26, 318 + (th.sticker.length - 1) * fs * 1.18 + 22, th.ref, { font: "Golos Text", size: 10.5, weight: 600, fill: p.ink, op: 0.65 });
    s += L(`<g transform="rotate(-2 268 316)">${qr(window.dayUrl(d), 232, 280, 72, "#24150D", "#FFFDF8")}</g>`) + `</g>`;
    return s;
  }

  // o.layer(i, n) → {dy, op} — анимация слоёв сцены; o.decor — прозрачность гирлянды; o.text — подписи и QR (для видео)
  function renderPaper(th, o = {}) {
    const d = th.day, p = PAPER[d], id = `pa${d}`, sc = SCENES[d]();
    const L = c => `<g filter="url(#${id}-pl)">${c}</g>`;
    let s = paperDefs(id) + `<rect width="${W}" height="${H}" fill="${p.frame}"/>`;
    const n = sc.layers.length;
    s += `<g clip-path="url(#${id}-arch)">` + sc.layers.map((layer, i) => {
      const a = o.layer ? o.layer(i, n) : null, body = L(layer.map(paperItem).join(""));
      return a ? (a.op > 0 ? `<g transform="translate(0,${f(a.dy || 0)})" opacity="${f(a.op)}">${body}</g>` : "") : body;
    }).join("") + `</g>`;
    s += `<g filter="url(#${id}-fr)"><path fill-rule="evenodd" d="M0,0 H${W} V${H} H0Z ${ARCH}" fill="${p.frame}"/></g>`;
    s += `<g opacity="${o.decor ?? 1}">` + garland().map(l => L(garlandSvg(l))).join("") + `</g>`;
    s += paperText(th, p, L, o.text ?? 1);
    return svg(s, `Наклейка «Бумага», день ${d}: ${th.topic}`);
  }

  // Гибрид: картинка — рендер Blender (вместе с гирляндой и кружком дня), текст и QR — вектор поверх
  function renderPaperHybrid(th, img) {
    const d = th.day, p = PAPER[d], id = `pa${d}`;
    const L = c => `<g filter="url(#${id}-pl)">${c}</g>`;
    return svg(paperDefs(id) + `<image href="${img}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>` + paperText(th, p, L, 1, false),
      `Наклейка «Бумага», рендер Blender, день ${d}: ${th.topic}`);
  }

  /* ─────────────────────────── АКВАРЕЛЬ КОФЕ (нарисовано кофе по хлопковой бумаге) ─────────────────────────── */

  const WC = { paper: "#F8F2E7", white: "#FFFCF4", c1: "#D6AE82", c2: "#A26B3B", c3: "#5A361D", ink: "#3B2414" };

  function wcDefs(id, d) {
    const wash = (fid, scale, erode, blur, seed) => `
      <filter id="${id}-${fid}" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".028" numOctaves="4" seed="${seed}" result="n"/>
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
      <filter id="${id}-ink" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="${d}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter>
      <filter id="${id}-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="4" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .5 -.2"/></filter>
      <radialGradient id="${id}-vig" cx="50%" cy="45%" r="75%"><stop offset=".6" stop-color="#C9A97F" stop-opacity="0"/><stop offset="1" stop-color="#C9A97F" stop-opacity=".28"/></radialGradient>
    </defs>`;
  }

  // тон размывки по цвету фигуры: светлое — белила, средние — светлый/средний кофе, тёмное — крепкий кофе
  function tone(it) {
    const w = it.w ?? (lum(it.p) > .8 ? "paper" : lum(it.p) > .6 ? 1 : lum(it.p) > .36 ? 2 : 3);
    if (w === "paper") return [WC.white, it.o ?? .92];
    return [[0, WC.c1, WC.c2, WC.c3][w], it.o ?? [0, .6, .66, .82][w]];
  }

  const SKY = "M26,34 Q160,10 294,34 Q310,150 296,256 Q160,274 24,256 Q10,150 26,34Z";

  // o.layer(i, n) → {op, ink} — анимация (прозрачность размывок, доля дорисованной туши; i = -1 — небо); o.decor; o.text
  function renderAqua(th, o = {}) {
    const d = th.day, id = `wa${d}`, sc = SCENES[d]();
    let s = wcDefs(id, d);
    s += `<rect width="${W}" height="${H}" fill="${WC.paper}"/><rect width="${W}" height="${H}" filter="url(#${id}-paper)"/>`;
    const n = sc.layers.length;
    let pic = "";
    const skyA = o.layer ? o.layer(-1, n) : { op: 1 };
    if (sc.sky === "night") pic += `<g opacity="${f(skyA.op)}"><g filter="url(#${id}-wc)" fill="${WC.c2}" opacity=".55"><path d="${SKY}"/></g><g filter="url(#${id}-wc)" fill="${WC.c3}" opacity=".85"><path d="${SKY}" transform="translate(160,140) scale(.95) translate(-160,-140)"/></g></g>`;
    else pic += `<g opacity="${f(skyA.op)}"><g filter="url(#${id}-wc)" fill="${WC.c1}" opacity=".45"><path d="${SKY}"/></g></g>`;
    sc.layers.forEach((layer, i) => {
      const a = o.layer ? o.layer(i, n) : { op: 1, ink: 1 };
      if (a.op <= 0 && !(a.ink > 0)) return;
      let washes = "", ink = "";
      layer.filter(it => it.only !== "paper").forEach(it => {
        if (!it.sw) {
          const [c, op] = tone(it);
          washes += `<g filter="url(#${id}-${it.fine ? "wcf" : "wc"})" fill="${c}" opacity="${op}"><path d="${it.d}"/></g>`;
        }
        if (it.ink || it.sw) {
          const p = a.ink ?? 1, dash = p < 1 ? ` pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${f(1 - p)}"` : "";
          if (p > 0) ink += `<path d="${it.d}" stroke-width="${it.sw ? f(it.sw * .55 + .5) : 1}"${dash}/>`;
        }
      });
      pic += `<g opacity="${f(a.op)}">${washes}</g>` + (ink ? `<g filter="url(#${id}-ink)" fill="none" stroke="${WC.ink}" stroke-linecap="round" stroke-linejoin="round" transform="translate(1.2,-1)">${ink}</g>` : "");
    });
    s += `<g transform="translate(24,44) scale(.85)">${pic}</g>`;
    // рождественская веточка в углу: хвоя тушью, размывка, ягоды и звёздочка
    let sprig = `<g filter="url(#${id}-wcf)" fill="${WC.c2}" opacity=".45"><path d="M252,46 C268,38 286,24 306,12 L310,20 C290,34 272,46 256,54Z"/></g>`;
    let needles = `<path d="M246,52 C266,40 288,24 312,8"/><path d="M276,34 C282,42 290,46 300,48"/>`;
    for (let i = 0; i < 14; i++) {            // хвоинки разной длины по обе стороны ветки
      const x = 250 + i * 4.5, y = 50 - i * 3, l = 7 + (i * 7 % 4);
      needles += `<path d="M${f(x)},${f(y)} q-2,-${f(l * .6)} -${f(l * .5)},-${f(l)} M${f(x)},${f(y)} q${f(l * .6)},1 ${f(l)},${f(l * .5)}"/>`;
    }
    for (let i = 0; i < 5; i++) { const x = 282 + i * 4, y = 39 + i * 2; needles += `<path d="M${f(x)},${f(y)} l1,-7 M${f(x)},${f(y)} l3,6"/>`; }
    sprig += `<g filter="url(#${id}-ink)" fill="none" stroke="${WC.ink}" stroke-width="1" stroke-linecap="round">${needles}</g>`;
    sprig += `<g fill="${WC.c3}"><circle cx="262" cy="56" r="3"/><circle cx="268" cy="58" r="2.6"/><circle cx="265" cy="63" r="2.4"/></g>`;
    sprig += `<path d="${star5(296, 44, 7)}" fill="none" stroke="${WC.c2}" stroke-width="1.2"/>`;
    s += `<g opacity="${o.decor ?? 1}">${sprig}</g>`;
    s += `<rect width="${W}" height="${H}" fill="url(#${id}-vig)"/>`;
    s += T(22, 38, `${d} декабря`, { font: "Marck Script", size: 23, fill: WC.c2 });
    s += `<g opacity="${o.text ?? 1}">`;
    s += T(22, 300, window.THANKS, { font: "Marck Script", size: 22, fill: WC.ink });
    const fs = fit(th.sticker, 26, 192, 0.58);
    th.sticker.forEach((l, i) => s += T(21, 328 + i * fs * 1.04, l, { font: "Lora", size: fs, weight: 600, italic: true, fill: WC.ink }));
    s += T(22, 328 + (th.sticker.length - 1) * fs * 1.04 + 21, th.ref, { font: "Lora", size: 10.5, italic: true, fill: WC.c2 });
    s += qr(window.dayUrl(d), 238, 288, 68, WC.ink, WC.paper) + `</g>`;
    return svg(s, `Наклейка «Акварель кофе», день ${d}: ${th.topic}`);
  }

  /* ─────────────────────────── МОЛОДЁЖНЫЕ СТИЛИ (дни 1–3) ─────────────────────────── */

  const toHsl = h => {
    let [r, g, b] = hx(h).map(v => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, 0, l];
    const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    const hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [hh * 60, s, l];
  };
  const fromHsl = (h, s, l) => {
    const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const c = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))).toString(16).padStart(2, "0");
    return "#" + c(0) + c(8) + c(4);
  };
  // ярче и насыщеннее — для комикса и пикселя
  const pop = (hex, ks = 1.45, kl = 1.04) => { const [h, s, l] = toHsl(hex); return fromHsl(h, Math.min(1, s * ks + .06), Math.max(.1, Math.min(.93, l * kl))); };
  const sceneSvg = (sc, item) => sc.layers.map(l => l.filter(it => it.only !== "aqua").map(item).join("")).join("");

  /* ── КОМИКС: поп-арт, толстый контур, растровые точки, гирлянда-лампочки ── */
  const COMIC = { 1: { bg: "#4CC9F0", accent: "#FF3D7F" }, 2: { bg: "#FF5DA2", accent: "#FFD23F" }, 3: { bg: "#FFD23F", accent: "#3A86FF" } };
  const BLACK = "#141414";
  function burst(x, y, r1, r2, n) {
    return "M" + Array.from({ length: n * 2 }, (_, i) => {
      const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? r2 : r1 * (1 + (i % 4 === 0 ? .12 : 0));
      return `${f(x + Math.cos(a) * r)},${f(y + Math.sin(a) * r)}`;
    }).join(" L") + "Z";
  }
  function renderComic(th, o = {}) {
    const d = th.day, P = COMIC[d], id = `co${d}`, sc = SCENES[d]();
    let s = `<defs><clipPath id="${id}-pan"><rect x="16" y="16" width="288" height="244" rx="10"/></clipPath>
      <pattern id="${id}-ht" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><circle cx="3" cy="3" r="1.25" fill="#000"/></pattern>
      <pattern id="${id}-bg" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><circle cx="5" cy="5" r="2.3" fill="#fff"/></pattern></defs>`;
    s += `<rect width="${W}" height="${H}" fill="${P.bg}"/><rect width="${W}" height="${H}" fill="url(#${id}-bg)" opacity=".28"/>`;
    s += `<rect x="22" y="22" width="288" height="244" rx="10" fill="${BLACK}"/>`;
    const item = it => it.sw
      ? `<path d="${it.d}" fill="none" stroke="${BLACK}" stroke-width="${f(it.sw + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="${it.d}" fill="${pop(it.p)}" stroke="${BLACK}" stroke-width="2.3" stroke-linejoin="round"/>`;
    s += `<g clip-path="url(#${id}-pan)"><g transform="translate(16,16) scale(.9)">${sceneSvg(sc, item)}</g><rect x="16" y="16" width="288" height="244" fill="url(#${id}-ht)" opacity=".12"/></g>`;
    s += `<rect x="16" y="16" width="288" height="244" rx="10" fill="none" stroke="${BLACK}" stroke-width="4"/>`;
    // гирлянда-лампочки поверх панели
    const wire = [[10, 20, 88, 52, 166, 24], [166, 24, 242, 52, 314, 20]], cols = ["#FF4D4D", "#FFD23F", "#2EC27E", "#3A86FF"];
    let bulbs = "", k = 0;
    wire.forEach(([x0, y0, cx, cy, x1, y1]) => {
      bulbs += `<path d="M${x0},${y0} Q${cx},${cy} ${x1},${y1}" fill="none" stroke="${BLACK}" stroke-width="2.4"/>`;
      for (let t = .12; t < 1; t += .19) {
        const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
        bulbs += `<g transform="translate(${f(x)},${f(y)}) rotate(${f((t - .5) * 30)})"><rect x="-3" y="-1" width="6" height="5" fill="#555" stroke="${BLACK}" stroke-width="1.6"/><ellipse cx="0" cy="10" rx="5.2" ry="7.5" fill="${cols[k++ % 4]}" stroke="${BLACK}" stroke-width="2"/><ellipse cx="-1.6" cy="8" rx="1.4" ry="2.6" fill="#fff" opacity=".7"/></g>`;
      }
    });
    s += bulbs;
    s += `<path d="${burst(42, 46, 28, 19, 11)}" fill="${P.accent}" stroke="${BLACK}" stroke-width="2.6" stroke-linejoin="round"/>`;
    s += `<text x="42" y="55" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="26" fill="#fff" stroke="${BLACK}" stroke-width="2.6" paint-order="stroke">${d}</text>`;
    s += `<g opacity="${o.text ?? 1}">`;
    s += `<g transform="rotate(-2 112 320)"><rect x="20" y="278" width="196" height="88" fill="${BLACK}"/><rect x="14" y="272" width="196" height="88" fill="#fff" stroke="${BLACK}" stroke-width="3"/>`;
    s += T(26, 292, window.THANKS.toUpperCase(), { font: "Rubik", size: 11, weight: 800, ls: .6, fill: P.accent === "#FFD23F" ? "#E0447A" : P.accent });
    const up = th.sticker.map(l => l.toUpperCase()), fs = fit(up, 21, 180, .66);
    up.forEach((l, i) => s += T(25, 315 + i * fs * 1.05, l, { font: "Rubik", size: fs, weight: 900, fill: BLACK }));
    s += T(26, 352, th.ref, { font: "Rubik", size: 10, weight: 600, fill: BLACK, op: .7 }) + `</g>`;
    s += `<rect x="232" y="284" width="76" height="76" fill="${BLACK}"/>` + `<g>${qr(window.dayUrl(d), 226, 278, 76, BLACK, "#fff")}</g><rect x="226" y="278" width="76" height="76" fill="none" stroke="${BLACK}" stroke-width="3"/>`;
    s += `</g>`;
    return svg(s, `Наклейка «Комикс», день ${d}: ${th.topic}`);
  }

  /* ── ПИКСЕЛЬ: ретро-игра — пикселизированная сцена, HUD, диалог RPG, пиксельный снег ── */
  const PIX = { 1: { bg: "#1A1C3A", accent: "#FF5C8A" }, 2: { bg: "#0E1230", accent: "#FFD23F" }, 3: { bg: "#1C1430", accent: "#5CE1E6" } };
  const PXF = "'Press Start 2P'";
  function pxHeart(x, y, c, s = 2) {
    const m = ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"];
    let r = "";
    m.forEach((row, j) => [...row].forEach((v, i) => { if (v === "1") r += `<rect x="${x + i * s}" y="${y + j * s}" width="${s}" height="${s}" fill="${c}"/>`; }));
    return r;
  }
  function renderPixel(th, o = {}) {
    const d = th.day, P = PIX[d], id = `px${d}`, sc = SCENES[d](), B = 4;
    let s = `<defs><clipPath id="${id}-scr"><rect x="16" y="30" width="288" height="230"/></clipPath>
      <filter id="${id}-px" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
        <feFlood x="${B / 2 - .5}" y="${B / 2 - .5}" width="1" height="1"/><feComposite width="${B}" height="${B}"/><feTile result="a"/>
        <feComposite in="SourceGraphic" in2="a" operator="in"/><feMorphology operator="dilate" radius="${B / 2}"/></filter>
      <pattern id="${id}-grid" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="none" stroke="#fff" stroke-width=".3" opacity=".06"/></pattern></defs>`;
    s += `<rect width="${W}" height="${H}" fill="${P.bg}"/><rect width="${W}" height="${H}" fill="url(#${id}-grid)"/>`;
    // HUD
    s += T(16, 22, `ДЕНЬ ${d}/24`, { font: PXF, size: 8, fill: "#fff" });
    s += [0, 1, 2].map(i => pxHeart(250 + i * 18, 11, P.accent)).join("");
    // экран со сценой
    const item = it => it.sw ? `<path d="${it.d}" fill="none" stroke="${pop(it.p, 1.3)}" stroke-width="${it.sw + 1}"/>` : `<path d="${it.d}" fill="${pop(it.p, 1.3)}"/>`;
    s += `<g clip-path="url(#${id}-scr)"><g filter="url(#${id}-px)"><g transform="translate(16,26) scale(.9)">${sceneSvg(sc, item)}</g></g>`;
    let a = d * 97; const R = () => (a = (a * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 22; i++) s += `<rect x="${16 + Math.floor(R() * 72) * 4}" y="${32 + Math.floor(R() * 40) * 4}" width="4" height="4" fill="#fff" opacity="${f(.55 + R() * .45)}"/>`;
    const cols = ["#FF4D4D", "#2EC27E", "#FFD23F", "#3A86FF"];
    for (let i = 0; i < 18; i++) s += `<rect x="${20 + i * 16}" y="${34 + (i % 2) * 4}" width="6" height="6" fill="${cols[i % 4]}"/><rect x="${23 + i * 16}" y="${30}" width="2" height="${4 + (i % 2) * 4}" fill="#2A3A2A"/>`;
    s += `</g>`;
    s += `<rect x="14.5" y="28.5" width="291" height="233" fill="none" stroke="#fff" stroke-width="3"/><rect x="18" y="32" width="284" height="226" fill="none" stroke="${P.accent}" stroke-width="1.5" opacity=".8"/>`;
    s += `<g opacity="${o.text ?? 1}">`;
    // диалоговое окно
    s += `<rect x="12" y="274" width="210" height="96" fill="#0B0B18" stroke="#fff" stroke-width="3"/>`;
    const tag = th.topic.toUpperCase();
    s += `<rect x="20" y="266" width="${f(tag.length * 7 + 14)}" height="16" fill="${P.accent}" stroke="#fff" stroke-width="2"/>`;
    s += T(27, 278, tag, { font: PXF, size: 7, fill: "#0B0B18" });
    s += T(22, 300, window.THANKS, { font: PXF, size: 9, fill: "#fff" });
    const fs = fit(th.sticker, 13, 192, 1.0);
    th.sticker.forEach((l, i) => s += T(22, 324 + i * fs * 1.55, l, { font: PXF, size: fs, fill: P.accent }));
    s += T(22, 362, th.ref, { font: PXF, size: 6.5, fill: "#9AA0C8" });
    s += `<path d="M206,356 h10 l-5,6Z" fill="#fff"/>`;
    s += `<rect x="230" y="280" width="80" height="80" fill="#fff"/>` + qr(window.dayUrl(d), 232, 282, 76, "#0B0B18", "#fff");
    s += `<rect x="230" y="280" width="80" height="80" fill="none" stroke="${P.accent}" stroke-width="2"/>`;
    s += T(270, 372, "СКАН", { font: PXF, size: 6, anchor: "middle", fill: "#9AA0C8" }) + `</g>`;
    return svg(s, `Наклейка «Пиксель», день ${d}: ${th.topic}`);
  }

  /* ── НЕОН: светящиеся контуры героев на тёмной стене, неоновая надпись, огоньки по рамке ── */
  const NEON = { pink: "#FF4FD8", cyan: "#3DF5FF", yellow: "#FFE45E", violet: "#B98CFF", green: "#5CFF9D", orange: "#FF9F43", white: "#F6F2FF" };
  const NEON_BG = { 1: ["#12082A", "#2B0E3F"], 2: ["#070B24", "#1B0F3A"], 3: ["#160826", "#33103E"] };
  function neonOf(hex) {
    const [h, s, l] = toHsl(hex);
    if (l > .8) return NEON.white;
    if (s < .2) return NEON.violet;
    if (h < 22 || h >= 330) return NEON.pink;
    if (h < 48) return NEON.orange;
    if (h < 72) return NEON.yellow;
    if (h < 165) return NEON.green;
    if (h < 260) return NEON.cyan;
    return NEON.violet;
  }
  function renderNeon(th, o = {}) {
    const d = th.day, id = `ne${d}`, sc = SCENES[d](), [b0, b1] = NEON_BG[d];
    let s = `<defs><linearGradient id="${id}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b0}"/><stop offset="1" stop-color="${b1}"/></linearGradient>
      <filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b1"/><feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="b2"/>
        <feMerge><feMergeNode in="b1"/><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <pattern id="${id}-brick" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0,0 H40 M0,10 H40 M0,0 V10 M20,10 V20" stroke="#fff" stroke-width=".6" opacity=".05" fill="none"/></pattern>
      <filter id="${id}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 -.3"/></filter>
      <filter id="${id}-soft" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="3.2"/></filter>
      <clipPath id="${id}-fr"><rect x="14" y="14" width="292" height="250" rx="16"/></clipPath></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#${id}-bg)"/><rect width="${W}" height="${H}" fill="url(#${id}-brick)"/>`;
    // фон сцены (холмы, небо) — слабые цветные зоны без контура-трубки
    let soft = "";
    sc.layers.forEach(l => l.forEach(it => {
      if (it.only || it.ink || it.sw) return;
      const c = neonOf(it.p);
      soft += `<path d="${it.d}" fill="${c}" opacity=".08"/><path d="${it.d}" fill="none" stroke="${c}" stroke-width="1" opacity=".25"/>`;
    }));
    // фигуры рисуются по слоям: каждая перекрывает то, что позади, затем светится своим контуром
    let layered = "";
    sc.layers.forEach(l => {
      let oc = "", tb = "", co = "";
      l.forEach(it => {
        if (it.only || !it.ink || it.sw) return;
        const c = neonOf(it.p);
        oc += `<path d="${it.d}" fill="${b0}" opacity=".88"/>`;
        tb += `<path d="${it.d}" fill="none" stroke="${c}" stroke-width="1.9" stroke-linejoin="round"/>`;
        co += `<path d="${it.d}" fill="none" stroke="#fff" stroke-width=".6" stroke-linejoin="round" opacity=".75"/>`;
      });
      l.forEach(it => {
        if (!it.sw || it.only) return;
        const c = neonOf(it.p);
        tb += `<path d="${it.d}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`;
        co += `<path d="${it.d}" fill="none" stroke="#fff" stroke-width=".6" opacity=".7"/>`;
      });
      layered += oc + `<g filter="url(#${id}-glow)">${tb}</g>` + co;
    });
    s += `<g clip-path="url(#${id}-fr)"><g transform="translate(20,22) scale(.875)">${soft}${layered}</g></g>`;
    // рамка-вывеска с огоньками и звездой
    let lights = "";
    const cols = [NEON.pink, NEON.cyan, NEON.yellow, NEON.green];
    for (let i = 0; i < 15; i++) lights += `<circle cx="${30 + i * 18.6}" cy="${14 + (i % 2 ? 3 : -1)}" r="2.6" fill="${cols[i % 4]}"/>`;
    s += `<g filter="url(#${id}-glow)"><rect x="14" y="14" width="292" height="250" rx="16" fill="none" stroke="${NEON.pink}" stroke-width="2"/>${lights}
      <path d="${star5(160, 14, 11)}" fill="none" stroke="${NEON.yellow}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="36" cy="40" r="15" fill="none" stroke="${NEON.cyan}" stroke-width="1.8"/></g>`;
    s += `<g filter="url(#${id}-glow)">` + T(36, 45.5, String(d), { font: "Unbounded", size: 14, weight: 700, anchor: "middle", fill: NEON.cyan }) + `</g>`;
    s += `<rect width="${W}" height="${H}" filter="url(#${id}-grain)" opacity=".18"/>`;
    const fs = fit(th.sticker, 20, 188, .8);
    const words = c => T(22, 300, window.THANKS, { font: "Pacifico", size: 20, fill: c || NEON.pink }) +
      th.sticker.map((l, i) => T(22, 328 + i * fs * 1.2, l, { font: "Unbounded", size: fs, weight: 700, fill: c || NEON.white })).join("") +
      T(23, 328 + (th.sticker.length - 1) * fs * 1.2 + 21, th.ref, { font: "Unbounded", size: 9, weight: 500, fill: c || NEON.cyan });
    s += `<g opacity="${o.text ?? 1}"><g filter="url(#${id}-soft)" opacity=".9">${words(null).replace(/fill="#F6F2FF"/g, `fill="${NEON.cyan}"`)}</g>${words(null)}`;
    s += `<g filter="url(#${id}-glow)"><rect x="234" y="282" width="74" height="74" rx="8" fill="none" stroke="${NEON.cyan}" stroke-width="2"/></g>`;
    s += qr(window.dayUrl(d), 238, 286, 66, "#12082A", "#fff") + `</g>`;
    return svg(s, `Наклейка «Неон», день ${d}: ${th.topic}`);
  }

  window.STICKER_SIZE = { W, H, mm: [80, 95] };
  window.STK = { T, fit, qr, star5, svg, f, esc, toHsl, fromHsl };   // для js/illus.js
  window.STICKER_INTERNALS = { PAPER, ARCH, garland, renderPaperHybrid };
  window.STICKER_STYLES = [
    { id: "paper", name: "Бумага", render: renderPaper },
    { id: "aqua", name: "Акварель", render: renderAqua },
    // молодёжные стили — по 3 примера (дни 1–3)
    { id: "comic", name: "Комикс", render: renderComic, youth: true, days: 3 },
    { id: "pixel", name: "Пиксель", render: renderPixel, youth: true, days: 3 },
    { id: "neon", name: "Неон", render: renderNeon, youth: true, days: 3 }
  ];
})();
