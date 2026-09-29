import { STATS } from '@/data/stats';
import { useT } from '@/hooks/useLang';
import { Counter } from '@/components/ui/Counter';
import s from './Stats.module.css';

export function Stats() {
  const { t } = useT(['home', 'common']);
  return (
    <section className={`section ${s.stats}`} aria-labelledby="stats-title">
      <div className="container">
        <div className={s.head}>
          <p className={`t-caption ${s.eyebrow}`} data-reveal="fade">{t('stats.eyebrow')}</p>
          <h2 id="stats-title" className="t-h2" data-reveal>{t('stats.title')}</h2>
        </div>
        <dl className={s.grid}>
          {STATS.map((st, i) => (
            <div key={st.labelKey} className={s.item} data-reveal style={{ ['--reveal-i' as string]: i }}>
              <dt className={s.label}>{t(`common:${st.labelKey}`)}</dt>
              <dd className={s.value}><Counter value={st.value} /><span className={s.suffix}>{st.suffix}</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
