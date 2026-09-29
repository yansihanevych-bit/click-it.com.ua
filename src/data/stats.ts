/**
 * Numbers block — ONLY verifiable facts.
 *  - 6+ years: "6 років у сфері розробки сайтів" on the current click-it.com.ua
 *  - 9 cases: projects actually shown in the portfolio (src/data/projects.ts)
 * Add more (e.g. total projects delivered, clients, avg. result) only when confirmed.
 */
import { PROJECTS } from './projects';

export const STATS = [
  { value: 6, suffix: '+', labelKey: 'stats.years' },
  { value: PROJECTS.length, suffix: '', labelKey: 'stats.cases' },
] as const;
