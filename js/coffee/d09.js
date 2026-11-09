// День 9 — За смелость в молитве (Ин 16:23–24: «просите во имя Моё»). Образ: письмо «Отцу»,
// запечатанное печатью с крестом, поднимается вверх вместе с паром от чашки — просьба уже в пути.
COFFEE_ART[9] = (K, C) => {
  const { WC, cup, f } = C;
  const EX = 204, EY = 100, ER = -14, ES = 1.16; // центр и наклон конверта
  const env = `M-50,-32 H50 V32 H-50Z`;
  const flap = `M-50,-32 L0,6 L50,-32`;
  const folds = `M-50,32 L-12,0 M50,32 L12,0`;

  let s = K.ring(252, 236, 30, .45);

  // пар — широкая лента от чашки, поднимает письмо вверх (уходит под конверт)
  const st = [`M84,188 C72,172 92,162 88,150 C84,136 104,128 122,126 C136,124 142,116 148,112`,
    `M100,190 C92,174 110,166 108,156 C106,146 124,140 142,140 C150,140 152,136 157,133`,
    `M116,188 C112,176 126,170 128,164 C130,156 146,154 160,154 C168,154 172,150 177,147`];
  s += K.Ws(st[1], WC.c1, 24, .32) + K.Ws(st[0], WC.white, 6, .55) + K.Ws(st[2], WC.white, 4, .45);
  s += K.I(st.map(d => `<path d="${d}"/>`).join(""), 1.2);
  // следы движения за конвертом
  s += K.I(`<path d="M128,90 l14,-5 M122,102 l18,-6 M134,76 l10,-4"/>`, 1.1);

  // конверт
  let e = `<g transform="translate(${EX},${EY}) rotate(${ER}) scale(${ES})">`;
  e += K.W(`<path d="${env}"/>`, WC.white, .95) + K.W(`<path d="${env}"/>`, WC.c1, .3);
  e += K.Wf(`<path d="M-50,-32 L0,6 L50,-32Z"/>`, WC.c1, .45) + K.Wf(`<path d="M-50,32 L-12,0 L12,0 L50,32Z"/>`, WC.c1, .22);
  e += `<g transform="translate(1.4,-1.3)">` + K.I(`<path d="${env}"/><path d="${flap}"/><path d="${folds}"/>`, 1.25) + `</g>`;
  // сургучная печать с крестом
  e += K.Wf(`<circle cx="0" cy="6" r="10"/>`, WC.c3, .85) + K.Wf(`<path d="M-4,13 l-3,9 l5,-3 l3,4 l1,-10Z"/>`, WC.c3, .7);
  e += K.I(`<circle cx="0.8" cy="5" r="10.5"/>`, 1);
  e += `<path d="M0,0 V13 M-5,4.5 H5" stroke="${WC.paper}" stroke-width="2" stroke-linecap="round" opacity=".9"/>`;
  e += `<text x="0" y="27" text-anchor="middle" font-family="Lora" font-style="italic" font-weight="600" font-size="9.5" fill="${WC.c3}">Отцу</text>`;
  e += `</g>`;
  s += e;

  s += cup(K, 98, 192, 84);
  s += K.splat(9, 9, 30, 56, 300, 160, WC.c2);
  return s;
};
