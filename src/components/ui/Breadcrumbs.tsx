import { Link } from 'react-router';
import { useT } from '@/hooks/useLang';
import s from './Breadcrumbs.module.css';

export interface Crumb { name: string; to?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t } = useT();
  return (
    <nav aria-label={t('breadcrumbs.label')} className={s.nav}>
      <ol className={s.list}>
        {items.map((c, i) => (
          <li key={i}>
            {c.to && i < items.length - 1 ? <Link to={c.to}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
