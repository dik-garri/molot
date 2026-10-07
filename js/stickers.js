// Генератор наклеек: 3 направления × темы 1–5. Каждая наклейка — SVG 300×400 (пропорция 3:4).
(function () {
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const f = n => +(+n).toFixed(2);

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function T(x, y, s, o) {
    return `<text x="${f(x)}" y="${f(y)}" font-family="${o.font}" font-size="${f(o.size)}"` +
      (o.weight ? ` font-weight="${o.weight}"` : "") +
      (o.italic ? ` font-style="italic"` : "") +
      (o.anchor ? ` text-anchor="${o.anchor}"` : "") +
      (o.ls ? ` letter-spacing="${o.ls}"` : "") +
      (o.op ? ` opacity="${o.op}"` : "") +
      ` fill="${o.fill}">${esc(s)}</text>`;
  }

  // Размер шрифта, при котором самая длинная строка влезает в maxW (k — средняя ширина знака в em)
  const fit = (lines, max, maxW, k) => Math.min(max, maxW / (Math.max(...lines.map(l => l.length)) * k));

  function qr(text, x, y, size, fg, bg, extra = "") {
    const q = qrcode(0, "L");
    q.addData(text); q.make();
    const n = q.getModuleCount(), pad = 2.5, s = size / (n + pad * 2);
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
    return `<g transform="translate(${f(x)},${f(y)})" ${extra}><rect width="${size}" height="${size}" rx="${f(size * 0.07)}" fill="${bg}"/>` +
      `<path transform="translate(${f(pad * s)},${f(pad * s)}) scale(${f(s)})" d="${d}" fill="${fg}" shape-rendering="crispEdges"/></g>`;
  }

  function heart(cx, cy, w) {
    const k = w / 2;
    return `M${f(cx)},${f(cy + k * 0.9)} C${f(cx - k * 1.35)},${f(cy + k * 0.05)} ${f(cx - k * 0.95)},${f(cy - k)} ${f(cx)},${f(cy - k * 0.38)} ` +
      `C${f(cx + k * 0.95)},${f(cy - k)} ${f(cx + k * 1.35)},${f(cy + k * 0.05)} ${f(cx)},${f(cy + k * 0.9)}Z`;
  }

  function star4(cx, cy, r) {
    const i = r * 0.2;
    return `M${f(cx)},${f(cy - r)} Q${f(cx + i)},${f(cy - i)} ${f(cx + r)},${f(cy)} Q${f(cx + i)},${f(cy + i)} ${f(cx)},${f(cy + r)} ` +
      `Q${f(cx - i)},${f(cy + i)} ${f(cx - r)},${f(cy)} Q${f(cx - i)},${f(cy - i)} ${f(cx)},${f(cy - r)}Z`;
  }

  // Чашка сбоку: (x, y) — центр ободка, w — ширина
  function cupSide(x, y, w, o = {}) {
    const h = w * 0.72, dir = o.dir || 1, sw = o.strokeW || 0;
    const st = o.stroke ? ` stroke="${o.stroke}" stroke-width="${sw}" stroke-linejoin="round"` : "";
    const body = `M${f(x - w / 2)},${f(y)} L${f(x + w / 2)},${f(y)} C${f(x + w / 2)},${f(y + h * 0.78)} ${f(x + w * 0.3)},${f(y + h)} ${f(x)},${f(y + h)} ` +
      `C${f(x - w * 0.3)},${f(y + h)} ${f(x - w / 2)},${f(y + h * 0.78)} ${f(x - w / 2)},${f(y)}Z`;
    const hx = x + dir * w * 0.46;
    const handle = `M${f(hx)},${f(y + h * 0.16)} C${f(x + dir * w * 0.8)},${f(y + h * 0.06)} ${f(x + dir * w * 0.82)},${f(y + h * 0.66)} ${f(x + dir * w * 0.33)},${f(y + h * 0.76)}`;
    let s = "";
    if (o.saucer !== false) s += `<ellipse cx="${f(x)}" cy="${f(y + h + 1)}" rx="${f(w * 0.74)}" ry="${f(w * 0.11)}" fill="${o.fill}"${st}/>`;
    if (o.stroke) s += `<path d="${handle}" fill="none" stroke="${o.stroke}" stroke-width="${f(w * 0.1 + sw * 2)}" stroke-linecap="round"/>`;
    s += `<path d="${handle}" fill="none" stroke="${o.fill}" stroke-width="${f(w * 0.1)}" stroke-linecap="round"/>`;
    s += `<path d="${body}" fill="${o.fill}"${st}/>`;
    if (o.hatch) s += `<path d="M${f(x + w * 0.16)},${f(y)} L${f(x + w / 2)},${f(y)} C${f(x + w / 2)},${f(y + h * 0.78)} ${f(x + w * 0.32)},${f(y + h * 0.99)} ${f(x + w * 0.16)},${f(y + h * 0.995)}Z" fill="url(#${o.hatch})"/>`;
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w / 2)}" ry="${f(w * 0.12)}" fill="${o.rimFill || o.fill}"${st}/>`;
    if (o.coffee) s += `<ellipse cx="${f(x)}" cy="${f(y + w * 0.012)}" rx="${f(w / 2 - w * 0.06)}" ry="${f(w * 0.085)}" fill="${o.coffee}"/>`;
    return s;
  }

  const svg = (body, label) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" role="img" aria-label="${esc(label)}">${body}</svg>`;

  /* ─────────────────────────── A. ПЕНКА (латте-арт, вид сверху) ─────────────────────────── */

  const LATTE = {
    1: { bg: "#E8C3AB", ink: "#3B2418" },
    2: { bg: "#F1D293", ink: "#3B2418" },
    3: { bg: "#BCD1D4", ink: "#1F3238" },
    4: { bg: "#1C2440", ink: "#F3EAD8", dark: true },
    5: { bg: "#D6A3A0", ink: "#3A1F1E" }
  };

  function latteDefs(id, p) {
    const crema = p.dark
      ? `<stop offset="0" stop-color="#5A3320"/><stop offset=".6" stop-color="#3A2014"/><stop offset="1" stop-color="#1F110A"/>`
      : `<stop offset="0" stop-color="#C8915F"/><stop offset=".55" stop-color="#AE6E3D"/><stop offset=".86" stop-color="#874B26"/><stop offset="1" stop-color="#5A2E17"/>`;
    return `<defs>
      <radialGradient id="${id}-crema" cx="50%" cy="50%" r="50%">${crema}</radialGradient>
      <radialGradient id="${id}-cer" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#F4EEE5"/><stop offset="1" stop-color="#DCD1C1"/></radialGradient>
      <filter id="${id}-sh" x="-30%" y="-30%" width="170%" height="170%"><feDropShadow dx="5" dy="9" stdDeviation="7" flood-color="#160b04" flood-opacity="${p.dark ? 0.55 : 0.28}"/></filter>
      <filter id="${id}-foam" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="6" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".8"/></filter>
      <filter id="${id}-gal" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="14" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="2.4"/></filter>
      <filter id="${id}-speck" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .16  0 0 0 0 .07  0 0 0 2.2 -1.15"/></filter>
      <filter id="${id}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 -.17"/></filter>
    </defs>`;
  }

  function latteCup(id, k, cx, cy, R, foam, o = {}) {
    const lr = R * 0.84, deg = o.handle ?? 38;
    let s = "";
    if (o.saucer !== false) {
      s += `<circle cx="${cx}" cy="${cy}" r="${f(R * 1.32)}" fill="url(#${id}-cer)" filter="url(#${id}-sh)"/>`;
      s += `<circle cx="${cx}" cy="${cy}" r="${f(R * 1.07)}" fill="#E3D8C8"/><circle cx="${cx}" cy="${cy}" r="${f(R * 1.035)}" fill="#EEE6DA"/>`;
    }
    s += `<g transform="translate(${cx},${cy}) rotate(${deg})" filter="url(#${id}-sh)"><rect x="${f(R * 0.82)}" y="${f(-R * 0.115)}" width="${f(R * 0.46)}" height="${f(R * 0.23)}" rx="${f(R * 0.115)}" fill="#F5F0E8"/></g>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id}-cer)" filter="url(#${id}-sh)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.905)}" fill="#E2D6C6"/>`;
    s += `<clipPath id="${id}-cl${k}"><circle cx="${cx}" cy="${cy}" r="${f(lr)}"/></clipPath>`;
    s += `<g clip-path="url(#${id}-cl${k})">` +
      `<circle cx="${cx}" cy="${cy}" r="${f(lr)}" fill="url(#${id}-crema)"/>` +
      `<rect x="${f(cx - lr)}" y="${f(cy - lr)}" width="${f(2 * lr)}" height="${f(2 * lr)}" filter="url(#${id}-speck)" opacity=".5"/>` +
      `<g filter="url(#${id}-${o.foamFilter || "foam"})" fill="#FBF3E6">${foam}</g>` +
      (o.overlay || "") +
      `<circle cx="${cx}" cy="${cy}" r="${f(lr)}" fill="none" stroke="#2a1409" stroke-opacity=".35" stroke-width="3"/></g>`;
    return s;
  }

  const latteFoam = {
    1() { // круги от капли + сердце
      let s = "";
      [[27, 6, 0.95], [41, 4.6, 0.8], [55, 3.4, 0.62], [67, 2.2, 0.42]].forEach(([r, w, o]) =>
        s += `<circle cx="150" cy="150" r="${r}" fill="none" stroke="#FBF3E6" stroke-width="${w}" opacity="${o}"/>`);
      return s + `<path d="${heart(150, 153, 38)}"/>`;
    },
    2() { // солнце
      let s = `<circle cx="150" cy="150" r="17"/>`;
      for (let i = 0; i < 12; i++) {
        const a = (i * 30 + 15) * Math.PI / 180, long = i % 2 === 0;
        const r0 = 26, r1 = long ? 68 : 54, w = long ? 10 : 7;
        const ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca;
        const bx = 150 + ca * r0, by = 150 + sa * r0, tx = 150 + ca * r1, ty = 150 + sa * r1;
        const mr = (r0 + r1) / 2 - 4, mx = 150 + ca * mr, my = 150 + sa * mr;
        s += `<path d="M${f(bx + px * w / 2)},${f(by + py * w / 2)} Q${f(mx + px * w * 0.75)},${f(my + py * w * 0.75)} ${f(tx)},${f(ty)} ` +
          `Q${f(mx - px * w * 0.75)},${f(my - py * w * 0.75)} ${f(bx - px * w / 2)},${f(by - py * w / 2)}Z"/>`;
      }
      return s;
    },
    3() { // спираль дыхания
      let s = "";
      for (let t = 0; t < 10.2; t += 0.03) {
        const r = 3 + 6.5 * t, a = t + 0.6;
        s += `<circle cx="${f(150 + Math.cos(a) * r)}" cy="${f(150 + Math.sin(a) * r)}" r="${f(Math.max(1.4, 7.5 - t * 0.6))}"/>`;
      }
      return s;
    },
    4() { // галактика
      let s = `<g transform="translate(150,150) rotate(-28) scale(1,.62)"><circle r="13" opacity=".95"/>`;
      for (let arm = 0; arm < 2; arm++)
        for (let t = 0; t < 8.4; t += 0.05) {
          const r = 5 * Math.exp(0.29 * t), a = t + arm * Math.PI;
          s += `<circle cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" r="${f(Math.max(2.5, 10 - t * 0.85))}" opacity=".32"/>`;
        }
      return s + `</g>`;
    },
    5: (cx, rot) => `<path d="${heart(cx, 158, 50)}" transform="rotate(${rot} ${cx} 156)"/>`
  };

  function latteStars(seed, inCup) {
    const R = rng(seed);
    let s = "";
    if (inCup) {
      for (let i = 0; i < 90; i++) {
        const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 72;
        s += `<circle cx="${f(150 + Math.cos(a) * r)}" cy="${f(150 + Math.sin(a) * r)}" r="${f(0.3 + R() * 0.9)}" fill="#FFF8E8" opacity="${f(0.45 + R() * 0.55)}"/>`;
      }
      [[118, 112, 4.5], [186, 178, 3.4], [172, 104, 2.6], [120, 192, 2.2]].forEach(([x, y, r]) => s += `<path d="${star4(x, y, r)}" fill="#FFF8E8"/>`);
    } else {
      for (let i = 0; i < 70; i++) {
        const x = R() * 300, y = R() * 400;
        if (Math.hypot(x - 150, y - 150) < 125) continue;
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.3 + R() * 0.8)}" fill="#F2D28B" opacity="${f(0.35 + R() * 0.5)}"/>`;
      }
      [[262, 40, 4], [40, 250, 3], [270, 262, 2.6], [30, 92, 2.4]].forEach(([x, y, r]) => s += `<path d="${star4(x, y, r)}" fill="#F2D28B"/>`);
    }
    return s;
  }

  function renderLatte(th) {
    const d = th.day, p = LATTE[d], id = `la${d}`;
    let s = latteDefs(id, p);
    s += `<rect width="300" height="400" fill="${p.bg}"/><rect width="300" height="400" filter="url(#${id}-grain)" opacity="${p.dark ? 0.6 : 1}"/>`;
    if (d === 4) s += latteStars(44, false);
    if (d === 5) {
      s += latteCup(id, "a", 90, 156, 58, latteFoam[5](90, 16), { saucer: false, handle: 205 });
      s += latteCup(id, "b", 210, 156, 58, latteFoam[5](210, -16), { saucer: false, handle: -25 });
    } else {
      s += latteCup(id, "a", 150, 150, 88, latteFoam[d](), d === 4 ? { foamFilter: "gal", overlay: latteStars(7, true) } : {});
    }
    // текст
    const ink = p.ink;
    s += T(22, 44, String(d), { font: "Cormorant Garamond", size: 36, weight: 600, fill: ink });
    s += T(23, 64, "ДЕКАБРЯ", { font: "Manrope", size: 7, weight: 700, ls: 2, fill: ink, op: 0.7 });
    s += T(22, 302, "Спасибо, Господи,", { font: "Cormorant Garamond", italic: true, size: 19, weight: 500, fill: ink });
    const fs = fit(th.sticker, 31, 178, 0.47);
    th.sticker.forEach((l, i) => s += T(21, 333 + i * fs * 0.98, l, { font: "Cormorant Garamond", size: fs, weight: 700, fill: ink }));
    s += T(23, 333 + (th.sticker.length - 1) * fs * 0.98 + 22, th.ref.toUpperCase(), { font: "Manrope", size: 8.5, weight: 700, ls: 1.6, fill: ink, op: 0.72 });
    s += qr(window.dayUrl(d), 210, 300, 70, "#24150D", p.dark ? "#F3EAD8" : "#FFFBF5");
    return svg(s, `Наклейка «Пенка», день ${d}: ${th.topic}`);
  }

  /* ─────────────────────────── B. БУМАГА (многослойная бумажная диорама) ─────────────────────────── */

  const PAPER = {
    1: { frame: "#F3E7D3", ink: "#4A2A1A", badge: "#6B3E26" },
    2: { frame: "#F6E6CC", ink: "#4A2A1A", badge: "#C2672E" },
    3: { frame: "#EEF1EC", ink: "#23343A", badge: "#3E6C77" },
    4: { frame: "#222A47", ink: "#F2E6CF", badge: "#C9A15A", dark: true },
    5: { frame: "#F4E2DB", ink: "#4A2320", badge: "#B5545E" }
  };
  const ARCH = "M28,272 V150 A122,122 0 0 1 272,150 V272 Z";

  function paperDefs(id) {
    return `<defs>
      <clipPath id="${id}-arch"><path d="${ARCH}"/></clipPath>
      <filter id="${id}-pl" x="-10%" y="-10%" width="120%" height="130%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/>
        <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .32 -.07" result="g"/>
        <feComposite in="g" in2="SourceAlpha" operator="in" result="gm"/>
        <feMerge result="t"><feMergeNode in="SourceGraphic"/><feMergeNode in="gm"/></feMerge>
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.3"/><feOffset dy="2.4" result="b"/>
        <feFlood flood-color="#2a1608" flood-opacity=".42"/><feComposite in2="b" operator="in" result="s"/>
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
      <mask id="${id}-moon"><rect width="300" height="300" fill="#000"/><circle cx="92" cy="84" r="16" fill="#fff"/><circle cx="100" cy="78" r="14" fill="#000"/></mask>
    </defs>`;
  }

  const paperScene = {
    1(L) { // капля и корона брызг
      let s = `<rect width="300" height="300" fill="#E0A274"/>`;
      [[120, "#E8B48A"], [94, "#EEC5A0"], [68, "#F4D6B8"]].forEach(([r, c]) => s += L(`<circle cx="150" cy="150" r="${r}" fill="${c}"/>`));
      s += L(`<ellipse cx="150" cy="250" rx="175" ry="50" fill="#5B321E"/><rect y="250" width="300" height="60" fill="#5B321E"/>`);
      s += L(`<ellipse cx="150" cy="247" rx="118" ry="33" fill="#7A472B"/>`);
      s += L(`<ellipse cx="150" cy="244" rx="76" ry="21" fill="#985D37"/>`);
      let crown = `<ellipse cx="150" cy="241" rx="54" ry="11" fill="#B87645"/>`;
      const hs = [20, 38, 30, 0, 30, 38, 20];
      hs.forEach((h, i) => {
        if (!h) return;
        const x = 104 + i * 15.3, b = 240;
        crown += `<path d="M${f(x - 5.5)},${b} Q${f(x - 1.2)},${b - h * 0.6} ${f(x)},${b - h} Q${f(x + 1.2)},${b - h * 0.6} ${f(x + 5.5)},${b}Z" fill="#B87645"/>`;
        crown += `<circle cx="${f(x + (i < 3 ? -2 : 2))}" cy="${b - h - 8}" r="3.2" fill="#B87645"/>`;
      });
      s += L(crown);
      s += L(`<path d="M150,196 Q157,220 159,240 L141,240 Q143,220 150,196Z" fill="#C98552"/><circle cx="150" cy="184" r="5" fill="#C98552"/>`);
      s += L(`<path d="M150,72 C150,72 170,100 170,114 A20,20 0 0 1 130,114 C130,100 150,72 150,72Z" fill="#4A2A1A"/>`);
      s += `<ellipse cx="141" cy="111" rx="4" ry="7" fill="#7A4A30" transform="rotate(20 141 111)"/>`;
      s += L(`<circle cx="186" cy="150" r="4" fill="#4A2A1A"/><circle cx="114" cy="164" r="3" fill="#4A2A1A"/><circle cx="196" cy="186" r="2.4" fill="#4A2A1A"/>`);
      return s;
    },
    2(L) { // рассвет над плантацией
      let s = `<rect width="300" height="300" fill="#E58F66"/>`;
      [[190, "#EBA174"], [146, "#F0B585"], [106, "#F5C998"], [70, "#F9DCAE"]].forEach(([r, c]) => s += L(`<circle cx="150" cy="190" r="${r}" fill="${c}"/>`));
      s += L(`<circle cx="150" cy="190" r="40" fill="#EE8E32"/>`);
      s += `<circle cx="150" cy="190" r="31" fill="#F3A443"/>`;
      const hills = [
        ["M0,192 C60,168 120,176 160,186 C210,198 250,172 300,176", "#AAAE7B", null],
        ["M0,216 C50,198 100,200 150,212 C200,224 250,206 300,200", "#879560", "#6E7C4C"],
        ["M0,240 C70,222 130,226 180,238 C230,250 270,236 300,232", "#66784A", "#4E5F37"],
        ["M0,264 C60,250 120,252 170,262 C220,272 260,262 300,258", "#4A5C35", "#364527"]
      ];
      hills.forEach(([top, c, rowC]) => {
        let g = `<path d="${top} V300 H0Z" fill="${c}"/>`;
        if (rowC) [9, 19, 30].forEach(dy => g += `<path d="${top}" transform="translate(0,${dy})" fill="none" stroke="${rowC}" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="0 10"/>`);
        s += L(g);
      });
      s += `<g fill="none" stroke="#7A3E22" stroke-width="1.8" stroke-linecap="round"><path d="M88,104 q6,-6 11,0 q5,-6 11,0"/><path d="M114,90 q5,-5 9,0 q4,-5 9,0"/></g>`;
      return s;
    },
    3(L) { // квиллинг: пар закручивается в ветер
      let s = `<rect width="300" height="300" fill="#B9D3DA"/>`;
      [[230, "#C4DAE0"], [180, "#CFE2E7"], [128, "#DBEAEE"]].forEach(([r, c]) => s += L(`<circle cx="150" cy="262" r="${r}" fill="${c}"/>`));
      s += L(`<rect y="258" width="300" height="50" fill="#A06E4A"/><rect y="258" width="300" height="5" fill="#B88460"/>`);
      s += L(cupSide(150, 190, 96, { fill: "#F7F0E5", coffee: "#6B3E26" }));
      const strips = [
        "M128,182 C116,160 142,146 132,126 C122,106 98,104 96,82 C94,60 120,50 133,62 C143,72 133,87 121,81",
        "M150,180 C162,158 138,140 152,117 C166,95 192,96 195,73 C198,52 175,40 161,50 C151,58 158,73 170,70",
        "M173,182 C188,166 178,150 190,138 C202,126 226,130 228,112 C230,98 214,90 206,99"
      ];
      strips.forEach(d => s += L(`<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E3EEF1" stroke-width="2.2" stroke-linecap="round"/>`));
      s += L(`<circle cx="226" cy="70" r="4" fill="#fff"/><circle cx="84" cy="122" r="3" fill="#fff"/><circle cx="240" cy="94" r="2.4" fill="#fff"/>`);
      return s;
    },
    4(L) { // Млечный путь из чашки
      let s = `<rect width="300" height="300" fill="#141A31"/>`;
      [[250, "#19203D"], [200, "#1F2849"], [150, "#273158"]].forEach(([r, c]) => s += L(`<circle cx="150" cy="320" r="${r}" fill="${c}"/>`));
      const R = rng(12);
      let mw = "";
      for (let t = 0; t <= 1; t += 0.0045) {
        const x0 = (1 - t) ** 2 * 152 + 2 * (1 - t) * t * 118 + t * t * 252;
        const y0 = (1 - t) ** 2 * 216 + 2 * (1 - t) * t * 92 + t * t * 46;
        const spread = 2 + t * 26, k = 2;
        for (let j = 0; j < k; j++) {
          const g = (R() + R() + R() - 1.5) * spread;
          mw += `<circle cx="${f(x0 + g * 0.8)}" cy="${f(y0 + g * 0.6)}" r="${f(0.5 + R() * 1.3)}" fill="#F6E7C1" opacity="${f(0.5 + R() * 0.5)}"/>`;
        }
      }
      s += `<g opacity=".95">${mw}</g>`;
      let stars = "";
      [[58, 128, 4], [80, 170, 2.6], [208, 132, 3.2], [236, 168, 2.4], [190, 70, 2.6], [120, 52, 3], [262, 120, 2], [46, 196, 2.2], [150, 148, 2]].forEach(([x, y, r]) => stars += `<path d="${star4(x, y, r * 1.5)}" fill="#F6E7C1"/>`);
      s += L(stars);
      s += L(`<rect width="300" height="300" fill="#F6E7C1" mask="url(#${"__ID__"}-moon)"/>`);
      s += L(`<path d="M0,214 L46,170 L80,196 L126,150 L170,200 L212,168 L258,204 L300,178 V300H0Z" fill="#0F1428"/>`);
      s += L(`<path d="M0,252 C70,226 230,226 300,252 V300H0Z" fill="#2C2541"/>`);
      s += L(cupSide(152, 216, 32, { fill: "#F6E7C1", coffee: "#5A3420" }));
      return s;
    },
    5(L) { // два пара сплетаются в сердце
      let s = `<rect width="300" height="300" fill="#DFA398"/>`;
      [[122, "#E6B4AA"], [94, "#ECC4BB"], [66, "#F2D4CC"]].forEach(([r, c]) => s += L(`<circle cx="150" cy="130" r="${r}" fill="${c}"/>`));
      s += L(`<rect y="238" width="300" height="70" fill="#A6673C"/><rect y="238" width="300" height="6" fill="#BE8255"/>`);
      s += L(cupSide(94, 196, 62, { fill: "#FBF4EA", coffee: "#6B3E26", dir: -1 }));
      s += L(cupSide(206, 196, 62, { fill: "#FBF4EA", coffee: "#6B3E26", dir: 1 }));
      const left = "M96,188 C94,172 124,176 150,160 C124,146 98,130 100,110 C102,86 138,78 150,102";
      const right = "M204,188 C206,172 176,176 150,160 C176,146 202,130 200,110 C198,86 162,78 150,102";
      [left, right].forEach(d => s += L(`<path d="${d}" fill="none" stroke="#FFF8F0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`));
      s += L(`<path d="${heart(212, 70, 13)}" fill="#FFF8F0"/><path d="${heart(86, 64, 9)}" fill="#FFF8F0"/>`);
      return s;
    }
  };

  function paperText(th, p, L) {
    const d = th.day;
    let s = "";
    s += T(44, 50.5, String(d), { font: "Unbounded", size: 17, weight: 700, anchor: "middle", fill: p.dark ? "#222A47" : "#FFF7EC" });
    s += T(24, 300, "Спасибо, Господи,", { font: "Golos Text", size: 13, weight: 500, fill: p.ink, op: 0.85 });
    const fs = fit(th.sticker, 21, 178, 0.66);
    th.sticker.forEach((l, i) => s += T(23, 327 + i * fs * 1.18, l, { font: "Unbounded", size: fs, weight: 600, fill: p.ink }));
    s += T(24, 327 + (th.sticker.length - 1) * fs * 1.18 + 22, th.ref, { font: "Golos Text", size: 10, weight: 600, fill: p.ink, op: 0.65 });
    s += L(`<g transform="rotate(-2 244 326)">${qr(window.dayUrl(d), 208, 290, 72, "#24150D", "#FFFDF8")}</g>`);
    return s;
  }

  // Гибрид: картинка — рендер Blender, текст и QR — вектор поверх
  function renderPaperHybrid(th, img) {
    const d = th.day, p = PAPER[d], id = `pa${d}`;
    const L = c => `<g filter="url(#${id}-pl)">${c}</g>`;
    return svg(paperDefs(id) + `<image href="${img}" width="300" height="400" preserveAspectRatio="xMidYMid slice"/>` + paperText(th, p, L),
      `Наклейка «Бумага», рендер Blender, день ${d}: ${th.topic}`);
  }

  function renderPaper(th) {
    const d = th.day, p = PAPER[d], id = `pa${d}`;
    const L = c => `<g filter="url(#${id}-pl)">${c}</g>`;
    let s = paperDefs(id);
    s += `<rect width="300" height="400" fill="${p.frame}"/>`;
    s += `<g clip-path="url(#${id}-arch)">${paperScene[d](L).replace(/__ID__/g, id)}</g>`;
    s += `<g filter="url(#${id}-fr)"><path fill-rule="evenodd" d="M0,0 H300 V400 H0Z ${ARCH}" fill="${p.frame}"/></g>`;
    s += L(`<circle cx="44" cy="44" r="21" fill="${p.badge}"/>`);
    s += paperText(th, p, L);
    return svg(s, `Наклейка «Бумага», день ${d}: ${th.topic}`);
  }

  /* ─────────────────────────── C. ГРАВЮРА (линогравюра на крафте) ─────────────────────────── */

  const INK = "#24150D", CREAM = "#F2E8D5", KRAFT = "#C59B6D";
  const LINO = { 1: "#B4432F", 2: "#E08A2E", 3: "#4F8F96", 4: "#E2B04A", 5: "#C9576D" };

  function linoDefs(id) {
    return `<defs>
      <filter id="${id}-wear" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="11" result="n"/>
        <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -25 18.6" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in" result="w"/>
        <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="3" result="t2"/>
        <feDisplacementMap in="w" in2="t2" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="${id}-fib" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .05" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .22  0 0 0 0 .13  0 0 0 0 .05  0 0 0 1.1 -.48"/></filter>
      <filter id="${id}-fib2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05 .7" numOctaves="2" seed="6"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .85  0 0 0 1 -.55"/></filter>
      <pattern id="${id}-hatch" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="1.3" height="3.4" fill="${INK}"/></pattern>
      <clipPath id="${id}-med"><circle cx="150" cy="140" r="89"/></clipPath>
    </defs>`;
  }

  function seed(x, y, rot, sc, c) {
    let fan = "";
    for (let i = -3; i <= 3; i++) {
      const a = (i * 22 - 90) * Math.PI / 180, ex = Math.cos(a) * 8, ey = -11 + Math.sin(a) * 8;
      fan += `<line x1="0" y1="-11" x2="${f(ex)}" y2="${f(ey)}"/><circle cx="${f(ex)}" cy="${f(ey)}" r=".8" fill="${c}" stroke="none"/>`;
    }
    return `<g transform="translate(${f(x)},${f(y)}) rotate(${rot}) scale(${sc})" stroke="${c}" stroke-width="1.3" fill="none">` +
      `<line x1="0" y1="0" x2="0" y2="-11"/>${fan}<ellipse cx="0" cy="2" rx="1.3" ry="2.6" fill="${c}" stroke="none"/></g>`;
  }

  function sunburst(cx, cy, n, r, c, start = 0) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a0 = (start + i * 360 / n) * Math.PI / 180, a1 = a0 + Math.PI / n;
      s += `<path d="M${cx},${cy} L${f(cx + Math.cos(a0) * r)},${f(cy + Math.sin(a0) * r)} L${f(cx + Math.cos(a1) * r)},${f(cy + Math.sin(a1) * r)}Z" fill="${c}"/>`;
    }
    return s;
  }

  const linoArt = {
    1(id, A) { // чашка в лучах
      let s = sunburst(150, 150, 30, 110, KRAFT);
      s += `<circle cx="150" cy="150" r="40" fill="${INK}"/>`;
      s += cupSide(150, 132, 98, { fill: CREAM, stroke: INK, strokeW: 2, coffee: INK, hatch: `${id}-hatch` });
      s += `<g fill="none" stroke="${CREAM}" stroke-width="3.6" stroke-linecap="round"><path d="M132,118 c-8,-12 8,-18 0,-32"/><path d="M150,114 c-8,-14 8,-22 0,-40"/><path d="M168,118 c-8,-12 8,-18 0,-32"/></g>`;
      s += `<path d="${heart(150, 64, 22)}" fill="${A}"/>`;
      return s;
    },
    2(id, A) { // солнце встаёт из чашки
      let s = sunburst(150, 172, 22, 120, KRAFT, -4);
      s += `<circle cx="150" cy="172" r="46" fill="${INK}"/>`;
      s += `<circle cx="150" cy="172" r="38" fill="${A}"/><circle cx="150" cy="172" r="30" fill="none" stroke="${INK}" stroke-width="1.2"/><circle cx="150" cy="172" r="22" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
      // корпус чашки (обрезается медальоном)
      const w = 168, y = 176, h = w * 0.72;
      s += `<path d="M${150 + w * 0.42},${y + 18} C${150 + w * 0.72},${y + 6} ${150 + w * 0.74},${y + 70} ${150 + w * 0.3},${y + 82}" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>`;
      s += `<path d="M${150 + w * 0.42},${y + 18} C${150 + w * 0.72},${y + 6} ${150 + w * 0.74},${y + 70} ${150 + w * 0.3},${y + 82}" fill="none" stroke="${CREAM}" stroke-width="14" stroke-linecap="round"/>`;
      s += `<path d="M${150 - w / 2},${y} L${150 + w / 2},${y} C${150 + w / 2},${y + h * 0.78} ${150 + w * 0.3},${y + h} 150,${y + h} C${150 - w * 0.3},${y + h} ${150 - w / 2},${y + h * 0.78} ${150 - w / 2},${y}Z" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>`;
      s += `<rect x="168" y="${y}" width="80" height="80" fill="url(#${id}-hatch)"/>`;
      s += `<ellipse cx="150" cy="${y}" rx="${w / 2}" ry="13" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>`;
      s += `<ellipse cx="150" cy="${y + 1}" rx="${w / 2 - 8}" ry="9" fill="${INK}"/>`;
      s += `<path d="M118,${y + 1} Q150,${y - 6} 182,${y + 1}" fill="none" stroke="${A}" stroke-width="2.4" stroke-linecap="round"/>`;
      s += `<g fill="none" stroke="${CREAM}" stroke-width="2.2" stroke-linecap="round"><path d="M92,92 q7,-7 13,0 q6,-7 13,0"/><path d="M196,78 q5,-5 10,0 q5,-5 10,0"/><path d="M214,102 q4,-4 8,0 q4,-4 8,0"/></g>`;
      return s;
    },
    3(id, A) { // пар уносит семена одуванчика
      let s = "";
      for (let r = 20; r < 100; r += 9) s += `<circle cx="150" cy="232" r="${r}" fill="none" stroke="${KRAFT}" stroke-width=".9" opacity=".55"/>`;
      s += `<g fill="none" stroke-linecap="round">
        <path d="M132,186 C120,160 146,150 132,126 C118,104 88,112 84,90 C80,68 110,58 120,72 C127,82 116,92 108,86" stroke="${CREAM}" stroke-width="4"/>
        <path d="M152,184 C166,160 140,140 158,116 C176,94 206,104 214,82 C222,60 196,46 182,56 C172,64 180,78 192,74" stroke="${CREAM}" stroke-width="4"/>
        <path d="M170,186 C186,168 176,154 194,140 C210,128 236,138 238,118" stroke="${A}" stroke-width="2.4"/>
        <path d="M118,184 C104,170 112,156 100,144" stroke="${A}" stroke-width="2.4"/>
      </g>`;
      [[108, 58, -20, 1.1], [150, 64, 10, 1.25], [230, 74, 30, 1], [214, 46, 18, 0.8], [76, 128, -35, 0.9], [244, 140, 40, 0.95], [178, 98, 0, 0.75], [96, 74, -10, 0.7]]
        .forEach(([x, y, r, sc]) => s += seed(x, y, r, sc * 2.1, CREAM));
      s += cupSide(150, 190, 84, { fill: CREAM, stroke: INK, strokeW: 2, coffee: INK, hatch: `${id}-hatch` });
      return s;
    },
    4(id, A) { // ночь, Млечный путь из чашки
      const R = rng(31);
      let s = "";
      for (let i = 0; i < 70; i++) s += `<circle cx="${f(60 + R() * 180)}" cy="${f(48 + R() * 150)}" r="${f(0.4 + R() * 1.1)}" fill="${CREAM}" opacity="${f(0.5 + R() * 0.5)}"/>`;
      let mw = "";
      for (let t = 0; t <= 1; t += 0.006) {
        const x0 = (1 - t) ** 2 * 150 + 2 * (1 - t) * t * 116 + t * t * 236;
        const y0 = (1 - t) ** 2 * 190 + 2 * (1 - t) * t * 88 + t * t * 62;
        for (let j = 0; j < 2; j++) {
          const g = (R() + R() + R() - 1.5) * (2 + t * 22);
          mw += `<circle cx="${f(x0 + g * 0.8)}" cy="${f(y0 + g * 0.6)}" r="${f(0.5 + R() * 1.2)}" fill="${CREAM}"/>`;
        }
      }
      s += mw;
      [[96, 126, 6], [204, 118, 4.5], [178, 70, 3.5], [126, 82, 3]].forEach(([x, y, r]) => {
        s += `<path d="${star4(x, y, r * 1.6)}" fill="${CREAM}"/><path d="${star4(x, y, r)}" fill="${CREAM}" transform="rotate(45 ${x} ${y})"/>`;
      });
      s += `<path d="M108,58 a22,22 0 1 0 22,34 a17,17 0 1 1 -22,-34Z" fill="${A}"/>`;
      s += `<path d="M40,214 C90,196 210,196 260,214 V260 H40Z" fill="${KRAFT}"/>`;
      s += `<g stroke="${INK}" stroke-width="1" fill="none">${[206, 214, 222, 230].map(y => `<path d="M40,${y + 8} C90,${y - 10} 210,${y - 10} 260,${y + 8}"/>`).join("")}</g>`;
      s += cupSide(150, 186, 48, { fill: CREAM, stroke: INK, strokeW: 1.8, coffee: INK, hatch: `${id}-hatch` });
      return s;
    },
    5(id, A) { // две чашки звенят
      let s = "";
      for (let r = 14; r < 100; r += 8) s += `<circle cx="150" cy="106" r="${r}" fill="none" stroke="${KRAFT}" stroke-width="1.6" opacity=".7"/>`;
      s += `<g transform="rotate(16 104 168)">${cupSide(108, 126, 76, { fill: CREAM, stroke: INK, strokeW: 2, coffee: INK, dir: -1, saucer: false, hatch: `${id}-hatch` })}</g>`;
      s += `<g transform="rotate(-16 196 168)">${cupSide(192, 126, 76, { fill: CREAM, stroke: INK, strokeW: 2, coffee: INK, dir: 1, saucer: false, hatch: `${id}-hatch` })}</g>`;
      s += `<g stroke="${A}" stroke-width="3" stroke-linecap="round"><path d="M150,98 V84"/><path d="M136,102 L128,92"/><path d="M164,102 L172,92"/></g>`;
      s += `<path d="${heart(150, 62, 26)}" fill="${A}"/>`;
      s += `<circle cx="132" cy="112" r="2.6" fill="${CREAM}"/><circle cx="170" cy="110" r="2" fill="${CREAM}"/><circle cx="160" cy="118" r="1.6" fill="${CREAM}"/>`;
      s += `<path d="M64,210 H236" stroke="${CREAM}" stroke-width="2"/>`;
      return s;
    }
  };

  function bean(x, y, r, c) {
    return `<g transform="translate(${x},${y}) rotate(${r})"><ellipse rx="4.2" ry="2.8" fill="${c}"/><path d="M-3.4,0 Q0,-1.6 3.4,0" stroke="${KRAFT}" stroke-width=".8" fill="none"/></g>`;
  }

  function renderLino(th) {
    const d = th.day, id = `li${d}`, A = LINO[d];
    let s = linoDefs(id);
    s += `<rect width="300" height="400" fill="${KRAFT}"/>`;
    s += `<rect width="300" height="400" filter="url(#${id}-fib)" opacity=".55"/><rect width="300" height="400" filter="url(#${id}-fib2)" opacity=".18"/>`;
    let ink = "";
    ink += `<rect x="9" y="9" width="282" height="382" fill="none" stroke="${INK}" stroke-width="2.6"/><rect x="15" y="15" width="270" height="370" fill="none" stroke="${INK}" stroke-width=".9"/>`;
    [[15, 15], [285, 15], [15, 385], [285, 385]].forEach(([x, y]) => ink += `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="${INK}" transform="rotate(45 ${x} ${y})"/>`);
    ink += `<circle cx="150" cy="140" r="97" fill="${INK}"/><circle cx="150" cy="140" r="92.5" fill="none" stroke="${CREAM}" stroke-width="1.1"/>`;
    ink += `<g clip-path="url(#${id}-med)">${linoArt[d](id, A)}</g>`;
    // лента
    ink += `<path d="M58,228 H86 V252 H58 L66,240Z" fill="${INK}"/><path d="M242,228 H214 V252 H242 L234,240Z" fill="${INK}"/>`;
    ink += `<path d="M78,222 H222 V246 H78Z" fill="${A}" stroke="${INK}" stroke-width="1.6"/>`;
    ink += `<path d="M78,246 L86,252 V246Z M222,246 L214,252 V246Z" fill="${INK}"/>`;
    s += `<g filter="url(#${id}-wear)">${ink}</g>`;
    s += T(150, 238.5, `${d} ДЕКАБРЯ`, { font: "PT Serif", size: 10.5, weight: 700, ls: 2.4, anchor: "middle", fill: d === 4 ? INK : CREAM });
    s += T(150, 31.5, "АДВЕНТ · 24 ПОВОДА БЛАГОДАРИТЬ", { font: "PT Serif", size: 6.4, weight: 700, ls: 1.8, anchor: "middle", fill: INK, op: 0.85 });
    s += T(26, 282, "СПАСИБО, ГОСПОДИ,", { font: "PT Serif", size: 10, weight: 700, ls: 1.6, fill: INK });
    const fs = fit(th.sticker, 27, 172, 0.58);
    th.sticker.forEach((l, i) => s += T(25, 309 + i * fs * 1.08, l, { font: "Yeseva One", size: fs, fill: INK }));
    s += T(26, 309 + (th.sticker.length - 1) * fs * 1.08 + 21, th.ref, { font: "PT Serif", size: 11, italic: true, fill: INK, op: 0.85 });
    s += qr(window.dayUrl(d), 210, 266, 66, INK, CREAM);
    s += T(243, 346, "наведи камеру", { font: "PT Serif", size: 7, italic: true, anchor: "middle", fill: INK, op: 0.8 });
    let beans = "";
    for (let i = 0; i < 11; i++) beans += bean(40 + i * 22, 370, i % 2 ? 25 : -25, INK);
    s += `<g filter="url(#${id}-wear)">${beans}</g>`;
    return svg(s, `Наклейка «Гравюра», день ${d}: ${th.topic}`);
  }

  /* ─────────────────────────── D. ВИТРАЖ (стрельчатое окно, цветное стекло) ─────────────────────────── */

  const LEAD = "#1B1511";
  const WIN = "M14,272 V122 Q14,44 150,14 Q286,44 286,122 V272 Z";
  const gP = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" stroke="${LEAD}" stroke-width="3" stroke-linejoin="round" ${extra}/>`;
  const gE = (cx, cy, rx, ry, fill) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" stroke="${LEAD}" stroke-width="3"/>`;
  const gC = (cx, cy, r, fill, sw = 3) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" stroke="${LEAD}" stroke-width="${sw}"/>`;
  const gS = (d, w, c) => `<path d="${d}" fill="none" stroke="${LEAD}" stroke-width="${f(w + 5)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round"/>`;
  const gL = d => `<path d="${d}" fill="none" stroke="${LEAD}" stroke-width="2.6" stroke-linecap="round"/>`;
  const poly = pts => "M" + pts.map(p => `${f(p[0])},${f(p[1])}`).join(" L") + "Z";

  // фон окна: лучи × кольца, каждый кусок — отдельное стекло
  function glassRays(cx, cy, n, rings, pal, seedN, rot = 0) {
    const R = rng(seedN);
    let s = "";
    for (let j = 0; j < rings.length - 1; j++)
      for (let i = 0; i < n; i++) {
        const a0 = (rot + i * 360 / n) * Math.PI / 180, a1 = (rot + (i + 1) * 360 / n) * Math.PI / 180;
        const pt = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
        const r0 = rings[j], r1 = rings[j + 1];
        const pts = r0 === 0 ? [[cx, cy], pt(a0, r1), pt(a1, r1)] : [pt(a0, r0), pt(a0, r1), pt(a1, r1), pt(a1, r0)];
        const row = pal[Math.min(j, pal.length - 1)];
        s += gP(poly(pts), row[(i + (R() < 0.3 ? 1 : 0)) % row.length]);
      }
    return s;
  }

  function glassCup(x, y, w, cup, coffee, o = {}) {
    const h = w * 0.72, dir = o.dir || 1;
    const body = `M${f(x - w / 2)},${f(y)} L${f(x + w / 2)},${f(y)} C${f(x + w / 2)},${f(y + h * 0.78)} ${f(x + w * 0.3)},${f(y + h)} ${f(x)},${f(y + h)} C${f(x - w * 0.3)},${f(y + h)} ${f(x - w / 2)},${f(y + h * 0.78)} ${f(x - w / 2)},${f(y)}Z`;
    const handle = `M${f(x + dir * w * 0.46)},${f(y + h * 0.16)} C${f(x + dir * w * 0.8)},${f(y + h * 0.06)} ${f(x + dir * w * 0.82)},${f(y + h * 0.66)} ${f(x + dir * w * 0.33)},${f(y + h * 0.76)}`;
    let s = "";
    if (o.saucer !== false) s += gE(x, y + h + 1, w * 0.74, w * 0.12, o.saucerC || cup);
    s += gS(handle, w * 0.08, cup) + gP(body, cup);
    s += gL(`M${f(x - w / 6)},${f(y + w * 0.1)} L${f(x - w / 7)},${f(y + h * 0.95)}`) + gL(`M${f(x + w / 6)},${f(y + w * 0.1)} L${f(x + w / 7)},${f(y + h * 0.95)}`);
    s += gE(x, y, w / 2, w * 0.12, cup) + `<ellipse cx="${f(x)}" cy="${f(y + 1)}" rx="${f(w / 2 - w * 0.06)}" ry="${f(w * 0.085)}" fill="${coffee}" stroke="${LEAD}" stroke-width="2"/>`;
    return s;
  }

  const gStar = (x, y, r, c) => gP(star4(x, y, r * 1.5), c) + gP(star4(x, y, r), c, `transform="rotate(45 ${f(x)} ${f(y)})"`);
  const gHeart = (x, y, w, c) => { const k = w / 2; return gP(heart(x, y, w), c) + gL(`M${f(x)},${f(y - k * 0.38)} L${f(x)},${f(y + k * 0.9)}`); };
  const leaf = (x, y, len, ang, c) => gP(`M0,0 Q${f(len / 2)},${f(-len * 0.34)} ${len},0 Q${f(len / 2)},${f(len * 0.34)} 0,0Z`, c, `transform="translate(${x},${y}) rotate(${ang})"`) + gL(`M${x},${y} L${f(x + Math.cos(ang * Math.PI / 180) * len * 0.8)},${f(y + Math.sin(ang * Math.PI / 180) * len * 0.8)}`);

  const GLASS = {
    1: { // чашка в лучах, сердце в паре
      art() {
        let s = glassRays(150, 196, 16, [0, 60, 120, 190, 600], [["#F4D891", "#F8E4AE"], ["#E9B455", "#F2C46A"], ["#D8923A", "#E3A445"], ["#B86E2A", "#C97F33"]], 3, 4);
        s += glassCup(150, 166, 116, "#F3EBDC", "#5A3220", { saucerC: "#E6D8C0" });
        s += gS("M132,154 C124,138 140,128 132,112", 6, "#FBF7EE") + gS("M150,150 C142,132 158,120 150,100", 6, "#FBF7EE") + gS("M168,154 C160,138 176,128 168,112", 6, "#FBF7EE");
        s += gHeart(150, 74, 40, "#B3243A");
        return s;
      }
    },
    2: { // рассвет над холмами, ветка кофе с ягодами
      art() {
        let s = glassRays(150, 212, 18, [0, 48, 96, 156, 600], [["#FBE2A6"], ["#F8D28A", "#F6C66A"], ["#F2A675", "#F0B07A"], ["#E58A8A", "#DE7B86"]], 8, 0);
        s += gC(150, 212, 38, "#F2A62E") + gC(150, 212, 24, "#F8CB55");
        s += gP("M14,206 C70,190 120,196 160,204 C210,214 250,194 286,196 V272 H14Z", "#9BBF6E");
        s += gL("M70,196 L62,272") + gL("M150,203 L156,272") + gL("M232,204 L226,272");
        s += gP("M14,234 C70,220 130,224 180,234 C230,244 262,232 286,228 V272 H14Z", "#6E9650");
        s += gL("M110,226 L104,272") + gL("M200,238 L206,272");
        s += gP("M14,258 C60,250 120,250 170,258 C220,266 260,258 286,254 V272 H14Z", "#4D7440");
        s += gS("M14,250 C46,238 78,224 120,216", 6, "#6B4226");
        s += leaf(40, 240, 30, -70, "#3F7A44") + leaf(60, 232, 28, 30, "#5C9A4E") + leaf(86, 224, 30, -60, "#4B8A47") + leaf(104, 219, 26, 25, "#3F7A44");
        [[50, 247], [58, 254], [44, 256], [94, 230], [102, 237]].forEach(([x, y]) => s += gC(x, y, 6, "#B3243A", 2.4));
        return s;
      }
    },
    3: { // пар становится голубем
      art() {
        let s = glassRays(150, 250, 14, [0, 70, 140, 220, 600], [["#B7D4E6", "#C8DFEC"], ["#86B2D2", "#94BEDA"], ["#5B8DB8", "#6A9AC2"], ["#3F6E9E", "#35628F"]], 5, -2);
        s += gS("M136,194 C126,174 146,162 134,144 C124,128 104,132 96,122", 6, "#FBF7EE");
        s += gS("M152,192 C164,172 146,156 158,138 C168,122 186,124 192,112", 6, "#FBF7EE");
        s += gS("M168,194 C182,178 176,164 190,152 C202,142 222,148 228,134", 6, "#FBF7EE");
        const dove = `<g transform="translate(146,86) scale(1.05)">` +
          gP("M6,0 C14,-22 32,-40 52,-46 C44,-26 32,-10 20,0 Z", "#DCE8F0") +
          gP("M-46,22 L-30,10 C-14,4 6,2 22,-2 C28,-10 38,-12 44,-8 L54,-6 L44,-2 C40,6 30,12 18,14 C0,20 -18,22 -30,18 L-50,30 Z", "#F7F5EF") +
          gP("M-4,4 C-18,-18 -16,-46 -2,-64 C4,-44 14,-26 18,-2 Z", "#EEF3F6") +
          `<circle cx="40" cy="-7" r="1.8" fill="${LEAD}"/></g>`;
        s += dove;
        s += glassCup(150, 202, 92, "#F3EBDC", "#5A3220", { saucerC: "#E6D8C0" });
        return s;
      }
    },
    4: { // ночь, звёзды, Млечный путь из чашки
      art() {
        let s = glassRays(150, 250, 14, [0, 80, 150, 230, 600], [["#2B3B7A", "#33448A"], ["#22346E", "#2B2F6E"], ["#1E2A5E", "#2A2462"], ["#181F4A", "#221C50"]], 9, 3);
        s += gC(88, 80, 20, "#F3E3A6") + gC(98, 73, 17, "#2B2F6E");
        const R = rng(17);
        for (let t = 0.08; t <= 1; t += 0.045) {
          const x = (1 - t) ** 2 * 150 + 2 * (1 - t) * t * 118 + t * t * 236, y = (1 - t) ** 2 * 206 + 2 * (1 - t) * t * 96 + t * t * 52;
          const g = (R() - 0.5) * (6 + t * 26);
          s += gC(x + g, y + g * 0.6, 2.4 + R() * 2.2, "#F6F1E2", 1.6);
        }
        [[214, 164, 10], [62, 164, 8], [196, 100, 7], [126, 50, 6.5], [254, 128, 6], [44, 124, 6], [176, 50, 5]].forEach(([x, y, r]) => s += gStar(x, y, r, "#F2C14E"));
        s += gP("M14,236 C80,218 220,218 286,236 V272 H14Z", "#2E4A3E");
        s += gL("M90,226 L84,272") + gL("M210,226 L216,272");
        s += glassCup(150, 214, 40, "#F3EBDC", "#5A3220", { saucerC: "#E6D8C0" });
        return s;
      }
    },
    5: { // две чашки, одно сердце из двух половин
      art() {
        let s = glassRays(150, 118, 16, [0, 54, 104, 170, 600], [["#F6CF9A", "#F9DDB2"], ["#F2B27A", "#EFA582"], ["#E98A7A", "#E07B86"], ["#D9667A", "#C9566E"]], 12, 0);
        s += gP("M14,250 H286 V272 H14Z", "#8C5A3A") + gL("M100,250 V272") + gL("M200,250 V272");
        s += gS("M92,198 C88,176 116,170 136,148", 6, "#FBF7EE") + gS("M208,198 C212,176 184,170 164,148", 6, "#FBF7EE");
        s += glassCup(92, 206, 70, "#F3EBDC", "#5A3220", { dir: -1, saucerC: "#E6D8C0" });
        s += glassCup(208, 206, 70, "#F3EBDC", "#5A3220", { dir: 1, saucerC: "#E6D8C0" });
        s += gHeart(150, 104, 76, "#B3243A");
        return s;
      }
    }
  };

  function renderGlass(th) {
    const d = th.day, id = `gl${d}`;
    let s = `<defs>
      <clipPath id="${id}-win"><path d="${WIN}"/></clipPath>
      <clipPath id="${id}-glass"><path d="${WIN}"/><rect x="14" y="282" width="272" height="104"/><circle cx="34" cy="34" r="17"/><circle cx="266" cy="34" r="17"/></clipPath>
      <radialGradient id="${id}-glow" cx="50%" cy="34%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".55" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
      <filter id="${id}-streak" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".014 .06" numOctaves="3" seed="${d * 3}"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.3 -.62"/></filter>
      <filter id="${id}-mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="${d * 5}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -.5"/></filter>
    </defs>`;
    s += `<rect width="300" height="400" fill="${LEAD}"/>`;
    s += `<g clip-path="url(#${id}-win)">${GLASS[d].art()}</g>`;
    s += gP(WIN, "none", `stroke-width="4"`);
    // табличка с текстом: два стекла
    s += gP("M14,282 H200 V386 H14Z", "#F1E1B8") + gP("M200,282 H286 V386 H200Z", "#F7EFDC");
    // уголки над аркой: медальоны с числом и зерном
    s += gC(34, 34, 17, "#E9B455") + gC(266, 34, 17, "#E9B455");
    s += gP("M266,22 C276,26 276,42 266,46 C256,42 256,26 266,22Z", "#6B4226") + gL("M266,24 C262,32 270,36 266,44");
    // свет и фактура стекла
    s += `<g clip-path="url(#${id}-glass)"><rect width="300" height="400" fill="url(#${id}-glow)"/>` +
      `<rect width="300" height="400" filter="url(#${id}-streak)" opacity=".35"/><rect width="300" height="400" filter="url(#${id}-mottle)" opacity=".22"/></g>`;
    s += T(34, 40, String(d), { font: "Kurale", size: 17, anchor: "middle", fill: LEAD });
    s += T(26, 300, `${d} ДЕКАБРЯ`, { font: "Philosopher", size: 8.5, weight: 700, ls: 2, fill: "#7A2E1E" });
    s += T(26, 318, "Спасибо, Господи,", { font: "Philosopher", size: 13.5, italic: true, fill: LEAD });
    const fs = fit(th.sticker, 21, 166, 0.5);
    th.sticker.forEach((l, i) => s += T(25, 340 + i * fs * 1.02, l, { font: "Kurale", size: fs, fill: LEAD }));
    s += T(26, 377, th.ref, { font: "Philosopher", size: 10, fill: LEAD, op: 0.8 });
    s += qr(window.dayUrl(d), 207, 298, 72, LEAD, "#FFFDF7");
    return svg(s, `Наклейка «Витраж», день ${d}: ${th.topic}`);
  }

  /* ─────────────────────────── E. АКВАРЕЛЬ КОФЕ (нарисовано кофе по хлопковой бумаге) ─────────────────────────── */

  const WC = { paper: "#F8F2E7", c1: "#D6AE82", c2: "#A26B3B", c3: "#5A361D", ink: "#3B2414" };

  function wcDefs(id, d) {
    return `<defs>
      <filter id="${id}-wc" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".028" numOctaves="4" seed="${d * 7}" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="13" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="d" stdDeviation="1.1" result="b"/>
        <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="3" result="g"/>
        <feColorMatrix in="g" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.62" result="ga"/>
        <feComposite in="b" in2="ga" operator="in" result="gran"/>
        <feMorphology in="b" operator="erode" radius="2.2" result="er"/>
        <feComposite in="b" in2="er" operator="out" result="edge"/>
        <feMerge><feMergeNode in="gran"/><feMergeNode in="edge"/></feMerge>
      </filter>
      <filter id="${id}-bloom" x="-40%" y="-40%" width="180%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" seed="${d * 11}" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="d" stdDeviation="5"/>
      </filter>
      <filter id="${id}-ink" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="${d}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>
      <filter id="${id}-ring" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="${d * 13}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".5"/></filter>
      <filter id="${id}-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="4" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .5 -.2"/></filter>
      <radialGradient id="${id}-vig" cx="50%" cy="45%" r="75%"><stop offset=".6" stop-color="#C9A97F" stop-opacity="0"/><stop offset="1" stop-color="#C9A97F" stop-opacity=".28"/></radialGradient>
    </defs>`;
  }

  function wcKit(id) {
    return {
      W: (c, color, op) => `<g filter="url(#${id}-wc)" fill="${color}" opacity="${op}">${c}</g>`,
      Ws: (d, color, w, op) => `<g filter="url(#${id}-wc)" opacity="${op}"><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/></g>`,
      B: (c, color, op) => `<g filter="url(#${id}-bloom)" fill="${color}" opacity="${op}">${c}</g>`,
      I: (c, w = 1.3) => `<g filter="url(#${id}-ink)" fill="none" stroke="${WC.ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${c}</g>`,
      ring: (cx, cy, r, op) => `<g filter="url(#${id}-ring)" opacity="${op}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#C08A55" fill-opacity=".09"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#9C6436" stroke-width="2.4" stroke-dasharray="${f(r * 4.6)} ${f(r * 0.5)} ${f(r * 0.8)} ${f(r * 0.4)}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="#9C6436" stroke-width=".8" stroke-opacity=".6"/></g>`,
      splat: (seedN, n, x0, y0, x1, y1, color, rMax = 2.2) => {
        const R = rng(seedN); let s = "";
        for (let i = 0; i < n; i++) s += `<circle cx="${f(x0 + R() * (x1 - x0))}" cy="${f(y0 + R() * (y1 - y0))}" r="${f(0.4 + R() * rMax)}" fill="${color}" opacity="${f(0.35 + R() * 0.5)}"/>`;
        return s;
      }
    };
  }

  // чашка: размывки + чуть смещённый контур тушью
  function wcCup(K, x, y, w, o = {}) {
    const h = w * 0.72, dir = o.dir || 1;
    const body = `M${f(x - w / 2)},${f(y)} L${f(x + w / 2)},${f(y)} C${f(x + w / 2)},${f(y + h * 0.78)} ${f(x + w * 0.3)},${f(y + h)} ${f(x)},${f(y + h)} C${f(x - w * 0.3)},${f(y + h)} ${f(x - w / 2)},${f(y + h * 0.78)} ${f(x - w / 2)},${f(y)}Z`;
    const shade = `M${f(x + w * 0.14)},${f(y)} L${f(x + w / 2)},${f(y)} C${f(x + w / 2)},${f(y + h * 0.78)} ${f(x + w * 0.32)},${f(y + h)} ${f(x + w * 0.1)},${f(y + h)}Z`;
    const handle = `M${f(x + dir * w * 0.46)},${f(y + h * 0.16)} C${f(x + dir * w * 0.8)},${f(y + h * 0.06)} ${f(x + dir * w * 0.82)},${f(y + h * 0.66)} ${f(x + dir * w * 0.33)},${f(y + h * 0.76)}`;
    let s = "";
    s += K.W(`<ellipse cx="${x}" cy="${f(y + h + 2)}" rx="${f(w * 0.76)}" ry="${f(w * 0.12)}"/>`, WC.c1, 0.55);
    s += K.Ws(handle, WC.c1, w * 0.09, 0.6);
    s += K.W(`<path d="${body}"/>`, WC.c1, 0.5);
    s += K.W(`<path d="${shade}"/>`, WC.c2, 0.38);
    s += K.W(`<ellipse cx="${x}" cy="${f(y + 1)}" rx="${f(w / 2 - w * 0.06)}" ry="${f(w * 0.085)}"/>`, WC.c3, 0.85);
    const dx = 1.6, dy = -1.4;
    s += K.I(`<g transform="translate(${dx},${dy})"><path d="${body}"/><ellipse cx="${x}" cy="${y}" rx="${f(w / 2)}" ry="${f(w * 0.12)}"/><path d="${handle}"/>` +
      `<path d="M${f(x - w * 0.72)},${f(y + h + 4)} Q${x},${f(y + h + w * 0.2)} ${f(x + w * 0.74)},${f(y + h + 2)}"/></g>`);
    return s;
  }

  const AQUA = {
    1(K) { // вкус
      let s = K.ring(214, 232, 56, 0.6);
      s += wcCup(K, 150, 152, 122);
      s += K.W(`<path d="${heart(150, 72, 36)}"/>`, WC.c2, 0.6);
      s += K.I(`<path d="${heart(151.5, 70.5, 37)}"/><path d="M130,138 c-8,-12 8,-20 0,-34"/><path d="M150,134 c-8,-14 8,-24 0,-42"/><path d="M170,138 c-8,-12 8,-20 0,-34"/>`);
      s += K.splat(3, 14, 40, 60, 270, 250, WC.c2);
      return s;
    },
    2(K) { // утро: солнце — нетронутая бумага
      let s = K.W(`<path fill-rule="evenodd" d="M26,74 C40,48 70,58 92,46 C120,30 150,52 178,40 C206,28 240,54 262,48 C282,60 280,120 280,200 L20,204 C16,150 18,100 26,74Z M150,147 a30,30 0 1 0 0.1,0Z"/>`, WC.c1, 0.5);
      s += K.W(`<path fill-rule="evenodd" d="M22,128 C100,120 200,122 280,128 L280,204 L20,206Z M150,147 a34,34 0 1 0 0.1,0Z"/>`, WC.c2, 0.28);
      s += K.W(`<path d="M18,190 C70,172 120,180 160,188 C210,198 250,176 282,178 L282,236 L20,240Z"/>`, WC.c1, 0.65);
      s += K.W(`<path d="M18,214 C70,198 130,204 180,214 C230,224 262,210 282,208 L284,252 L18,256Z"/>`, WC.c2, 0.5);
      s += K.W(`<path d="M20,238 C60,228 120,232 170,240 C220,248 260,238 282,236 C276,256 240,268 150,268 C70,268 30,258 20,238Z"/>`, WC.c3, 0.55);
      s += K.I(`<circle cx="150" cy="177" r="29"/><path d="M84,96 q6,-6 11,0 q5,-6 11,0"/><path d="M110,82 q5,-5 9,0 q4,-5 9,0"/>` +
        [204, 214, 226].map(y => `<path d="M24,${y + 8} C70,${y - 8} 130,${y - 4} 180,${y + 6} C230,${y + 16} 262,${y + 2} 280,${y}" stroke-dasharray="0 9" stroke-width="2.6"/>`).join(""), 1.3);
      return s;
    },
    3(K) { // дыхание: пар уносит семена
      let s = K.B(`<circle cx="120" cy="96" r="44"/><circle cx="190" cy="84" r="38"/>`, WC.c1, 0.32);
      const paths = ["M134,184 C122,160 146,148 132,126 C118,104 88,112 86,90 C84,68 112,58 122,72", "M152,182 C166,158 140,140 158,116 C176,94 204,102 210,80 C216,60 194,48 182,58", "M170,184 C186,168 176,154 194,140 C210,128 234,136 236,116"];
      paths.forEach(d => s += K.Ws(d, WC.c2, 12, 0.32));
      s += wcCup(K, 150, 190, 92);
      s += K.I(paths.map(d => `<path d="${d}" transform="translate(2,-2)"/>`).join(""), 1.2);
      [[150, 70, 10, 1.5], [232, 84, 30, 1.2], [206, 60, 18, 1.0], [70, 124, -35, 1.1], [250, 136, 40, 1.15], [100, 80, -20, 1.25]].forEach(([x, y, r, sc]) => s += `<g filter="url(#__ID__-ink)">${seed(x, y, r, sc, WC.ink)}</g>`);
      return s;
    },
    4(K) { // ночное небо, звёзды — брызги белил
      const sky = "M36,70 Q150,48 264,70 Q290,150 268,222 Q150,246 32,222 Q10,150 36,70Z";
      let s = K.W(`<path d="${sky}"/>`, WC.c2, 0.55) + K.W(`<path d="${sky}" transform="translate(150,128) scale(.94) translate(-150,-128)"/>`, WC.c3, 0.85);
      s += K.W(`<path d="M150,200 Q118,110 240,80" fill="none" stroke="${WC.paper}" stroke-width="26" stroke-linecap="round"/>`, WC.paper, 0.35);
      const R = rng(41);
      let dots = "";
      for (let t = 0; t <= 1; t += 0.01) {
        const x = (1 - t) ** 2 * 150 + 2 * (1 - t) * t * 118 + t * t * 240, y = (1 - t) ** 2 * 200 + 2 * (1 - t) * t * 110 + t * t * 80;
        const g = (R() + R() - 1) * (4 + t * 18);
        dots += `<circle cx="${f(x + g)}" cy="${f(y + g * 0.6)}" r="${f(0.5 + R() * 1.3)}" fill="#FFFCF4" opacity="${f(0.6 + R() * 0.4)}"/>`;
      }
      s += dots + K.splat(9, 60, 44, 76, 258, 206, "#FFFCF4", 1.6);
      s += K.W(`<circle cx="88" cy="104" r="17"/>`, "#FFFCF4", 0.95) + K.W(`<circle cx="99" cy="97" r="15"/>`, WC.c3, 0.95);
      s += wcCup(K, 150, 200, 44);
      return s;
    },
    5(K) { // друзья: два кольца от чашек пересекаются
      let s = K.ring(120, 140, 64, 0.65) + K.ring(184, 146, 64, 0.65);
      s += K.W(`<path d="${heart(150, 112, 58)}"/>`, WC.c2, 0.4);
      s += wcCup(K, 96, 198, 74, { dir: -1 }) + wcCup(K, 204, 198, 74, { dir: 1 });
      s += K.I(`<path d="M98,190 C96,172 124,174 150,156 C124,142 100,128 102,108 C104,86 138,80 150,102"/><path d="M202,190 C204,172 176,174 150,156 C176,142 200,128 198,108 C196,86 162,80 150,102"/>`, 1.4);
      return s;
    }
  };

  function renderAqua(th) {
    const d = th.day, id = `wa${d}`, K = wcKit(id);
    let s = wcDefs(id, d);
    s += `<rect width="300" height="400" fill="${WC.paper}"/><rect width="300" height="400" filter="url(#${id}-paper)"/>`;
    s += AQUA[d](K).replace(/__ID__/g, id);
    s += `<rect width="300" height="400" fill="url(#${id}-vig)"/>`;
    s += T(22, 44, `${d} декабря`, { font: "Marck Script", size: 24, fill: WC.c2 });
    s += T(22, 302, "Спасибо, Господи,", { font: "Marck Script", size: 22, fill: WC.ink });
    const fs = fit(th.sticker, 27, 176, 0.5);
    th.sticker.forEach((l, i) => s += T(21, 331 + i * fs * 1.04, l, { font: "Lora", size: fs, weight: 600, italic: true, fill: WC.ink }));
    s += T(22, 331 + (th.sticker.length - 1) * fs * 1.04 + 22, th.ref, { font: "Lora", size: 10.5, italic: true, fill: WC.c2 });
    s += qr(window.dayUrl(d), 212, 298, 68, WC.ink, WC.paper);
    return svg(s, `Наклейка «Акварель кофе», день ${d}: ${th.topic}`);
  }

  window.STICKER_INTERNALS = { paperScene, PAPER, ARCH, cupSide, renderPaperHybrid };
  window.STICKER_STYLES = [
    { id: "latte", name: "Пенка", render: renderLatte },
    { id: "paper", name: "Бумага", render: renderPaper },
    { id: "lino", name: "Гравюра", render: renderLino },
    { id: "glass", name: "Витраж", render: renderGlass },
    { id: "aqua", name: "Акварель", render: renderAqua }
  ];
})();
