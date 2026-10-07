// Экспорт слоёв бумажной наклейки в отдельные SVG-файлы для Blender.
// node blender/export_layers.js <день> <папка>
const fs = require("fs"), path = require("path");
global.window = global;
global.qrcode = require("../vendor/qrcode.js");
require("../js/data.js"); require("../js/stickers.js");
const { paperScene, PAPER, ARCH } = window.STICKER_INTERNALS;

const day = +process.argv[2] || 2, out = process.argv[3] || "blender/layers";
fs.mkdirSync(out, { recursive: true });

// пунктирные ряды кустов (stroke-dasharray) → настоящие кружки вдоль кривой
function dotsAlong(d, dy, r, step, fill) {
  const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const pts = [[n[0], n[1]]];
  for (let i = 2; i + 5 < n.length + 1; i += 6) pts.push(n.slice(i, i + 6));
  let s = "", acc = step / 2, prev = null, cur = pts[0];
  for (let k = 1; k < pts.length; k++) {
    const [x1, y1, x2, y2, x3, y3] = pts[k], [x0, y0] = cur;
    for (let t = 0; t <= 1; t += 0.002) {
      const u = 1 - t;
      const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
      const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3 + dy;
      if (prev) { acc += Math.hypot(x - prev[0], y - prev[1]); if (acc >= step) { acc = 0; s += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${fill}"/>`; } }
      prev = [x, y];
    }
    cur = [x3, y3];
  }
  return s;
}

const groups = [];
const L = c => { groups.push(c); return `<!--L${groups.length}-->`; };
const base = paperScene[day](L);              // то, что не обёрнуто в L(), лежит на предыдущем слое
const shapes = [];
const re = /<(rect|circle|ellipse|path)\b[^>]*\/>/g;
function collect(svg, layer) {
  svg = svg.replace(/<path d="([^"]+)" transform="translate\(0,(\d+)\)" fill="none" stroke="([^"]+)" stroke-width="[^"]+" stroke-linecap="round" stroke-dasharray="0 10"\/>/g,
    (_, d, dy, c) => dotsAlong(d, +dy, 2.6, 10, c));
  for (const m of svg.matchAll(re)) {
    const el = m[0];
    if (/fill="none"/.test(el)) continue;     // штрихи (птицы) в объём не идут
    const fill = (el.match(/fill="(#[0-9A-Fa-f]{6})"/) || [])[1];
    if (!fill) continue;
    shapes.push({ layer, el, fill });
  }
}
base.split(/<!--L(\d+)-->/).forEach((chunk, i, arr) => {
  if (i % 2) collect(groups[+chunk - 1], +chunk);          // слой-группа
  else collect(chunk, i === 0 ? 0 : +arr[i - 1] + 0.5);    // плоский элемент поверх предыдущего слоя
});
const top = groups.length + 1, p = PAPER[day];
shapes.push({ layer: top, el: `<path fill-rule="evenodd" d="M0,0 H300 V400 H0Z ${ARCH}" fill="${p.frame}"/>`, fill: p.frame, frame: true });
shapes.push({ layer: top + 1, el: `<circle cx="44" cy="44" r="21" fill="${p.badge}"/>`, fill: p.badge });

// фигуры одного слоя и цвета — в один файл
const byKey = new Map();
shapes.forEach(s => { const k = s.layer + s.fill; if (!byKey.has(k)) byKey.set(k, { ...s, els: [] }); byKey.get(k).els.push(s.el); });
const manifest = [...byKey.values()].map((s, i) => {
  const file = `s${String(i).padStart(3, "0")}.svg`;
  fs.writeFileSync(path.join(out, file), `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">${s.els.join("")}</svg>`);
  return { file, layer: s.layer, fill: s.fill, frame: !!s.frame };
});
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify({ day, layers: top + 2, shapes: manifest }, null, 1));
console.log(`день ${day}: ${manifest.length} фигур, ${top + 2} слоёв → ${out}`);
