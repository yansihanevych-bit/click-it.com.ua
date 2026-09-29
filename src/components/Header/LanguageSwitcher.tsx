import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/config/languages';
import { switchLangPath, useLang, useT } from '@/hooks/useLang';
import { loadLocale } from '@/i18n';
import s from './Header.module.css';

export function LanguageSwitcher({ className }: { className?: string }) {
  const lang = useLang();
  const { t } = useT();
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  return (
    <nav aria-label={t('header.language')} className={[s.lang, className].filter(Boolean).join(' ')}>
      {LANGUAGES.map((l) => (
        <Link
          key={l.code}
          to={switchLangPath(pathname, l.code)}
          hrefLang={l.hreflang}
          lang={l.htmlLang}
          aria-current={l.code === lang ? 'true' : undefined}
          aria-label={`${l.label} — ${l.name}`}
          className={l.code === lang ? s.langActive : undefined}
          onPointerEnter={() => loadLocale(i18n, l.locale)}
          onFocus={() => loadLocale(i18n, l.locale)}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
