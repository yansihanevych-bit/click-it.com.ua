import { Link } from 'react-router';
import { Seo } from '@/seo/Seo';
import { absUrl } from '@/seo/head';
import { breadcrumbSchema } from '@/seo/schema';
import { SERVICE_GROUPS, servicesByGroup } from '@/data/services';
import { href, useLang, useT } from '@/hooks/useLang';
import { PageHero } from '@/components/PageHero/PageHero';
import { GroupVisual } from '@/components/Services/GroupVisual';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { CtaSection } from '@/components/CTA/CtaSection';
import s from './Services.module.css';

export default function ServicesPage() {
  const lang = useLang();
  const { t } = useT(['services', 'common', 'home']);
  return (
    <>
      <Seo
        lang={lang}
        path="services"
        title={t('index.metaTitle')}
        description={t('index.metaDescription')}
        jsonLd={[breadcrumbSchema([
          { name: t('common:breadcrumbs.home'), url: absUrl(lang, '') },
          { name: t('index.h1'), url: absUrl(lang, 'services') },
        ])]}
      />
      <PageHero crumbs={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('index.h1') }]} title={t('index.h1')} lead={t('index.lead')} />
      {SERVICE_GROUPS.map((g, gi) => (
        <section key={g} id={g} className={s.group} aria-labelledby={`g-${g}`}>
          <div className={`container ${s.groupInner}`}>
            <div className={s.groupHead}>
              <span className={s.gNum}>0{gi + 1}</span>
              <h2 id={`g-${g}`} className="t-h2" data-reveal>{t(`home:services.groups.${g}.title`)}</h2>
              <p className={s.gText} data-reveal>{t(`home:services.groups.${g}.text`)}</p>
              <div className={s.gVisual} data-reveal="fade"><GroupVisual group={g} /></div>
            </div>
            <ul className={s.rows}>
              {servicesByGroup(g).map((svc, i) => (
                <li key={svc.slug} data-reveal style={{ ['--reveal-i' as string]: i }}>
                  <Link to={href(lang, 'services', svc.slug)} className={s.row}>
                    <span className={s.rowName}>{t(`items.${svc.slug}.name`)}</span>
                    <span className={s.rowShort}>{t(`items.${svc.slug}.short`)}</span>
                    <span className={s.rowArrow} aria-hidden="true"><ArrowIcon size={14} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <CtaSection />
    </>
  );
}
