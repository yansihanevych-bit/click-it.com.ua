import { useT } from '@/hooks/useLang';
import s from './BusinessValue.module.css';

export function BusinessValue() {
  const { t } = useT('home');
  const items = t('value.items', { returnObjects: true }) as { title: string; text: string }[];
  return (
    <section className={`section ${s.value}`} aria-labelledby="value-title">
      <div className="container">
        <h2 id="value-title" className={`t-h1 ${s.title}`}>
          <span data-reveal>{t('value.titleA')}</span>
          <span data-reveal className={s.accent} style={{ ['--reveal-i' as string]: 1 }}>{t('value.titleB')}</span>
        </h2>
        <ol className={s.grid}>
          {items.map((it, i) => (
            <li key={i} className={s.item} data-reveal style={{ ['--reveal-i' as string]: i }}>
              <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-h3">{it.title}</h3>
              <p>{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
