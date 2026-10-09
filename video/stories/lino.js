// «Гравюра», день 5 — Дружба с Богом: оттиск медальона, две чашки съезжаются и звенят, искры, сердце бьётся.
window.STORY = {
  style: "lino", day: 5, duration: 16, poster: 6, cardIn: "stamp",
  theme: { bg: "#3A2618", ink: "#F2E8D5", accent: "#E9A0AE", display: "'PT Serif'", body: "'PT Serif'" },
  music: { chords: [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]], wave: "triangle", cutoff: 1700, bells: [[3.05, 84], [9.4, 79], [13.4, 76]] },
  sfx: [[.3, "thud"], [1.2, "whoosh"], [2.6, "clink"], [3.05, "pop"], [8.6, "chime", 88]],
  frame(t) {
    const { seg, eo, back, lerp } = V, K = SK, { INK, CREAM, KRAFT } = K;
    return {
      art: (id, A) => {
        let s = "";
        const ph = (t * 7) % 8, ro = .7 * seg(t, .5, 1.2);
        for (let r = 6 + ph; r < 100; r += 8) s += `<circle cx="150" cy="106" r="${r}" fill="none" stroke="${KRAFT}" stroke-width="1.6" opacity="${ro}"/>`;
        const e = seg(t, 1.1, 2.6), ang = lerp(-26, 16, eo(e)), dx = lerp(-140, 0, eo(e));
        const bump = t > 2.6 ? -5 * Math.sin((t - 2.6) * 20) * Math.exp(-(t - 2.6) * 6) : 0;
        const cup = dir => K.cupSide(dir < 0 ? 108 : 192, 126, 76, { fill: CREAM, stroke: INK, strokeW: 2, coffee: INK, dir, saucer: false, hatch: `${id}-hatch` });
        s += `<g transform="translate(${dx + bump},0) rotate(${ang} 104 168)">${cup(-1)}</g>`;
        s += `<g transform="translate(${-dx - bump},0) rotate(${-ang} 196 168)">${cup(1)}</g>`;
        const ck = seg(t, 2.6, 3.1);
        if (ck > 0) s += `<g transform="translate(150,100) scale(${back(ck)}) translate(-150,-100)" stroke="${A}" stroke-width="3" stroke-linecap="round"><path d="M150,98 V84"/><path d="M136,102 L128,92"/><path d="M164,102 L172,92"/></g>`;
        const hk = seg(t, 3.0, 3.6), beat = 1 + .08 * Math.pow(Math.max(0, Math.sin((t - 3.6) * 6)), 6);
        if (hk > 0) s += `<g transform="translate(150,62) scale(${back(hk) * beat}) translate(-150,-62)"><path d="${K.heart(150, 62, 26)}" fill="${A}"/></g>`;
        const dk = seg(t, 2.6, 3.4);
        if (dk > 0) s += `<g opacity="${dk}" transform="translate(0,${-10 * eo(dk)})"><circle cx="132" cy="122" r="2.6" fill="${CREAM}"/><circle cx="170" cy="120" r="2" fill="${CREAM}"/><circle cx="160" cy="128" r="1.6" fill="${CREAM}"/></g>`;
        const lk = eo(seg(t, .7, 1.4));
        if (lk > 0) s += `<path d="M${150 - 86 * lk},210 H${150 + 86 * lk}" stroke="${CREAM}" stroke-width="2"/>`;
        return s;
      }
    };
  }
};
