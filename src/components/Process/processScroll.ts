import { animate, scroll } from 'motion';

/**
 * Scroll-linked progress line (Motion). Loaded as a separate chunk after hydration,
 * so it never blocks first paint and needs no Suspense boundary.
 */
export function attachProcessLine(fill: HTMLElement, target: HTMLElement, onProgress: (p: number) => void) {
  const stopLine = scroll(animate(fill, { transform: ['scaleY(0)', 'scaleY(1)'] }, { ease: 'linear' }), {
    target,
    offset: ['start 70%', 'end 60%'],
  });
  const stopProgress = scroll((p: number) => onProgress(p), { target, offset: ['start 70%', 'end 60%'] });
  return () => { stopLine(); stopProgress(); };
}
