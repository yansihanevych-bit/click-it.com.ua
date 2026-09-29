import { SITE, SITE_URL } from '@/config/site';
import { absUrl } from './head';
import type { Lang } from '@/config/languages';

const ORG_ID = `${SITE_URL}/#organization`;

export const organizationSchema = (lang: Lang, description: string) => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORG_ID,
  name: SITE.name,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/click-it-logo.png`,
  image: `${SITE_URL}/og/og-default.jpg`,
  description,
  email: SITE.email,
  telephone: SITE.phones.map((p) => p.href),
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.streetAddress[lang],
    addressLocality: SITE.address.locality[lang],
    addressCountry: SITE.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.address.geo.lat, longitude: SITE.address.geo.lng },
  areaServed: ['UA', 'PL'],
  sameAs: SITE.socials.map((s) => s.url).filter(Boolean),
});

export const websiteSchema = (lang: Lang, inLanguage: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: absUrl(lang, ''),
  name: SITE.name,
  inLanguage,
  publisher: { '@id': ORG_ID },
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
});

export const serviceSchema = (o: { name: string; description: string; url: string; category: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  description: o.description,
  url: o.url,
  serviceType: o.category,
  provider: { '@id': ORG_ID },
  areaServed: ['UA', 'PL'],
});

export const creativeWorkSchema = (o: { name: string; description: string; url: string; image: string; inLanguage: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: o.name,
  description: o.description,
  url: o.url,
  image: o.image,
  inLanguage: o.inLanguage,
  creator: { '@id': ORG_ID },
});

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
});
