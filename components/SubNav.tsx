'use client';

import { useEffect, useRef, useState } from 'react';

/** Sticky in-page nav with scroll-spy (highlights the section you're reading). */
export default function SubNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target.id) : inBand.delete(e.target.id)));
        // first section (in page order) that overlaps the band
        const first = sections.find((s) => inBand.has(s.id));
        if (first) setActive(first.id);
      },
      // a thin band just below the sticky header + this nav
      { rootMargin: '-140px 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // keep the active link visible on narrow screens
  useEffect(() => {
    const link = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (link && listRef.current) {
      const list = listRef.current;
      list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2, behavior: 'smooth' });
    }
  }, [active]);

  return (
    <nav aria-label="On this page" className="sticky top-[var(--header-h)] z-30 border-b border-gold/50 bg-cream/95 backdrop-blur">
      <ul ref={listRef} className="no-scrollbar container-page flex gap-1 overflow-x-auto">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              data-id={s.id}
              aria-current={active === s.id ? 'location' : undefined}
              className={`flex min-h-[48px] items-center border-b-2 px-3 text-[15px] font-medium transition-colors ${
                active === s.id ? 'border-copper-dark text-copper-dark' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
