import { useEffect, useRef, useState } from 'react';
import { useT } from '@/hooks/useLang';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import s from './Cursor.module.css';

type Mode = 'default' | 'view' | 'explore' | 'cta' | 'hidden';

/** Minimal desktop cursor. Disabled on touch devices and with prefers-reduced-motion. */
export function Cursor() {
  const { t } = useT();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const el = (e.target as Element).closest?.('[data-cursor], a, button, summary, input, textarea, label');
      const c = el?.getAttribute('data-cursor');
      if (el && (el.matches('input, textarea'))) setMode('hidden');
      else setMode(c === 'view' || c === 'explore' || c === 'cta' ? c : el ? 'cta' : 'default');
    };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => setMode('hidden');
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className={s.root} data-mode={mode} aria-hidden="true">
      <div ref={ring} className={s.ring}>
        <span className={s.label}>
          {mode === 'view' && t('cursor.view')}
          {mode === 'explore' && t('cursor.explore')}
          {mode === 'cta' && <ArrowIcon size={10} />}
        </span>
      </div>
      <div ref={dot} className={s.dot} />
    </div>
  );
}
