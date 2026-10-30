'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Pause, Play } from 'lucide-react';
import Img from './Img';

export type HeroSlide = { src: string; alt: string; caption: string; href: string };

const SLIDE_MS = 6500;

/**
 * Full-screen home hero: it slides up under the sticky header (which is transparent on the home page
 * until you scroll), so the photo covers the whole first screen. One large photo at a time, slow crossfade with a gentle zoom
 * (Aman / Oberoi / Sayaji lead with big imagery), with the hero text laid over it (`children`).
 * Plays only while on screen, has a Pause button (WCAG 2.2.2) and stays still for
 * prefers-reduced-motion. The first photo is the LCP image; the rest load one ahead, never all at once.
 */
export default function HeroSlideshow({ slides, labelledBy, children, className = '' }: { slides: HeroSlide[]; labelledBy: string; children: ReactNode; className?: string }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(() => new Set([0, 1]));
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => {
      mq.removeEventListener('change', onChange);
      io.disconnect();
    };
  }, []);

  const playing = !paused && inView && !reduced && slides.length > 1;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(index + 1), SLIDE_MS);
    return () => window.clearTimeout(t);
  });

  function go(i: number) {
    const next = (i + slides.length) % slides.length;
    const after = (next + 1) % slides.length;
    setIndex(next);
    // keep the photo after this one loading in the background
    setMounted((m) => (m.has(next) && m.has(after) ? m : new Set([...m, next, after])));
  }

  const current = slides[index];

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-labelledby={labelledBy}
      className={`relative isolate -mt-[var(--header-h)] flex h-[100svh] min-h-[660px] max-h-[1040px] flex-col overflow-hidden bg-deep ${className}`}
    >
      {slides.map((s, i) =>
        mounted.has(i) ? (
          <div key={s.src} className={`band__slide absolute inset-0 -z-10 ${i === index ? 'is-active' : ''}`} aria-hidden={i !== index}>
            <Img src={s.src} alt={s.alt} sizes="100vw" priority={i === 0} className="h-full w-full object-cover" />
          </div>
        ) : null,
      )}
      {/* darker at the top (header text) and bottom (controls), lighter in the middle */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/45 to-black/75" aria-hidden="true" />
      {/* soft dark glow behind the centred logo + headline so the jade logo reads on bright photos */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_42%_48%_at_50%_45%,rgb(0_0_0/0.5),transparent_75%)]" aria-hidden="true" />

      {/* Hero text, centred over the photos */}
      <div className="container-page flex flex-1 flex-col items-center justify-center pt-[calc(var(--header-h)+1.5rem)] text-center text-white">{children}</div>

      {/* Caption + slideshow controls. Bottom padding leaves room for the availability pill that overlaps this edge. */}
      {slides.length > 1 && (
        <div className="container-page flex items-center justify-between gap-4 pb-14 text-white sm:pb-[4.5rem]">
          <p className="hidden items-center gap-3 text-sm text-white/90 sm:flex" aria-live={paused ? 'polite' : 'off'}>
            <span>{current.caption}</span>
            <Link href={current.href} className="inline-flex items-center gap-1 font-semibold text-brass hover:underline">
              View <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
          <div className="ml-auto flex items-center gap-3">
            <ol className="flex items-center gap-1.5">
              {slides.map((s, i) => (
                <li key={s.src}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Photo ${i + 1} of ${slides.length}: ${s.caption}`}
                    aria-current={i === index ? 'true' : undefined}
                    className="grid h-11 w-7 place-items-center sm:w-8"
                  >
                    <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/35">
                      {i === index && <span key={index} className={`block h-full bg-white ${playing ? 'band__fill' : 'w-full'}`} style={{ animationDuration: `${SLIDE_MS}ms` }} />}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={paused ? 'Play the photo slideshow' : 'Pause the photo slideshow'}
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/50 px-4 text-sm font-semibold hover:bg-sand hover:text-ink"
              >
                {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                <span className="hidden sm:inline">{paused ? 'Play' : 'Pause'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
