import { useEffect } from 'react';

/**
 * Scroll parallax for any element with data-parallax="<speed>" (e.g. 0.08).
 * One rAF loop, transforms only, only for elements near the viewport.
 * Disabled on small screens and with prefers-reduced-motion.
 */
export function useParallax(key: string) {
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;
    let els: HTMLElement[] = [];
    let raf = 0;
    const collect = () => { els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]')); };
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.parentElement!.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const speed = Number(el.dataset.parallax) || 0.06;
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    collect();
    update();
    const t = window.setTimeout(() => { collect(); update(); }, 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [key]);
}
