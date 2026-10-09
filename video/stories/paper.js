// «Бумага», день 2 — Свет во тьме: слои бумажной сцены по очереди выезжают на место (небо, сияние, ангел, холмы, овцы, пастухи),
// затем появляется рождественская гирлянда по арке.
(() => {
  const n = SCENES[2]().layers.length, at = i => .5 + i * .32;
  window.STORY = {
    style: "paper", day: 2, duration: 16, poster: 7, textAt: 6.2, verseAt: 7.1,
    theme: { bg: "#151B36", ink: "#F2E6CF", accent: "#E9B455", display: "'Golos Text'", body: "'Golos Text'" },
    music: { chords: [[53, 60, 65, 69], [50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64]], wave: "triangle", cutoff: 1300, bells: [[at(6) + .3, 81], [7.1, 77], [13.4, 72]] },
    sfx: [...Array.from({ length: n }, (_, i) => [at(i), "paper"]), [at(n) + .1, "sparkle"], [at(n) + .5, "sparkle"], [6.2, "chime", 86]],
    frame(t) {
      const { seg, eo, back, lerp } = V;
      return {
        layer: i => { const e = seg(t, at(i), at(i) + .75); return { dy: lerp(70, 0, back(e)), op: seg(t, at(i), at(i) + .2) }; },
        decor: eo(seg(t, at(n), at(n) + .9))
      };
    }
  };
})();
