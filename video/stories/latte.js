// «Пенка», день 1 — Живая вода: капля падает в чашку, по пенке расходятся круги, в центре проявляется сердце.
window.STORY = {
  style: "latte", day: 1, duration: 16, poster: 6,
  theme: { bg: "#C99B7E", ink: "#2E1B12", accent: "#6E3418", display: "'Cormorant Garamond'", body: "Manrope" },
  music: { chords: [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]], wave: "triangle", bells: [[3.95, 81], [9.4, 74], [13.4, 78]] },
  sfx: [[1.72, "drip"], [1.9, "ripple"], [3.95, "pop"], [8.6, "chime", 86]],
  frame(t) {
    const { seg, eo, eio, back, lerp } = V, K = SK, u = t - 1.1;
    return {
      art: (id) => {
        let foam = "";
        [[27, 6, .95], [41, 4.6, .8], [55, 3.4, .62], [67, 2.2, .42]].forEach(([r, w, o], i) => {
          const a = .7 + i * .32, k = seg(u, a, a + 1.7);
          if (k > 0) foam += `<circle cx="150" cy="150" r="${r * eo(k)}" fill="none" stroke="#FBF3E6" stroke-width="${w}" opacity="${o * seg(u, a, a + .25)}"/>`;
        });
        [.75, 1.2].forEach(a => {   // бегущие волны до края чашки
          const k = seg(u, a, a + 1.4);
          if (k > 0 && k < 1) foam += `<circle cx="150" cy="150" r="${10 + 64 * eo(k)}" fill="none" stroke="#FBF3E6" stroke-width="${2.5 * (1 - k) + .5}" opacity="${.7 * (1 - k)}"/>`;
        });
        const hk = seg(u, 2.5, 3.3);
        if (u > .62) foam += `<circle cx="150" cy="150" r="${7 * eo(seg(u, .62, .9)) * (1 - hk)}"/>` +
          (hk > 0 ? `<g transform="translate(150,153) scale(${back(hk)}) translate(-150,-153)"><path d="${K.heart(150, 153, 38)}"/></g>` : "");
        let s = `<defs><filter id="${id}-st" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter></defs>`;
        s += `<g transform="rotate(${-8 + 8 * eio(t / 16)} 150 150)">${K.latteCup(id, "a", 150, 150, 88, foam, {})}</g>`;
        const dk = seg(u, 0, .62);          // капля летит сверху и растёт (вид сверху)
        if (dk > 0 && dk < 1) {
          const y = lerp(-30, 150, dk * dk), r = lerp(4, 7, dk);
          s += `<ellipse cx="150" cy="150" rx="${r * .9}" ry="${r * .6}" fill="#000" opacity="${.25 * dk}"/><ellipse cx="150" cy="${y}" rx="${r}" ry="${r * 1.25}" fill="#FBF3E6"/>`;
        }
        const sk = seg(u, .62, 1.1);        // брызги
        if (sk > 0 && sk < 1) for (let i = 0; i < 8; i++) {
          const a = i / 8 * 6.283 + .3, d = 8 + 26 * eo(sk);
          s += `<circle cx="${150 + Math.cos(a) * d}" cy="${150 + Math.sin(a) * d}" r="${2.2 * (1 - sk) + .4}" fill="#FBF3E6" opacity="${1 - sk}"/>`;
        }
        const so = seg(u, 3, 4);            // пар над чашкой
        if (so > 0) for (let i = 0; i < 3; i++) {
          const p = ((u - 3) * .22 + i / 3) % 1;
          s += `<ellipse cx="${150 + Math.sin(p * 6 + i * 2) * 20}" cy="${150 - p * 130}" rx="${18 + p * 16}" ry="${12 + p * 10}" fill="#fff" opacity="${.2 * Math.sin(Math.PI * p) * so}" filter="url(#${id}-st)"/>`;
        }
        return s;
      }
    };
  }
};
