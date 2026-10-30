/** Thin gold rule with a small diamond, our own take on the brochure line art. */
export default function Divider({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-3 w-40 text-brass ${className}`} viewBox="0 0 160 12" fill="none" aria-hidden="true">
      <path d="M0 6h68M92 6h68" stroke="currentColor" strokeWidth="1" />
      <path d="M80 1l5 5-5 5-5-5 5-5z" stroke="currentColor" strokeWidth="1" />
      <circle cx="68" cy="6" r="1.5" fill="currentColor" />
      <circle cx="92" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}
