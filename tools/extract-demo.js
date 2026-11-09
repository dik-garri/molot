// Сохраняет темы дней 1–5 первой версии (по ним нарисованы образцы наклеек и видео) в js/demo.js.
// node tools/extract-demo.js
const fs = require("fs");
global.window = global;
require("../js/data.js");
const keep = THEMES.slice(0, 5).map(({ day, key, topic, sticker, ref, verse }) => ({ day, key, topic, sticker, ref, verse }));
fs.writeFileSync(__dirname + "/../js/demo.js",
  "// Темы дней 1–5 из первой версии календаря. По ним нарисованы наклейки-образцы всех стилей и видео,\n" +
  "// поэтому образцы рендерятся по этим данным, а карточки и страницы дней — по актуальному списку в data.js.\n" +
  "window.DEMO_THEMES = " + JSON.stringify(keep, null, 2) + ";\n");
console.log(keep.map(t => t.topic).join(", "));
