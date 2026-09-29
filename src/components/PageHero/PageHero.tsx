import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import s from './PageHero.module.css';

export function PageHero({ crumbs, title, lead, eyebrow, children }: { crumbs: Crumb[]; title: string; lead?: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <section className={s.hero}>
      <div className={s.stamp} aria-hidden="true" data-parallax="0.12"><svg viewBox="0 0 120 120"><path d="M4.8 0V26.5H73.8L0 100.3L18.7 119.1L92.5 45.3V114.2H119.2V0H4.8Z" fill="#fff" /></svg></div>
      <div className="container">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className={`t-caption ${s.eyebrow}`}>{eyebrow}</p>}
        <h1 className={`t-h1 sq-end-h ${s.title}`}>{title}</h1>
        {lead && <p className={`t-lead ${s.lead}`}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}
