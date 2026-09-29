import { Link } from 'react-router';
import logoUrl from '@/assets/logo.svg?inline';
import { SITE } from '@/config/site';
import { SERVICES } from '@/data/services';
import { href, useLang, useT } from '@/hooks/useLang';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { OPEN_CONSENT_EVENT } from '@/components/Consent/CookieConsent';
import s from './Footer.module.css';

export function Footer() {
  const lang = useLang();
  const { t } = useT(['common', 'services']);
  const nav = ['services', 'projects', 'about', 'blog', 'contacts'] as const;
  const socials = SITE.socials.filter((x) => x.url);
  const year = new Date().getFullYear();
  return (
    <footer className={`sheet ${s.footer}`}>
      <div className="container">
        <a href="#contact" className={s.big} data-cursor="cta">
          <span>{t('footer.cta')}</span>
          <span className={s.bigLine}>
            {t('cta.discuss')}
            <span className={s.bigIcon} aria-hidden="true"><ArrowIcon size={28} /></span>
          </span>
        </a>

        <div className={s.grid}>
          <div className={s.brand}>
            <p>{t('footer.tagline')}</p>
          </div>

          <nav aria-label={t('footer.navigation')}>
            <p className={`t-caption ${s.title}`}>{t('footer.navigation')}</p>
            <ul className={s.list}>
              {nav.map((k) => <li key={k}><Link to={href(lang, k)}>{t(`nav.${k}`)}</Link></li>)}
            </ul>
          </nav>

          <nav aria-label={t('footer.services')}>
            <p className={`t-caption ${s.title}`}>{t('footer.services')}</p>
            <ul className={s.list}>
              {SERVICES.filter((x) => x.inMenu).slice(0, 8).map((x) => (
                <li key={x.slug}><Link to={href(lang, 'services', x.slug)}>{t(`services:items.${x.slug}.name`)}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={`t-caption ${s.title}`}>{t('footer.contacts')}</p>
            <address className={s.list}>
              {SITE.phones.map((p) => <a key={p.href} href={`tel:${p.href}`}>{p.display}</a>)}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <span className={s.muted}>{SITE.address.locality[lang]}, {SITE.address.streetAddress[lang]}</span>
            </address>
            {socials.length > 0 && (
              <>
                <p className={`t-caption ${s.title}`} style={{ marginTop: 'var(--space-6)' }}>{t('footer.socials')}</p>
                <ul className={s.socials}>
                  {socials.map((x) => <li key={x.id}><a href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a></li>)}
                </ul>
              </>
            )}
          </div>
        </div>

        <Link to={href(lang)} className={s.giant} aria-label={`${SITE.name} — ${t('nav.home')}`} data-cursor="cta">
          <img src={logoUrl} alt="" width={1093} height={260} loading="lazy" />
        </Link>

        <div className={s.bottom}>
          <span>© {year} Click IT. {t('footer.rights')}</span>
          <Link to={href(lang, 'privacy')}>{t('footer.privacy')}</Link>
          <button type="button" className={s.cookies} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>{t('consent.settings')}</button>
          <a href="#main" className={s.top}>{t('footer.toTop')} ↑</a>
        </div>
      </div>
    </footer>
  );
}
