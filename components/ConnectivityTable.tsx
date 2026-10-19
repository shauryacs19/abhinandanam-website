import Link from 'next/link';
import { Plane, TrainFront, TramFront } from 'lucide-react';
import type { Hotel } from '@/data/hotels';

const head = 'px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-muted sm:px-3 sm:text-xs sm:tracking-[0.14em]';

/** Minutes to airport / railway / metro, one row per hotel. */
export default function ConnectivityTable({ hotels, linkNames = true, caption }: { hotels: Hotel[]; linkNames?: boolean; caption?: string }) {
  const rows = hotels.filter((h) => h.connectivity);
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-gold/50 bg-white/60">
      <table className="w-full text-sm">
        {caption && <caption className="caption-top px-3 pt-3 text-left text-xs text-muted">{caption}</caption>}
        <thead className="border-b border-gold/40">
          <tr>
            <th scope="col" className={head}>
              Hotel
            </th>
            <th scope="col" className={head}>
              <span className="inline-flex items-center gap-1.5">
                <Plane className="hidden h-4 w-4 sm:block" aria-hidden="true" /> Airport
              </span>
            </th>
            <th scope="col" className={head}>
              <span className="inline-flex items-center gap-1.5">
                <TrainFront className="hidden h-4 w-4 sm:block" aria-hidden="true" /> Railway
              </span>
            </th>
            <th scope="col" className={head}>
              <span className="inline-flex items-center gap-1.5">
                <TramFront className="hidden h-4 w-4 sm:block" aria-hidden="true" /> Metro
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold/30">
          {rows.map((h) => (
            <tr key={h.slug}>
              <th scope="row" className="px-2 py-3 text-left font-semibold sm:px-3">
                {linkNames ? (
                  <Link href={`/hotels/${h.slug}/`} className="hover:text-copper-dark hover:underline">
                    {h.name}
                  </Link>
                ) : (
                  h.name
                )}
                {h.status === 'coming-soon' && <span className="ml-2 text-xs font-normal text-teal-dark">(coming soon)</span>}
              </th>
              <td className="whitespace-nowrap px-2 py-3 tabular-nums sm:px-3">{h.connectivity!.airport}<span className="hidden text-muted sm:inline"> min</span></td>
              <td className="whitespace-nowrap px-2 py-3 tabular-nums sm:px-3">{h.connectivity!.railway}<span className="hidden text-muted sm:inline"> min</span></td>
              <td className="whitespace-nowrap px-2 py-3 tabular-nums sm:px-3">{h.connectivity!.metro}<span className="hidden text-muted sm:inline"> min</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
