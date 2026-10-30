// npm run images
//
// 1. Converts any .jpg/.jpeg/.png dropped into public/images/hotels/<slug>/ to
//    <name>.webp (max 2000px wide, never upscaled), then deletes the original.
// 2. Makes responsive variants <name>-400.webp and <name>-800.webp for every photo (if missing).
// 3. Builds the small brand assets (header mark, favicon) and the "photo coming soon" placeholders.
// 4. Writes data/image-meta.json ({ "/images/...webp": [width, height, ...variantWidths] }) so
//    every <img> gets width/height (no layout shift) and a correct srcset.
import { readdir, unlink, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

// Windows: sharp's file cache keeps the source .jpg open, so unlink() fails with EPERM
sharp.cache(false);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const HOTELS = path.join(PUBLIC, 'images', 'hotels');
const exists = (p) => access(p).then(() => true, () => false);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function convertNewPhotos() {
  if (!(await exists(HOTELS))) return;
  for (const file of await walk(HOTELS)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const base = file.replace(/\.(jpe?g|png)$/i, '');
    await sharp(file).rotate().resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 80 }).toFile(base + '.webp'); // rotate = respect camera EXIF
    await unlink(file);
    console.log('converted', path.relative(PUBLIC, file));
  }
}

const VARIANTS = [400, 800];
const isVariant = (f) => /-(400|800)\.webp$/.test(f);

async function buildVariants(dir, only) {
  const files = only ? [path.join(dir, only)] : await walk(dir);
  for (const file of files) {
    if (!file.endsWith('.webp') || isVariant(file)) continue;
    const { width } = await sharp(file).metadata();
    for (const w of VARIANTS) {
      const out = file.replace(/\.webp$/, `-${w}.webp`);
      if (width <= w || (await exists(out))) continue;
      await sharp(file).resize({ width: w }).webp({ quality: 72, effort: 6 }).toFile(out);
    }
  }
}

async function buildBrandAssets() {
  const logo = path.join(PUBLIC, 'images', 'brand', 'abhinandanam-hospitality-logo.webp');
  if (!(await exists(logo))) return;
  // Header logo: small copy of the intro/hero mark (same artwork), 2x of the ~56px display height
  const markLg = path.join(PUBLIC, 'images', 'brand', 'abhinandanam-mark-lg.webp');
  if (await exists(markLg)) {
    await sharp(markLg).resize({ height: 112 }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(PUBLIC, 'images', 'brand', 'abhinandanam-mark-sm.webp'));
  }
  // Favicon / app icon: the arch + hands mark (top of the logo, above the wordmark) on cream
  const { width, height } = await sharp(logo).metadata();
  const mark = await sharp(logo).extract({ left: 0, top: 0, width, height: Math.round(height * 0.7) }).trim().toBuffer();
  const cream = { r: 251, g: 246, b: 238, alpha: 1 };
  const padded = await sharp(mark)
    .resize(430, 430, { fit: 'contain', background: cream })
    .flatten({ background: cream })
    .extend({ top: 41, bottom: 41, left: 41, right: 41, background: cream })
    .png()
    .toBuffer();
  await sharp(padded).resize(96, 96).png({ palette: true, compressionLevel: 9 }).toFile(path.join(ROOT, 'app', 'icon.png'));
  await sharp(padded).resize(180, 180).png().toFile(path.join(ROOT, 'app', 'apple-icon.png'));
}

function placeholderSvg(w, h, label) {
  const archW = Math.round(w * 0.22);
  const archH = Math.round(h * 0.42);
  const x = (w - archW) / 2;
  const y = h * 0.16;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#F1E6D6"/>
  <path d="M${x} ${y + archH} V${y + archW / 2} A${archW / 2} ${archW / 2} 0 0 1 ${x + archW} ${y + archW / 2} V${y + archH} Z" fill="none" stroke="#D9B98C" stroke-width="4"/>
  <text x="50%" y="${y + archH + h * 0.12}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(h * 0.06)}" fill="#8A4A1F">${label}</text>
  <text x="50%" y="${y + archH + h * 0.2}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(h * 0.035)}" letter-spacing="4" fill="#6B5D52">PLACEHOLDER</text>
</svg>`;
}

async function buildPlaceholders() {
  const dir = path.join(PUBLIC, 'images');
  const items = [
    ['placeholder-hotel', 1600, 1000, 'Hotel photos coming soon'],
    ['placeholder-room', 1200, 800, 'Room photos coming soon'],
    ['placeholder-amenity', 1200, 800, 'Photos coming soon'],
  ];
  for (const [name, w, h, label] of items) {
    const svg = Buffer.from(placeholderSvg(w, h, label));
    await sharp(svg).webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
  }
}

async function writeMeta() {
  const meta = {};
  for (const file of await walk(path.join(PUBLIC, 'images'))) {
    if (!file.endsWith('.webp') || isVariant(file)) continue;
    const { width, height } = await sharp(file).metadata();
    const rel = '/' + path.relative(PUBLIC, file).split(path.sep).join('/');
    const variants = [];
    for (const w of VARIANTS) if (await exists(file.replace(/\.webp$/, `-${w}.webp`))) variants.push(w);
    meta[rel] = [width, height, ...variants];
  }
  const sorted = Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b)));
  await mkdir(path.join(ROOT, 'data'), { recursive: true });
  await writeFile(path.join(ROOT, 'data', 'image-meta.json'), JSON.stringify(sorted, null, 1) + '\n');
  console.log(`image-meta.json: ${Object.keys(sorted).length} images`);
}

await convertNewPhotos();
await buildBrandAssets();
await buildPlaceholders();
await buildVariants(HOTELS);
// placeholders were just regenerated, so rebuild their variants
for (const name of ['placeholder-hotel', 'placeholder-room', 'placeholder-amenity']) {
  for (const w of VARIANTS) await unlink(path.join(PUBLIC, 'images', `${name}-${w}.webp`)).catch(() => {});
  await buildVariants(path.join(PUBLIC, 'images'), `${name}.webp`);
}
await writeMeta();
