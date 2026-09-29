/** Post-build SEO/i18n audit: run `node scripts/check-seo.mjs` after `npm run build`. */
import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';
const pages = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p);
  else if (e.name === 'index.html' && d !== dist) pages.push(p);
});
walk(dist);

const problems = [];
const titles = new Map(), descs = new Map(), h1s = new Map();
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const url = '/' + path.relative(dist, path.dirname(file)).split(path.sep).join('/') + '/';
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta data-rh name="description" content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link data-rh rel="canonical" href="([^"]*)"/)?.[1];
  const hreflangs = [...html.matchAll(/rel="alternate" hreflang="([^"]+)"/g)].map((m) => m[1]);
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  if (!title) problems.push(`${url}: no title`);
  if (!desc) problems.push(`${url}: no description`);
  if (desc && (desc.length < 70 || desc.length > 170)) problems.push(`${url}: description length ${desc.length}`);
  if (title && title.length > 75) problems.push(`${url}: title length ${title.length}`);
  if (!canonical || !canonical.endsWith(url)) problems.push(`${url}: canonical ${canonical}`);
  if (hreflangs.length !== 4) problems.push(`${url}: hreflang count ${hreflangs.length}`);
  if (h1.length !== 1) problems.push(`${url}: h1 count ${h1.length}`);
  if (!lang || lang.includes('<!--')) problems.push(`${url}: html lang ${lang}`);
  if (/\b(items|labels|index|hero|form)\.[a-z-]+\.[a-zA-Z]+\b/.test(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')))
    problems.push(`${url}: possible untranslated key in text`);
  for (const m of html.matchAll(/<script data-rh type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { problems.push(`${url}: invalid JSON-LD`); }
  }
  for (const [map, v] of [[titles, title], [descs, desc], [h1s, `${lang}|${h1[0]}`]]) map.set(v, [...(map.get(v) || []), url]);
}
for (const [name, map] of [['title', titles], ['description', descs], ['h1', h1s]]) {
  for (const [v, urls] of map) if (urls.length > 1) problems.push(`duplicate ${name} "${v}" on ${urls.join(', ')}`);
}

// Translation key parity
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [`${p}${k}${Array.isArray(v) ? `[${v.length}]` : ''}`]));
const locales = fs.readdirSync('src/locales');
for (const ns of fs.readdirSync('src/locales/uk')) {
  const base = new Set(flat(JSON.parse(fs.readFileSync(`src/locales/uk/${ns}`, 'utf8'))));
  for (const l of locales.filter((x) => x !== 'uk')) {
    const other = new Set(flat(JSON.parse(fs.readFileSync(`src/locales/${l}/${ns}`, 'utf8'))));
    for (const k of base) if (!other.has(k)) problems.push(`i18n: ${l}/${ns} missing ${k}`);
    for (const k of other) if (!base.has(k)) problems.push(`i18n: ${l}/${ns} extra ${k}`);
  }
}
console.log(`Checked ${pages.length} pages.`);
console.log(problems.length ? problems.join('\n') : 'No problems found.');
process.exitCode = problems.length ? 1 : 0;
