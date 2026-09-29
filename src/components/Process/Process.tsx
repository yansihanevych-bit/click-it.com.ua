import { useRef } from 'react';
import { LazyMotion, domAnimation, m, useScroll, useSpring } from 'motion/react';
import { useT } from '@/hooks/useLang';
import { SectionHeader } from '@/components/ui/SectionHeader';
import s from './Process.module.css';

/** Timeline whose progress line fills while the section scrolls through the viewport. */
export function Process() {
  const { t } = useT('home');
  const items = t('process.items', { returnObjects: true }) as { title: string; text: string }[];
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section className="section" aria-labelledby="process-title">
      <div className={`container ${s.inner}`}>
        <div className={s.head}>
          <SectionHeader id="process-title" eyebrow={t('process.eyebrow')} title={t('process.title')} lead={t('process.lead')} />
        </div>
        <LazyMotion features={domAnimation} strict>
          <ol className={s.timeline} ref={ref}>
            <span className={s.track} aria-hidden="true"><m.span className={s.fill} style={{ scaleY }} /></span>
            {items.map((it, i) => (
              <li key={i} className={s.step} data-reveal style={{ ['--reveal-i' as string]: 0 }}>
                <span className={s.dot} aria-hidden="true" />
                <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="t-h3">{it.title}</h3>
                  <p className={s.text}>{it.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </LazyMotion>
      </div>
    </section>
  );
}
