/**
 * Static site generation: renders every route in every language to dist/<lang>/<path>/index.html,
 * then writes sitemap.xml (with hreflang alternates), robots.txt and 404.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://click-it.com.ua').replace(/\/$/, '');
const HREFLANG = { ua: 'uk-UA', pl: 'pl-PL', en: 'en' };

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render, getPaths, languages } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const fill = ({ html, head, htmlLang }) =>
  template.replace('<!--app-lang-->', htmlLang).replace('<!--app-head-->', head).replace('<!--app-html-->', html);

const paths = getPaths();
let count = 0;
for (const lang of languages) {
  for (const p of paths) {
    const url = `/${lang}/${p ? p + '/' : ''}`;
    const out = await render(url);
    if (out.status !== 200) throw new Error(`Route ${url} rendered with status ${out.status}`);
    const file = path.join(dist, url, 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, fill(out));
    count++;
  }
}

// Root fallback (Vercel redirects "/" → "/ua/", this covers other static hosts) and 404.
fs.writeFileSync(path.join(dist, 'index.html'), fill(await render('/ua/')));
fs.writeFileSync(path.join(dist, '404.html'), fill(await render('/ua/__not-found__/')));

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const loc = (lang, p) => `${SITE_URL}/${lang}/${p ? p + '/' : ''}`;
const urls = languages.flatMap((lang) =>
  paths.map((p) => {
    const alternates = languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${loc(l, p)}"/>`).join('\n');
    return `  <url>\n    <loc>${loc(lang, p)}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${loc('ua', p)}"/>\n  </url>`;
  }),
);
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`Prerendered ${count} pages (+ index, 404), sitemap with ${urls.length} URLs.`);
