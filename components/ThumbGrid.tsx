'use client';

import { useState } from 'react';
import Img from './Img';
import Lightbox, { type LightboxImage } from './Lightbox';

/** Small square thumbnails (first `limit`) + "view all" tile; opens the lightbox. */
export default function ThumbGrid({ images, limit = 8, title, className = 'grid-cols-2 sm:grid-cols-4' }: { images: LightboxImage[]; limit?: number; title: string; className?: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const shown = images.slice(0, limit);
  const rest = images.length - shown.length;
  return (
    <>
      <ul className={`grid gap-2 ${className}`}>
        {shown.map((img, i) => {
          const isLastWithMore = rest > 0 && i === shown.length - 1;
          return (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setOpenAt(i)}
                className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-sand"
                aria-label={isLastWithMore ? `+${rest + 1} photos: view all ${images.length}` : `Open photo: ${img.alt}`}
              >
                <Img src={img.src} alt="" sizes="(min-width: 640px) 200px, 45vw" className="h-full w-full object-cover transition-opacity group-hover:opacity-85" />
                {isLastWithMore && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/60 font-serif text-2xl font-semibold text-white">+{rest + 1} photos</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <Lightbox images={images} openAt={openAt} onClose={() => setOpenAt(null)} title={title} />
    </>
  );
}
