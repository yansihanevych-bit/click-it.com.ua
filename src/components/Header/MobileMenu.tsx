import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SITE } from '@/config/site';
import { SERVICE_GROUPS, servicesByGroup } from '@/data/services';
import { href, useLang, useT } from '@/hooks/useLang';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import s from './Header.module.css';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lang = useLang();
  const { t } = useT(['common', 'services']);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    ref.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const links = ['projects', 'about', 'blog', 'contacts'] as const;
  return (
    <div id="mobile-menu" ref={ref} className={[s.mobile, open && s.mobileOpen].filter(Boolean).join(' ')} inert={!open}>
      <nav aria-label={t('header.mainNav')} className={s.mobileNav}>
        <details className={s.mobileServices}>
          <summary className={s.mobileLink} style={{ ['--i' as string]: 0 }}>{t('nav.services')}<span aria-hidden="true">+</span></summary>
          <div className={s.mobileGroups}>
            {SERVICE_GROUPS.map((g) => (
              <div key={g}>
                <p className="t-caption">{t(`groups.${g}`)}</p>
                <ul>
                  {servicesByGroup(g).map((svc) => (
                    <li key={svc.slug}><Link to={href(lang, 'services', svc.slug)} onClick={onClose}>{t(`services:items.${svc.slug}.name`)}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <Link to={href(lang, 'services')} onClick={onClose} className={s.megaAll}>{t('megaMenu.all')} →</Link>
          </div>
        </details>
        {links.map((k, i) => (
          <Link key={k} to={href(lang, k)} onClick={onClose} className={s.mobileLink} style={{ ['--i' as string]: i + 1 }}>{t(`nav.${k}`)}</Link>
        ))}
      </nav>
      <div className={s.mobileFooter}>
        <LanguageSwitcher />
        {SITE.phones.map((p) => <a key={p.href} href={`tel:${p.href}`} className={s.mobilePhone}>{p.display}</a>)}
        <a href={`mailto:${SITE.email}`} className={s.mobilePhone}>{SITE.email}</a>
        <Button href="#contact" block onClick={onClose} magnetic={false}>{t('header.discuss')}</Button>
      </div>
    </div>
  );
}
