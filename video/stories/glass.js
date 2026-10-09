// «Витраж», день 3 — Дух Святой: тёмное окно зажигается светом от центра, пар поднимается лентами и становится голубем.
window.STORY = {
  style: "glass", day: 3, duration: 16, poster: 7,
  theme: { bg: "#14110E", ink: "#F1E1B8", accent: "#E9B455", display: "Philosopher", body: "Philosopher" },
  music: { chords: [[51, 58, 63, 67], [48, 55, 60, 63], [44, 51, 56, 60], [46, 53, 58, 62]], wave: "sine", organ: true, v: .045, cutoff: 1800, bells: [[5.0, 87], [9.4, 82], [13.4, 79]] },
  sfx: [[1.0, "chime", 75], [1.6, "chime", 79], [2.2, "chime", 82], [2.8, "chime", 87], [3.3, "whoosh"], [5.0, "flap"], [5.1, "sparkle"], [8.6, "chime", 91]],
  frame(t) {
    const { seg, eo, lerp, mix } = V, K = SK, { LEAD, gP, gL, poly, glassCup } = K;
    return {
      glow: lerp(.1, 1, eo(seg(t, .4, 5.2))),
      art: () => {
        let s = `<defs><radialGradient id="dove-burst"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
          <linearGradient id="sweep" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
        // лучи окна: та же раскладка и тот же генератор цветов, что в наклейке; свет идёт кольцами от чашки
        const cx = 150, cy = 250, n = 14, rings = [0, 70, 140, 220, 600], rot = -2, R = K.rng(5);
        const pal = [["#B7D4E6", "#C8DFEC"], ["#86B2D2", "#94BEDA"], ["#5B8DB8", "#6A9AC2"], ["#3F6E9E", "#35628F"]];
        for (let j = 0; j < rings.length - 1; j++) for (let i = 0; i < n; i++) {
          const a0 = (rot + i * 360 / n) * Math.PI / 180, a1 = (rot + (i + 1) * 360 / n) * Math.PI / 180;
          const pt = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r], r0 = rings[j], r1 = rings[j + 1];
          const pts = r0 === 0 ? [[cx, cy], pt(a0, r1), pt(a1, r1)] : [pt(a0, r0), pt(a0, r1), pt(a1, r1), pt(a1, r0)];
          const c = pal[j][(i + (R() < .3 ? 1 : 0)) % 2];
          const d0 = 1 + j * .6 + Math.abs(Math.sin(i * 1.7)) * .25, lk = eo(seg(t, d0, d0 + .7));
          s += gP(poly(pts), mix(mix(c, "#0D0B12", .86), c, lk));
        }
        const strip = (d, p) => p <= 0 ? "" : `<path d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${1 - p}" fill="none" stroke="${LEAD}" stroke-width="11" stroke-linecap="round"/>` +
          `<path d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${1 - p}" fill="none" stroke="#FBF7EE" stroke-width="6" stroke-linecap="round"/>`;
        ["M136,194 C126,174 146,162 134,144 C124,128 104,132 96,122", "M152,192 C164,172 146,156 158,138 C168,122 186,124 192,112", "M168,194 C182,178 176,164 190,152 C202,142 222,148 228,134"]
          .forEach((d, i) => s += strip(d, eo(seg(t, 3.2 + i * .25, 4.6 + i * .25))));
        const dk = seg(t, 4.8, 5.8);
        if (dk > 0) {
          const bo = Math.max(0, 1 - Math.abs(t - 5.4) / 1.4);
          s += `<circle cx="146" cy="80" r="${60 + 40 * dk}" fill="url(#dove-burst)" opacity="${.7 * bo}"/>`;
          const flap = 12 * Math.sin(t * 7) * (1 - seg(t, 6.6, 7.6));
          s += `<g opacity="${eo(dk)}" transform="translate(146,${86 + lerp(22, 0, eo(dk))}) scale(${1.05 * lerp(.85, 1, eo(dk))})">` +
            `<g transform="rotate(${-flap} 6 0)">${gP("M6,0 C14,-22 32,-40 52,-46 C44,-26 32,-10 20,0 Z", "#DCE8F0")}</g>` +
            gP("M-46,22 L-30,10 C-14,4 6,2 22,-2 C28,-10 38,-12 44,-8 L54,-6 L44,-2 C40,6 30,12 18,14 C0,20 -18,22 -30,18 L-50,30 Z", "#F7F5EF") +
            `<g transform="rotate(${flap} -4 4)">${gP("M-4,4 C-18,-18 -16,-46 -2,-64 C4,-44 14,-26 18,-2 Z", "#EEF3F6")}</g>` +
            `<circle cx="40" cy="-7" r="1.8" fill="${LEAD}"/></g>`;
        }
        s += `<g style="filter:brightness(${lerp(.15, 1, eo(seg(t, .5, 1.5)))})">${glassCup(150, 202, 92, "#F3EBDC", "#5A3220", { saucerC: "#E6D8C0" })}</g>`;
        const sw = seg(t, 6.2, 9.2);          // солнечный блик проходит по стеклу
        if (sw > 0 && sw < 1) s += `<rect x="${lerp(-260, 320, sw)}" y="-40" width="160" height="380" fill="url(#sweep)" transform="rotate(18 150 150)"/>`;
        return s;
      }
    };
  }
};
