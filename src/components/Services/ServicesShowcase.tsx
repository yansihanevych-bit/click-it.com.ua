import { useState } from 'react';
import { Link } from 'react-router';
import { SERVICE_GROUPS, servicesByGroup } from '@/data/services';
import { href, useLang, useT } from '@/hooks/useLang';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { GroupVisual } from './GroupVisual';
import s from './Services.module.css';

export function ServicesShowcase({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h1' }) {
  const lang = useLang();
  const { t } = useT(['home', 'common', 'services']);
  const [active, setActive] = useState(0);
  return (
    <section className="section" aria-labelledby="services-title" id="services">
      <div className="container">
        <SectionHeader as={headingLevel} id="services-title" eyebrow={t('services.eyebrow')} title={t('services.title')} lead={t('services.lead')} split />
        <div className={s.panels}>
          {SERVICE_GROUPS.map((g, i) => (
            <article
              key={g}
              className={[s.panel, active === i && s.active].filter(Boolean).join(' ')}
              onPointerEnter={() => setActive(i)}
              onFocusCapture={() => setActive(i)}
              data-reveal
              style={{ ['--reveal-i' as string]: i }}
            >
              <div className={s.panelTop}>
                <span className={s.num}>0{i + 1}</span>
                <h3 className={`t-h3 ${s.panelTitle}`}>{t(`services.groups.${g}.title`)}</h3>
              </div>
              <div className={s.art} data-cursor="explore"><GroupVisual group={g} /></div>
              <div className={s.body}>
                <p className={s.text}>{t(`services.groups.${g}.text`)}</p>
                <ul className={s.list}>
                  {servicesByGroup(g).map((svc) => (
                    <li key={svc.slug}>
                      <Link to={href(lang, 'services', svc.slug)}>
                        {t(`services:items.${svc.slug}.name`)}
                        <ArrowIcon size={10} />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={`${href(lang, 'services')}#${g}`} className={s.explore}>
                  <span className={s.exploreIcon}><ArrowIcon size={12} /></span>
                  {t('common:cta.explore')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
