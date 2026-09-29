import { Link } from 'react-router';
import { SERVICE_GROUPS, servicesByGroup } from '@/data/services';
import { href, useLang, useT } from '@/hooks/useLang';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import s from './Header.module.css';

export function MegaMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const lang = useLang();
  const { t } = useT(['common', 'services']);
  return (
    <div id="mega-menu" className={[s.mega, open && s.megaOpen].filter(Boolean).join(' ')} inert={!open}>
      <div className={`container ${s.megaInner}`}>
        {SERVICE_GROUPS.map((g, gi) => (
          <div key={g} className={s.megaCol} style={{ ['--i' as string]: gi }}>
            <p className={`t-caption ${s.megaTitle}`}>{t(`groups.${g}`)}</p>
            <ul>
              {servicesByGroup(g).filter((x) => x.inMenu).map((svc) => (
                <li key={svc.slug}>
                  <Link to={href(lang, 'services', svc.slug)} onClick={onNavigate} className={s.megaLink}>
                    <span>{t(`services:items.${svc.slug}.name`)}</span>
                    <small>{t(`services:items.${svc.slug}.short`)}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className={s.megaAside}>
          <p>{t('megaMenu.note')}</p>
          <Link to={href(lang, 'services')} onClick={onNavigate} className={s.megaAll}>
            {t('megaMenu.all')} <ArrowIcon size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
