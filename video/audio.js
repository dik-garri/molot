/* Офлайн-синтез звука для роликов: мягкие аккорды, колокольчики и звуки (sfx).
   VAUDIO.render(S, D) → AudioBuffer; VAUDIO.wav(buf) → WAV в base64 (для render.mjs).
   S.music = { chords: [[midi…], …], bar, wave, cutoff, v, organ, bells: [[t, midi], …] }, S.sfx = [[t, "имя", арг?], …] */
(() => {
  const SR = 48000, mf = m => 440 * Math.pow(2, (m - 69) / 12), cl = (v, a, b) => Math.max(a, Math.min(b, v));
  function synth(ac, out, S, D) {
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
      flap: at => [0, .16, .32].forEach(d => noise(at + d, .14, { v: .1, f0: 900, q: .7 })),
      pen: at => [0, .09, .2, .27].forEach((d, i) => noise(at + d, .07, { v: .05, f0: 3800 - i * 300, q: 2 }))
    };
    const M = S.music, bar = M.bar || 4;
    const pad = ac.createBiquadFilter(); pad.type = "lowpass"; pad.frequency.value = M.cutoff || 1500; pad.connect(out);
    for (let i = 0; i * bar < D; i++) {      // аккорды идут по кругу до конца ролика
      const ch = M.chords[i % M.chords.length], at = i * bar, len = bar + 1.6;
      ch.forEach(m => {
        [-4, 4].forEach(det => {
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = M.wave || "triangle"; o.frequency.value = mf(m); o.detune.value = det;
          g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(M.v || .035, at + 1.2); g.gain.linearRampToValueAtTime(0, at + len);
          o.connect(g); g.connect(pad); o.start(at); o.stop(at + len + .1);
        });
        if (M.organ) tone(mf(m + 12), at, len, { v: .012, a: 1 });
      });
    }
    (M.bells || []).forEach(([at, m]) => bell(m, at));
    (S.sfx || []).forEach(([at, name, arg]) => SFX[name](at, arg));
  }
  async function render(S, D) {
    const ac = new OfflineAudioContext(2, Math.ceil(SR * D), SR);
    const out = ac.createGain(); out.gain.setValueAtTime(1.5, 0); out.gain.setValueAtTime(1.5, D - 1.2); out.gain.linearRampToValueAtTime(0, D);
    const comp = ac.createDynamicsCompressor(); out.connect(comp); comp.connect(ac.destination);
    synth(ac, out, S, D);
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
  window.VAUDIO = { render, wav };
})();
