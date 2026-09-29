import { Seo } from '@/seo/Seo';
import { href, useLang, useT } from '@/hooks/useLang';
import { PageHero } from '@/components/PageHero/PageHero';
import { Button } from '@/components/ui/Button';
import { CtaSection } from '@/components/CTA/CtaSection';
import s from './Blog.module.css';

/**
 * Temporary blog page until articles are migrated (see src/data/blog.ts for the legacy list).
 * noindex + excluded from sitemap, so a thin page never reaches the search index.
 */
export default function BlogPage() {
  const lang = useLang();
  const { t } = useT(['pages', 'common']);
  const topics = t('blog.topics', { returnObjects: true }) as string[];
  return (
    <>
      <Seo lang={lang} path="blog" title={t('blog.metaTitle')} description={t('blog.metaDescription')} noindex />
      <PageHero crumbs={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('blog.h1') }]} title={t('blog.h1')} lead={t('blog.lead')} />
      <section className={s.wrap}>
        <div className="container">
          <div className={s.panel} data-reveal>
            <div className={s.copy}>
              <h2 className="t-h2">{t('blog.placeholderTitle')}</h2>
              <p className="t-lead">{t('blog.placeholderText')}</p>
              <Button href="#contact">{t('common:cta.discuss')}</Button>
            </div>
            <div className={s.topics}>
              <p className={`t-caption ${s.label}`}>{t('blog.topicsLabel')}</p>
              <ul>{topics.map((x, i) => <li key={x}><span>{String(i + 1).padStart(2, '0')}</span>{x}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
