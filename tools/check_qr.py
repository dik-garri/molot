# Проверка, что QR на PNG-наклейке читается и ведёт на нужный день.
# python tools/check_qr.py png/coffee-01.png [ещё файлы…]   (нужны opencv-python-headless и pillow)
import re, sys
import cv2
import numpy as np
from PIL import Image

det = cv2.QRCodeDetector()
bad = 0
for path in sys.argv[1:]:
    img = cv2.cvtColor(np.array(Image.open(path).convert("RGB")), cv2.COLOR_RGB2BGR)
    data, _, _ = det.detectAndDecode(img)
    m = re.search(r"(\d+)\D*\.png$", path)
    ok = bool(data) and (not m or re.search(r"(?:d=|/)" + str(int(m.group(1))) + "$", data))
    bad += not ok
    print(("ok   " if ok else "FAIL ") + path + "  →  " + (data or "не читается"))
sys.exit(1 if bad else 0)
