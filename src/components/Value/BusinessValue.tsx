import { useT } from '@/hooks/useLang';
import { SplitText } from '@/components/ui/SplitText';
import s from './BusinessValue.module.css';

export function BusinessValue() {
  const { t } = useT('home');
  const items = t('value.items', { returnObjects: true }) as { title: string; text: string }[];
  return (
    <section className={`section sheet ${s.value}`} aria-labelledby="value-title">
      <div className="container">
        <SplitText squareEnd id="value-title" className={`t-h1 ${s.title}`} lines={[t('value.titleA'), t('value.titleB')]} accentLine={1} />
        <span className={s.deco} data-parallax="0.18" aria-hidden="true" />
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
