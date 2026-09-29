import type { ServiceGroup } from '@/data/services';
import s from './Services.module.css';

/** Abstract, brand-coloured illustrations for each service direction (SVG, animated with CSS on hover). */
export function GroupVisual({ group }: { group: ServiceGroup }) {
  if (group === 'development') {
    return (
      <svg viewBox="0 0 320 220" className={`${s.visual} ${s.vDev}`} aria-hidden="true">
        <g className={s.l3}><rect x="92" y="18" width="200" height="140" rx="10" fill="#C7D2E9" /></g>
        <g className={s.l2}><rect x="60" y="42" width="200" height="140" rx="10" fill="#4E7296" /><rect x="76" y="62" width="70" height="8" rx="4" fill="#fff" opacity=".6" /></g>
        <g className={s.l1}>
          <rect x="28" y="66" width="200" height="140" rx="10" fill="#000" />
          <circle cx="44" cy="80" r="3.5" fill="#59ADFF" /><circle cx="56" cy="80" r="3.5" fill="#fff" opacity=".4" /><circle cx="68" cy="80" r="3.5" fill="#fff" opacity=".4" />
          <rect x="44" y="102" width="44" height="7" rx="3.5" fill="#59ADFF" /><rect x="94" y="102" width="70" height="7" rx="3.5" fill="#fff" opacity=".5" />
          <rect x="58" y="120" width="90" height="7" rx="3.5" fill="#fff" opacity=".35" /><rect x="58" y="138" width="60" height="7" rx="3.5" fill="#59ADFF" opacity=".8" />
          <rect x="44" y="156" width="110" height="7" rx="3.5" fill="#fff" opacity=".5" /><rect x="44" y="174" width="38" height="7" rx="3.5" fill="#59ADFF" />
        </g>
      </svg>
    );
  }
  if (group === 'marketing') {
    return (
      <svg viewBox="0 0 320 220" className={`${s.visual} ${s.vMkt}`} aria-hidden="true">
        <line x1="20" y1="200" x2="300" y2="200" stroke="#000" strokeWidth="2" />
        {[40, 70, 58, 100, 128, 160].map((h, i) => (
          <rect key={i} className={s.bar} style={{ ['--i' as string]: i }} x={32 + i * 44} y={200 - h} width="28" height={h} rx="3" fill={i === 5 ? '#59ADFF' : i % 2 ? '#4E7296' : '#C7D2E9'} />
        ))}
        <path className={s.trend} d="M38 150 L90 128 L134 138 L178 96 L222 78 L270 36" fill="none" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        <g className={s.arrowHead} transform="translate(262 22)"><path d="M1.3 0V7.3H20.4L0 27.7L5.2 32.9L25.6 12.5V31.6H33V0Z" fill="#000" /></g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 220" className={`${s.visual} ${s.vDes}`} aria-hidden="true">
      <g className={s.circle}><circle cx="118" cy="112" r="78" fill="#C7D2E9" /></g>
      <g className={s.sq}><rect x="150" y="40" width="120" height="120" fill="#59ADFF" /><path d="M184.6 68V78.5H212L182.7 107.8L190.1 115.2L219.4 85.9V113.3H230V68Z" fill="#fff" /></g>
      <g className={s.tri}><path d="M70 196 L130 196 L100 144Z" fill="#000" /></g>
      <g className={s.dots}>{Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={210 + (i % 4) * 18} cy={176 + Math.floor(i / 4) * 12} r="2.5" fill="#4E7296" />)}</g>
    </svg>
  );
}
