'use client';

import { useEffect } from 'react';

const DOWN_KEYS = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar']);
const UP_KEYS = new Set(['ArrowUp', 'PageUp']);

/**
 * Home "Our hotels" (client, 2026-10-30): the hotel panels (.hx) are a full-screen stop.
 * Down: once the stats row above them ([data-snap-from]) is fully on screen, the next downward scroll
 * (wheel, trackpad, keyboard or swipe) glides straight to the panels.
 * Up: once the top edge of the section below them ([data-snap-back]) is on screen, the next upward
 * scroll glides back so the panels fill the screen (phones, where they stack: the last panel).
 * Up from the panels themselves: glides straight back to the hero at the top of the page.
 * Everywhere else the page scrolls normally.
 */
export default function PanelSnap() {
  useEffect(() => {
    const from = document.querySelector<HTMLElement>('[data-snap-from]');
    const to = document.querySelector<HTMLElement>('.hx');
    const back = document.querySelector<HTMLElement>('[data-snap-back]');
    if (!from || !to) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let busyUntil = 0;

    // Where each direction should glide to, or null when the page should scroll normally
    const target = (down: boolean): number | null => {
      const r = to.getBoundingClientRect();
      if (down) return from.getBoundingClientRect().bottom <= innerHeight + 1 && r.top > 2 ? r.top + scrollY : null;
      // the panels' bottom edge lands on the screen's bottom edge (desktop: same as their top at 0)
      if (back && back.getBoundingClientRect().top >= 0 && r.bottom < innerHeight - 2) return r.bottom + scrollY - innerHeight;
      // on the panels (their top at, or a little above, the top of the screen): back to the hero
      if (r.top <= 2 && r.top > -innerHeight / 2 && scrollY > 2) return 0;
      return null;
    };

    const jump = (down: boolean, e?: Event) => {
      if (performance.now() < busyUntil) {
        e?.preventDefault(); // swallow the rest of a trackpad flick while gliding
        return;
      }
      const top = target(down);
      if (top === null) return;
      e?.preventDefault();
      busyUntil = performance.now() + 900;
      scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY) jump(e.deltaY > 0, e);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, select, textarea, [contenteditable]')) return;
      if (DOWN_KEYS.has(e.key) && !e.shiftKey) jump(true, e);
      else if (UP_KEYS.has(e.key) || (e.key === ' ' && e.shiftKey)) jump(false, e);
    };
    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY !== null) {
        const moved = touchY - e.changedTouches[0].clientY; // finger moved up = scroll down
        if (Math.abs(moved) > 30) jump(moved > 0);
      }
      touchY = null;
    };

    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('keydown', onKey);
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      removeEventListener('wheel', onWheel);
      removeEventListener('keydown', onKey);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchend', onTouchEnd);
    };
  }, []);
  return null;
}
