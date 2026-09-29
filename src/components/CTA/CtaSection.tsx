import { SITE } from '@/config/site';
import { useT } from '@/hooks/useLang';
import { ContactForm } from '@/components/ContactForm/ContactForm';
import { SplitText } from '@/components/ui/SplitText';
import { BrandMark } from '@/components/ui/ArrowIcon';
import s from './CtaSection.module.css';

/** Final statement: oversized typography → contacts → form. */
export function CtaSection() {
  const { t } = useT(['home', 'common']);
  return (
    <section id="contact" className={`sheet ${s.cta}`} aria-labelledby="cta-title">
      <div className="container">
        <p className={`t-caption ${s.eyebrow}`}><span className="chapter" aria-hidden="true" />{t('cta.titleA')}</p>
        <div className={s.statementWrap}>
          <SplitText squareEnd id="cta-title" className={s.statement} lines={t('cta.statement', { returnObjects: true }) as string[]} />
          <span className={s.mark} data-parallax="0.1" aria-hidden="true"><BrandMark size={220} /></span>
        </div>
        <div className={s.inner}>
          <div className={s.copy}>
            <p className={s.lead} data-reveal>{t('cta.lead')}</p>
            <ul className={s.contacts} data-reveal>
              {SITE.phones.map((p) => <li key={p.href}><a href={`tel:${p.href}`}>{p.display}</a></li>)}
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>
          <div className={s.card} data-reveal="scale">
            <h3 className="t-h3">{t('common:form.title')}</h3>
            <p className={s.cardLead}>{t('common:form.lead')}</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
