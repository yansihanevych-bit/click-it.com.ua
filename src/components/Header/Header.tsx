import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import logoUrl from '@/assets/logo.svg?inline';
import { SITE } from '@/config/site';
import { href, useLang, useT } from '@/hooks/useLang';
import { Button } from '@/components/ui/Button';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import s from './Header.module.css';

export function Header() {
  const lang = useLang();
  const { t } = useT();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number>(undefined);
  const hoverOpenedAt = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMega(false); setMobile(false); }, [pathname]);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMega(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mega]);

  const open = (e: RPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer.current);
    if (!mega) hoverOpenedAt.current = Date.now();
    setMega(true);
  };
  // A click right after hover-open must not immediately close the menu.
  const toggle = () => { if (Date.now() - hoverOpenedAt.current > 600) setMega((v) => !v); };
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setMega(false), 160); };
  const items = [
    { key: 'projects', to: href(lang, 'projects') },
    { key: 'about', to: href(lang, 'about') },
    { key: 'blog', to: href(lang, 'blog') },
    { key: 'contacts', to: href(lang, 'contacts') },
  ];

  return (
    <>
      <a className="skip-link" href="#main">{t('skipLink')}</a>
      <header className={[s.header, scrolled && s.scrolled, (mega || mobile) && s.solid].filter(Boolean).join(' ')}>
        <div className={`container ${s.inner}`}>
          <Link to={href(lang)} className={s.logo} aria-label={`${SITE.name} — ${t('nav.home')}`}>
            <img src={logoUrl} alt="Click IT" width={1093} height={260} />
          </Link>

          <nav aria-label={t('header.mainNav')} className={s.nav}>
            <ul className={s.navList}>
              <li className={s.megaItem} onPointerEnter={open} onPointerLeave={(e) => e.pointerType === 'mouse' && scheduleClose()}>
                <button
                  type="button"
                  className={[s.navLink, pathname.includes('/services') && s.navActive].filter(Boolean).join(' ')}
                  aria-expanded={mega}
                  aria-controls="mega-menu"
                  onClick={toggle}
                >
                  {t('nav.services')}
                  <svg className={s.chev} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3.5 5 7l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                </button>
                <MegaMenu open={mega} onNavigate={() => setMega(false)} />
              </li>
              {items.map((it) => (
                <li key={it.key}>
                  <NavLink to={it.to} className={({ isActive }) => [s.navLink, isActive && s.navActive].filter(Boolean).join(' ')}>
                    {t(`nav.${it.key}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={s.actions}>
            <LanguageSwitcher className={s.langDesktop} />
            <a className={s.phone} href={`tel:${SITE.phones[0].href}`}>{SITE.phones[0].display}</a>
            <Button href="#contact" size="small" className={s.cta}>{t('header.discuss')}</Button>
            <button
              type="button"
              className={[s.burger, mobile && s.burgerOpen].filter(Boolean).join(' ')}
              aria-expanded={mobile}
              aria-controls="mobile-menu"
              aria-label={mobile ? t('header.closeMenu') : t('header.openMenu')}
              onClick={() => setMobile((v) => !v)}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div className={[s.backdrop, mega && s.backdropOn].filter(Boolean).join(' ')} aria-hidden="true" onClick={() => setMega(false)} />
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}
