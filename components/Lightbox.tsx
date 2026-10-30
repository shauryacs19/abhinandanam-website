'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { imageInfo } from '@/lib/images';

export type LightboxImage = {
  src: string;
  alt: string;
  category?: string;
  categoryLabel?: string;
  hotelName?: string;
  isRender?: boolean;
};

type Props = {
  images: LightboxImage[];
  /** index into `images`, or null when closed */
  openAt: number | null;
  onClose: () => void;
  title?: string;
};

/**
 * Full-screen photo viewer: ←/→/Esc, swipe, counter, captions, category tabs, focus trap.
 * Rendered in a portal so transformed ancestors (fade-in sections) can't clip it.
 */
export default function Lightbox({ images, openAt, onClose, title = 'Photo gallery' }: Props) {
  const [category, setCategory] = useState<string>('all');
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const open = openAt !== null;

  const tabs = useMemo(() => {
    const seen = new Map<string, string>();
    images.forEach((i) => i.category && !seen.has(i.category) && seen.set(i.category, i.categoryLabel ?? i.category));
    return seen.size > 1 ? [['all', 'All'] as const, ...Array.from(seen.entries())] : [];
  }, [images]);

  const list = useMemo(() => (category === 'all' ? images : images.filter((i) => i.category === category)), [images, category]);

  // Opening: start on the clicked photo
  useEffect(() => {
    if (openAt === null) return;
    returnFocus.current = document.activeElement as HTMLElement;
    setCategory('all');
    setIndex(openAt);
  }, [openAt]);

  const go = useCallback((d: number) => setIndex((i) => (list.length ? (i + d + list.length) % list.length : 0)), [list.length]);

  const close = useCallback(() => {
    onClose();
    // give React a tick to unmount, then restore focus to the thumbnail that opened us
    setTimeout(() => returnFocus.current?.focus(), 0);
  }, [onClose]);

  // Keyboard, scroll lock, focus trap
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && dialogRef.current) {
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, go, close]);

  // Preload neighbours so arrows feel instant
  useEffect(() => {
    if (!open || list.length < 2) return;
    [list[(index + 1) % list.length], list[(index - 1 + list.length) % list.length]].forEach((i) => {
      const im = new Image();
      im.src = i.src;
    });
  }, [open, index, list]);

  if (!open || typeof document === 'undefined') return null;
  const current = list[Math.min(index, list.length - 1)];
  if (!current) return null;
  const info = imageInfo(current.src);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="lightbox fixed inset-0 z-[100] flex flex-col bg-[#14100d]/95 text-ink"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="text-sm tabular-nums text-ink/80" aria-live="polite">
          {index + 1} / {list.length}
        </p>
        {tabs.length > 0 && (
          <div className="no-scrollbar -mx-2 flex flex-1 gap-1 overflow-x-auto px-2 sm:justify-center" role="group" aria-label="Filter photos">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={category === key}
                onClick={() => {
                  setCategory(key);
                  setIndex(0);
                }}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${category === key ? 'bg-cream text-ink' : 'text-ink/80 hover:bg-white/10'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <button ref={closeRef} type="button" onClick={close} className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-white/10" aria-label="Close gallery (Esc)">
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <figure className="relative flex min-h-0 flex-1 flex-col px-2 sm:px-16">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <img
            key={current.src}
            src={current.src}
            srcSet={info.srcSet}
            sizes="100vw"
            width={info.width}
            height={info.height}
            alt={current.alt}
            className="h-full w-full select-none object-contain"
            draggable={false}
          />
        </div>
        <figcaption className="mt-3 px-4 pb-4 text-center text-sm text-ink/85">
          {current.alt}
          {current.hotelName && <span className="text-ink/60"> · {current.hotelName}</span>}
          {current.isRender && <span className="ml-2 rounded-full border border-cream/40 px-2 py-0.5 text-xs">Artist&rsquo;s impression</span>}
        </figcaption>
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 hover:bg-black/60 sm:left-4"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-7 w-7" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 hover:bg-black/60 sm:right-4"
              aria-label="Next photo"
            >
              <ChevronRight className="h-7 w-7" aria-hidden="true" />
            </button>
          </>
        )}
      </figure>
    </div>,
    document.body,
  );
}
