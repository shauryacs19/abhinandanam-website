import type { Config } from 'tailwindcss';

// Colours come from CSS variables in app/globals.css ("forest & white" theme).
// Names are historical: cream = page green, ink = white text, gold = white CTA/lines, brass = pale jade accent.
const c = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.ts', './lib/**/*.ts'],
  theme: {
    // "Desktop" (lg) starts at tablet width, so narrower windows keep the desktop arrangement and just
    // scale down (fluid root font in globals.css) instead of re-flowing (client, 2026-10-30).
    // Phones (< 768px) still get the stacked layout.
    screens: { sm: '640px', md: '768px', lg: '768px', xl: '1280px', '2xl': '1536px' },
    extend: {
      colors: {
        cream: c('cream'),
        sand: c('sand'),
        brass: { DEFAULT: c('brass'), deep: c('brass-deep') },
        teal: { DEFAULT: c('teal'), dark: c('teal-dark') },
        deep: c('deep'),
        ink: c('ink'),
        muted: c('muted'),
        gold: c('gold-line'),
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
      borderRadius: { arch: '999px 999px 0 0' },
      boxShadow: {
        card: '0 1px 2px rgb(16 35 31 / 0.06), 0 8px 24px -12px rgb(16 35 31 / 0.18)',
        lift: '0 2px 4px rgb(16 35 31 / 0.08), 0 16px 40px -16px rgb(16 35 31 / 0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
