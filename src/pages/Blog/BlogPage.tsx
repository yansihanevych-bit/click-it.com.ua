import { Seo } from '@/seo/Seo';
import { absUrl } from '@/seo/head';
import { breadcrumbSchema } from '@/seo/schema';
import { POSTS } from '@/data/blog';
import { getLanguage } from '@/config/languages';
import { href, useLang, useT } from '@/hooks/useLang';
import { PageHero } from '@/components/PageHero/PageHero';
import { CtaSection } from '@/components/CTA/CtaSection';
import s from './Blog.module.css';

export default function BlogPage() {
  const lang = useLang();
  const { t } = useT(['pages', 'common']);
  const fmt = new Intl.DateTimeFormat(getLanguage(lang).htmlLang, { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return (
    <>
      <Seo
        lang={lang}
        path="blog"
        title={t('blog.metaTitle')}
        description={t('blog.metaDescription')}
        jsonLd={[breadcrumbSchema([
          { name: t('common:breadcrumbs.home'), url: absUrl(lang, '') },
          { name: t('blog.h1'), url: absUrl(lang, 'blog') },
        ])]}
      />
      <PageHero crumbs={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('blog.h1') }]} title={t('blog.h1')} lead={t('blog.lead')} />
      <section className={s.wrap} aria-label={t('blog.h1')}>
        <div className="container">
          <p className={s.notice} role="note">{t('blog.soon')}</p>
          <ul className={s.grid}>
            {POSTS.map((p, i) => (
              <li key={p.slug} className={s.card} data-reveal style={{ ['--reveal-i' as string]: i % 3 }}>
                <div className={s.meta}>
                  <span>{t('blog.category')}</span>
                  <time dateTime={p.date}>{fmt.format(new Date(p.date))}</time>
                </div>
                <h2 className={s.title}>{t(`blog.posts.${p.slug}`)}</h2>
                <span className={s.n} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
