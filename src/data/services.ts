/**
 * Service catalogue. Text lives in src/locales/<locale>/services.json under items.<slug>.
 * To add a service: add an entry here + translations in every locale (+ a preview scene in ServicePreview.tsx).
 */
export type ServiceGroup = 'development' | 'marketing' | 'design';

export interface Service {
  slug: string;
  group: ServiceGroup;
  /** show in header mega menu / footer */
  inMenu: boolean;
}

export const SERVICE_GROUPS: ServiceGroup[] = ['development', 'marketing', 'design'];

export const SERVICES: Service[] = [
  // Development
  { slug: 'web-development', group: 'development', inMenu: true },
  { slug: 'ecommerce', group: 'development', inMenu: true },
  { slug: 'landing-page', group: 'development', inMenu: true },
  { slug: 'corporate-websites', group: 'development', inMenu: true },
  { slug: 'wordpress', group: 'development', inMenu: true },
  { slug: 'opencart', group: 'development', inMenu: true },
  { slug: 'shopify', group: 'development', inMenu: true },
  { slug: 'magento', group: 'development', inMenu: true },
  // Marketing
  { slug: 'google-ads', group: 'marketing', inMenu: true },
  { slug: 'bing-ads', group: 'marketing', inMenu: true },
  { slug: 'meta-ads', group: 'marketing', inMenu: true },
  { slug: 'tiktok-ads', group: 'marketing', inMenu: true },
  { slug: 'x-ads', group: 'marketing', inMenu: true },
  { slug: 'youtube-ads', group: 'marketing', inMenu: true },
  { slug: 'seo', group: 'marketing', inMenu: true },
  { slug: 'email-marketing', group: 'marketing', inMenu: true },
  { slug: 'content-marketing', group: 'marketing', inMenu: true },
  { slug: 'smm', group: 'marketing', inMenu: true },
  // Design
  { slug: 'design', group: 'design', inMenu: true },
  { slug: 'branding', group: 'design', inMenu: true },
  { slug: 'usability-audit', group: 'design', inMenu: true },
];

export const servicesByGroup = (g: ServiceGroup) => SERVICES.filter((s) => s.group === g);
export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
