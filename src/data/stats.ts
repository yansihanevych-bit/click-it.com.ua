/**
 * Numbers block. Only facts verifiable on the current site are used.
 * Replace / extend with real figures (e.g. total projects delivered) when available.
 */
export const STATS = [
  { value: 6, suffix: '+', labelKey: 'stats.years' }, // "6 років у сфері розробки сайтів"
  { value: 15, suffix: '', labelKey: 'stats.clients' }, // unique brands shown in cases + client logos on click-it.com.ua
  { value: 14, suffix: '', labelKey: 'stats.services' }, // services listed on the current site
  { value: 24, suffix: '/7', labelKey: 'stats.support' }, // "Цілодобове обслуговування"
] as const;
