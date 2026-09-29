/** Hairline separator that draws itself when scrolled into view. */
export function Divider({ dark }: { dark?: boolean }) {
  return <div className={['divider', dark ? 'divider-dark' : ''].filter(Boolean).join(' ')} data-reveal="line" aria-hidden="true" />;
}
