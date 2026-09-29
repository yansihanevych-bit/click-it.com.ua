/**
 * Portfolio. Facts come from the current click-it.com.ua /case/ page.
 * Text lives in src/locales/<locale>/projects.json under items.<slug>.
 * Images: /public/images/projects/<image>-{640,1200}.{avif,webp}
 */
export type WorkType = 'development' | 'promotion' | 'booking' | 'website';

export interface Project {
  slug: string;
  image: string;
  gallery: string[];
  industry: string; // key in projects.json → industries
  work: WorkType[]; // key in projects.json → work
  featured: boolean; // shown on the home page
  /** aspect ratio of the source images (w / h) */
  ratio: number;
  /** TODO: add live URL of the client's website if it may be shown */
  url?: string;
}

export const PROJECTS: Project[] = [
  { slug: 'avangard', image: 'avangard', gallery: ['avangard-2'], industry: 'renovation', work: ['development', 'promotion'], featured: true, ratio: 1200 / 853 },
  { slug: 'family-apartments', image: 'family', gallery: ['family-2'], industry: 'hospitality', work: ['development', 'booking', 'promotion'], featured: true, ratio: 1200 / 853 },
  { slug: 'oseque', image: 'oseque', gallery: ['oseque-2'], industry: 'beauty', work: ['development', 'promotion'], featured: true, ratio: 1200 / 853 },
  { slug: 'mcorp', image: 'mcorp', gallery: ['mcorp-2'], industry: 'construction', work: ['website'], featured: true, ratio: 1200 / 802 },
  { slug: 'whitewood', image: 'whitewood', gallery: [], industry: 'realestate', work: ['website'], featured: false, ratio: 1200 / 802 },
  { slug: 'crazybox', image: 'crazybox', gallery: [], industry: 'food', work: ['website'], featured: false, ratio: 1200 / 566 },
  { slug: 'kratos', image: 'kratos', gallery: [], industry: 'security', work: ['website'], featured: false, ratio: 1200 / 689 },
  { slug: 'qoopiqoopi', image: 'qoopiqoopi', gallery: [], industry: 'adtech', work: ['website'], featured: false, ratio: 1200 / 742 },
  { slug: 'piknik-menu', image: 'piknik', gallery: [], industry: 'food', work: ['website'], featured: false, ratio: 846 / 489 },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
