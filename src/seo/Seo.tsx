import { createContext, useContext, useEffect } from 'react';
import { buildHead, type SeoMeta } from './head';
import { getLanguage } from '@/config/languages';

export interface HeadCollector { head?: string; htmlLang?: string; status?: number }
export const HeadContext = createContext<HeadCollector | null>(null);

/** Declarative head manager: collected during SSR/prerender, applied to document.head on the client. */
export function Seo(props: SeoMeta & { status?: number }) {
  const collector = useContext(HeadContext);
  const html = buildHead(props);
  const htmlLang = getLanguage(props.lang).htmlLang;
  if (collector) {
    collector.head = html;
    collector.htmlLang = htmlLang;
    if (props.status) collector.status = props.status;
  }
  useEffect(() => {
    document.querySelectorAll('head [data-rh]').forEach((n) => n.remove());
    document.head.insertAdjacentHTML('beforeend', html);
    document.documentElement.lang = htmlLang;
  }, [html, htmlLang]);
  return null;
}
