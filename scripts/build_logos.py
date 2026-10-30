"""Build the site logos from the client's originals, with a registered-trademark mark added.

Reads  assets/source/logos/logo-horizontal.webp  (transparent, 2000x461)
       assets/source/logos/logo-stacked.jpg      (on white with a thin grey frame)
Writes public/images/brand/abhinandanam-logo-horizontal.webp   (header)
       public/images/brand/abhinandanam-logo-stacked.webp      (page body: hero, footer)

The stacked logo's white background is removed with a matte that treats anything as far from
white as the logo's palest green (~0.5) as fully solid, and un-mixes white out of the anti-aliased
edges. So the logo keeps its exact colours at full strength on dark backgrounds (plain
"colour to alpha" would leave the pastel greens ~40% see-through) and gets no white fringe.

The (R) goes after "LTD." on the bottom line: raised so its top lines up with the tops of the
capitals, about half their height, in the same green. Placement and size aren't fixed by law;
a superscript at the top right is the common convention.

Run from the repo root:  python scripts/build_logos.py
Needs: pip install pillow numpy
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "source", "logos")
OUT = os.path.join(ROOT, "public", "images", "brand")
FONT = os.environ.get("REG_FONT", "C:/Windows/Fonts/georgiab.ttf")  # any font with a good (R) glyph

REG_SIZE = 0.55  # (R) height as a share of the bottom line's cap height
REG_GAP = 0.16  # gap after "LTD." as a share of the cap height


SOLID = 0.45  # distance from white at which a pixel counts as fully opaque logo ink


def white_to_alpha(rgb: Image.Image) -> Image.Image:
    """Remove a white background: solid logo colours stay opaque, edges get partial alpha."""
    a = np.asarray(rgb.convert("RGB")).astype(np.float32)
    dist = ((255.0 - a) / 255.0).max(axis=2)  # 0 = white, 1 = a fully saturated/dark channel
    alpha = np.clip(dist / SOLID, 0, 1)
    alpha[dist < 0.06] = 0  # JPEG noise in the white background
    safe = np.where(alpha > 0, alpha, 1)[..., None]
    color = 255.0 - (255.0 - a) / safe
    out = np.dstack([np.clip(color, 0, 255), alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim(im: Image.Image, pad: int) -> Image.Image:
    box = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    im = im.crop(box)
    canvas = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad))
    return canvas


def last_text_line(im: Image.Image, text_from: float):
    """(top, bottom, right) of the lowest line of text, from the alpha channel.
    text_from: share of the width where the text starts (skips a symbol that spans every row)."""
    a = np.asarray(im.getchannel("A")) > 128
    a[:, : int(im.width * text_from)] = False
    filled = set(np.where(a.sum(axis=1) > 2)[0])
    bottom = max(filled)
    while True:
        top = bottom
        while top - 1 in filled:  # walk up until an empty row separates this line from the one above
            top -= 1
        if bottom - top >= 10:  # a real line of text, not a stray speck
            break
        bottom = max(r for r in filled if r < top)
    right = np.where(a[top : bottom + 1].any(axis=0))[0][-1]
    return top, bottom, right


def add_registered(im: Image.Image, text_from: float = 0.0) -> Image.Image:
    top, bottom, right = last_text_line(im, text_from)
    cap = bottom - top + 1
    a = np.asarray(im)
    line = a[top : bottom + 1]
    solid = line[line[..., 3] > 200][:, :3]
    color = tuple(int(v) for v in np.median(solid, axis=0)) + (255,)

    target = cap * REG_SIZE
    size = int(target)
    font = ImageFont.truetype(FONT, size)
    for _ in range(40):  # fit the glyph's ink height to the target
        l, t, r, b = font.getbbox("\u00ae")
        if abs((b - t) - target) < 1:
            break
        size = max(4, int(size * target / (b - t)))
        font = ImageFont.truetype(FONT, size)
    l, t, r, b = font.getbbox("\u00ae")
    x = right + int(cap * REG_GAP)
    need = x + (r - l) + int(cap * 0.1)
    if need > im.width:  # widen the canvas on the right if the mark doesn't fit
        wider = Image.new("RGBA", (need, im.height), (0, 0, 0, 0))
        wider.paste(im, (0, 0))
        im = wider
    ImageDraw.Draw(im).text((x - l, top - t), "\u00ae", font=font, fill=color)
    return im


def save(im: Image.Image, name: str, width: int) -> None:
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    path = os.path.join(OUT, name)
    im.save(path, "WEBP", quality=92, alpha_quality=100, method=6)
    print(f"{name}: {im.width}x{im.height}, {os.path.getsize(path) // 1024} kB")


def main() -> None:
    horizontal = Image.open(os.path.join(SRC, "logo-horizontal.webp")).convert("RGBA")
    save(add_registered(trim(horizontal, 8), text_from=0.25), "abhinandanam-logo-horizontal.webp", 1000)  # hands symbol fills the left ~23%

    stacked = Image.open(os.path.join(SRC, "logo-stacked.jpg")).convert("RGB")
    stacked = stacked.crop((12, 12, stacked.width - 12, stacked.height - 12))  # drop the grey frame
    save(add_registered(trim(white_to_alpha(stacked), 12)), "abhinandanam-logo-stacked.webp", 900)


if __name__ == "__main__":
    main()
