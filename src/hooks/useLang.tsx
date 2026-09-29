import { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANG, getLanguage, type Lang } from '@/config/languages';

export const LangContext = createContext<Lang>(DEFAULT_LANG);
export const useLang = () => useContext(LangContext);

/** Translation hook bound to the language from the URL (not global i18n state → SSR-safe). */
export function useT(ns: string | string[] = 'common') {
  const lang = useLang();
  return useTranslation(ns, { lng: getLanguage(lang).locale });
}

/** Build a localized, trailing-slash URL: href('ua', 'services', 'seo') → /ua/services/seo/ */
export function href(lang: Lang, ...segments: string[]) {
  const rest = segments.filter(Boolean).join('/');
  return `/${lang}/${rest ? rest + '/' : ''}`;
}

/** Swap the language segment of a pathname. */
export function switchLangPath(pathname: string, to: Lang) {
  const parts = pathname.split('/');
  parts[1] = to;
  let p = parts.join('/');
  if (!p.endsWith('/')) p += '/';
  return p;
}
