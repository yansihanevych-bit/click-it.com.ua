/**
 * Portfolio. Facts come from the current click-it.com.ua /case/ page.
 * Text lives in src/locales/<locale>/projects.json under items.<slug>.
 * Images: /public/images/projects/<image>-{640,1200}.{avif,webp}
 */
export type WorkType = 'development' | 'promotion' | 'booking' | 'website';
/** Visual composition of the case presentation (each case gets its own art direction). */
export type Composition = 'stage' | 'devices' | 'lookbook' | 'panorama';

export interface Project {
  slug: string;
  image: string;
  gallery: string[];
  industry: string; // key in projects.json → industries
  work: WorkType[]; // key in projects.json → work
  featured: boolean; // shown on the home page
  /** aspect ratio of the source images (w / h) */
  ratio: number;
  composition: Composition;
  /** Live URL of the client's website (shown on the case page when set) */
  url?: string;
}

export const PROJECTS: Project[] = [
  { slug: 'avangard', image: 'avangard', gallery: ['avangard-2'], industry: 'renovation', work: ['development', 'promotion'], featured: true, ratio: 1200 / 853, composition: 'stage' },
  { slug: 'family-apartments', image: 'family', gallery: ['family-2'], industry: 'hospitality', work: ['development', 'booking', 'promotion'], featured: true, ratio: 1200 / 853, composition: 'devices' },
  { slug: 'oseque', image: 'oseque', gallery: ['oseque-2'], industry: 'beauty', work: ['development', 'promotion'], featured: true, ratio: 1200 / 853, composition: 'lookbook' },
  { slug: 'mcorp', image: 'mcorp', gallery: ['mcorp-2'], industry: 'construction', work: ['website'], featured: true, ratio: 1200 / 802, composition: 'panorama' },
  { slug: 'yansi', image: 'yansi', gallery: [], industry: 'marketing', work: ['development'], featured: false, ratio: 1200 / 800, composition: 'stage', url: 'https://yansi-tech.vercel.app/uk' },
  { slug: 'slimax-peptides', image: 'slimax', gallery: [], industry: 'peptides', work: ['development'], featured: false, ratio: 1200 / 800, composition: 'panorama', url: 'https://www.sl1mex.shop/' },
  { slug: 'whitewood', image: 'whitewood', gallery: [], industry: 'realestate', work: ['website'], featured: false, ratio: 1200 / 802, composition: 'stage' },
  { slug: 'crazybox', image: 'crazybox', gallery: [], industry: 'food', work: ['website'], featured: false, ratio: 1200 / 566, composition: 'panorama' },
  { slug: 'kratos', image: 'kratos', gallery: [], industry: 'security', work: ['website'], featured: false, ratio: 1200 / 689, composition: 'lookbook' },
  { slug: 'qoopiqoopi', image: 'qoopiqoopi', gallery: [], industry: 'adtech', work: ['website'], featured: false, ratio: 1200 / 742, composition: 'devices' },
  { slug: 'piknik-menu', image: 'piknik', gallery: [], industry: 'food', work: ['website'], featured: false, ratio: 846 / 489, composition: 'lookbook' },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
