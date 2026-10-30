import Link from 'next/link';
import { Phone } from 'lucide-react';
import Divider from '@/components/Divider';
import { site } from '@/data/site';
import { formatPhone } from '@/lib/contact';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Page not found</p>
      <h1 className="h-display mt-3">This room seems to be taken</h1>
      <Divider className="mx-auto mt-4" />
      <p className="mt-5 max-w-md text-muted">The page you were looking for doesn&rsquo;t exist. Try our hotels, or call us and we&rsquo;ll help straight away.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/hotels/" className="btn-outline">
          See all hotels
        </Link>
        <a href={`tel:${site.phones[0]}`} className="btn-primary">
          <Phone className="h-4 w-4" aria-hidden="true" /> Call us
        </a>
      </div>
    </section>
  );
}
