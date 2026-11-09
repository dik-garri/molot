/* Видеодвижок наклеек. Фиксированный код: новое видео — это новый файл stories/<name>.js.
   Как в anim-kit: кадр полностью определяется временем t (draw(t) детерминирован),
   звук синтезируется офлайн (OfflineAudioContext) и отдаётся как WAV — поэтому видео можно
   рендерить покадрово (render.mjs) и всегда получать одно и то же. ?t=5 — показать один кадр. */
(() => {
  "use strict";
  const S = window.STORY, D = S.duration, th = DEMO_THEMES[S.day - 1];   // видео сняты на темы первой версии
  const style = STICKER_STYLES.find(s => s.id === S.style);
  const $ = id => document.getElementById(id);

  /* ---------- время ---------- */
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const eo = x => 1 - Math.pow(1 - cl(x), 3);
  const eio = x => (x = cl(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const back = x => { x = cl(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * cl(k)).toString(16).padStart(2, "0")).join(""); };
  window.V = { cl, seg, lerp, eo, eio, back, mix, D };

  /* ---------- раскладка кадра 540×960 (9:16) ---------- */
  const T = S.theme;
  document.documentElement.style.setProperty("--bg", T.bg);
  document.documentElement.style.setProperty("--ink", T.ink);
  document.documentElement.style.setProperty("--accent", T.accent);
  document.documentElement.style.setProperty("--display", T.display);
  document.documentElement.style.setProperty("--body", T.body);
  $("eyebrow").textContent = `Адвент-календарь · день ${S.day}`;
  $("cta").innerHTML = `<b>24 причины</b> поблагодарить Христа<br>за Его приход`;
  $("ref").textContent = th.ref;

  // общий ритм (секунды): сцена → подпись наклейки → стих → финал
  const TL = { cardIn: [.25, 1.25], text: [S.textAt ?? 8.6, (S.textAt ?? 8.6) + 1], verse: S.verseAt ?? 9.4, cta: D - 2.8 };
  const CPS = 42;   // скорость «печати» стиха, знаков в секунду

  function draw(t) {
    t = cl(t, 0, D);
    $("bg").style.opacity = 1;
    $("eyebrow").style.opacity = seg(t, .1, .8);
    // карточка: появление (подъём или «штамп») + медленный наезд
    const k = seg(t, ...TL.cardIn), zoom = 1 + .035 * eio(t / D);
    let ty = 0, sc = 1, op = eo(k);
    if (S.cardIn === "stamp") { sc = lerp(1.16, 1, back(k)); op = seg(t, TL.cardIn[0], TL.cardIn[0] + .15); }
    else { ty = lerp(40, 0, eo(k)); sc = lerp(.94, 1, eo(k)); }
    $("card").style.opacity = op;
    $("card").style.transform = `translateY(${ty}px) scale(${sc * zoom})`;
    $("card").innerHTML = style.render(th, { ...S.frame(t), text: eo(seg(t, ...TL.text)) });
    // стих печатается
    const n = Math.floor(cl((t - TL.verse) * CPS, 0, th.verse.length));
    $("verse").textContent = th.verse.slice(0, n);
    $("verse").style.opacity = seg(t, TL.verse - .2, TL.verse);
    const typed = TL.verse + th.verse.length / CPS;
    $("ref").style.opacity = seg(t, typed, typed + .5);
    // финал
    const c = seg(t, TL.cta, TL.cta + .8);
    $("cta").style.opacity = eo(c);
    $("cta").style.transform = `translateY(${lerp(14, 0, eo(c))}px)`;
    $("fade").style.opacity = seg(t, D - .45, D);
  }

  /* ---------- звук: общий модуль video/audio.js ---------- */
  const renderAudio = () => VAUDIO.render(S, D), wav = VAUDIO.wav;

  /* ---------- просмотр в браузере ---------- */
  let ctx = null, src = null, raf = 0;
  async function play() {
    stop();
    const buf = await renderAudio();
    ctx = ctx || new AudioContext(); await ctx.resume();
    src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination);
    const t0 = ctx.currentTime + .05; src.start(t0);
    $("play").style.display = "none";
    const loop = () => { const t = ctx.currentTime - t0; draw(t); if (t < D) raf = requestAnimationFrame(loop); else $("play").style.display = ""; };
    loop();
  }
  function stop() { cancelAnimationFrame(raf); if (src) { try { src.stop(); } catch (e) {} src = null; } }

  // все шрифты наклеек грузим заранее, иначе первые кадры уйдут с запасным шрифтом
  const FONTS = [`20px ${T.display}`, `20px ${T.body}`, "700 20px Unbounded", "600 20px Unbounded", "500 20px 'Golos Text'", "600 20px 'Golos Text'",
    "20px 'Marck Script'", "italic 600 20px Lora", "italic 400 20px Lora"];
  const ready = Promise.all(FONTS.map(fn => document.fonts.load(fn, "Аа1"))).then(() => document.fonts.ready).catch(() => {});
  window.VIDEO = { duration: D, draw, ready, audio: async () => wav(await renderAudio()), play };
  $("play").onclick = play;
  const still = parseFloat(new URLSearchParams(location.search).get("t"));
  ready.then(() => draw(isNaN(still) ? (S.poster ?? 6) : still));
})();
