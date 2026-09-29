import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { SERVICE_GROUPS, servicesByGroup, type ServiceGroup } from '@/data/services';
import { href, useLang, useT } from '@/hooks/useLang';
import { SplitText } from '@/components/ui/SplitText';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { ServicePreview } from './ServicePreview';
import s from './Services.module.css';

/**
 * Three large directions (accordion). Hover/focus/click opens a direction:
 * background switches to black, the number slides, the service list unfolds,
 * and hovering a service swaps the live preview on the right.
 */
export function ServicesShowcase() {
  const lang = useLang();
  const { t } = useT(['home', 'common', 'services']);
  const [open, setOpenState] = useState<ServiceGroup>('development');
  const hoverTimer = useRef<number>(undefined);

  /** Open a direction while keeping its header visually in place (compensates the collapse above it). */
  const setOpen = (g: ServiceGroup, anchor?: HTMLElement | null) => {
    if (g === open) return;
    setOpenState(g);
    if (!anchor || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = anchor.getBoundingClientRect().top;
    const t0 = performance.now();
    const tick = () => {
      const d = anchor.getBoundingClientRect().top - start;
      if (Math.abs(d) > 0.5) window.scrollBy(0, d);
      if (performance.now() - t0 < 900) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const hoverOpen = (g: ServiceGroup, el: HTMLElement) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(g, el), 220); // intent delay: no flicker when passing over
  };
  const [active, setActive] = useState<Record<ServiceGroup, string>>({
    development: servicesByGroup('development')[0].slug,
    marketing: servicesByGroup('marketing')[0].slug,
    design: servicesByGroup('design')[0].slug,
  });

  return (
    <section className={`section ${s.section}`} aria-labelledby="services-title" id="services">
      <div className="container">
        <header className={s.head}>
          <div>
            <p className={`t-caption ${s.eyebrow}`}>{t('services.eyebrow')}</p>
            <SplitText id="services-title" className="t-mega" lines={t('services.titleLines', { returnObjects: true }) as string[]} />
          </div>
          <p className={`t-lead ${s.lead}`} data-reveal>{t('services.lead')}</p>
        </header>

        <div className={s.list}>
          {SERVICE_GROUPS.map((g, gi) => {
            const isOpen = open === g;
            const items = servicesByGroup(g);
            return (
              <article key={g} className={[s.cat, isOpen && s.open].filter(Boolean).join(' ')} onPointerEnter={(e) => e.pointerType === 'mouse' && hoverOpen(g, e.currentTarget)}
                onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
              >
                <h3 className={s.catH}>
                  <button type="button" className={s.catHead} aria-expanded={isOpen} aria-controls={`cat-${g}`} onClick={(e) => setOpen(g, e.currentTarget)}>
                    <span className={s.num}>0{gi + 1}</span>
                    <span className={s.catTitle}>{t(`services.groups.${g}.title`)}</span>
                    <span className={s.count}>({String(items.length).padStart(2, '0')})</span>
                    <span className={s.catArrow} aria-hidden="true"><ArrowIcon size={16} /></span>
                  </button>
                </h3>
                <div id={`cat-${g}`} className={s.body} inert={!isOpen}>
                  <div className={s.bodyInner}>
                    <div className={s.col}>
                      <p className={s.text}>{t(`services.groups.${g}.text`)}</p>
                      <ol className={s.items}>
                        {items.map((svc, i) => (
                          <li key={svc.slug}>
                            <Link
                              to={href(lang, 'services', svc.slug)}
                              className={[s.item, active[g] === svc.slug && s.itemOn].filter(Boolean).join(' ')}
                              onPointerEnter={() => setActive((a) => ({ ...a, [g]: svc.slug }))}
                              onFocus={() => setActive((a) => ({ ...a, [g]: svc.slug }))}
                            >
                              <span className={s.itemN}>{String(i + 1).padStart(2, '0')}</span>
                              <span className={s.itemName}>{t(`services:items.${svc.slug}.name`)}</span>
                              <span className={s.itemArrow} aria-hidden="true"><ArrowIcon size={12} /></span>
                            </Link>
                          </li>
                        ))}
                      </ol>
                      <Link to={`${href(lang, 'services')}#${g}`} className={s.all}>{t('common:cta.explore')} <ArrowIcon size={11} /></Link>
                    </div>
                    <div className={s.stage} aria-hidden="true" data-cursor="explore">
                      {isOpen && <ServicePreview key={active[g]} slug={active[g]} />}
                      <p className={s.hint}>{t(`services:items.${active[g]}.short`)}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
