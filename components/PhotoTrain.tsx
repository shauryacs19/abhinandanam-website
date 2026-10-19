'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import Img from './Img';
import Lightbox, { type LightboxImage } from './Lightbox';
import { imageInfo } from '@/lib/images';

type Props = {
  images: LightboxImage[];
  title: string;
  /** pixels per second (same idea as the Appstle v2 marquee) */
  speed?: number;
  reverse?: boolean;
  size?: 'md' | 'lg';
};

/**
 * "Train" of photos: an infinite horizontal marquee, ported from the Appstle v2 site
 * (appstle-site/v2/js/main.js → buildMarquee). The track holds the photos plus enough
 * cloned sets to loop without a gap, and slides left by exactly one set's width.
 *
 * - Pauses on hover / keyboard focus, and has a Pause/Play button (WCAG 2.2.2).
 * - prefers-reduced-motion: no movement, the row scrolls by hand instead (CSS).
 * - Any photo opens this hotel's own lightbox.
 */
export default function PhotoTrain({ images, title, speed = 40, reverse = false, size = 'lg' }: Props) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  // How many cloned sets the loop needs, worked out from the photos' known sizes (not measured), so the
  // clones are in the server HTML. Clones added later by JS would bypass lazy loading and download
  // every photo at once. Track must be >= container (max ~1440px) + one set.
  const estimatedSet = images.reduce((sum, img) => {
    const { width, height: h } = imageInfo(img.src);
    return sum + (260 * width) / h + 12;
  }, 0);
  const copies = Math.max(1, Math.ceil(1440 / Math.max(estimatedSet, 1)));

  // Measure one set's real width (incl. gaps) so the loop is seamless at any breakpoint
  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const measure = () => {
      const items = track.children;
      const firstClone = items[images.length] as HTMLElement | undefined;
      const first = items[0] as HTMLElement | undefined;
      if (!first || !firstClone) return;
      const setSize = firstClone.offsetLeft - first.offsetLeft;
      if (!setSize) return;
      track.style.setProperty('--shift', `${setSize}px`);
      track.style.setProperty('--duration', `${(setSize / speed).toFixed(2)}s`);
      setReady(true);
    };
    measure();
    let lastWidth = window.innerWidth;
    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        measure();
      }, 200);
    };
    window.addEventListener('resize', onResize);
    // re-measure once images have their final widths (they reserve space via width/height, so this is a safety net)
    const t2 = window.setTimeout(measure, 1500);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
      window.clearTimeout(t2);
    };
  }, [images.length, speed]);

  const height = size === 'lg' ? 'h-[200px] sm:h-[260px]' : 'h-[170px] sm:h-[220px]';
  const tile = (img: LightboxImage, i: number, clone: boolean) => {
    const { width, height: h } = imageInfo(img.src);
    return (
      <li key={`${clone ? 'c' : 'o'}-${i}-${img.src}`} className="train__item" data-clone={clone ? '' : undefined} aria-hidden={clone || undefined}>
        <button
          type="button"
          tabIndex={clone ? -1 : undefined}
          onClick={() => setOpenAt(i % images.length)}
          className={`group relative block overflow-hidden rounded-2xl bg-sand ${height}`}
          aria-label={clone ? undefined : `Open photo: ${img.alt}${img.isRender ? ' (Artist’s impression)' : ''}`}
        >
          <Img
            src={img.src}
            alt=""
            sizes={`${Math.round((260 * width) / h)}px`}
            className="h-full w-auto max-w-none object-cover transition-opacity duration-300 group-hover:opacity-85"
          />
          {img.isRender && (
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white" aria-hidden="true">
              Artist&rsquo;s impression
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="relative">
      <div
        ref={rootRef}
        className={`train ${ready ? 'is-ready' : ''} ${paused ? 'is-paused' : ''}`}
        data-direction={reverse ? 'right' : 'left'}
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
      >
        <ul ref={trackRef} className="train__track">
          {images.map((img, i) => tile(img, i, false))}
          {Array.from({ length: copies }, (_, c) => images.map((img, i) => tile(img, i + (c + 1) * images.length, true)))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="train__toggle absolute bottom-3 right-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-cream/95 px-3 text-xs font-semibold text-ink shadow-card hover:bg-white"
        aria-pressed={paused}
        aria-label={paused ? `Play ${title}` : `Pause ${title}`}
      >
        {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
        {paused ? 'Play' : 'Pause'}
      </button>
      <Lightbox images={images} openAt={openAt} onClose={() => setOpenAt(null)} title={title} />
    </div>
  );
}
