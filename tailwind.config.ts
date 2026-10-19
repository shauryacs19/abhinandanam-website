import type { Config } from 'tailwindcss';

// Colours come from CSS variables in app/globals.css (taken from the brochures).
// Contrast rule: `copper` only for large display text; use `copper-dark` for small text and buttons.
const c = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.ts', './lib/**/*.ts'],
  theme: {
    extend: {
      colors: {
        cream: c('cream'),
        sand: c('sand'),
        copper: { DEFAULT: c('copper'), dark: c('copper-dark'), deep: c('copper-deep') },
        teal: { DEFAULT: c('teal'), dark: c('teal-dark') },
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
        card: '0 1px 2px rgb(43 36 32 / 0.06), 0 8px 24px -12px rgb(43 36 32 / 0.18)',
        lift: '0 2px 4px rgb(43 36 32 / 0.08), 0 16px 40px -16px rgb(43 36 32 / 0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
