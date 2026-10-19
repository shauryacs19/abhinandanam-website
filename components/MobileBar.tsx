'use client';

import { usePathname } from 'next/navigation';
import { Mail, MessageCircle, Navigation, Phone } from 'lucide-react';

export type BarContext = {
  slug: string;
  phone: string;
  whatsappHref: string;
  directionsHref?: string;
  emailHref: string;
  comingSoon?: boolean;
};

type Props = { fallback: BarContext; hotels: BarContext[] };

/** Fixed Call | WhatsApp | Directions bar on phones. Adapts to the hotel page you're on. */
export default function MobileBar({ fallback, hotels }: Props) {
  const pathname = usePathname() ?? '';
  const slug = pathname.match(/^\/hotels\/([^/]+)/)?.[1];
  const ctx = hotels.find((h) => h.slug === slug) ?? fallback;
  const item = 'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[12px] font-semibold min-h-[56px]';

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/60 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="flex divide-x divide-gold/40">
        <a href={`tel:${ctx.phone}`} data-track={`bar:${ctx.slug}`} className={`${item} bg-copper-dark text-white`}>
          <Phone className="h-5 w-5" aria-hidden="true" />
          {ctx.comingSoon ? 'Pre-book' : 'Call'}
        </a>
        <a href={ctx.whatsappHref} data-track={`bar:${ctx.slug}`} target="_blank" rel="noopener noreferrer" className={`${item} text-teal-dark`}>
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          WhatsApp
        </a>
        {ctx.directionsHref ? (
          <a href={ctx.directionsHref} data-track={`bar:${ctx.slug}`} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`}>
            <Navigation className="h-5 w-5" aria-hidden="true" />
            Directions
          </a>
        ) : (
          <a href={ctx.emailHref} data-track={`bar:${ctx.slug}`} className={`${item} text-ink`}>
            <Mail className="h-5 w-5" aria-hidden="true" />
            Email
          </a>
        )}
      </div>
    </nav>
  );
}
