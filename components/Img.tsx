import { imageInfo } from '@/lib/images';

type Props = {
  src: string;
  alt: string;
  /** e.g. "(min-width: 1024px) 50vw, 100vw" */
  sizes?: string;
  className?: string;
  /** true for the LCP image only */
  priority?: boolean;
};

/** Plain <img> with intrinsic size + 400w/800w/full srcset (static export, no image server). */
export default function Img({ src, alt, sizes = '100vw', className, priority }: Props) {
  const info = imageInfo(src);
  return (
    <img
      src={info.defaultSrc}
      srcSet={info.srcSet}
      sizes={info.srcSet ? sizes : undefined}
      width={info.width}
      height={info.height}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? undefined : 'async'} // sync decode would hold the whole first paint for the hero
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}
