import { STATS } from '@/data/stats';
import { useT } from '@/hooks/useLang';
import { Counter } from '@/components/ui/Counter';
import { SplitText } from '@/components/ui/SplitText';
import s from './Stats.module.css';

export function Stats() {
  const { t } = useT(['home', 'common']);
  return (
    <section className={`section sheet ${s.stats}`} aria-labelledby="stats-title">
      <div className="container">
        <div className={s.head}>
          <p className={`t-caption ${s.eyebrow}`}><span className="chapter" aria-hidden="true" />{t('stats.eyebrow')}</p>
          <SplitText id="stats-title" className="t-h2" lines={t('stats.title')} />
        </div>
        <dl className={s.grid}>
          {STATS.map((st, i) => {
            const key = st.labelKey.split('.')[1];
            return (
              <div key={st.labelKey} className={s.item} data-reveal style={{ ['--reveal-i' as string]: i }}>
                <dt className={s.label}>
                  <span className={s.short}>{t(`common:statsShort.${key}`)}</span>
                  <span className={s.long}>{t(`common:${st.labelKey}`)}</span>
                </dt>
                <dd className={s.value}><Counter value={st.value} /><span className={s.suffix}>{st.suffix}</span></dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
