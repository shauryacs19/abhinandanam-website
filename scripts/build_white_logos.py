"""All-white copies of the Abhinandanam logos for the dark green theme (2026-10-30).

Keeps each logo's transparency and paints every visible pixel white.
Run from the project root:  python scripts/build_white_logos.py
"""
from pathlib import Path

from PIL import Image

BRAND = Path("public/images/brand")
SOURCES = [
    "abhinandanam-logo-horizontal",  # header
    "abhinandanam-logo-stacked",  # hero, footer
    "abhinandanam-mark-lg",  # opening intro
    "abhinandanam-mark-sm",  # "Ways to stay" tile
]

for name in SOURCES:
    src = Image.open(BRAND / f"{name}.webp").convert("RGBA")
    white = Image.new("RGBA", src.size, (255, 255, 255, 0))
    white.putalpha(src.getchannel("A"))
    out = BRAND / f"{name}-white.webp"
    white.save(out, "WEBP", lossless=True, quality=100, method=6)
    print(f"{out}  {src.size[0]}x{src.size[1]}  {out.stat().st_size // 1024} kB")
