import { useEffect, useRef, useState } from 'react';
import { useT } from '@/hooks/useLang';
import { SplitText } from '@/components/ui/SplitText';
import { StepVisual } from './StepVisual';
import s from './Approach.module.css';

interface Item { title: string; text: string }

/**
 * Sticky storytelling. Desktop: the left "stage" is pinned — its number, title, illustration
 * and progress change as the steps on the right pass the viewport centre. Mobile: a simple list.
 */
export function Approach() {
  const { t } = useT('home');
  const items = t('approach.items', { returnObjects: true }) as Item[];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index))),
      { rootMargin: '-48% 0px -48% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className={`section sheet ${s.approach}`} aria-labelledby="approach-title">
      <div className={`container ${s.inner}`}>
        <div className={s.sticky}>
          <p className={`t-caption ${s.eyebrow}`}>{t('approach.eyebrow')}</p>
          <SplitText id="approach-title" className={`t-h2 ${s.title}`} lines={t('approach.titleLines', { returnObjects: true }) as string[]} accentLine={1} />
          <p className={`t-lead ${s.lead}`} data-reveal>{t('approach.lead')}</p>

          <div className={s.stage} aria-hidden="true">
            <div className={s.stageTop}>
              <span className={s.stageN} key={`n${active}`}>{pad(active + 1)}</span>
              <span className={s.stageTitle} key={`t${active}`}>{items[active]?.title}</span>
            </div>
            <div className={s.stageVisual} key={`v${active}`}><StepVisual step={active} /></div>
            <div className={s.progress}>
              <div className={s.bars}>{items.map((_, i) => <span key={i} className={i <= active ? s.on : undefined} />)}</div>
              <span className={s.counter}>{pad(active + 1)} / {pad(items.length)}</span>
            </div>
          </div>
        </div>

        <ol className={s.steps}>
          {items.map((it, i) => (
            <li
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              data-index={i}
              className={[s.step, i === active && s.current, i < active && s.passed].filter(Boolean).join(' ')}
            >
              <span className={s.n}>{pad(i + 1)}</span>
              <h3 className={s.stepTitle}>{it.title}</h3>
              <p className={s.stepText}>{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
