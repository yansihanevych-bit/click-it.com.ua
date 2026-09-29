import { Seo } from '@/seo/Seo';
import { href, useLang, useT } from '@/hooks/useLang';
import { PageHero } from '@/components/PageHero/PageHero';

export default function PrivacyPage() {
  const lang = useLang();
  const { t } = useT(['pages', 'common']);
  const sections = t('privacy.sections', { returnObjects: true }) as { title: string; text: string }[];
  return (
    <>
      <Seo lang={lang} path="privacy" title={t('privacy.metaTitle')} description={t('privacy.metaDescription')} />
      <PageHero crumbs={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('privacy.h1') }]} title={t('privacy.h1')} lead={t('privacy.updated')} />
      <section style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="container" style={{ maxWidth: '56rem', marginInline: 'auto', display: 'grid', gap: 'var(--space-7)' }}>
          {sections.map((sec, i) => (
            <article key={i} style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <h2 className="t-h3">{i + 1}. {sec.title}</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>{sec.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
