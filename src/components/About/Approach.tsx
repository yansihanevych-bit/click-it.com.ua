import { useEffect, useRef, useState } from 'react';
import { useT } from '@/hooks/useLang';
import s from './Approach.module.css';

interface Item { title: string; text: string }

/** Sticky storytelling: heading pinned on the left, steps activate as they pass the viewport centre. */
export function Approach() {
  const { t } = useT('home');
  const items = t('approach.items', { returnObjects: true }) as Item[];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className={`section ${s.approach}`} aria-labelledby="approach-title">
      <div className={`container ${s.inner}`}>
        <div className={s.sticky}>
          <p className={`t-caption ${s.eyebrow}`} data-reveal="fade">{t('approach.eyebrow')}</p>
          <h2 id="approach-title" className="t-h2" data-reveal>{t('approach.title')}</h2>
          <p className="t-lead" data-reveal>{t('approach.lead')}</p>
          <div className={s.progress} aria-hidden="true">
            {items.map((_, i) => <span key={i} className={i <= active ? s.on : undefined} />)}
          </div>
        </div>
        <ol className={s.steps}>
          {items.map((it, i) => (
            <li
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              data-index={i}
              className={[s.step, i === active && s.current].filter(Boolean).join(' ')}
            >
              <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className={s.stepTitle}>{it.title}</h3>
                <p className={s.stepText}>{it.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
