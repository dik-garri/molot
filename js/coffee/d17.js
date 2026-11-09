// День 17 — За надежду на возвращение Христа (Ин 14:3, Тит 2:13). Образ: окно в предрассветное небо, над горизонтом —
// яркая утренняя звезда. На подоконнике стол накрыт на двоих: своя чашка и вторая, под самой звездой,
// налитая для Гостя, которого ждут; пар от неё тянется к звезде. Ожидание с надеждой, а не с тревогой.
COFFEE_ART[17] = (K, C) => {
  const { WC, cup, star4, f } = C;
  const X0 = 32, X1 = 288, Y0 = 62;                            // проём окна
  const hz = 184, tb = 238;                                    // линия горизонта, край подоконника
  const sx = 210, sy = 106;                                    // утренняя звезда
  let s = "";
  // предрассветное небо: сверху гуще, к горизонту светлеет
  s += `<defs><linearGradient id="${K.id}-sky" gradientUnits="userSpaceOnUse" x1="0" y1="${Y0}" x2="0" y2="${hz}">` +
    `<stop offset="0" stop-color="${WC.c3}" stop-opacity=".95"/><stop offset=".55" stop-color="${WC.c2}" stop-opacity=".72"/><stop offset="1" stop-color="${WC.c1}" stop-opacity=".2"/></linearGradient></defs>`;
  s += K.W(`<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${hz - Y0 + 4}" fill="url(#${K.id}-sky)"/>`, WC.c2, .85);
  // рассветное зарево у горизонта под звездой и ореол звезды
  s += K.B(`<ellipse cx="${sx}" cy="${hz - 4}" rx="90" ry="24"/>`, WC.white, .55);
  s += K.B(`<circle cx="${sx}" cy="${sy}" r="30"/>`, WC.white, .5);
  // гаснущие звёзды
  s += K.Wf(`<path d="${star4(64, 86, 3.4)}"/><path d="${star4(108, 122, 2.4)}"/><path d="${star4(140, 78, 2.8)}"/><path d="${star4(272, 82, 2.4)}"/><path d="${star4(56, 150, 2)}"/>`, WC.white, .75);
  // утренняя звезда: белила, тонкие лучи и контур тушью
  s += K.Wf(`<path d="${star4(sx, sy, 26)}"/><path d="${star4(sx, sy, 11)}" transform="rotate(45 ${sx} ${sy})"/>`, WC.white, 1);
  let rays = "";
  for (let i = 0; i < 8; i++) {
    const a = (i * 45 + 22.5) * Math.PI / 180, r0 = 16, r1 = i % 2 ? 24 : 30;
    rays += `<path d="M${f(sx + Math.cos(a) * r0)},${f(sy + Math.sin(a) * r0)} L${f(sx + Math.cos(a) * r1)},${f(sy + Math.sin(a) * r1)}"/>`;
  }
  s += K.I(`<g transform="translate(1.2,-1)"><path d="${star4(sx, sy, 26)}"/></g>` + rays, 1.1);
  // дальние холмы и поле до подоконника
  s += K.W(`<path d="M${X0},${hz - 4} Q64,${hz - 16} 100,${hz - 8} T172,${hz - 6} Q236,${hz - 3} ${X1},${hz - 12} L${X1},${hz + 6} L${X0},${hz + 6}Z"/>`, WC.c1, .6);
  s += K.W(`<rect x="${X0}" y="${hz}" width="${X1 - X0}" height="${tb - hz}"/>`, WC.c1, .45);
  s += K.I(`<path d="M${X0 + 2},${hz - 5} Q64,${hz - 17} 100,${hz - 9} T172,${hz - 7} Q236,${hz - 4} ${X1 - 2},${hz - 13}"/>`, 1);
  // рама окна
  const frame = `M${X0 - 3},${tb} L${X0 - 3},${Y0 - 3} L${X1 + 3},${Y0 - 3} L${X1 + 3},${tb}`;
  s += K.Ws(frame, WC.c2, 7, .6);
  s += K.I(`<g transform="translate(1.2,-1)"><path d="M${X0},${tb} L${X0},${Y0} L${X1},${Y0} L${X1},${tb}"/><path d="M${X0 - 7},${tb} L${X0 - 7},${Y0 - 7} L${X1 + 7},${Y0 - 7} L${X1 + 7},${tb}"/></g>`, 1.2);
  // подоконник
  s += K.W(`<path d="M18,${tb} L302,${tb - 1} L300,${tb + 15} L20,${tb + 16}Z"/>`, WC.c2, .6);
  s += K.I(`<g transform="translate(1.2,-1)"><path d="M18,${tb} L302,${tb - 1}"/><path d="M20,${tb + 16} L300,${tb + 15}"/></g>`, 1.2);
  // стол на двоих: своя чашка и налитая для Гостя — под звездой; её пар тянется вверх, к звезде
  s += cup(K, 100, tb - 33, 42, { dir: -1 });
  s += cup(K, sx, tb - 38, 50);
  s += K.Ws(`M${sx - 8},${tb - 46} c-7,-11 7,-18 0,-28 c-6,-9 6,-13 2,-18`, WC.white, 3.2, .7);
  s += K.Ws(`M${sx + 8},${tb - 46} c-7,-11 7,-18 0,-28 c-5,-7 5,-10 1,-13`, WC.white, 3, .6);
  s += K.I(`<path d="M${sx - 7},${tb - 47} c-7,-11 7,-18 0,-28 c-6,-9 6,-13 2,-18"/><path d="M${sx + 9},${tb - 47} c-7,-11 7,-18 0,-28 c-5,-7 5,-10 1,-13"/>`, 1);
  s += K.I(`<path d="M94,${tb - 41} c-4,-7 4,-11 0,-17"/>`, 1);
  s += K.splat(17, 6, 30, 200, 296, 268, WC.c2, 1.8);
  return s;
};
