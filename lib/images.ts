import meta from '@/data/image-meta.json';

// [width, height, ...available variant widths] — written by `npm run images`
const table = meta as unknown as Record<string, number[]>;

export type ImageInfo = { src: string; width: number; height: number; srcSet?: string; defaultSrc: string };

const variantSrc = (src: string, w: number) => src.replace(/\.webp$/, `-${w}.webp`);

/** Intrinsic size + srcset (400w / 800w / full) for a site image */
export function imageInfo(src: string): ImageInfo {
  const m = table[src];
  if (!m) {
    if (process.env.NODE_ENV !== 'production') console.warn(`[images] no meta for ${src}. Run npm run images`);
    return { src, width: 1200, height: 800, defaultSrc: src };
  }
  const [width, height, ...variants] = m;
  if (!variants.length) return { src, width, height, defaultSrc: src };
  const srcSet = [...variants.map((w) => `${variantSrc(src, w)} ${w}w`), `${src} ${width}w`].join(', ');
  // fallback src for browsers without srcset support: the largest variant <= 800
  const fallback = variants.filter((w) => w <= 800).pop();
  return { src, width, height, srcSet, defaultSrc: fallback ? variantSrc(src, fallback) : src };
}

/** Smallest file at least `min` px wide, for fixed small slots (thumbnails) */
export function smallSrc(src: string, min = 400): string {
  const m = table[src];
  if (!m) return src;
  const w = m.slice(2).find((v) => v >= min);
  return w ? variantSrc(src, w) : src;
}
