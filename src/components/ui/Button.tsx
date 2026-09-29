import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useMagnetic } from '@/hooks/useMagnetic';
import { ArrowIcon } from './ArrowIcon';
import s from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'dark' | 'light';
interface Common { children: ReactNode; variant?: Variant; size?: 'm' | 'small'; block?: boolean; className?: string; magnetic?: boolean }
type Props = Common & (
  | { to: string; href?: never; type?: never; onClick?: () => void; disabled?: never }
  | { href: string; to?: never; type?: never; onClick?: () => void; disabled?: never }
  | { to?: never; href?: never; type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean }
);

export function Button({ children, variant = 'primary', size = 'm', block, className, magnetic = true, ...rest }: Props) {
  const ref = useMagnetic<HTMLElement>(magnetic ? 0.18 : 0);
  const cls = [s.btn, variant !== 'primary' && s[variant], size === 'small' && s.small, block && s.block, className].filter(Boolean).join(' ');
  const inner = (
    <>
      <span>{children}</span>
      <span className={s.icon} aria-hidden="true">
        <ArrowIcon size={12} />
        <ArrowIcon size={12} />
      </span>
    </>
  );
  if ('to' in rest && rest.to) {
    return <Link ref={ref as never} to={rest.to} className={cls} onClick={rest.onClick} data-cursor="cta">{inner}</Link>;
  }
  if ('href' in rest && rest.href) {
    return <a ref={ref as never} href={rest.href} className={cls} onClick={rest.onClick} data-cursor="cta">{inner}</a>;
  }
  const b = rest as { type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean };
  return <button ref={ref as never} type={b.type || 'button'} className={cls} onClick={b.onClick} disabled={b.disabled} data-cursor="cta">{inner}</button>;
}

export function ArrowLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={[s.link, className].filter(Boolean).join(' ')}>
      {children}
      <ArrowIcon size={11} />
    </Link>
  );
}
