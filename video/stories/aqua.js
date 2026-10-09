// «Акварель кофе», день 4 — Бог стал человеком: размывка неба растекается, появляется луна, из маленькой чашки поднимается Млечный путь, вспыхивают звёзды.
window.STORY = {
  style: "aqua", day: 4, duration: 16, poster: 7,
  theme: { bg: "#F3EBDD", ink: "#3B2414", accent: "#A26B3B", display: "Lora", body: "Lora" },
  music: { chords: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]], wave: "sine", v: .045, cutoff: 1200, bells: [[5.0, 81], [6.6, 84], [9.4, 76], [13.4, 72]] },
  sfx: [[.8, "brush"], [1.5, "brush"], [3.0, "chime", 79], [3.8, "brush"], [5.2, "sparkle"], [6.0, "sparkle"], [6.8, "sparkle"], [8.6, "chime", 88]],
  frame(t) {
    const { seg, eo, back, lerp } = V, K = SK, WC = K.WC;
    return {
      art: (Kit) => {
        const sky = "M36,70 Q150,48 264,70 Q290,150 268,222 Q150,246 32,222 Q10,150 36,70Z";
        const g1 = eo(seg(t, .8, 2.6)), g2 = eo(seg(t, 1.5, 3.4));
        let s = "";
        if (g1 > 0) s += Kit.W(`<path d="${sky}" transform="translate(150,146) scale(${lerp(.25, 1, g1)}) translate(-150,-146)"/>`, WC.c2, .55 * seg(t, .8, 1.3));
        if (g2 > 0) s += Kit.W(`<path d="${sky}" transform="translate(150,128) scale(${.94 * lerp(.3, 1, g2)}) translate(-150,-128)"/>`, WC.c3, .85 * seg(t, 1.5, 2));
        const bp = eo(seg(t, 3.8, 5.4));
        if (bp > 0) s += Kit.W(`<path d="M150,200 Q118,110 240,80" fill="none" stroke="${WC.paper}" stroke-width="26" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${1 - bp}"/>`, WC.paper, .35);
        const R = K.rng(41), dp = seg(t, 4.0, 5.8);   // те же точки, что в наклейке, появляются снизу вверх
        for (let q = 0; q <= 1; q += .01) {
          const x = (1 - q) ** 2 * 150 + 2 * (1 - q) * q * 118 + q * q * 240, y = (1 - q) ** 2 * 200 + 2 * (1 - q) * q * 110 + q * q * 80;
          const g = (R() + R() - 1) * (4 + q * 18), r = .5 + R() * 1.3, o = .6 + R() * .4;
          if (q <= dp) s += `<circle cx="${x + g}" cy="${y + g * .6}" r="${r}" fill="#FFFCF4" opacity="${o * seg(dp, q, q + .08)}"/>`;
        }
        const S2 = K.rng(9);                          // брызги-звёзды загораются по одной
        for (let i = 0; i < 60; i++) {
          const x = 44 + S2() * 214, y = 76 + S2() * 130, r = .4 + S2() * 1.6, o = .35 + S2() * .5, at = 5 + (i * 37 % 60) / 60 * 2.2, k = seg(t, at, at + .3);
          if (k > 0) s += `<circle cx="${x}" cy="${y}" r="${r * (1 + .8 * (1 - k))}" fill="#FFFCF4" opacity="${o * k}"/>`;
        }
        const mk = seg(t, 2.8, 3.6);
        if (mk > 0) s += Kit.W(`<circle cx="88" cy="104" r="17"/>`, "#FFFCF4", .95 * mk) + Kit.W(`<circle cx="99" cy="97" r="15"/>`, WC.c3, .95 * mk);
        const ck = seg(t, 1.2, 2.4);
        if (ck > 0) s += `<g opacity="${ck}" transform="translate(0,${lerp(10, 0, eo(ck))})">${K.wcCup(Kit, 150, 200, 44)}</g>`;
        return s;
      }
    };
  }
};
