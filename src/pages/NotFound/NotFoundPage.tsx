import { Seo } from '@/seo/Seo';
import { href, useLang, useT } from '@/hooks/useLang';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/components/ui/ArrowIcon';

export default function NotFoundPage() {
  const lang = useLang();
  const { t } = useT(['pages', 'common']);
  return (
    <>
      <Seo lang={lang} path="404" title={t('notFound.metaTitle')} description={t('notFound.text')} noindex status={404} />
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 'var(--space-6)', justifyItems: 'start', minHeight: '50vh', alignContent: 'center' }}>
          <p className="t-display" style={{ display: 'flex', alignItems: 'center', gap: '0.15em' }} aria-hidden="true">4<BrandMark size={120} />4</p>
          <h1 className="t-h2">{t('notFound.h1')}</h1>
          <p className="t-lead" style={{ maxWidth: '36rem' }}>{t('notFound.text')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <Button to={href(lang)}>{t('common:cta.home')}</Button>
            <Button to={href(lang, 'services')} variant="secondary">{t('common:cta.allServices')}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
