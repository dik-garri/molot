// Время чтения каждого дня вслух: места Писания + молитва. Темп 130 слов в минуту; предел — 90 секунд.
// node tools/check-reading.js
global.window = global;
require("../js/data.js");
const WPM = 130, LIMIT = 90;
const words = s => s.split(/\s+/).filter(w => /[А-Яа-яЁё0-9]/.test(w)).length;
let over = 0;
THEMES.forEach(t => {
  const n = t.verses.reduce((a, v) => a + words(v.ref) + words(v.text), 0) + t.thanks.reduce((a, p) => a + words(p), 0) + words(t.topic);
  const sec = Math.round(n / WPM * 60);
  if (sec > LIMIT) over++;
  console.log(`${String(t.day).padStart(2)}  ${String(n).padStart(3)} слов  ≈ ${sec} с ${sec > LIMIT ? " ← больше 1,5 мин" : ""}  ${t.topic}`);
});
console.log(over ? `\nПревышений: ${over}` : "\nВсе дни укладываются в 1,5 минуты.");
