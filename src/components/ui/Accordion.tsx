import s from './Accordion.module.css';

/** Native <details> accordion: works without JS, keyboard-accessible, content stays indexable. */
export function Accordion({ items, headingLevel = 3 }: { items: { q: string; a: string }[]; headingLevel?: 3 | 4 }) {
  const H = `h${headingLevel}` as 'h3';
  return (
    <div className={s.list}>
      {items.map((it, i) => (
        <details key={i} className={s.item} data-reveal style={{ ['--reveal-i' as string]: i }}>
          <summary className={s.summary}>
            <H style={{ font: 'inherit', letterSpacing: 'inherit' }}>{it.q}</H>
            <span className={s.plus} aria-hidden="true" />
          </summary>
          <div className={s.content}><p>{it.a}</p></div>
        </details>
      ))}
    </div>
  );
}
