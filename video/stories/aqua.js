// «Акварель кофе», день 4 — Бог стал человеком: растекается ночное небо, затем слой за слоем проявляются размывки
// (звезда, хлев, сияние, Мария, Иосиф, ясли) и тушь дорисовывает контуры; в конце — рождественская веточка.
(() => {
  const n = SCENES[4]().layers.length, at = i => 1.2 + i * .3;
  window.STORY = {
    style: "aqua", day: 4, duration: 16, poster: 7, textAt: 6.4, verseAt: 7.2,
    theme: { bg: "#F3EBDD", ink: "#3B2414", accent: "#A26B3B", display: "Lora", body: "Lora" },
    music: { chords: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]], wave: "sine", v: .045, cutoff: 1200, bells: [[at(4) + .2, 84], [7.2, 76], [13.4, 72]] },
    sfx: [[.4, "brush"], ...Array.from({ length: n }, (_, i) => [at(i), i % 2 ? "brush" : "paper"]), [at(n) + .2, "sparkle"], [6.4, "chime", 88]],
    frame(t) {
      const { seg, eo } = V;
      return {
        layer: i => i < 0 ? { op: eo(seg(t, .4, 1.5)) } : { op: eo(seg(t, at(i), at(i) + .6)), ink: eo(seg(t, at(i) + .15, at(i) + 1.2)) },
        decor: eo(seg(t, at(n), at(n) + .8))
      };
    }
  };
})();
