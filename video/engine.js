/* Видеодвижок наклеек. Фиксированный код: новое видео — это новый файл stories/<name>.js.
   Как в anim-kit: кадр полностью определяется временем t (draw(t) детерминирован),
   звук синтезируется офлайн (OfflineAudioContext) и отдаётся как WAV — поэтому видео можно
   рендерить покадрово (render.mjs) и всегда получать одно и то же. ?t=5 — показать один кадр. */
(() => {
  "use strict";
  const S = window.STORY, D = S.duration, th = THEMES[S.day - 1];
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

  /* ---------- звук: офлайн-синтез ---------- */
  const SR = 48000, mf = m => 440 * Math.pow(2, (m - 69) / 12);
  function synth(ac, out) {
    const tone = (f, at, dur, { type = "sine", v = .2, a = .005, to = null, dest = out } = {}) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, at); if (to) o.frequency.exponentialRampToValueAtTime(to, at + dur);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + a); g.gain.exponentialRampToValueAtTime(.0001, at + dur);
      o.connect(g); g.connect(dest); o.start(at); o.stop(at + dur + .05);
    };
    let seedN = 7;
    const rnd = () => (seedN = (seedN * 16807) % 2147483647) / 2147483647;
    const noise = (at, dur, { v = .2, type = "bandpass", f0 = 1200, f1 = null, q = 1, a = .01 } = {}) => {
      const n = Math.floor(SR * dur), b = ac.createBuffer(1, n, SR), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = rnd() * 2 - 1;
      const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
      s.buffer = b; fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f0, at); if (f1) fl.frequency.exponentialRampToValueAtTime(f1, at + dur);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + a); g.gain.exponentialRampToValueAtTime(.0001, at + dur);
      s.connect(fl); fl.connect(g); g.connect(out); s.start(at);
    };
    const bell = (m, at, v = .12) => { tone(mf(m), at, 2.6, { v }); tone(mf(m) * 2.01, at, 1.4, { v: v * .35 }); tone(mf(m) * 3.02, at, .7, { v: v * .12 }); };
    const SFX = {
      drip: at => { tone(1400, at, .16, { v: .32, to: 380 }); tone(700, at + .05, .3, { v: .1, to: 300 }); },
      ripple: at => [0, .12, .26].forEach((d, i) => tone(900 - i * 120, at + d, .5, { v: .05 })),
      pop: at => tone(520, at, .14, { v: .2, to: 900 }),
      paper: at => noise(at, .38, { v: .16, f0: 2400, f1: 900, q: .8 }),
      whoosh: at => noise(at, .9, { v: .1, f0: 400, f1: 2600, q: .6, a: .35 }),
      thud: at => { tone(110, at, .35, { v: .45, to: 45 }); noise(at, .12, { v: .25, type: "lowpass", f0: 600 }); },
      clink: at => [2637, 3951, 5274, 6645].forEach((f, i) => tone(f, at, 1.1 - i * .2, { v: .09 / (i + 1) })),
      chime: (at, m = 84) => bell(m, at, .07),
      brush: at => noise(at, .7, { v: .14, f0: 3000, f1: 1200, q: .5, a: .2 }),
      sparkle: at => [96, 100, 103, 108].forEach((m, i) => tone(mf(m), at + i * .07, .4, { v: .025 })),
      chirp: at => [0, .11].forEach(d => tone(2600, at + d, .08, { v: .04, to: 3600 })),
      flap: at => [0, .16, .32].forEach(d => noise(at + d, .14, { v: .1, f0: 900, q: .7 }))
    };
    // подложка: мягкие аккорды
    const M = S.music, bar = M.bar || 4;
    const pad = ac.createBiquadFilter(); pad.type = "lowpass"; pad.frequency.value = M.cutoff || 1500; pad.connect(out);
    M.chords.forEach((ch, i) => {
      const at = i * bar, len = bar + 1.6;
      if (at >= D) return;
      ch.forEach(m => {
        [-4, 4].forEach(det => {
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = M.wave || "triangle"; o.frequency.value = mf(m); o.detune.value = det;
          g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(M.v || .035, at + 1.2); g.gain.linearRampToValueAtTime(0, at + len);
          o.connect(g); g.connect(pad); o.start(at); o.stop(at + len + .1);
        });
        if (M.organ) tone(mf(m + 12), at, len, { v: .012, a: 1 });
      });
    });
    (M.bells || []).forEach(([at, m]) => bell(m, at));
    (S.sfx || []).forEach(([at, name, arg]) => SFX[name](at, arg));
  }
  async function renderAudio() {
    const ac = new OfflineAudioContext(2, Math.ceil(SR * D), SR);
    const out = ac.createGain(); out.gain.setValueAtTime(1.5, 0); out.gain.setValueAtTime(1.5, D - 1.2); out.gain.linearRampToValueAtTime(0, D);
    const comp = ac.createDynamicsCompressor(); out.connect(comp); comp.connect(ac.destination);
    synth(ac, out);
    return ac.startRendering();
  }
  function wav(buf) {
    const ch = buf.numberOfChannels, n = buf.length, b = new ArrayBuffer(44 + n * ch * 2), v = new DataView(b);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, "RIFF"); v.setUint32(4, 36 + n * ch * 2, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true); v.setUint16(22, ch, true); v.setUint32(24, SR, true); v.setUint32(28, SR * ch * 2, true);
    v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * ch * 2, true);
    const data = [...Array(ch)].map((_, c) => buf.getChannelData(c));
    for (let i = 0, o = 44; i < n; i++) for (let c = 0; c < ch; c++, o += 2) v.setInt16(o, cl(data[c][i], -1, 1) * 32767, true);
    let s = ""; const u = new Uint8Array(b);
    for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768));
    return btoa(s);
  }

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
