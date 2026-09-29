import { SITE } from '@/config/site';
import { useT } from '@/hooks/useLang';
import { ContactForm } from '@/components/ContactForm/ContactForm';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import s from './CtaSection.module.css';

export function CtaSection() {
  const { t } = useT(['home', 'common']);
  return (
    <section id="contact" className={s.cta} aria-labelledby="cta-title">
      <div className={`container ${s.inner}`}>
        <div className={s.copy}>
          <h2 id="cta-title" className={`t-h1 ${s.title}`}>
            <span data-reveal>{t('cta.titleA')}</span>
            <span data-reveal style={{ ['--reveal-i' as string]: 1 }}>{t('cta.titleB')}</span>
          </h2>
          <p className={s.lead} data-reveal>{t('cta.lead')}</p>
          <ul className={s.contacts} data-reveal>
            {SITE.phones.map((p) => <li key={p.href}><a href={`tel:${p.href}`}>{p.display}</a></li>)}
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
          <span className={s.deco} aria-hidden="true"><ArrowIcon size={160} /></span>
        </div>
        <div className={s.card} data-reveal="scale">
          <h3 className="t-h3">{t('common:form.title')}</h3>
          <p className={s.cardLead}>{t('common:form.lead')}</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
