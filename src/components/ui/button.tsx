import Link from 'next/link';
import type { ComponentProps } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'icon' | 'icon-sm';

const base =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ' +
  'transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  '[&_svg]:size-4 [&_svg]:shrink-0';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(0_0_0/0.12),inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-primary/90',
  secondary: 'border border-border bg-surface text-foreground shadow-xs hover:bg-surface-muted',
  ghost: 'text-muted hover:bg-surface-muted hover:text-foreground',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-500',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4',
  icon: 'size-10',
  'icon-sm': 'size-8 rounded-lg',
};

export type ButtonStyleProps = { variant?: Variant; size?: Size; className?: string };

export const buttonClasses = ({ variant = 'primary', size = 'md', className }: ButtonStyleProps = {}) =>
  cn(base, variants[variant], sizes[size], className);

type ButtonProps = ComponentProps<'button'> & ButtonStyleProps & { loading?: boolean };

export function Button({ variant, size, className, loading, disabled, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
