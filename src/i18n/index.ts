import i18next, { type i18n as I18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

export const NAMESPACES = ['common', 'home', 'services', 'projects', 'pages'] as const;

type Loader = () => Promise<{ default: Record<string, unknown> }>;
// Lazy per-locale chunks on the client: only the active language is downloaded.
const loaders = import.meta.glob('../locales/*/*.json') as Record<string, Loader>;

export function createI18n(): I18n {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    resources: {},
    lng: 'uk',
    fallbackLng: false,
    ns: [...NAMESPACES],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    initAsync: false,
    react: { useSuspense: false },
  });
  return instance;
}

const pending = new Map<string, Promise<void>>();

export function loadLocale(i18n: I18n, locale: string): Promise<void> {
  if (NAMESPACES.every((ns) => i18n.hasResourceBundle(locale, ns))) return Promise.resolve();
  const key = locale;
  if (!pending.has(key)) {
    pending.set(
      key,
      Promise.all(
        NAMESPACES.map(async (ns) => {
          const load = loaders[`../locales/${locale}/${ns}.json`];
          if (!load) throw new Error(`Missing locale file: ${locale}/${ns}.json`);
          const mod = await load();
          i18n.addResourceBundle(locale, ns, mod.default, true, true);
        }),
      ).then(() => undefined),
    );
  }
  return pending.get(key)!;
}

export function isLocaleLoaded(i18n: I18n, locale: string) {
  return NAMESPACES.every((ns) => i18n.hasResourceBundle(locale, ns));
}
