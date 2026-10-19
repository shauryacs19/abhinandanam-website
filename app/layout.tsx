import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Header, { type NavHotel } from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBar, { type BarContext } from '@/components/MobileBar';
import ClickTracker from '@/components/ClickTracker';
import RevealObserver from '@/components/RevealObserver';
import IntroSplash from '@/components/IntroSplash';
import { site } from '@/data/site';
import { getHotel, sortedHotels } from '@/lib/hotels';
import { directionsHref, formatPhone, mailHref, waText, whatsappHref } from '@/lib/contact';
import type { Hotel } from '@/data/hotels';

// One weight keeps the font download small; every serif heading is set at 600. Italic is for the hero line.
const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['600'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Abhinandanam Hospitality | Hotels in Vijay Nagar, Indore', template: '%s | Abhinandanam Hospitality' },
  description: `${site.tagline}. Hotel Abhinandanam, The Grey Circle and the upcoming Pradesha in Vijay Nagar, Indore. Call +91 82258 22585 for the best direct rates.`,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    images: [{ url: '/images/og/home.jpg', width: 1200, height: 630, alt: 'Hotel Abhinandanam at dusk' }],
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: true },
};

// Intro plays once per visit, only when the visit starts on the home page (the logo lands in the home hero).
const INIT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{var home=location.pathname==='/'||location.pathname==='/index.html';if(!home||sessionStorage.getItem('intro-seen')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('no-intro')}else{sessionStorage.setItem('intro-seen','1')}}catch(e){d.classList.add('no-intro')}})();`;

export const viewport: Viewport = { themeColor: '#FBF6EE', width: 'device-width', initialScale: 1 };

function barContext(h: Hotel): BarContext {
  return {
    slug: h.slug,
    phone: h.phones[0],
    whatsappHref: whatsappHref(waText.hotel(h), h.whatsapp),
    directionsHref: directionsHref(h),
    emailHref: mailHref(h.email, `Enquiry: ${h.name}`),
    comingSoon: h.status === 'coming-soon',
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navHotels: NavHotel[] = sortedHotels.map((h) => ({
    slug: h.slug,
    name: h.name,
    featured: h.featured,
    tag: h.status === 'coming-soon' ? 'Coming soon' : undefined,
  }));
  const flagship = getHotel('abhinandanam')!;

  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: .js lets CSS hide .reveal content only when JS can reveal it again;
            .no-intro skips the opening animation after the first page of a visit or for reduced motion. */}
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
      </head>
      <body className="pb-[calc(56px+env(safe-area-inset-bottom))] lg:pb-0">
        <IntroSplash />
        <a href="#main" className="sr-only z-[60] rounded-full bg-copper-dark px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <Header
          hotels={navHotels}
          phone={{ tel: site.phones[0], display: formatPhone(site.phones[0]) }}
          whatsappHref={whatsappHref(waText.general)}
        />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar fallback={{ ...barContext(flagship), slug: 'site', whatsappHref: whatsappHref(waText.general) }} hotels={sortedHotels.map(barContext)} />
        <ClickTracker />
        <RevealObserver />
      </body>
    </html>
  );
}
