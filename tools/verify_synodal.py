# Сверка всех стихов из js/data.js с Синодальным переводом (bolls.life, SYNOD).
# python3 tools/verify_synodal.py
# Сравнение без учёта регистра, знаков препинания, вида тире и кавычек, скобок и «…» в начале цитаты:
# цитата должна дословно совпадать с текстом указанных стихов (или быть его непрерывной частью).
import json, re, sys, urllib.request
from pathlib import Path

BOOKS = {"Мф": 40, "Ин": 43, "Рим": 45, "1 Кор": 46, "2 Кор": 47, "Гал": 48, "Еф": 49, "Флп": 50, "Кол": 51,
         "2 Тим": 55, "Тит": 56, "Евр": 58, "1 Ин": 62, "Ис": 23}
src = Path(__file__).resolve().parent.parent / "js" / "data.js"
data = src.read_text(encoding="utf-8")
pairs = re.findall(r'\{ ref: "([^"]+)", text: "((?:[^"\\]|\\.)*)" \}', data)

cache = {}
def chapter(book, ch):
    key = (book, ch)
    if key not in cache:
        url = f"https://bolls.life/get-text/SYNOD/{book}/{ch}/"
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "molot-verify"}), timeout=30) as r:
            cache[key] = {v["verse"]: re.sub(r"<[^>]+>", "", v["text"]) for v in json.load(r)}
    return cache[key]

norm = lambda s: re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", s.lower().replace("ё", "е"))).strip()

bad = 0
for ref, text in pairs:
    m = re.match(r"^(\d? ?[А-Яа-я]+) (\d+):(\d+)(?:[–-](\d+))?$", ref)
    book, ch, v1, v2 = m.group(1), int(m.group(2)), int(m.group(3)), int(m.group(4) or m.group(3))
    verses = chapter(BOOKS[book], ch)
    original = " ".join(verses[v] for v in range(v1, v2 + 1))
    ok = norm(text.lstrip("…")) in norm(original)
    bad += not ok
    print(("ok   " if ok else "FAIL ") + ref + ("" if ok else f"\n     у нас:   {text}\n     синодал: {original}"))
print(f"\nСтихов: {len(pairs)}, расхождений: {bad}")
sys.exit(1 if bad else 0)
