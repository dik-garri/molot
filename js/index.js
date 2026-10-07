(function () {
  const DIRECTIONS = {
    latte: {
      kicker: "Направление A · вид сверху",
      idea: "Каждая тема нарисована молочной пенкой в чашке, как латте-арт у бариста. Один простой символ, крупный план, много воздуха вокруг.",
      mood: "тёплое, «вкусное», сразу кофейное",
      tech: "эскизы в SVG → финал в Blender (фотореализм)",
      plus: "прямое попадание в продукт; серию легко узнать",
      risk: "абстрактным темам (прощение, мудрость) нужны очень точные символы",
      sw: ["#E8C3AB", "#F1D293", "#BCD1D4", "#1C2440", "#D6A3A0", "#AE6E3D"]
    },
    paper: {
      kicker: "Направление B · бумажная диорама",
      idea: "Многослойная бумага в арке-окошке: каждый день — маленькая сцена с глубиной и тенями между слоями. Окошко рифмуется с дверцей адвент-календаря.",
      mood: "сказочное, рождественское, подарочное",
      tech: "слои в SVG → объём и свет в Blender",
      plus: "самый сильный «вау» в руках",
      risk: "самая трудоёмкая отрисовка; 24 сцены нужно держать в одной палитре",
      sw: ["#F3E7D3", "#E0A274", "#879560", "#B9D3DA", "#222A47", "#DFA398"]
    },
    lino: {
      kicker: "Направление C · линогравюра",
      idea: "Винтажная этикетка: гравюра в медальоне, лента с датой, печать в две-три краски на крафтовой бумаге. У каждого дня — своя акцентная краска.",
      mood: "ремесленное, честное, как у обжарочной",
      tech: "только SVG; в печати возможна шелкография",
      plus: "дешевле всего в печати, лучше всего смотрится на крафтовых дрипах",
      risk: "меньше цвета — меньше праздника; его держит акцентная краска",
      sw: ["#C59B6D", "#24150D", "#F2E8D5", "#B4432F", "#E08A2E", "#4F8F96"]
    }
  };

  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  let n = 0;
  // Делает id внутри SVG уникальными, когда одна наклейка встречается на странице несколько раз
  const uniq = s => { const p = "u" + (n++); return s.replace(/\b(la|pa|li)(\d+)-/g, `$1$2${p}-`); };
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
  fillBox("latte");

  document.getElementById("drip-sticker").innerHTML = uniq(styleById("paper").render(THEMES[0]));

  // направления
  document.getElementById("directions").innerHTML = STICKER_STYLES.map(st => {
    const D = DIRECTIONS[st.id];
    return `<article class="direction" id="dir-${st.id}">
      <div class="dir-head">
        <div><h3><small>${D.kicker}</small>${st.name}</h3><div class="swatches">${D.sw.map(c => `<i style="background:${c}" title="${c}"></i>`).join("")}</div></div>
        <div><p>${D.idea}</p>
          <dl><dt>Настроение</dt><dd>${D.mood}</dd><dt>Техника</dt><dd>${D.tech}</dd><dt>Сильная сторона</dt><dd>${D.plus}</dd><dt>Риск</dt><dd>${D.risk}</dd></dl>
        </div>
      </div>
      <div class="strip">${THEMES.slice(0, 5).map(t => `<figure>${uniq(st.render(t))}<figcaption>${t.day} · ${esc(t.topic)}</figcaption></figure>`).join("")}</div>
    </article>`;
  }).join("");

  // темы
  document.getElementById("theme-list").innerHTML = THEMES.map(t => `
    <article class="theme" id="day-${t.day}">
      <header><span class="d">${String(t.day).padStart(2, "0")}</span><h3>${esc(t.topic)}</h3></header>
      <div class="say">На наклейке: <b>Спасибо, Господи, ${esc(t.sticker.join(" "))}</b></div>
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
  const flat = STICKER_STYLES.find(s => s.id === "paper").render(THEMES[1]);
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
      <figure style="margin:0">${fix(H(THEMES[1], "img/render-paper-2.jpg"))}<figcaption class="cap">Blender + вектор</figcaption></figure>
    </div>`;
  box.querySelectorAll("svg").forEach(s => { s.style.width = "100%"; s.style.height = "auto"; s.style.display = "block"; s.style.borderRadius = "6px"; s.style.boxShadow = "0 20px 40px -24px rgba(30,15,5,.6)"; });
  box.hidden = false;
})();
