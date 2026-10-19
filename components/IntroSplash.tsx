'use client';

import { useEffect, useRef, useState } from 'react';

const MARK = '/images/brand/abhinandanam-mark-lg.webp';
const FLIGHT_MS = 750;

/**
 * Opening intro: the brand + logo colours swirl together and settle into the logo, then the logo
 * flies into its place in the home hero (#hero-logo) while the overlay fades and the site appears.
 *
 * - Plays once per visit, only when the visit starts on the home page (see INIT_SCRIPT in app/layout.tsx).
 * - Never plays for prefers-reduced-motion.
 * - Any click/tap or key press skips straight to the site.
 * - The colour animation is pure CSS with a self-ending fallback, so the site is never stuck behind it.
 */
export default function IntroSplash() {
  const [gone, setGone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('no-intro')) {
      setGone(true);
      return;
    }
    let finished = false;
    const end = () => {
      if (finished) return;
      finished = true;
      root.classList.add('no-intro'); // reveals #hero-logo underneath
      setGone(true);
    };

    const fly = () => {
      const overlay = overlayRef.current;
      const logo = overlay?.querySelector<HTMLElement>('.intro-logo');
      const target = document.getElementById('hero-logo');
      if (!overlay || !logo || !target || !logo.animate) return end();
      const a = logo.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const scale = b.width / a.width;
      const ease = 'cubic-bezier(0.65, 0, 0.35, 1)';
      logo.animate([{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }], {
        duration: FLIGHT_MS,
        easing: ease,
        fill: 'forwards',
      }).onfinish = end;
      overlay.animate([{ backgroundColor: 'rgb(251 246 238 / 0)' }], { duration: FLIGHT_MS * 0.8, easing: ease, fill: 'forwards' });
      overlay.querySelectorAll<HTMLElement>('.intro-word, .intro-skip').forEach((el) =>
        el.animate([{ opacity: 0 }], { duration: 250, fill: 'forwards' }),
      );
    };

    // Sync with the CSS timeline (it starts at first paint, not at navigation start):
    // fly when the wordmark has finished rising; if the CSS safety fade already ran, just finish.
    const overlay = overlayRef.current;
    const word = overlay?.querySelector<HTMLElement>('.intro-word');
    const rise = word?.getAnimations?.()[0];
    const fallback = overlay?.getAnimations?.().find((an) => (an as CSSAnimation).animationName === 'intro-out');
    if (!overlay || !rise || !fallback || fallback.playState === 'finished') {
      end();
      return;
    }
    let cancelled = false;
    rise.finished.then(() => !cancelled && fly(), () => {});
    fallback.finished.then(end, () => {});
    window.addEventListener('keydown', end, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('keydown', end);
    };
  }, []);

  if (gone) return null;

  return (
    // Decorative only: screen readers go straight to the page content
    <div
      ref={overlayRef}
      className="intro"
      aria-hidden="true"
      onClick={() => {
        document.documentElement.classList.add('no-intro');
        setGone(true);
      }}
    >
      <span className="intro-blob intro-blob--copper" />
      <span className="intro-blob intro-blob--gold" />
      <span className="intro-blob intro-blob--sage" />
      <span className="intro-blob intro-blob--aqua" />
      <span className="intro-blob intro-blob--teal" />
      <div className="intro-stage">
        <div className="intro-logo">
          {/* the swirling colours, cut to the logo's shape */}
          <div className="intro-logo__colors" style={{ WebkitMaskImage: `url(${MARK})`, maskImage: `url(${MARK})` }} />
          {/* then the real logo fades in on top */}
          <div className="intro-logo__real" style={{ backgroundImage: `url(${MARK})` }} />
        </div>
        <p className="intro-word">
          <span>Abhinandanam</span>
          <span>Hospitality</span>
        </p>
      </div>
      <span className="intro-skip">Tap to skip</span>
    </div>
  );
}
