import Divider from './Divider';

type Props = { eyebrow?: string; title: string; intro?: string; align?: 'left' | 'center'; id?: string; className?: string; /** 'dark' for emerald (bg-deep) sections */ tone?: 'light' | 'dark' };

export default function SectionHeading({ eyebrow, title, intro, align = 'center', id, className = '', tone = 'light' }: Props) {
  const dark = tone === 'dark';
  const center = align === 'center';
  return (
    <div className={`reveal ${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <p className={`eyebrow ${dark ? '!text-brass' : ''}`}>{eyebrow}</p>}
      <h2 id={id} className={`h-section mt-3 ${dark ? '!text-ink' : ''}`}>
        {title}
      </h2>
      <Divider className={`mt-4 ${center ? 'mx-auto' : ''}`} />
      {intro && <p className={`mt-5 text-[17px] ${dark ? 'text-ink/75' : 'text-muted'}`}>{intro}</p>}
    </div>
  );
}
