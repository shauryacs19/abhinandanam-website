/** Lazy Google Maps iframe (no API key; loads only when scrolled near). */
export default function MapEmbed({ src, title, className = '' }: { src: string; title: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-lg border border-gold/25 bg-sand ${className}`}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="map-dark h-full min-h-[320px] w-full border-0"
        allowFullScreen
      />
    </div>
  );
}
