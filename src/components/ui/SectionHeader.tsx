import type { ReactNode } from 'react';
import s from './SectionHeader.module.css';

interface Props { eyebrow?: string; title: ReactNode; lead?: string; id?: string; as?: 'h1' | 'h2'; split?: boolean; dark?: boolean; titleClass?: string }

export function SectionHeader({ eyebrow, title, lead, id, as: H = 'h2', split, dark, titleClass }: Props) {
  return (
    <header className={[s.wrap, split && s.split, dark && s.dark].filter(Boolean).join(' ')}>
      <div>
        {eyebrow && <p className={`t-caption ${s.eyebrow}`}><span className="chapter" aria-hidden="true" />{eyebrow}</p>}
        <H id={id} className={titleClass || (H === 'h1' ? 't-h1' : 't-h2')} data-reveal style={{ marginTop: eyebrow ? 'var(--space-4)' : 0 }}>
          {title}
        </H>
      </div>
      {lead && <p className={`t-lead ${s.lead}`} data-reveal style={{ ['--reveal-i' as string]: 1 }}>{lead}</p>}
    </header>
  );
}
