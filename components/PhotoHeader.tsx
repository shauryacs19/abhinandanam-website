'use client';

import { useState } from 'react';
import { Images } from 'lucide-react';
import Img from './Img';
import Lightbox, { type LightboxImage } from './Lightbox';

/** Airbnb-style 1 large + 4 small photo header. Any photo opens the full-screen lightbox. */
export default function PhotoHeader({ images, hotelName }: { images: LightboxImage[]; hotelName: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const tiles = images.slice(0, 5);
  if (!tiles.length) return null;

  return (
    <div className="relative">
      <div className="grid h-[300px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:h-[420px] lg:h-[500px]">
        {tiles.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setOpenAt(i)}
            className={`group relative overflow-hidden bg-sand ${i === 0 ? 'col-span-4 row-span-2 sm:col-span-2' : 'hidden sm:block'}`}
            aria-label={`Open photo ${i + 1} of ${images.length}: ${img.alt}${img.isRender && i === 0 ? ' (Artist’s impression)' : ''}`}
          >
            <Img
              src={img.src}
              alt=""
              priority={i === 0}
              sizes={i === 0 ? '(min-width: 640px) 50vw, 100vw' : '25vw'}
              className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-85"
            />
            {img.isRender && i === 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">Artist&rsquo;s impression</span>
            )}
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <button
          type="button"
          onClick={() => setOpenAt(0)}
          className="absolute bottom-4 right-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-cream px-4 text-sm font-semibold shadow-card hover:bg-sand"
        >
          <Images className="h-4 w-4" aria-hidden="true" /> View all {images.length} photos
        </button>
      )}
      <Lightbox images={images} openAt={openAt} onClose={() => setOpenAt(null)} title={`${hotelName} photos`} />
    </div>
  );
}
