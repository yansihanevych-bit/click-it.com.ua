import { useEffect } from 'react';

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * A MutationObserver picks up elements rendered later (lazy routes, client navigation).
 */
export function useRevealObserver() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const scan = (root: ParentNode) => root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    scan(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => n instanceof Element && (n.matches('[data-reveal]') ? io.observe(n) : scan(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}
