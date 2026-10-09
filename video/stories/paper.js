// «Бумага», день 2 — Свет во тьме: ночь, слои бумаги выезжают на место, солнце всходит, небо из синего становится персиковым.
window.STORY = {
  style: "paper", day: 2, duration: 16, poster: 7,
  theme: { bg: "#EFE0C7", ink: "#4A2A1A", accent: "#C2672E", display: "'Golos Text'", body: "'Golos Text'" },
  music: { chords: [[53, 60, 65, 69], [50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64]], wave: "triangle", cutoff: 1300, bells: [[6.4, 77], [9.4, 72], [13.4, 81]] },
  sfx: [[.5, "paper"], [.72, "paper"], [.94, "paper"], [1.2, "paper"], [1.45, "paper"], [1.7, "paper"], [1.95, "paper"], [2.2, "whoosh"], [6.6, "chirp"], [7.1, "chirp"], [8.6, "chime", 84]],
  frame(t) {
    const { seg, eo, eio, back, lerp, mix } = V, K = SK;
    return {
      scene: (L) => {
        const k = eio(seg(t, 2, 7));       // ночь → утро
        const night = ["#1E2548", "#262E57", "#2E3863", "#36416F", "#3F4A7A"], day = ["#E58F66", "#EBA174", "#F0B585", "#F5C998", "#F9DCAE"];
        let s = `<rect width="300" height="300" fill="${mix(night[0], day[0], k)}"/>`;
        [190, 146, 106, 70].forEach((r, i) => {
          const a = .5 + i * .22, e = seg(t, a, a + .7);
          if (e > 0) s += `<g opacity="${seg(t, a, a + .2)}" transform="translate(150,190) scale(${lerp(.5, 1, back(e))}) translate(-150,-190)">` + L(`<circle cx="150" cy="190" r="${r}" fill="${mix(night[i + 1], day[i + 1], k)}"/>`) + `</g>`;
        });
        const so = (1 - seg(t, 3.5, 6)) * seg(t, .8, 1.4);
        if (so > 0) s += `<g opacity="${so}">` + L([[60, 66, 3], [96, 96, 2.2], [204, 74, 2.6], [236, 116, 2], [130, 54, 1.8], [176, 104, 1.6], [262, 64, 2]].map(([x, y, r]) => `<path d="${K.star4(x, y, r * 1.6)}" fill="#F6E7C1"/>`).join("")) + `</g>`;
        const sy = lerp(300, 190, eo(seg(t, 2, 6.6)));
        s += L(`<circle cx="150" cy="${sy}" r="40" fill="${mix("#B45A2A", "#EE8E32", k)}"/>`) + `<circle cx="150" cy="${sy}" r="31" fill="${mix("#C46A30", "#F3A443", k)}"/>`;
        const hills = [
          ["M0,192 C60,168 120,176 160,186 C210,198 250,172 300,176", "#AAAE7B", null],
          ["M0,216 C50,198 100,200 150,212 C200,224 250,206 300,200", "#879560", "#6E7C4C"],
          ["M0,240 C70,222 130,226 180,238 C230,250 270,236 300,232", "#66784A", "#4E5F37"],
          ["M0,264 C60,250 120,252 170,262 C220,272 260,262 300,258", "#4A5C35", "#364527"]
        ];
        hills.forEach(([top, c, rowC], i) => {
          const a = 1.2 + i * .25, e = seg(t, a, a + .8);
          if (e <= 0) return;
          const nc = h => mix(mix(h, "#0F1530", .7), h, k);
          let g = `<path d="${top} V300 H0Z" fill="${nc(c)}"/>`;
          if (rowC) [9, 19, 30].forEach(dy => g += `<path d="${top}" transform="translate(0,${dy})" fill="none" stroke="${nc(rowC)}" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="0 10"/>`);
          s += `<g transform="translate(0,${lerp(110, 0, back(e))})">` + L(g) + `</g>`;
        });
        const bk = seg(t, 6.2, 9);           // птицы прилетают и машут крыльями
        if (bk > 0) {
          const dx = lerp(-150, 0, eo(bk)), f1 = .35 + .65 * Math.abs(Math.sin(t * 9)), f2 = .35 + .65 * Math.abs(Math.sin(t * 9 + 1.3));
          s += `<g transform="translate(${dx},${Math.sin(t * 2) * 3})" fill="none" stroke="#7A3E22" stroke-width="1.8" stroke-linecap="round">` +
            `<path d="M88,104 q6,${-6 * f1} 11,0 q5,${-6 * f1} 11,0"/><path d="M114,90 q5,${-5 * f2} 9,0 q4,${-5 * f2} 9,0"/></g>`;
        }
        return s;
      }
    };
  }
};
