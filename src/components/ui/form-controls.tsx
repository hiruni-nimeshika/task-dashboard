import type { ComponentProps, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const control =
  'h-10 w-full rounded-xl border border-border bg-surface text-sm text-foreground shadow-xs transition-colors ' +
  'placeholder:text-muted/80 hover:border-foreground/20 ' +
  'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ' +
  'aria-[invalid=true]:border-rose-500 aria-[invalid=true]:focus-visible:ring-rose-500/15 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

type InputProps = ComponentProps<'input'> & {
  icon?: ReactNode;
  trailing?: ReactNode;
  wrapperClassName?: string;
};

export function Input({ icon, trailing, className, wrapperClassName, ...props }: InputProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted [&_svg]:size-4" aria-hidden>
          {icon}
        </span>
      )}
      <input className={cn(control, icon ? 'pl-9' : 'pl-3', trailing ? 'pr-12' : 'pr-3', className)} {...props} />
      {trailing && <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</span>}
    </div>
  );
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'h-auto min-h-28 px-3 py-2.5 leading-relaxed', className)} {...props} />;
}

type SelectProps = ComponentProps<'select'> & { icon?: ReactNode; wrapperClassName?: string };

export function Select({ icon, className, wrapperClassName, children, ...props }: SelectProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted [&_svg]:size-4" aria-hidden>
          {icon}
        </span>
      )}
      <select className={cn(control, 'cursor-pointer appearance-none pr-9', icon ? 'pl-9' : 'pl-3', className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-surface-muted px-1.5 font-mono text-[11px] font-medium text-muted',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
