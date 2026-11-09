#!/bin/zsh
# Собирает страницы дней для goodnews.kg/dd/advent/ (QR на наклейках ведёт на https://goodnews.kg/dd/advent/N).
# tools/build-goodnews.sh [папка]  — по умолчанию ~/projects/personal/goodnews/dd/advent
# N.html — копии day.html (день берётся из адреса), index.html — оглавление (advent.html).
# Дальше папку advent загрузить на хостинг в httpdocs/dd/advent.
set -e
cd "${0:A:h}/.."
DEST=${1:-~/projects/personal/goodnews/dd/advent}
mkdir -p "$DEST"/{css,js/coffee,vendor}
cp css/site.css "$DEST/css/"
cp vendor/qrcode.js "$DEST/vendor/"
cp js/data.js js/stickers.js js/coffee.js "$DEST/js/"
cp js/coffee/d*.js "$DEST/js/coffee/"
for d in {1..24}; do cp day.html "$DEST/$d.html"; done
cp advent.html "$DEST/index.html"
echo "готово → $DEST ($(find "$DEST" -type f | wc -l | tr -d ' ') файлов)"
