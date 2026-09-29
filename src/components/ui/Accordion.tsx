import { useId, useState } from 'react';
import s from './Accordion.module.css';

/**
 * Accordion: all items closed by default, several can be open at once (easier to compare answers).
 * Content stays in the DOM (indexable), height animates via grid-template-rows (no layout-thrashing JS).
 */
export function Accordion({ items, headingLevel = 3 }: { items: { q: string; a: string }[]; headingLevel?: 3 | 4 }) {
  const H = `h${headingLevel}` as 'h3';
  const id = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setOpen((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <div className={s.list}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={[s.item, isOpen && s.open].filter(Boolean).join(' ')}>
            <div data-reveal style={{ ['--reveal-i' as string]: i }}>
              <H className={s.h}>
                <button type="button" className={s.summary} aria-expanded={isOpen} aria-controls={`${id}-${i}`} id={`${id}-b${i}`} onClick={() => toggle(i)}>
                  <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={s.q}>{it.q}</span>
                  <span className={s.plus} aria-hidden="true" />
                </button>
              </H>
              <div id={`${id}-${i}`} role="region" aria-labelledby={`${id}-b${i}`} className={s.panel} inert={!isOpen}>
                <div className={s.panelInner}><p className={s.a}>{it.a}</p></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
