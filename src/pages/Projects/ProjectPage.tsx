import { Link, useParams } from 'react-router';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import { Seo } from '@/seo/Seo';
import { absUrl } from '@/seo/head';
import { breadcrumbSchema, creativeWorkSchema } from '@/seo/schema';
import { SITE_URL } from '@/config/site';
import { getLanguage } from '@/config/languages';
import { PROJECTS, getProject } from '@/data/projects';
import { href, useLang, useT } from '@/hooks/useLang';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Picture } from '@/components/ui/Picture';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { CtaSection } from '@/components/CTA/CtaSection';
import s from './Projects.module.css';

export default function ProjectPage() {
  const { slug = '' } = useParams();
  const lang = useLang();
  const { t } = useT(['projects', 'common']);
  const p = getProject(slug);
  if (!p) return <NotFoundPage />;
  const idx = PROJECTS.indexOf(p);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const name = t(`items.${slug}.name`);
  const summary = t(`items.${slug}.summary`);
  const description = t(`items.${slug}.description`);
  const path = `projects/${slug}`;
  const rawMeta = description.length < 110 ? `${description} ${t('labels.metaSuffix')}` : description;
  const metaDescription = rawMeta.length > 160 ? rawMeta.slice(0, 157).replace(/\s+\S*$/, '') + '…' : rawMeta;
  const ogImage = `/og/projects/${p.image}.jpg`;

  return (
    <>
      <Seo
        lang={lang}
        path={path}
        title={`${name} — ${summary.replace(/\.$/, '')} | Click IT`}
        description={metaDescription}
        image={ogImage}
        imageAlt={name}
        jsonLd={[
          creativeWorkSchema({ name, description, url: absUrl(lang, path), image: SITE_URL + ogImage, inLanguage: getLanguage(lang).hreflang }),
          breadcrumbSchema([
            { name: t('common:breadcrumbs.home'), url: absUrl(lang, '') },
            { name: t('index.h1'), url: absUrl(lang, 'projects') },
            { name, url: absUrl(lang, path) },
          ]),
        ]}
      />
      <section style={{ paddingTop: 'clamp(2rem, 1rem + 4vw, 5rem)' }}>
        <div className="container">
          <Breadcrumbs items={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('index.h1'), to: href(lang, 'projects') }, { name }]} />
          <div className={s.head}>
            <div>
              <p className="t-caption" style={{ color: 'var(--color-text-secondary)' }}>{t(`industries.${p.industry}`)}</p>
              <h1 className="t-display" style={{ marginTop: 'var(--space-3)' }}>{name}</h1>
            </div>
            <dl className={s.metaList}>
              <dt>{t('labels.client')}</dt><dd>{name}</dd>
              <dt>{t('labels.industry')}</dt><dd>{t(`industries.${p.industry}`)}</dd>
            </dl>
          </div>
          <div className={s.cover} style={{ marginTop: 'clamp(2rem, 1rem + 3vw, 4rem)', viewTransitionName: `project-${p.slug}` }}>
            <Picture name={p.image} alt={`${name} — ${summary}`} ratio={p.ratio} sizes="(max-width: 1440px) 100vw, 1344px" priority />
          </div>
          <div className={s.body}>
            <h2 className="t-caption">{t('labels.about')}</h2>
            <div>
              <p className={s.desc} data-reveal>{description}</p>
              <ul className={s.tags} aria-label={t('labels.services')}>
                {p.work.map((w) => <li key={w}>{t(`work.${w}`)}</li>)}
              </ul>
            </div>
          </div>
          {p.gallery.length > 0 && (
            <div className={s.gallery}>
              <h2 className="visually-hidden">{t('labels.gallery')}</h2>
              {p.gallery.map((g) => (
                <figure key={g} data-reveal="scale"><Picture name={g} alt={`${name} — ${t('labels.gallery')}`} ratio={p.ratio} sizes="100vw" /></figure>
              ))}
            </div>
          )}
          <Link to={href(lang, 'projects', next.slug)} viewTransition className={`${s.next} ${s.nextLink}`} data-cursor="view">
            <div>
              <p className="t-caption">{t('labels.next')}</p>
              <span className={s.nextName}>{t(`items.${next.slug}.name`)} <ArrowIcon /></span>
            </div>
            <div className={s.nextThumb}><Picture name={next.image} alt="" ratio={next.ratio} sizes="420px" /></div>
          </Link>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
