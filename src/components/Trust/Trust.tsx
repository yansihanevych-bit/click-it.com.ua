import { CLIENTS } from '@/data/clients';
import { useT } from '@/hooks/useLang';
import s from './Trust.module.css';

export function Trust() {
  const { t } = useT('home');
  const row = (hidden: boolean) => (
    <ul className={s.row} aria-hidden={hidden || undefined}>
      {CLIENTS.map((c) => (
        <li key={c.name} className={s.item}>
          <img src={c.logo} alt={hidden ? '' : c.name} width={160} height={64} loading="lazy" decoding="async" />
        </li>
      ))}
    </ul>
  );
  return (
    <section id="trust" className={s.trust} aria-labelledby="trust-title">
      <div className={`container ${s.head}`}>
        <h2 id="trust-title" className={`t-caption ${s.title}`}>{t('trust.title')}</h2>
      </div>
      <div className={s.marquee}>
        <div className={s.track}>{row(false)}{row(true)}</div>
      </div>
    </section>
  );
}
