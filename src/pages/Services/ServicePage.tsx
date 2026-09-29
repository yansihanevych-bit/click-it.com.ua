import { Link, useParams } from 'react-router';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import { Seo } from '@/seo/Seo';
import { absUrl } from '@/seo/head';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/seo/schema';
import { getService, servicesByGroup } from '@/data/services';
import { href, useLang, useT } from '@/hooks/useLang';
import { PageHero } from '@/components/PageHero/PageHero';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { ServicePreview } from '@/components/Services/ServicePreview';
import { CtaSection } from '@/components/CTA/CtaSection';
import s from './ServicePage.module.css';

export default function ServicePage() {
  const { slug = '' } = useParams();
  const lang = useLang();
  const { t } = useT(['services', 'common']);
  const svc = getService(slug);
  if (!svc) return <NotFoundPage />;
  const k = (x: string) => `items.${slug}.${x}`;
  const features = t(k('features'), { returnObjects: true }) as { title: string; text: string }[];
  const faq = t(k('faq'), { returnObjects: true }) as { q: string; a: string }[];
  const related = servicesByGroup(svc.group).filter((x) => x.slug !== slug);
  const path = `services/${slug}`;

  return (
    <>
      <Seo
        lang={lang}
        path={path}
        title={t(k('metaTitle'))}
        description={t(k('metaDescription'))}
        jsonLd={[
          serviceSchema({ name: t(k('name')), description: t(k('metaDescription')), url: absUrl(lang, path), category: t(`common:groups.${svc.group}`) }),
          breadcrumbSchema([
            { name: t('common:breadcrumbs.home'), url: absUrl(lang, '') },
            { name: t('index.h1'), url: absUrl(lang, 'services') },
            { name: t(k('name')), url: absUrl(lang, path) },
          ]),
          faqSchema(faq),
        ]}
      />
      <PageHero
        crumbs={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('index.h1'), to: href(lang, 'services') }, { name: t(k('name')) }]}
        eyebrow={t(`common:groups.${svc.group}`)}
        title={t(k('h1'))}
        lead={t(k('lead'))}
      >
        <div className={s.heroCta}><Button href="#contact">{t('common:cta.discuss')}</Button></div>
      </PageHero>

      <section className={`section ${s.features}`} aria-labelledby="features-title">
        <div className={`container ${s.featuresInner}`}>
          <div className={s.featHead}>
            <h2 id="features-title" className="t-h2" data-reveal>{t('labels.features')}</h2>
            <div className={s.stage} data-reveal="scale" aria-hidden="true"><ServicePreview slug={slug} /></div>
          </div>
          <ol className={s.featGrid}>
            {features.map((f, i) => (
              <li key={i} className={s.feat} data-reveal style={{ ['--reveal-i' as string]: i % 2 }}>
                <span className={s.fNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3">{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${s.audience}`} aria-labelledby="audience-title">
        <div className={`container ${s.audInner}`}>
          <div>
            <h2 id="audience-title" className="t-caption">{t('labels.audience')}</h2>
            <p className={s.audText} data-reveal>{t(k('audience'))}</p>
          </div>
          <div className={s.process} data-reveal>
            <h2 className="t-caption">{t('labels.process')}</h2>
            <p>{t('labels.processText')}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="sfaq-title">
        <div className={`container ${s.faqInner}`}>
          <h2 id="sfaq-title" className="t-h2" data-reveal>{t('labels.faq')}</h2>
          <Accordion items={faq} />
        </div>
      </section>

      {related.length > 0 && (
        <section className={s.related} aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title" className="t-caption">{t('labels.related')}</h2>
            <ul className={s.relList}>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={href(lang, 'services', r.slug)} className={s.rel}>
                    <span>{t(`items.${r.slug}.name`)}</span>
                    <small>{t(`items.${r.slug}.short`)}</small>
                    <ArrowIcon size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaSection />
    </>
  );
}
