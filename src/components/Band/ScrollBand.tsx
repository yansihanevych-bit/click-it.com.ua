import { useEffect, useRef } from 'react';
import { useT } from '@/hooks/useLang';
import s from './ScrollBand.module.css';

/**
 * Oversized typographic band that slides horizontally with scroll (two rows, opposite directions).
 * Shared visual element that links the portfolio with the dark "business value" section.
 */
export function ScrollBand() {
  const { t } = useT('home');
  const words = t('band', { returnObjects: true }) as string[];
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-dir]'));
    let raf = 0, visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height); // 0 → 1 while passing
      for (const row of rows) row.style.transform = `translate3d(${(Number(row.dataset.dir) * (p - 0.5) * 30).toFixed(2)}%, 0, 0)`;
    };
    const onScroll = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) update(); });
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const row = (list: string[]) => [...list, ...list].map((w, i) => <span key={i}>{w}<i /></span>);
  return (
    <div className={s.band} ref={root} aria-hidden="true">
      <div className={s.row} data-dir="-1">{row(words)}</div>
      <div className={`${s.row} ${s.outline}`} data-dir="1">{row([...words].reverse())}</div>
    </div>
  );
}
