import type { ElementType } from 'react';

interface Props {
  /** One string or explicit editorial lines */
  lines: string | string[];
  as?: ElementType;
  id?: string;
  className?: string;
  /** 'scroll' = reveal when in view (default), 'load' = play on page load */
  trigger?: 'scroll' | 'load';
  /** base delay in ms (load trigger) */
  delay?: number;
  /** index of the line to accent in brand blue */
  accentLine?: number;
  /** end the heading with the Click IT square (brand full stop) */
  squareEnd?: boolean;
}

/**
 * Word-by-word masked reveal. Real text stays in the DOM (SEO, screen readers, copy/paste);
 * only presentation is split. Without JS the text is fully visible.
 */
export function SplitText({ lines, as: Tag = 'h2', id, className, trigger = 'scroll', delay = 0, accentLine, squareEnd }: Props) {
  const list = Array.isArray(lines) ? lines : [lines];
  let w = 0;
  return (
    <Tag
      id={id}
      className={['st', trigger === 'load' ? 'st-load' : '', squareEnd ? 'sq-end' : '', className].filter(Boolean).join(' ')}
      data-reveal={trigger === 'scroll' ? 'split' : undefined}
      style={{ ['--st-delay' as string]: `${delay}ms` }}
    >
      {list.map((line, li) => (
        <span key={li} className={['st-line', li === accentLine ? 'st-accent' : ''].filter(Boolean).join(' ')}>
          {line.split(' ').map((word, wi, arr) => {
            const i = w++;
            return (
              <span key={wi}>
                <span className="st-word"><span className="st-inner" style={{ ['--w' as string]: i }}>{word}</span></span>
                {wi < arr.length - 1 ? ' ' : ''}
              </span>
            );
          })}
          {li < list.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
