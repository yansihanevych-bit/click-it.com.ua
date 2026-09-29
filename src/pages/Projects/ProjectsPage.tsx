import { useState } from 'react';
import { Seo } from '@/seo/Seo';
import { absUrl } from '@/seo/head';
import { breadcrumbSchema } from '@/seo/schema';
import { PROJECTS } from '@/data/projects';
import { href, useLang, useT } from '@/hooks/useLang';
import { PageHero } from '@/components/PageHero/PageHero';
import { ProjectCard } from '@/components/Projects/ProjectCard';
import { CtaSection } from '@/components/CTA/CtaSection';
import s from './Projects.module.css';

export default function ProjectsPage() {
  const lang = useLang();
  const { t } = useT(['projects', 'common']);
  const industries = [...new Set(PROJECTS.map((p) => p.industry))];
  const [filter, setFilter] = useState<string | null>(null);
  const list = filter ? PROJECTS.filter((p) => p.industry === filter) : PROJECTS;
  return (
    <>
      <Seo
        lang={lang}
        path="projects"
        title={t('index.metaTitle')}
        description={t('index.metaDescription')}
        jsonLd={[breadcrumbSchema([
          { name: t('common:breadcrumbs.home'), url: absUrl(lang, '') },
          { name: t('index.h1'), url: absUrl(lang, 'projects') },
        ])]}
      />
      <PageHero crumbs={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('index.h1') }]} title={t('index.h1')} lead={t('index.lead')} />
      <section className={s.wrap} aria-label={t('index.h1')}>
        <div className="container">
          <div className={s.filters} role="group" aria-label={t('labels.filter')}>
            <button type="button" aria-pressed={!filter} onClick={() => setFilter(null)}>{t('labels.all')} <sup>{PROJECTS.length}</sup></button>
            {industries.map((ind) => (
              <button key={ind} type="button" aria-pressed={filter === ind} onClick={() => setFilter(ind)}>
                {t(`industries.${ind}`)} <sup>{PROJECTS.filter((p) => p.industry === ind).length}</sup>
              </button>
            ))}
          </div>
          <div className={s.grid}>
            {list.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} headingLevel={2} />)}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
