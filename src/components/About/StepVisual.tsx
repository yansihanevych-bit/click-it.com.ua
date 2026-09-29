import s from './Approach.module.css';

/** One illustration per approach step, built from the Click IT shape language (square, arrow, grid). */
export function StepVisual({ step }: { step: number }) {
  const common = { viewBox: '0 0 320 220', className: s.svg, 'aria-hidden': true } as const;
  switch (step) {
    case 0: // Understand — focus on the business
      return (
        <svg {...common}>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={40 + (i % 4) * 62} y={30 + Math.floor(i / 4) * 56} width="50" height="44" rx="4" fill={i === 5 ? '#59ADFF' : '#C7D2E9'} opacity={i === 5 ? 1 : 0.5} className={s.pop} style={{ ['--i' as string]: i }} />
          ))}
          <g className={s.lens}><circle cx="140" cy="108" r="46" fill="none" stroke="#000" strokeWidth="6" /><path d="M173 141 L210 178" stroke="#000" strokeWidth="10" strokeLinecap="square" /></g>
        </svg>
      );
    case 1: // Strategy — route to the goal
      return (
        <svg {...common}>
          <path className={s.draw} d="M36 180 C 90 180, 90 110, 150 110 S 220 40, 270 44" fill="none" stroke="#000" strokeWidth="4" strokeDasharray="10 8" />
          {[[36, 180], [150, 110]].map(([x, y], i) => <rect key={i} x={x - 9} y={y - 9} width="18" height="18" fill="#C7D2E9" stroke="#000" strokeWidth="2" className={s.pop} style={{ ['--i' as string]: i * 3 }} />)}
          <g className={s.pop} style={{ ['--i' as string]: 8 }}><rect x="248" y="22" width="44" height="44" fill="#59ADFF" /><path d="M261 32V38H278L260 56L264 60L282 42V58H288V32Z" fill="#fff" /></g>
        </svg>
      );
    case 2: // UX/UI — interface
      return (
        <svg {...common}>
          <rect x="40" y="24" width="240" height="172" rx="10" fill="#fff" stroke="#000" strokeWidth="3" />
          <rect x="40" y="24" width="240" height="22" rx="10" fill="#000" />
          <rect x="58" y="62" width="120" height="12" rx="3" fill="#000" className={s.grow} />
          <rect x="58" y="82" width="90" height="12" rx="3" fill="#C7D2E9" className={s.grow} style={{ ['--i' as string]: 2 }} />
          <rect x="58" y="110" width="70" height="24" rx="12" fill="#59ADFF" className={s.pop} style={{ ['--i' as string]: 4 }} />
          {[0, 1, 2].map((i) => <rect key={i} x={58 + i * 72} y="148" width="60" height="34" rx="4" fill={i === 2 ? '#4E7296' : '#EAF0F8'} className={s.pop} style={{ ['--i' as string]: 5 + i }} />)}
          <path className={s.cursor} d="M150 118 l22 12 -10 3 -4 11z" fill="#000" />
        </svg>
      );
    case 3: // Development — code
      return (
        <svg {...common}>
          <rect x="30" y="20" width="260" height="180" rx="10" fill="#000" />
          {[[50, 50, 60, '#59ADFF'], [118, 50, 90, '#fff'], [70, 76, 120, '#C7D2E9'], [70, 102, 80, '#59ADFF'], [158, 102, 70, '#fff'], [90, 128, 110, '#C7D2E9'], [70, 154, 60, '#59ADFF'], [50, 180, 40, '#fff']].map(([x, y, w, c], i) => (
            <rect key={i} x={x as number} y={(y as number) - 6} width={w as number} height="10" rx="5" fill={c as string} opacity={c === '#fff' ? 0.55 : 1} className={s.grow} style={{ ['--i' as string]: i }} />
          ))}
          <rect x="136" y="172" width="8" height="16" fill="#59ADFF" className={s.caret} />
        </svg>
      );
    case 4: // Launch — the Click IT arrow takes off
      return (
        <svg {...common}>
          <line x1="40" y1="196" x2="280" y2="196" stroke="#000" strokeWidth="3" />
          {[0, 1, 2].map((i) => <line key={i} className={s.trail} x1={110 - i * 14} y1={190 - i * 4} x2={60 - i * 14} y2={206 - i * 4} stroke="#C7D2E9" strokeWidth="6" strokeLinecap="round" style={{ ['--i' as string]: i }} />)}
          <g className={s.launch}><rect x="110" y="50" width="120" height="120" fill="#59ADFF" /><path d="M144.6 78V88.5H172L142.7 117.8L150.1 125.2L179.4 95.9V123.3H190V78Z" fill="#fff" /></g>
        </svg>
      );
    default: // Growth
      return (
        <svg {...common}>
          <line x1="30" y1="196" x2="290" y2="196" stroke="#000" strokeWidth="3" />
          {[40, 62, 56, 94, 126, 160].map((h, i) => <rect key={i} x={44 + i * 40} y={196 - h} width="28" height={h} fill={i === 5 ? '#59ADFF' : i % 2 ? '#4E7296' : '#C7D2E9'} className={s.bar} style={{ ['--i' as string]: i }} />)}
          <path className={s.draw} d="M50 150 L96 128 L136 136 L176 98 L216 76 L262 30" fill="none" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
  }
}
