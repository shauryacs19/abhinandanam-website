import { MessageCircle, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { formatPhone, waText, whatsappHref } from '@/lib/contact';
import Divider from './Divider';

type Props = { title?: string; text?: string; whatsappText?: string; phones?: readonly string[]; eyebrow?: string };

/** "Ready to stay?" band: both numbers big + WhatsApp. */
export default function CallBand({
  title = 'Ready to stay?',
  text = 'Our team will help with rooms and availability and give you the best direct rate on the phone.',
  whatsappText = waText.general,
  phones = site.phones,
  eyebrow = 'Best rates on a direct call',
}: Props) {
  return (
    <section aria-labelledby="call-band-title" className="bg-ink text-cream">
      <div className="container-page reveal flex flex-col items-center py-16 text-center sm:py-20">
        <p className="eyebrow !text-gold">{eyebrow}</p>
        <h2 id="call-band-title" className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
          {title}
        </h2>
        <Divider className="mt-4" />
        <p className="mt-4 max-w-xl text-cream/80">{text}</p>
        <ul className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-10">
          {phones.map((p) => (
            <li key={p}>
              <a href={`tel:${p}`} data-track="call-band" className="flex items-center gap-3 font-serif text-3xl font-semibold text-white hover:text-gold sm:text-4xl">
                <Phone className="h-6 w-6 text-gold" aria-hidden="true" />
                {formatPhone(p)}
              </a>
            </li>
          ))}
        </ul>
        <a href={whatsappHref(whatsappText)} data-track="call-band" target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-8">
          <MessageCircle className="h-5 w-5" aria-hidden="true" /> Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
