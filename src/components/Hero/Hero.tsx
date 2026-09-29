import { useEffect, useRef } from 'react';
import { href, useLang, useT } from '@/hooks/useLang';
import { Button } from '@/components/ui/Button';
import { ArrowIcon, BrandMark } from '@/components/ui/ArrowIcon';
import s from './Hero.module.css';

export function Hero() {
  const lang = useLang();
  const { t } = useT(['home', 'common']);
  const visual = useRef<HTMLDivElement>(null);

  // Pointer parallax on the visual layers (desktop only, GPU transforms).
  useEffect(() => {
    const root = visual.current;
    if (!root || !window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]'));
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, running = false;
    const loop = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      for (const l of layers) {
        const d = Number(l.dataset.depth);
        l.style.translate = `${cx * d}px ${cy * d}px`;
      }
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const move = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.grid} aria-hidden="true" />
      <div className={`container ${s.inner}`}>
        <div className={s.copy}>
          <p className={`t-caption ${s.eyebrow}`}>{t('hero.eyebrow')}</p>
          <h1 id="hero-title" className={`t-display ${s.title}`}>
            <span className={s.line}><span>{t('hero.titleA')}</span></span>
            <span className={s.line}><span>{t('hero.titleB')} <span className={s.mark}><ArrowIcon size={40} /></span></span></span>
            <span className={s.line}><span className={s.accent}>{t('hero.titleC')}</span></span>
          </h1>
          <p className={`t-lead ${s.lead}`}>{t('hero.lead')}</p>
          <div className={s.ctas}>
            <Button href="#contact">{t('common:cta.discuss')}</Button>
            <Button to={href(lang, 'projects')} variant="secondary">{t('common:cta.viewProjects')}</Button>
          </div>
        </div>

        <div className={s.visual} ref={visual} aria-hidden="true">
          <div className={s.browser} data-depth="6">
            <div className={s.bar}><i /><i /><i /><span>{t('hero.visual.browser')}</span></div>
            <div className={s.page}>
              <div className={s.pageHero}>
                <div className={s.sk} style={{ width: '38%' }} />
                <div className={s.skBig} />
                <div className={s.skBig} style={{ width: '62%' }} />
                <div className={s.skBtn} />
              </div>
              <div className={s.tiles}><span /><span /><span /></div>
            </div>
          </div>
          <div className={s.square} data-depth="-14"><BrandMark size={120} /></div>
          <div className={s.metric} data-depth="12">
            <p className={s.metricTitle}>{t('hero.visual.metric')}</p>
            <svg viewBox="0 0 220 80" className={s.chart}>
              <defs>
                <linearGradient id="hero-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#59ADFF" stopOpacity=".35" /><stop offset="1" stopColor="#59ADFF" stopOpacity="0" /></linearGradient>
              </defs>
              <path d="M0 70 L30 62 L60 64 L90 48 L120 52 L150 32 L180 26 L220 8 L220 80 L0 80Z" fill="url(#hero-g)" />
              <path className={s.chartLine} d="M0 70 L30 62 L60 64 L90 48 L120 52 L150 32 L180 26 L220 8" fill="none" stroke="#59ADFF" strokeWidth="3" strokeLinejoin="round" />
            </svg>
            <p className={s.metricNote}>{t('hero.visual.metricNote')}</p>
          </div>
          <div className={s.chip} data-depth="-8">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 1l11 6-5 1.5L5.5 14z" fill="#000" /></svg>
            {t('hero.visual.badge')}
          </div>
          <div className={s.code} data-depth="9">
            <span className={s.c1}>&lt;</span><span className={s.c2}>{t('hero.visual.code')}</span><span className={s.c1}> /&gt;</span>
          </div>
        </div>
      </div>
      <a href="#trust" className={s.scroll}><span>{t('hero.scroll')}</span><i /></a>
    </section>
  );
}
