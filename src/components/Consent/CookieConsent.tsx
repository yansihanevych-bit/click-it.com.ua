import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { analyticsEnabled, getStoredConsent, setConsent } from '@/analytics';
import { href, useLang, useT } from '@/hooks/useLang';
import s from './CookieConsent.module.css';

export const OPEN_CONSENT_EVENT = 'ci:open-consent';

/** Minimal consent banner (Consent Mode v2). Rendered client-side only, only where analytics runs. */
export function CookieConsent() {
  const lang = useLang();
  const { t } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled()) return;
    if (!getStoredConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open) return null;
  const choose = (c: 'granted' | 'denied') => { setConsent(c); setOpen(false); };
  return (
    <div className={s.banner} role="dialog" aria-live="polite" aria-label={t('consent.title')}>
      <p className={s.title}>{t('consent.title')}</p>
      <p className={s.text}>
        {t('consent.text')} <Link to={href(lang, 'privacy')}>{t('consent.more')}</Link>
      </p>
      <div className={s.actions}>
        <button type="button" className={s.accept} onClick={() => choose('granted')}>{t('consent.accept')}</button>
        <button type="button" className={s.decline} onClick={() => choose('denied')}>{t('consent.decline')}</button>
      </div>
    </div>
  );
}
