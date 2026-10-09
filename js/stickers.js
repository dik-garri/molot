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

  window.STICKER_SIZE = { W, H, mm: [80, 95] };
  window.STICKER_INTERNALS = { PAPER, ARCH, garland, renderPaperHybrid };
  window.STICKER_STYLES = [
    { id: "paper", name: "Бумага", render: renderPaper },
    { id: "aqua", name: "Акварель", render: renderAqua }
  ];
})();
