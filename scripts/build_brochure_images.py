"""One-off: turn brochure extracts into site-ready WebP images.

Reads scripts/brochure-images.json, pulls each image straight from the source
PDF (so shaped masks can be read), crops masked photos to their largest clean
rectangle, and writes:
  public/images/hotels/<hotel>/<name>.webp      (max 2000px wide, never upscaled)
  public/images/brand/<logo>.webp                (transparent, trimmed)
  public/images/og/<hotel>.jpg                   (1200x630 social cards)

Run from the repo root:  python scripts/build_brochure_images.py
Needs: pip install pymupdf pillow numpy
"""
import json
import os
import sys

import numpy as np
import pymupdf
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = json.load(open(os.path.join(ROOT, "scripts", "brochure-images.json")))
OUT = os.path.join(ROOT, "public", "images")


def load_rgba(tag, xref):
    doc = pymupdf.open(os.path.join(ROOT, MANIFEST["pdfs"][tag]))
    smask = 0
    for page in doc:
        for im in page.get_images(full=True):
            if im[0] == xref:
                smask = im[1]
                break
        if smask:
            break
    base = pymupdf.Pixmap(doc, xref)
    if base.n - base.alpha >= 4:  # CMYK -> RGB
        base = pymupdf.Pixmap(pymupdf.csRGB, base)
    if base.alpha:
        base = pymupdf.Pixmap(base, 0)
    if smask:
        base = pymupdf.Pixmap(base, pymupdf.Pixmap(doc, smask))
    mode = "RGBA" if base.alpha else "RGB"
    return Image.frombytes(mode, (base.width, base.height), base.samples)


def largest_rect(mask):
    """Largest all-True axis-aligned rectangle (histogram method). Returns x0,y0,x1,y1."""
    h, w = mask.shape
    heights = np.zeros(w, dtype=int)
    best = (0, 0, 0, 0, 0)
    for y in range(h):
        heights = np.where(mask[y], heights + 1, 0)
        stack = []
        for x in range(w + 1):
            cur = heights[x] if x < w else 0
            start = x
            while stack and stack[-1][1] >= cur:
                sx, sh = stack.pop()
                area = sh * (x - sx)
                if area > best[0]:
                    best = (area, sx, y - sh + 1, x, y + 1)
                start = sx
            stack.append((start, cur))
    _, x0, y0, x1, y1 = best
    return x0, y0, x1, y1


def crop_to_mask(img):
    if img.mode != "RGBA":
        return img
    f = 4  # work on a downscaled mask for speed
    small = img.getchannel("A").resize((img.width // f, img.height // f))
    x0, y0, x1, y1 = largest_rect(np.asarray(small) >= 250)
    pad = 1  # step inside soft mask edges
    box = ((x0 + pad) * f, (y0 + pad) * f, (x1 - pad) * f, (y1 - pad) * f)
    return img.crop(box).convert("RGB")


def save_webp(img, path_no_ext, max_w, quality=80):
    im = img.copy()
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path_no_ext), exist_ok=True)
    im.save(path_no_ext + ".webp", "WEBP", quality=quality, method=6)
    return im.size


def main():
    for item in MANIFEST["photos"]:
        tag, _, x = item["src"].split("-")
        img = load_rgba(tag, int(x[1:]))
        img = crop_to_mask(img) if item.get("crop") else img.convert("RGB")
        if item.get("trim"):  # black letterbox bars baked into the source image
            dark = np.asarray(img).max(axis=2) < 18
            rows = np.where(dark.mean(axis=1) < 0.9)[0]
            cols = np.where(dark.mean(axis=0) < 0.9)[0]
            img = img.crop((cols.min() + 2, rows.min() + 2, cols.max() - 1, rows.max() - 1))
        dest = os.path.join(OUT, "hotels", item["out"])
        full = save_webp(img, dest, 2000)  # -400/-800 variants come from `npm run images`
        print(f"{item['out']:45s} {full[0]}x{full[1]}")

    for item in MANIFEST["logos"]:
        tag, _, x = item["src"].split("-")
        img = load_rgba(tag, int(x[1:])).convert("RGBA")
        bbox = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
        if bbox:
            img = img.crop(bbox)
        img.thumbnail((480, 480), Image.LANCZOS)
        save_webp(img, os.path.join(OUT, item["out"]), 480, quality=90)
        print(f"{item['out']:45s} {img.width}x{img.height} (logo)")

    # Large arch + hands mark (no wordmark) for the opening intro, from the full-res logo
    logo = load_rgba("b1", 39).convert("RGBA")
    mark = logo.crop((0, 0, logo.width, int(logo.height * 0.7)))
    mark = mark.crop(mark.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
    mark.save(os.path.join(OUT, "brand", "abhinandanam-mark-lg.webp"), "WEBP", quality=70, alpha_quality=70, method=6)
    print(f"{'brand/abhinandanam-mark-lg':45s} {mark.width}x{mark.height} (intro mark)")

    # 1200x630 social share cards from each hotel's cover
    os.makedirs(os.path.join(OUT, "og"), exist_ok=True)
    for name, src in {
        "home": "abhinandanam/abhinandanam-exterior-1",
        "abhinandanam": "abhinandanam/abhinandanam-exterior-1",
        "the-grey-circle": "the-grey-circle/the-grey-circle-exterior-1",
        "pradesha": "pradesha/pradesha-exterior-1",
    }.items():
        img = Image.open(os.path.join(OUT, "hotels", src + ".webp")).convert("RGB")
        ImageOps.fit(img, (1200, 630), Image.LANCZOS).save(
            os.path.join(OUT, "og", name + ".jpg"), "JPEG", quality=82, optimize=True
        )

    print("next: npm run images  (refreshes data/image-meta.json)")


if __name__ == "__main__":
    sys.exit(main())
