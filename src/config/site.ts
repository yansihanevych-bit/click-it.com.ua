/**
 * Business facts taken from the current click-it.com.ua.
 * Keep this file the single source of truth for contact data.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://click-it.com.ua').replace(/\/$/, '');

export const SITE = {
  name: 'Click IT',
  legalName: 'Click IT', // TODO: add the registered legal entity name if needed for schema.org
  email: 'contact@click-it.com.ua',
  phones: [
    { display: '+38 (068) 208-08-35', href: '+380682080835' },
    { display: '+38 (098) 342-07-13', href: '+380983420713' },
  ],
  address: {
    streetAddress: { ua: 'вул. Нетечинська, 25', pl: 'ul. Netechynska 25', en: '25 Netechynska St.' },
    locality: { ua: 'Харків', pl: 'Charków', en: 'Kharkiv' },
    country: 'UA',
    geo: { lat: 49.98, lng: 36.23 },
  },
  foundingYearsExperience: 6, // "6 років у сфері розробки сайтів" on the current site
  /** TODO: fill in real profiles — footer renders only non-empty entries */
  socials: [
    { id: 'instagram', label: 'Instagram', url: '' },
    { id: 'facebook', label: 'Facebook', url: '' },
    { id: 'linkedin', label: 'LinkedIn', url: '' },
    { id: 'telegram', label: 'Telegram', url: '' },
  ],
} as const;

export const OG_DEFAULT_IMAGE = '/og/og-default.jpg';
