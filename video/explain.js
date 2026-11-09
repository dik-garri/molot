/* Ролик-пояснение дня (9:16, до минуты): наклейка → тема → места Писания с пояснением → мысль дня → благодарность.
   Кадр — функция времени t (как в engine.js), поэтому ролик рендерится покадрово через render.mjs:
   node render.mjs explain-d01 --page explain.html?d=1 */
(() => {
  "use strict";
  const E = window.EXPLAIN, D = E.duration, th = THEMES[E.day - 1];
  const $ = id => document.getElementById(id);
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const eo = x => 1 - Math.pow(1 - cl(x), 3);
  const back = x => { x = cl(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  $("eyebrow").textContent = `Адвент-календарь · ${th.day} декабря`;
  $("card").innerHTML = STICKER_STYLES.find(s => s.id === "coffee").render(th);
  $("title-under").innerHTML = `<div class="script">24 причины</div><div class="sub" style="margin-top:6px">поблагодарить Христа за Его приход</div>`;

  // сцены собираем один раз, дальше draw(t) только меняет видимость и печатает стих
  const host = $("scenes");
  E.scenes.forEach((s, i) => {
    if (s.kind === "title") return;
    const el = document.createElement("div");
    el.className = "scene"; el.id = "sc" + i;
    let h = s.label ? `<div class="label">${esc(s.label)}</div>` : "";
    if (s.title) h += `<div class="title">${esc(s.title)}</div>`;
    if (s.verse != null) h += `<div class="verse"></div>`;
    if (s.big) h += `<div class="big">${s.big}</div>`;
    if (s.kind === "thanks") h += `<div class="thanks">${esc(th.thanks[s.thanks])}</div>`;
    if (s.note) h += `<div class="note">${esc(s.note)}</div>`;
    if (s.sub) h += `<div class="sub">${esc(s.sub)}</div>`;
    el.innerHTML = h;
    if (s.kind === "thanks") {
      const cta = document.createElement("div");
      cta.className = "cta"; cta.id = "cta";
      cta.innerHTML = `<b>«Вкусите и увидите»</b>адвент-календарь · 24 причины поблагодарить Христа<br>QR-код на каждом дрип-пакете`;
      $("frame").insertBefore(cta, $("stamp"));
    }
    host.appendChild(el);
  });

  const CPS = 40;   // скорость появления стиха, знаков в секунду
  function draw(t) {
    t = cl(t, 0, D);
    // наклейка: крупно в начале, затем уезжает вверх и уменьшается
    const k = eo(seg(t, 5.2, 6.6)), intro = eo(seg(t, .2, 1.2));
    const w = lerp(400, 200, k), x = (540 - w) / 2, y = lerp(lerp(150, 110, intro), 64, k);
    $("card").style.transform = `translate(${x}px,${y}px) scale(${w / 320})`;
    $("card").style.opacity = intro;
    $("eyebrow").style.opacity = intro * (1 - k);
    $("title-under").style.opacity = eo(seg(t, 1.6, 2.6)) * (1 - seg(t, 5, 5.6));
    E.scenes.forEach((s, i) => {
      if (s.kind === "title") return;
      const el = $("sc" + i), a = eo(seg(t, s.t0, s.t0 + .6)) * (1 - seg(t, s.t1 - .45, s.t1));
      el.style.opacity = a;
      el.style.transform = `translateY(${lerp(22, 0, eo(seg(t, s.t0, s.t0 + .7)))}px)`;
      el.style.visibility = a > 0 ? "visible" : "hidden";
      if (s.verse != null) {
        const v = th.verses[s.verse].text, n = Math.floor(cl((t - s.t0 - .7) * CPS, 0, v.length));
        el.querySelector(".verse").textContent = v.slice(0, n);
      }
      if (s.note) el.querySelector(".note").style.opacity = eo(seg(t, s.t0 + s.noteAt, s.t0 + s.noteAt + .7));
      if (s.sub) el.querySelector(".sub").style.opacity = eo(seg(t, s.t0 + (s.subAt || 0), s.t0 + (s.subAt || 0) + .7));
      if (s.stamp) {
        const st = $("stamp"), sk = seg(t, s.t0 + s.stampAt, s.t0 + s.stampAt + .35);
        st.textContent = s.stamp;
        st.style.opacity = (sk > 0 ? .92 : 0) * (1 - seg(t, s.t1 - .45, s.t1));
        st.style.transform = `translate(-50%,0) rotate(-9deg) scale(${lerp(1.9, 1, back(sk))})`;
      }
      if (s.kind === "thanks") $("cta").style.opacity = eo(seg(t, s.t0 + 2.6, s.t0 + 3.4));
    });
    $("fade").style.opacity = seg(t, D - .5, D);
  }

  /* просмотр в браузере со звуком */
  let ctx = null, src = null, raf = 0;
  async function play() {
    cancelAnimationFrame(raf); if (src) { try { src.stop(); } catch (e) {} }
    const buf = await VAUDIO.render(E, D);
    ctx = ctx || new AudioContext(); await ctx.resume();
    src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination);
    const t0 = ctx.currentTime + .05; src.start(t0);
    $("play").style.display = "none";
    const loop = () => { const t = ctx.currentTime - t0; draw(t); if (t < D) raf = requestAnimationFrame(loop); else $("play").style.display = ""; };
    loop();
  }

  const FONTS = ["italic 400 20px Lora", "italic 600 20px Lora", "600 20px Lora", "500 20px 'Golos Text'", "600 20px 'Golos Text'", "20px 'Marck Script'"];
  const ready = Promise.all(FONTS.map(fn => document.fonts.load(fn, "Аа1"))).then(() => document.fonts.ready).catch(() => {});
  window.VIDEO = { duration: D, draw, ready, audio: async () => VAUDIO.wav(await VAUDIO.render(E, D)), play };
  $("play").onclick = play;
  const still = parseFloat(new URLSearchParams(location.search).get("t"));
  ready.then(() => draw(isNaN(still) ? 20 : still));
})();
