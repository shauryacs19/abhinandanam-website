import type { ReactNode } from 'react';

// Background line art (client, 2026-10-30: "doodles that still feel luxury"). Hand-built motifs from
// Indore and the hotels themselves, drawn as fine champagne-gold strokes at low opacity:
// a Rajwada-style jharokha arch, a lotus, a paisley (kairi), a rosette and a chandelier.
// Purely decorative (aria-hidden, no pointer events). Strokes stay hairline at any size (.doodle in
// globals.css) and fade up with the site's usual .reveal when scrolled into view.

export type DoodleName = 'arch' | 'lotus' | 'paisley' | 'rosette' | 'chandelier';

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Rosette: 16 petal loops around two rings */
function rosette(): ReactNode {
  const petals = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const tip = [100 + Math.cos(a) * 92, 100 + Math.sin(a) * 92];
    const l = [100 + Math.cos(a - 0.2) * 44, 100 + Math.sin(a - 0.2) * 44];
    const r = [100 + Math.cos(a + 0.2) * 44, 100 + Math.sin(a + 0.2) * 44];
    const cl = [100 + Math.cos(a - 0.17) * 84, 100 + Math.sin(a - 0.17) * 84];
    const cr = [100 + Math.cos(a + 0.17) * 84, 100 + Math.sin(a + 0.17) * 84];
    return `M${r2(l[0])} ${r2(l[1])}Q${r2(cl[0])} ${r2(cl[1])} ${r2(tip[0])} ${r2(tip[1])}Q${r2(cr[0])} ${r2(cr[1])} ${r2(r[0])} ${r2(r[1])}`;
  });
  return (
    <>
      <circle cx="100" cy="100" r="44" />
      <circle cx="100" cy="100" r="30" />
      <circle cx="100" cy="100" r="6" />
      {petals.map((d) => (
        <path key={d} d={d} />
      ))}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        return <path key={i} d={`M${r2(100 + Math.cos(a) * 10)} ${r2(100 + Math.sin(a) * 10)}L${r2(100 + Math.cos(a) * 28)} ${r2(100 + Math.sin(a) * 28)}`} />;
      })}
    </>
  );
}

const shapes: Record<DoodleName, { viewBox: string; body: () => ReactNode }> = {
  // Rajwada-style jharokha: scalloped arch inside a pointed arch, small dome and finial, balcony base
  arch: {
    viewBox: '0 0 200 260',
    body: () => (
      <>
        <path d="M30 250V120Q30 40 100 18Q170 40 170 120V250" />
        <path d="M46 250V126Q46 66 100 44Q154 66 154 126V250" />
        <path d="M58 250V130Q58 112 68 104Q66 92 76 86Q78 74 90 70Q94 60 100 58Q106 60 110 70Q122 74 124 86Q134 92 132 104Q142 112 142 130V250" />
        <path d="M100 18V6M96 10H104" />
        <circle cx="100" cy="4" r="2" />
        <path d="M18 250H182M24 238H176M30 226H170" />
        {[44, 66, 88, 110, 132, 154].map((x) => (
          <path key={x} d={`M${x} 238V226`} />
        ))}
      </>
    ),
  },
  // Lotus: seven petals over a waterline
  lotus: {
    viewBox: '0 0 240 160',
    body: () => (
      <>
        <path d="M120 20Q96 60 120 120Q144 60 120 20Z" />
        <path d="M120 120Q78 92 74 44Q104 64 120 120Z" />
        <path d="M120 120Q162 92 166 44Q136 64 120 120Z" />
        <path d="M120 120Q60 116 36 74Q82 78 120 120Z" />
        <path d="M120 120Q180 116 204 74Q158 78 120 120Z" />
        <path d="M120 120Q64 136 22 116Q72 104 120 120Z" />
        <path d="M120 120Q176 136 218 116Q168 104 120 120Z" />
        <path d="M30 140Q75 132 120 140T210 140M60 152Q90 147 120 152T180 152" />
      </>
    ),
  },
  // Paisley (kairi) with an inner echo and a seed row
  paisley: {
    viewBox: '0 0 180 220',
    body: () => (
      <>
        <path d="M120 16Q150 40 130 70Q170 110 150 160Q126 210 74 204Q22 196 22 140Q24 92 70 76Q104 66 112 44Q116 30 120 16Z" />
        <path d="M112 72Q140 104 128 148Q112 186 76 182Q42 176 44 140Q48 106 82 98Q104 92 112 72Z" />
        <path d="M86 116Q108 118 106 140Q102 160 82 158Q64 154 66 136Q70 118 86 116Z" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = -0.9 + i * 0.42;
          return <circle key={i} cx={r2(88 + Math.cos(a) * 64)} cy={r2(140 + Math.sin(a) * 64)} r="2.5" />;
        })}
      </>
    ),
  },
  rosette: { viewBox: '0 0 200 200', body: rosette },
  // Chandelier: canopy, chain, two tiers of arms with candles and hanging drops (echoes the lobby photos)
  chandelier: {
    viewBox: '0 0 220 240',
    body: () => (
      <>
        <path d="M94 6H126M100 6Q110 18 120 6" />
        <path d="M110 14V46" />
        <circle cx="110" cy="52" r="6" />
        <path d="M110 58V96" />
        <path d="M110 96Q60 96 34 70M110 96Q160 96 186 70M110 96Q80 120 58 112M110 96Q140 120 162 112" />
        <path d="M110 130Q70 150 46 140M110 130Q150 150 174 140M110 96V170" />
        {[34, 58, 162, 186, 46, 174].map((x, i) => {
          const y = [70, 112, 112, 70, 140, 140][i];
          return (
            <g key={x}>
              <path d={`M${x - 7} ${y}H${x + 7}M${x - 4} ${y}V${y - 14}H${x + 4}V${y}M${x} ${y - 14}Q${x - 4} ${y - 20} ${x} ${y - 26}Q${x + 4} ${y - 20} ${x} ${y - 14}`} />
              <path d={`M${x} ${y}V${y + 14}`} />
              <path d={`M${x} ${y + 14}L${x - 4} ${y + 22}L${x} ${y + 30}L${x + 4} ${y + 22}Z`} />
            </g>
          );
        })}
        <path d="M110 170L102 186L110 206L118 186Z" />
        <path d="M84 150V164M136 150V164M96 160V172M124 160V172" />
      </>
    ),
  },
};

/**
 * One background motif. Position and size it with className (e.g. "absolute -right-24 top-10 w-80");
 * the parent needs `relative overflow-hidden` and its content `relative`.
 */
export default function Doodle({ name, className = '' }: { name: DoodleName; className?: string }) {
  const s = shapes[name];
  return (
    <svg
      viewBox={s.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`doodle reveal pointer-events-none select-none text-brass/[0.13] ${className}`}
    >
      {s.body()}
    </svg>
  );
}
