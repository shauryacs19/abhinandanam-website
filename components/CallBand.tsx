import { MessageCircle, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { waText, whatsappHref } from '@/lib/contact';
import Divider from './Divider';
import Doodle from './Doodle';

type Props = { title?: string; text?: string; whatsappText?: string; phones?: readonly string[]; eyebrow?: string };

/** "Ready to stay?" band: Call + WhatsApp buttons (no numbers on show, client request). */
export default function CallBand({
  title = 'Ready to stay?',
  text = 'Our team will help with rooms, availability and rates on the phone.',
  whatsappText = waText.general,
  phones = site.phones,
  eyebrow = 'Book direct with the hotel',
}: Props) {
  return (
    <section aria-labelledby="call-band-title" className="relative overflow-hidden bg-deep text-ink">
      {/* a pair of jharokha arches framing the call to action */}
      <Doodle name="arch" className="absolute -bottom-6 left-[2%] hidden w-56 sm:block lg:left-[8%] lg:w-64" />
      <Doodle name="arch" className="absolute -bottom-6 right-[2%] hidden w-56 sm:block lg:right-[8%] lg:w-64" />
      <div className="container-page reveal relative flex flex-col items-center py-16 text-center sm:py-20">
        <p className="eyebrow !text-brass">{eyebrow}</p>
        <h2 id="call-band-title" className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
          {title}
        </h2>
        <Divider className="mt-4" />
        <p className="mt-4 max-w-xl text-ink/80">{text}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a href={`tel:${phones[0]}`} data-track="call-band" className="btn-primary">
            <Phone className="h-5 w-5" aria-hidden="true" /> Call to book
          </a>
          <a href={whatsappHref(whatsappText)} data-track="call-band" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <MessageCircle className="h-5 w-5" aria-hidden="true" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
