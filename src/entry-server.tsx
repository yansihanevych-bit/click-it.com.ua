import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import { createI18n, NAMESPACES } from './i18n';
import { HeadContext, type HeadCollector } from './seo/Seo';
import { LANGUAGES } from './config/languages';
import { SERVICES } from './data/services';
import { PROJECTS } from './data/projects';

// Server bundle: all locales are bundled eagerly.
const all = import.meta.glob('./locales/*/*.json', { eager: true }) as Record<string, { default: object }>;
const i18n = createI18n();
for (const l of LANGUAGES) for (const ns of NAMESPACES) i18n.addResourceBundle(l.locale, ns, all[`./locales/${l.locale}/${ns}.json`].default);

/** Every indexable path (without language prefix). */
export function getPaths(): string[] {
  return [
    '',
    'services',
    ...SERVICES.map((s) => `services/${s.slug}`),
    'projects',
    ...PROJECTS.map((p) => `projects/${p.slug}`),
    'about',
    'blog',
    'contacts',
    'privacy',
  ];
}
export const languages = LANGUAGES.map((l) => l.code);

export async function render(url: string) {
  const collector: HeadCollector = {};
  const { prelude } = await prerender(
    <StrictMode>
      <HeadContext.Provider value={collector}>
        <I18nextProvider i18n={i18n}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </I18nextProvider>
      </HeadContext.Provider>
    </StrictMode>,
    {
      onError(error) {
        // Surface SSR errors at build time instead of silently falling back to client rendering.
        console.error(`[prerender] ${url}:`, error);
        collector.status = 500;
      },
    },
  );
  const html = await new Response(prelude).text();
  return { html, head: collector.head || '', htmlLang: collector.htmlLang || 'uk', status: collector.status || 200 };
}
