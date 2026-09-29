/**
 * Service catalogue. Text lives in src/locales/<locale>/services.json under items.<slug>.
 * To add a service: add an entry here + translations in every locale.
 */
export type ServiceGroup = 'development' | 'marketing' | 'design';

export interface Service {
  slug: string;
  group: ServiceGroup;
  /** show in header mega menu */
  inMenu: boolean;
}

export const SERVICE_GROUPS: ServiceGroup[] = ['development', 'marketing', 'design'];

export const SERVICES: Service[] = [
  { slug: 'web-development', group: 'development', inMenu: true },
  { slug: 'ecommerce', group: 'development', inMenu: true },
  { slug: 'landing-page', group: 'development', inMenu: true },
  { slug: 'corporate-websites', group: 'development', inMenu: true },
  { slug: 'tilda', group: 'development', inMenu: false },
  { slug: 'google-ads', group: 'marketing', inMenu: true },
  { slug: 'seo', group: 'marketing', inMenu: true },
  { slug: 'smm', group: 'marketing', inMenu: true },
  { slug: 'email-marketing', group: 'marketing', inMenu: false },
  { slug: 'design', group: 'design', inMenu: true },
  { slug: 'branding', group: 'design', inMenu: true },
  { slug: 'usability-audit', group: 'design', inMenu: true },
];

export const servicesByGroup = (g: ServiceGroup) => SERVICES.filter((s) => s.group === g);
export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
