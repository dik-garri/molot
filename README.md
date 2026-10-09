# Вкусите и увидите — адвент-календарь благодарности

24 дрип-пакета кофе, 24 темы благодарности Богу. На каждом пакете наклейка (3:4) с QR-кодом на страницу дня.

**Сайт:** https://dik-garri.github.io/molot/

- `index.html` — концепция для согласования: коробка, 5 дизайн-направлений × 5 наклеек, 24 темы с текстами, производство.
- `day.html?d=1…24` — страница дня, на которую ведёт QR (`&s=latte|paper|lino|glass|aqua` — стиль картинки для дней 1–5).
- `sheet.html` — все 25 наклеек на одном листе.
- `png/` — 25 наклеек в PNG 1200×1600 (≈500 dpi при ширине 60 мм); `export.html?s=latte|paper|lino|glass|aqua&d=1…5` — страница для экспорта.
- `js/data.js` — весь контент: темы, текст наклейки, стих (Синодальный перевод), размышление, действие дня, идея рисунка.
- `js/stickers.js` — генератор наклеек в SVG (направления «Пенка», «Бумага», «Гравюра», «Витраж», «Акварель»).

## Blender

Бумажные наклейки можно отрендерить в объёме из тех же SVG-слоёв:

```sh
node blender/export_layers.js 2 /tmp/layers2              # слои дня 2 → отдельные SVG
blender -b -P blender/paper_render.py -- /tmp/layers2 out.png 160
```

Рендер — 900×1200, Cycles, ~10 с на наклейку. Текст и QR накладываются вектором поверх (`renderPaperHybrid`).
Поддерживаются фигуры с заливкой; штрихи и маски (птицы, луна дня 4, пар дней 3 и 5) пока в объём не переводятся.

---

[Все проекты →](https://dik-garri.github.io/garry/)

## Видео

Ролики 9:16 (1080×1920, 16 с, со звуком) — по одному на стиль. Устроено по образцу [anim-kit](https://github.com/tima-kho/anim-kit) / anim-kit-studio:
сценарий — данные (`video/stories/<стиль>.js`), кадр — функция времени (`VIDEO.draw(t)` в `video/engine.js`), звук синтезируется офлайн (`VIDEO.audio()` → WAV),
`video/render.mjs` снимает кадры в headless Chrome и склеивает их с звуком через ffmpeg.

```sh
cd video && npm install
node render.mjs latte          # → video/out/latte.mp4  (latte | paper | lino | glass | aqua)
```

`video/player.html?story=latte` — просмотр в браузере со звуком; `&t=6` — один кадр для проверки.
