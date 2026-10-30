'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { site } from '@/data/site';

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
  const [scrolled, setScrolled] = useState(false);
  const home = pathname === '/';

  // Close menus on navigation
  useEffect(() => {
    setHotelsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Home: the header floats transparent over the full-screen photo hero until the page scrolls
  useEffect(() => {
    if (!home) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [home]);

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
  const overlay = home && !scrolled && !mobileOpen;

  return (
    <header
      // No bottom border: it made the header 1px taller than the hero's pull-up, leaving a light sliver at the top
      className={`theme-dark sticky top-0 z-50 text-ink transition-colors duration-300 ${
        overlay
          ? 'bg-transparent'
          : // translucent smoked glass: the page and photos show through, tinted dark (client, 2026-10-30)
            'bg-[rgb(18_16_14/0.88)] supports-[backdrop-filter]:bg-[rgb(18_16_14/0.42)] supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150'
      }`}
    >
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
        {/* Horizontal logo (client artwork + (R), scripts/build_logos.py). Jade on emerald is 5:1. */}
        <Link href="/" className="flex min-w-0 shrink items-center">
          <img src={site.logoHorizontalWhite} alt="Abhinandanam Hospitality Pvt. Ltd. (home)" width={1000} height={237} className="h-10 w-auto max-w-full sm:h-[52px] lg:h-[clamp(40px,3.6vw,52px)]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[15px] font-medium lg:text-[clamp(13px,1.05vw,15px)]">
            <li className="relative" ref={dropdownRef}>
              <button
                type="button"
                className={`flex min-h-[44px] items-center gap-1 rounded-full px-4 hover:text-brass lg:px-[clamp(8px,1.1vw,16px)] ${isActive('/hotels') ? 'text-brass' : ''}`}
                aria-expanded={hotelsOpen}
                aria-controls="hotels-menu"
                onClick={() => setHotelsOpen((o) => !o)}
              >
                Hotels <ChevronDown className={`h-4 w-4 transition-transform ${hotelsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <div
                id="hotels-menu"
                hidden={!hotelsOpen}
                className="absolute left-0 top-full mt-2 w-80 rounded-lg border border-gold/25 bg-cream p-3 text-ink shadow-lift"
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
                    <p className="mt-2 border-t border-gold/20 px-3 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">More hotels</p>
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
                  className={`flex min-h-[44px] items-center rounded-full px-4 hover:text-brass lg:px-[clamp(8px,1.1vw,16px)] ${isActive(l.href) ? 'text-brass' : ''}`}
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
            className="grid h-11 w-11 place-items-center rounded-full border border-gold/15 lg:hidden"
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
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto border-t border-gold/25 bg-cream text-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-6">
          <p className="eyebrow">Our hotels</p>
          <ul className="mt-3 divide-y divide-gold/15">
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
          <ul className="mt-6 divide-y divide-gold/15 border-t border-gold/15">
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
              <Phone className="h-4 w-4" aria-hidden="true" /> Call to Book
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
