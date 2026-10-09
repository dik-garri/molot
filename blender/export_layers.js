// Экспорт слоёв бумажной наклейки в отдельные SVG-файлы для Blender.
// node blender/export_layers.js <день> <папка>
// Слои: сцена (js/scenes.js) → рамка с аркой → гирлянда → кружок с номером дня. Линии (посох, верёвка) в объём не идут.
const fs = require("fs"), path = require("path");
global.window = global;
global.qrcode = require("../vendor/qrcode.js");
require("../js/data.js"); require("../js/scenes.js"); require("../js/stickers.js");
const { PAPER, ARCH, garland } = window.STICKER_INTERNALS, { W, H } = window.STICKER_SIZE;

const day = +process.argv[2] || 4, out = process.argv[3] || "blender/layers";
fs.mkdirSync(out, { recursive: true });

const layers = [];                                   // [{els: [{el, fill}], frame?}]
SCENES[day]().layers.forEach(l => layers.push({ els: l.filter(it => !it.sw && it.only !== "aqua").map(it => ({ el: `<path d="${it.d}" fill="${it.p}"/>`, fill: it.p })) }));
const p = PAPER[day];
layers.push({ frame: true, els: [{ el: `<path fill-rule="evenodd" d="M0,0 H${W} V${H} H0Z ${ARCH}" fill="${p.frame}"/>`, fill: p.frame }] });
garland().forEach(l => layers.push({ els: l.map(it => ({ el: `<path d="${it.d}" fill="${it.p}"${it.tf ? ` transform="${it.tf}"` : ""}/>`, fill: it.p })) }));
layers.push({ els: [{ el: `<circle cx="38" cy="38" r="18" fill="${p.badge}"/>`, fill: p.badge }] });

// фигуры одного слоя и цвета — в один файл
const manifest = [];
layers.forEach((l, i) => {
  const byFill = new Map();
  l.els.forEach(e => { if (!byFill.has(e.fill)) byFill.set(e.fill, []); byFill.get(e.fill).push(e.el); });
  byFill.forEach((els, fill) => {
    const file = `s${String(manifest.length).padStart(3, "0")}.svg`;
    fs.writeFileSync(path.join(out, file), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${els.join("")}</svg>`);
    manifest.push({ file, layer: i, fill, frame: !!l.frame });
  });
});
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify({ day, layers: layers.length, shapes: manifest }, null, 1));
console.log(`день ${day}: ${manifest.length} файлов, ${layers.length} слоёв → ${out}`);
