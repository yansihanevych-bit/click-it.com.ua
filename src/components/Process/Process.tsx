import { useEffect, useRef, useState } from 'react';
import { useT } from '@/hooks/useLang';
import { SectionHeader } from '@/components/ui/SectionHeader';
import s from './Process.module.css';

/** Timeline whose progress line fills while the section scrolls through the viewport. */
export function Process() {
  const { t } = useT('home');
  const items = t('process.items', { returnObjects: true }) as { title: string; text: string }[];
  const ref = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(-1);

  useEffect(() => {
    if (!ref.current || !fill.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setProgress(1); return; }
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import('./processScroll').then(({ attachProcessLine }) => {
      if (cancelled || !ref.current || !fill.current) return;
      cleanup = attachProcessLine(fill.current, ref.current, setProgress);
    });
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  const reached = (i: number) => progress >= 0 && progress >= i / Math.max(1, items.length - 1) - 0.02;

  return (
    <section className="section sheet sheet-white" aria-labelledby="process-title">
      <div className={`container ${s.inner}`}>
        <div className={s.head}>
          <SectionHeader id="process-title" eyebrow={t('process.eyebrow')} title={t('process.title')} lead={t('process.lead')} />
        </div>
        <ol className={s.timeline} ref={ref}>
          <span className={s.track} aria-hidden="true"><span ref={fill} className={s.fill} /></span>
          {items.map((it, i) => (
            <li key={i} className={[s.step, reached(i) && s.reached].filter(Boolean).join(' ')}>
              <span className={s.dot} aria-hidden="true" />
              {/* data-reveal lives on a child whose className React never rewrites (keeps the observer's is-in class) */}
              <div className={s.stepBody} data-reveal>
                <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="t-h3">{it.title}</h3>
                  <p className={s.text}>{it.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
