import { LANGUAGES, DEFAULT_LANG, getLanguage, type Lang } from '@/config/languages';
import { SITE_URL, SITE, OG_DEFAULT_IMAGE } from '@/config/site';

export interface SeoMeta {
  lang: Lang;
  /** path without language prefix, e.g. "services/seo" ('' for home) */
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object[];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const absUrl = (lang: Lang, path: string) =>
  `${SITE_URL}/${lang}/${path ? path.replace(/^\/|\/$/g, '') + '/' : ''}`;

/** Returns the managed <head> markup. Every tag carries data-rh so the client can replace it on navigation. */
export function buildHead(m: SeoMeta): string {
  const lang = getLanguage(m.lang);
  const url = absUrl(m.lang, m.path);
  const image = (m.image || OG_DEFAULT_IMAGE).startsWith('http') ? m.image! : SITE_URL + (m.image || OG_DEFAULT_IMAGE);
  const tags: string[] = [
    `<title data-rh>${esc(m.title)}</title>`,
    `<meta data-rh name="description" content="${esc(m.description)}">`,
    `<meta data-rh name="robots" content="${m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">`,
  ];
  if (!m.noindex) {
    tags.push(`<link data-rh rel="canonical" href="${url}">`);
    for (const l of LANGUAGES) tags.push(`<link data-rh rel="alternate" hreflang="${l.hreflang}" href="${absUrl(l.code, m.path)}">`);
    tags.push(`<link data-rh rel="alternate" hreflang="x-default" href="${absUrl(DEFAULT_LANG, m.path)}">`);
  }
  tags.push(
    `<meta data-rh property="og:type" content="${m.type || 'website'}">`,
    `<meta data-rh property="og:site_name" content="${SITE.name}">`,
    `<meta data-rh property="og:title" content="${esc(m.title)}">`,
    `<meta data-rh property="og:description" content="${esc(m.description)}">`,
    `<meta data-rh property="og:url" content="${url}">`,
    `<meta data-rh property="og:image" content="${image}">`,
    `<meta data-rh property="og:image:alt" content="${esc(m.imageAlt || m.title)}">`,
    `<meta data-rh property="og:locale" content="${lang.ogLocale}">`,
    ...LANGUAGES.filter((l) => l.code !== m.lang).map((l) => `<meta data-rh property="og:locale:alternate" content="${l.ogLocale}">`),
    `<meta data-rh name="twitter:card" content="summary_large_image">`,
    `<meta data-rh name="twitter:title" content="${esc(m.title)}">`,
    `<meta data-rh name="twitter:description" content="${esc(m.description)}">`,
    `<meta data-rh name="twitter:image" content="${image}">`,
  );
  for (const obj of m.jsonLd || []) {
    tags.push(`<script data-rh type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}
