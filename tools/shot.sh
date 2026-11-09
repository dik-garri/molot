#!/bin/zsh
# Скриншот страницы в headless Chrome. Каждый запуск — со своим профилем, поэтому можно запускать параллельно.
# tools/shot.sh URL OUT.png WIDTHxHEIGHT [масштаб]
#   tools/shot.sh "http://localhost:8765/export.html?s=coffee&d=7" /tmp/d07.png 320,380 2
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PROF=$(mktemp -d "${TMPDIR:-/tmp}/molot-chrome.XXXXXX")
rm -f "$2"
"$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=${4:-1} --user-data-dir="$PROF" \
  --window-size=$3 --virtual-time-budget=6000 --screenshot="$2" "$1" >/dev/null 2>&1 &
PID=$!
for i in {1..80}; do sleep 0.5; [ -s "$2" ] && break; done
sleep 0.5
kill $PID 2>/dev/null; pkill -f "$PROF" 2>/dev/null; rm -rf "$PROF"
[ -s "$2" ] && echo "ok $2" || { echo "не получилось: $2"; exit 1; }
