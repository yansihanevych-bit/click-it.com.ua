import { Seo } from '@/seo/Seo';
import { absUrl } from '@/seo/head';
import { breadcrumbSchema, organizationSchema } from '@/seo/schema';
import { SITE } from '@/config/site';
import { href, useLang, useT } from '@/hooks/useLang';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactForm } from '@/components/ContactForm/ContactForm';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import s from './Contacts.module.css';

export default function ContactsPage() {
  const lang = useLang();
  const { t } = useT(['pages', 'common']);
  const address = `${SITE.address.locality[lang]}, ${SITE.address.streetAddress[lang]}`;
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Харків, вул. Нетечинська, 25')}`;
  return (
    <>
      <Seo
        lang={lang}
        path="contacts"
        title={t('contacts.metaTitle')}
        description={t('contacts.metaDescription')}
        jsonLd={[
          organizationSchema(lang, t('contacts.metaDescription')),
          breadcrumbSchema([
            { name: t('common:breadcrumbs.home'), url: absUrl(lang, '') },
            { name: t('contacts.h1'), url: absUrl(lang, 'contacts') },
          ]),
        ]}
      />
      <section id="contact" className={s.page}>
        <div className={`container ${s.inner}`}>
          <div className={s.info}>
            <Breadcrumbs items={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('contacts.h1') }]} />
            <h1 className="t-h1">{t('contacts.h1')}</h1>
            <p className="t-lead">{t('contacts.lead')}</p>
            <dl className={s.list}>
              <div>
                <dt className="t-caption">{t('contacts.phone')}</dt>
                <dd>{SITE.phones.map((p) => <a key={p.href} href={`tel:${p.href}`}>{p.display}</a>)}</dd>
              </div>
              <div>
                <dt className="t-caption">{t('contacts.email')}</dt>
                <dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd>
              </div>
              <div>
                <dt className="t-caption">{t('contacts.address')}</dt>
                <dd>
                  <address>{address}</address>
                  <a href={map} target="_blank" rel="noopener noreferrer" className={s.map}>{t('contacts.map')} <ArrowIcon size={10} /></a>
                </dd>
              </div>
            </dl>
          </div>
          <div className={s.card}>
            <h2 className="t-h3">{t('common:form.title')}</h2>
            <p className={s.cardLead}>{t('common:form.lead')}</p>
            <ContactForm idPrefix="contacts" />
          </div>
        </div>
      </section>
    </>
  );
}
