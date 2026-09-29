/**
 * Google Tag Manager + Consent Mode v2.
 *  - Loads only on production hosts (preview/dev deployments never send data).
 *  - All storage is denied by default until the visitor chooses in the consent banner.
 *  - Conversion events are pushed to dataLayer; GA4 / Google Ads tags are configured in GTM.
 * Container ID: VITE_GTM_ID (defaults to the container already used on click-it.com.ua).
 */
type Params = Record<string, unknown>;
declare global {
  interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void }
}

export const GTM_ID = import.meta.env.VITE_GTM_ID ?? 'GTM-PCF9P2C';
const PROD_HOSTS = ['click-it.com.ua', 'www.click-it.com.ua'];
const STORAGE_KEY = 'ci-consent';

export type ConsentChoice = 'granted' | 'denied';

export const analyticsEnabled = () =>
  typeof window !== 'undefined' && !!GTM_ID && (PROD_HOSTS.includes(window.location.hostname) || import.meta.env.VITE_GTM_FORCE === 'true');

function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

export function getStoredConsent(): ConsentChoice | null {
  try { const v = localStorage.getItem(STORAGE_KEY); return v === 'granted' || v === 'denied' ? v : null; } catch { return null; }
}

export function setConsent(choice: ConsentChoice) {
  try { localStorage.setItem(STORAGE_KEY, choice); } catch { /* private mode */ }
  if (!window.gtag) return;
  window.gtag('consent', 'update', {
    ad_storage: choice, analytics_storage: choice, ad_user_data: choice, ad_personalization: choice,
  });
  window.dataLayer.push({ event: 'consent_update', consent: choice });
}

export function track(event: string, params: Params = {}) {
  if (!analyticsEnabled() || !window.dataLayer) return;
  window.dataLayer.push({ event, ...params });
}

let started = false;
export function initAnalytics() {
  if (started || !analyticsEnabled()) return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500,
  });
  const stored = getStoredConsent();
  if (stored) setConsent(stored);
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(s);

  // Contact clicks (phone / email) — useful Google Ads conversions
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a[href^="tel:"], a[href^="mailto:"]') as HTMLAnchorElement | null;
    if (!a) return;
    const isTel = a.href.startsWith('tel:');
    track(isTel ? 'click_phone' : 'click_email', { link_url: a.href.replace(/^(tel|mailto):/, ''), page_path: location.pathname });
  });
}

/** SPA page views for GA4 (configure a "History Change" or custom event trigger in GTM). */
export function trackPageView(path: string, language: string) {
  track('page_view_spa', { page_path: path, page_location: location.href, language });
}
