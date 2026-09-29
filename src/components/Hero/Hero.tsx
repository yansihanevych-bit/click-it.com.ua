import { useEffect, useRef } from 'react';
import { href, useLang, useT } from '@/hooks/useLang';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/components/ui/ArrowIcon';
import { SplitText } from '@/components/ui/SplitText';
import s from './Hero.module.css';

/**
 * Hero: oversized headline (who/what/why) + layered composition of real project screenshots.
 * Load sequence (CSS only, ~1s): background → header → eyebrow → headline → lead → CTA → visuals.
 * Pointer parallax: background 2px, middle 5px, foreground 10px (desktop only).
 */
export function Hero() {
  const lang = useLang();
  const { t } = useT(['home', 'common']);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia('(pointer: fine) and (min-width: 1025px) and (prefers-reduced-motion: no-preference)').matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]'));
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      for (const l of layers) {
        const d = Number(l.dataset.depth);
        l.style.translate = `${(cx * d).toFixed(2)}px ${(cy * d).toFixed(2)}px`;
      }
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -2;
      ty = (e.clientY / window.innerHeight - 0.5) * -2;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className={s.hero} ref={root} aria-labelledby="hero-title">
      <div className={s.bg} data-depth="2" aria-hidden="true">
        <div className={s.grid} />
        <div className={s.glow} />
      </div>

      <div className={`container ${s.inner}`}>
        <p className={`t-caption ${s.eyebrow}`}>
          <span className={s.dot} />
          {t('hero.eyebrow')}
        </p>

        <SplitText
          as="h1"
          id="hero-title"
          trigger="load"
          delay={260}
          className={s.title}
          lines={[t('hero.titleA'), t('hero.titleB'), t('hero.titleC')]}
          accentLine={2}
        />

        <div className={s.bottom}>
          <div className={s.copy}>
            <p className={`t-lead ${s.lead}`}>{t('hero.lead')}</p>
            <div className={s.ctas}>
              <Button href="#contact">{t('common:cta.discuss')}</Button>
              <Button to={href(lang, 'projects')} variant="secondary">{t('common:cta.viewProjects')}</Button>
            </div>
          </div>

          <div className={s.visual} aria-hidden="true">
            <div className={s.layer} data-depth="2">
              <div className={s.frameOutline} />
            </div>
            <div className={s.layer} data-depth="5">
              <figure className={`${s.win} ${s.winBack}`}>
                <div className={s.bar}><i /><i /><i /></div>
                <img src="/images/projects/oseque-640.webp" alt="" width={640} height={455} loading="eager" decoding="async" fetchPriority="low" />
              </figure>
              <figure className={`${s.win} ${s.winFront}`}>
                <div className={s.bar}><i /><i /><i /><span>{t('hero.visual.browser')}</span></div>
                <img src="/images/projects/avangard-640.webp" alt="" width={640} height={455} loading="eager" decoding="async" fetchPriority="low" />
              </figure>
            </div>
            <div className={s.layer} data-depth="10">
              <div className={s.mark}><BrandMark size={112} /></div>
              <div className={s.metric}>
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
              <div className={s.chip}>
                <svg width="14" height="14" viewBox="0 0 16 16"><path d="M2 1l11 6-5 1.5L5.5 14z" fill="#000" /></svg>
                {t('hero.visual.badge')}
              </div>
              <div className={s.code}><span>&lt;</span>{t('hero.visual.code')}<span> /&gt;</span></div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
