(function () {
  const DIRECTIONS = {
    paper: {
      kicker: "Направление 1 · бумажная диорама",
      idea: "Многослойная бумага в арке-окошке: евангельский сюжет с героями, собранный из вырезанных слоёв с тенями. По арке — рождественская гирлянда с ягодами, шарами и звездой.",
      mood: "сказочное, рождественское, подарочное",
      tech: "слои в SVG → объём и свет в Blender",
      plus: "яркий цвет и глубина; гирлянда сразу говорит «Рождество»",
      risk: "самая трудоёмкая отрисовка; 24 сцены нужно держать в одной палитре",
      sw: ["#F3E7D3", "#1F2645", "#E7B48A", "#3E6C9A", "#2F5D3A", "#B3243A"]
    },
    comic: {
      kicker: "Молодёжный · комикс",
      idea: "Поп-арт: сюжет нарисован как кадр комикса — толстый чёрный контур, сочные цвета, растровые точки. Номер дня во взрывной звезде, над панелью — гирлянда-лампочки.",
      mood: "дерзко, весело, ярко",
      tech: "SVG; тот же сюжет, что в основных стилях",
      plus: "считывается за секунду, отлично смотрится в сторис",
      risk: "может показаться слишком «детским» для старших",
      sw: ["#4CC9F0", "#FF5DA2", "#FFD23F", "#FF3D7F", "#141414"]
    },
    pixel: {
      kicker: "Молодёжный · ретро-игра",
      idea: "Каждый день — уровень игры: сюжет в пиксель-арте, сверху «ДЕНЬ 1/24» и сердечки, снизу диалоговое окно как в RPG. Пиксельный снег и гирлянда.",
      mood: "игровое, ностальгическое, «как в 8-бит»",
      tech: "SVG; пикселизация фильтром — любой сюжет становится пиксель-артом",
      plus: "календарь превращается в прохождение: 24 уровня до Рождества",
      risk: "мелкий пиксельный шрифт нужно проверять в печати",
      sw: ["#1A1C3A", "#FF5C8A", "#FFD23F", "#5CE1E6", "#FFFFFF"]
    },
    neon: {
      kicker: "Молодёжный · неон",
      idea: "Неоновая вывеска на тёмной стене: светящиеся контуры героев, надпись «Спасибо, Иисус» неоновым почерком, огоньки и звезда по рамке.",
      mood: "атмосферно, вечерне, как в кофейне",
      tech: "SVG; в печати — флуоресцентные краски",
      plus: "самый «инстаграмный» вид, сильно смотрится в темноте",
      risk: "на печати без флуоресцентных красок свечение будет скромнее, чем на экране",
      sw: ["#12082A", "#FF4FD8", "#3DF5FF", "#FFE45E", "#5CFF9D"]
    },
    aqua: {
      kicker: "Направление 2 · акварель кофе",
      idea: "Тот же сюжет, будто нарисованный самим кофе: сепиевые размывки по хлопковой бумаге, контуры тушью, белила для света. В углу — рождественская еловая веточка.",
      mood: "тихое, тёплое, как страница дневника",
      tech: "SVG-фильтры; финал можно расписать настоящим кофе и отсканировать",
      plus: "самый «кофейный» по смыслу: материал рисунка и есть продукт",
      risk: "монохром спокойнее; героям нужен крупный план, чтобы читались",
      sw: ["#F8F2E7", "#D6AE82", "#A26B3B", "#5A361D", "#3B2414"]
    }
  };


  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  let n = 0;
  // Делает id внутри SVG уникальными, когда одна наклейка встречается на странице несколько раз
  const uniq = s => { const p = "u" + (n++); return s.replace(/\b(pa|wa|co|px|ne)(\d+)-/g, `$1$2${p}-`); };
  const styleById = id => STICKER_STYLES.find(s => s.id === id);

  // коробка
  const slots = document.getElementById("slots");
  function fillBox(styleId) {
    const st = styleById(styleId);
    slots.innerHTML = THEMES.map(t => {
      if (t.day <= 5) return `<a class="slot has-art" href="#day-${t.day}" aria-label="День ${t.day}: ${esc(t.topic)}">${uniq(st.render(t))}</a>`;
      return `<a class="slot${t.day === 24 ? " gift" : ""}" href="#day-${t.day}"><span class="n">${t.day}</span><span class="t">${esc(t.topic)}</span></a>`;
    }).join("");
  }
  document.querySelectorAll(".switch button").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".switch button").forEach(x => x.setAttribute("aria-pressed", x === b));
    fillBox(b.dataset.style);
  }));
  fillBox("paper");

  document.getElementById("drip-sticker").innerHTML = uniq(styleById("paper").render(THEMES[0]));

  // направления
  const dirHtml = st => {
    const D = DIRECTIONS[st.id];
    return `<article class="direction" id="dir-${st.id}">
      <div class="dir-head">
        <div><h3><small>${D.kicker}</small>${st.name}</h3><div class="swatches">${D.sw.map(c => `<i style="background:${c}" title="${c}"></i>`).join("")}</div></div>
        <div><p>${D.idea}</p>
          <dl><dt>Настроение</dt><dd>${D.mood}</dd><dt>Техника</dt><dd>${D.tech}</dd><dt>Сильная сторона</dt><dd>${D.plus}</dd><dt>Риск</dt><dd>${D.risk}</dd></dl>
        </div>
      </div>
      <div class="strip">${THEMES.slice(0, st.days || 5).map(t => `<figure>${uniq(st.render(t))}<figcaption>${t.day} · ${esc(t.topic)}</figcaption></figure>`).join("")}</div>
    </article>`;
  };
  document.getElementById("directions").innerHTML = STICKER_STYLES.filter(st => !st.youth).map(dirHtml).join("");
  document.getElementById("youth-directions").innerHTML = STICKER_STYLES.filter(st => st.youth).map(dirHtml).join("");

  // темы
  document.getElementById("theme-list").innerHTML = THEMES.map(t => `
    <article class="theme" id="day-${t.day}">
      <header><span class="d">${String(t.day).padStart(2, "0")}</span><h3>${esc(t.topic)}</h3></header>
      <div class="say">На наклейке: <b>${esc(THANKS)} ${esc(t.sticker.join(" "))}</b></div>
      <blockquote>${esc(t.verse)}<cite>${esc(t.ref)}</cite></blockquote>
      <p>${esc(t.text.join(" "))}</p>
      <div class="meta"><b>Сегодня:</b> ${esc(t.practice)}</div>
      <div class="meta"><b>Идея рисунка:</b> ${esc(t.idea)}</div>
      <a class="open" href="day.html?d=${t.day}">Страница дня →</a>
    </article>`).join("");
})();

// Рендер Blender: слои из SVG → бумага с объёмом; текст и QR — вектором поверх
(function () {
  const box = document.getElementById("render");
  const H = window.STICKER_INTERNALS.renderPaperHybrid;
  const flat = STICKER_STYLES.find(s => s.id === "paper").render(THEMES[3]);
  const fix = s => s.replace(/\b(pa)(\d+)-/g, (m, a, d) => `${a}${d}r${Math.random().toString(36).slice(2, 6)}-`);
  box.innerHTML = `
    <div>
      <div class="eyebrow">Проверено: рендер Blender</div>
      <h3 style="font-size:34px;margin:8px 0 10px">Из SVG — в настоящую бумагу</h3>
      <p>Это не макет, а настоящий рендер. Скрипт взял те же слои, из которых собрана векторная наклейка, превратил каждый в лист бумаги толщиной 0,35 мм, разнёс их по глубине и осветил. Текст и QR наложены вектором, чтобы печатались чётко. Одна наклейка рендерится примерно за 10 секунд, все 24 — одной командой.</p>
      <p style="color:var(--roast-soft);font-size:15px">Скрипты лежат в репозитории: <code>blender/export_layers.js</code> и <code>blender/paper_render.py</code>.</p>
    </div>
    <div class="render-pair">
      <figure style="margin:0">${fix(flat)}<figcaption class="cap">SVG, плоский</figcaption></figure>
      <figure style="margin:0">${fix(H(THEMES[3], "img/render-paper-4.jpg"))}<figcaption class="cap">Blender + вектор</figcaption></figure>
    </div>`;
  box.querySelectorAll("svg").forEach(s => { s.style.width = "100%"; s.style.height = "auto"; s.style.display = "block"; s.style.borderRadius = "6px"; s.style.boxShadow = "0 20px 40px -24px rgba(30,15,5,.6)"; });
  box.hidden = false;
})();
