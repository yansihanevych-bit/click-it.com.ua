/** Diagonal arrow taken from the Click IT logo mark. */
export function ArrowIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <path d="M4.8 0V26.5H73.8L0 100.3L18.7 119.1L92.5 45.3V114.2H119.2V0H4.8Z" fill="currentColor" />
    </svg>
  );
}

/** The brand square with arrow (logo sign). */
export function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="92.5 270.5 259.5 259.5" aria-hidden="true" focusable="false">
      <path d="M351.984 270.574H92.5625V529.745H351.984V270.574Z" fill="#59ADFF" />
      <path d="M167.525 340.56V367.066H236.592L162.752 440.834L181.422 459.627L255.262 385.858V454.718H281.934V340.56H167.525Z" fill="#fff" />
    </svg>
  );
}
