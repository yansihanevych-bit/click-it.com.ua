import { useEffect, useRef } from 'react';

/** Subtle magnetic pull toward the pointer (desktop, fine pointer, motion allowed). */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => (el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`));
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.translate = '';
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);
  return ref;
}
