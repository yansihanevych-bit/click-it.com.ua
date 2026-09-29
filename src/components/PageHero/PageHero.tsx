import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import s from './PageHero.module.css';

export function PageHero({ crumbs, title, lead, eyebrow, children }: { crumbs: Crumb[]; title: string; lead?: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <section className={s.hero}>
      <div className={s.bg} aria-hidden="true" />
      <div className="container">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className={`t-caption ${s.eyebrow}`}>{eyebrow}</p>}
        <h1 className={`t-h1 ${s.title}`}>{title}</h1>
        {lead && <p className={`t-lead ${s.lead}`}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}
