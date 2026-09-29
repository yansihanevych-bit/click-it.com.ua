import { useEffect } from 'react';

/**
 * Signature micro-interaction "Click": pressing any interactive element emits a square
 * (the logo shape) from the pointer. One listener, one short-lived element, transform/opacity only.
 */
export function useClickSquare() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onDown = (e: PointerEvent) => {
      const target = (e.target as Element).closest('a, button, summary, [data-cursor]');
      if (!target) return;
      const el = document.createElement('span');
      el.className = 'click-sq';
      if (target.closest('[class*="_cta_"], [class*="_open_"], [class*="_value_"]')) el.classList.add('click-sq-dark');
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);
}
