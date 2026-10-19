'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, MessageCircle, Phone, X } from 'lucide-react';

export type NavHotel = { slug: string; name: string; tag?: string; featured?: boolean };

type Props = {
  hotels: NavHotel[];
  phone: { tel: string; display: string };
  whatsappHref: string;
};

const links = [
  { href: '/banquets-events/', label: 'Banquets' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export default function Header({ hotels, phone, whatsappHref }: Props) {
  const pathname = usePathname();
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Close menus on navigation
  useEffect(() => {
    setHotelsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Dropdown: close on outside click / Escape
  useEffect(() => {
    if (!hotelsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setHotelsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setHotelsOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [hotelsOpen]);

  // Mobile menu: lock scroll, Escape closes, focus moves into the panel
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mobilePanelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const featured = hotels.filter((h) => h.featured);
  const others = hotels.filter((h) => !h.featured);
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/50 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img src="/images/brand/abhinandanam-mark-sm.webp" alt="" width={113} height={112} className="h-10 w-auto shrink-0 sm:h-12" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[19px] font-semibold tracking-wide text-teal-dark sm:text-2xl">Abhinandanam</span>{' '}
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-muted sm:text-[10px]">Hospitality</span>
            <span className="sr-only"> (home)</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[15px] font-medium">
            <li className="relative" ref={dropdownRef}>
              <button
                type="button"
                className={`flex min-h-[44px] items-center gap-1 rounded-full px-4 hover:text-copper-dark ${isActive('/hotels') ? 'text-copper-dark' : ''}`}
                aria-expanded={hotelsOpen}
                aria-controls="hotels-menu"
                onClick={() => setHotelsOpen((o) => !o)}
              >
                Hotels <ChevronDown className={`h-4 w-4 transition-transform ${hotelsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <div
                id="hotels-menu"
                hidden={!hotelsOpen}
                className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-gold/50 bg-cream p-3 shadow-lift"
              >
                <ul>
                  {featured.map((h) => (
                    <li key={h.slug}>
                      <Link href={`/hotels/${h.slug}/`} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-sand">
                        <span className="font-serif text-lg font-semibold">{h.name}</span>
                        {h.tag && <span className="rounded-full bg-teal-dark px-2 py-0.5 text-[11px] font-semibold text-white">{h.tag}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
                {others.length > 0 && (
                  <>
                    <p className="mt-2 border-t border-gold/40 px-3 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">More hotels</p>
                    <ul className="grid grid-cols-2 gap-x-2 py-1 text-sm">
                      {others.map((h) => (
                        <li key={h.slug}>
                          <Link href={`/hotels/${h.slug}/`} className="block rounded-lg px-3 py-1.5 hover:bg-sand">
                            {h.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <Link href="/hotels/" className="link mt-2 block px-3 py-2 text-sm">
                  View all {hotels.length} hotels →
                </Link>
              </div>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center rounded-full px-4 hover:text-copper-dark ${isActive(l.href) ? 'text-copper-dark' : ''}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a href={`tel:${phone.tel}`} data-track="header" className="btn-primary !min-h-[44px] !px-4 sm:!px-5">
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Call to Book</span>
            <span className="sm:hidden">Call</span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-gold lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={mobilePanelRef}
        hidden={!mobileOpen}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto border-t border-gold/50 bg-cream lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-6">
          <p className="eyebrow">Our hotels</p>
          <ul className="mt-3 divide-y divide-gold/30">
            {featured.map((h) => (
              <li key={h.slug}>
                <Link href={`/hotels/${h.slug}/`} className="flex min-h-[52px] items-center justify-between font-serif text-xl font-semibold">
                  {h.name}
                  {h.tag && <span className="rounded-full bg-teal-dark px-2 py-0.5 font-sans text-[11px] font-semibold text-white">{h.tag}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/hotels/" className="link mt-2 inline-block text-sm">
            All {hotels.length} hotels →
          </Link>
          <ul className="mt-6 divide-y divide-gold/30 border-t border-gold/30">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? 'page' : undefined} className="flex min-h-[52px] items-center text-lg font-medium">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <a href={`tel:${phone.tel}`} data-track="mobile-menu" className="btn-primary w-full">
              <Phone className="h-4 w-4" aria-hidden="true" /> Call {phone.display}
            </a>
            <a href={whatsappHref} data-track="mobile-menu" target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
