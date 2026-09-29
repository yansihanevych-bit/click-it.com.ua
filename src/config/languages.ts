/**
 * Language registry. `code` is the URL segment (/ua/, /pl/, /en/),
 * `locale` is the folder in src/locales, `hreflang` is used in <link rel="alternate">.
 * To add a language: add an entry here + create src/locales/<locale>/*.json.
 */
export const LANGUAGES = [
  { code: 'ua', locale: 'uk', hreflang: 'uk-UA', htmlLang: 'uk', ogLocale: 'uk_UA', label: 'UA', name: 'Українська' },
  { code: 'pl', locale: 'pl', hreflang: 'pl-PL', htmlLang: 'pl', ogLocale: 'pl_PL', label: 'PL', name: 'Polski' },
  { code: 'en', locale: 'en', hreflang: 'en', htmlLang: 'en', ogLocale: 'en_US', label: 'EN', name: 'English' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];
export const DEFAULT_LANG: Lang = 'ua';

export const isLang = (v: string | undefined): v is Lang => LANGUAGES.some((l) => l.code === v);
export const getLanguage = (code: Lang) => LANGUAGES.find((l) => l.code === code)!;
