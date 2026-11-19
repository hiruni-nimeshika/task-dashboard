import { cn, dueInfo, formatDate, type DueTone } from '@/lib/utils';
import type { TaskPriority, TaskStatus } from '../types';

export const STATUS_META: Record<TaskStatus, { label: string; dot: string; pill: string; bar: string }> = {
  todo: {
    label: 'To do',
    dot: 'bg-slate-400',
    pill: 'bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:text-slate-300',
    bar: 'bg-slate-400',
  },
  in_progress: {
    label: 'In progress',
    dot: 'bg-blue-500',
    pill: 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300',
    bar: 'bg-blue-500',
  },
  in_review: {
    label: 'In review',
    dot: 'bg-amber-500',
    pill: 'bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300',
    bar: 'bg-amber-500',
  },
  done: {
    label: 'Done',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
    bar: 'bg-emerald-500',
  },
};

export const PRIORITY_META: Record<TaskPriority, { label: string; level: number; text: string; bar: string }> = {
  low: { label: 'Low', level: 1, text: 'text-slate-600 dark:text-slate-400', bar: 'bg-slate-400' },
  medium: { label: 'Medium', level: 2, text: 'text-sky-700 dark:text-sky-300', bar: 'bg-sky-500' },
  high: { label: 'High', level: 3, text: 'text-orange-700 dark:text-orange-300', bar: 'bg-orange-500' },
  urgent: { label: 'Urgent', level: 4, text: 'text-rose-700 dark:text-rose-300', bar: 'bg-rose-500' },
};

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        meta.pill,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', meta.dot)} aria-hidden />
      {meta.label}
    </span>
  );
}

/** Signal-strength bars plus a text label, so priority never relies on colour alone. */
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={cn('inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium', meta.text)}>
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={cn('w-[3px] rounded-full', n <= meta.level ? meta.bar : 'bg-foreground/15')}
            style={{ height: `${n * 25}%` }}
          />
        ))}
      </span>
      {meta.label}
    </span>
  );
}

const toneClass: Record<DueTone, string> = {
  overdue: 'text-rose-600 dark:text-rose-400',
  soon: 'text-amber-600 dark:text-amber-400',
  normal: 'text-muted',
  done: 'text-emerald-600 dark:text-emerald-400',
};

export function DueDate({ dueDate, done, compact }: { dueDate: string; done?: boolean; compact?: boolean }) {
  const info = dueInfo(dueDate, done);
  if (compact) {
    return (
      <span className={cn('text-xs font-medium', info.tone === 'normal' ? 'text-muted' : toneClass[info.tone])}>
        {info.tone === 'normal' ? formatDate(dueDate) : info.label}
      </span>
    );
  }
  return (
    <div className="leading-tight">
      <p className="text-sm text-foreground">{formatDate(dueDate)}</p>
      <p className={cn('mt-0.5 text-xs', toneClass[info.tone])}>{info.label}</p>
    </div>
  );
}
