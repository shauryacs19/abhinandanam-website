import { Star } from 'lucide-react';

export default function Stars({ count, className = '' }: { count?: number; className?: string }) {
  if (!count) return null;
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${count}-star hotel`} role="img">
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      ))}
    </span>
  );
}
