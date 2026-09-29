import { lazy, use, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANG, getLanguage, isLang } from '@/config/languages';
import { LangContext } from '@/hooks/useLang';
import { isLocaleLoaded, loadLocale } from '@/i18n';
import { useRevealObserver } from '@/hooks/useRevealObserver';
import { useParallax } from '@/hooks/useParallax';
import { useClickSquare } from '@/hooks/useClickSquare';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Cursor } from '@/components/Cursor/Cursor';

const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function LangLayout() {
  const params = useParams();
  const valid = isLang(params.lang);
  const lang = valid ? params.lang! as typeof DEFAULT_LANG : DEFAULT_LANG;
  const { i18n } = useTranslation();
  const locale = getLanguage(lang).locale;
  // Suspend (client only) until the target language chunk is loaded.
  if (!isLocaleLoaded(i18n, locale)) use(loadLocale(i18n, locale));

  const { pathname, hash } = useLocation();
  useRevealObserver();
  useParallax(pathname);
  useClickSquare();

  useIsoLayoutEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <LangContext.Provider value={lang}>
      <Header />
      <main id="main" tabIndex={-1} key={pathname} className="page-enter">
        {valid ? <Outlet /> : <NotFoundPage />}
      </main>
      <Footer />
      <Cursor />
    </LangContext.Provider>
  );
}
