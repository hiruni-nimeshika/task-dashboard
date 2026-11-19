import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardHeader, Skeleton } from '@/components/ui/card';
import { cn, relativeTime } from '@/lib/utils';
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskPriority, type TaskStatus } from '@/features/tasks/types';
import { DueDate, PRIORITY_META, STATUS_META, StatusBadge } from '@/features/tasks/components/task-badges';

type Tone = 'indigo' | 'blue' | 'emerald' | 'rose';

const toneStyles: Record<Tone, { icon: string; glow: string; bar: string }> = {
  indigo: { icon: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300', glow: 'bg-indigo-500', bar: 'bg-indigo-500' },
  blue: { icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-300', glow: 'bg-blue-500', bar: 'bg-blue-500' },
  emerald: { icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300', glow: 'bg-emerald-500', bar: 'bg-emerald-500' },
  rose: { icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-300', glow: 'bg-rose-500', bar: 'bg-rose-500' },
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone,
  href,
  progress,
}: {
  label: string;
  value: number | string;
  hint: string;
  icon: ReactNode;
  tone: Tone;
  href: string;
  progress?: number;
}) {
  const s = toneStyles[tone];
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_3px_rgb(15_20_38/0.04)] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className={cn('pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-20', s.glow)} aria-hidden />
      <div className="flex items-center justify-between">
        <span className={cn('flex size-10 items-center justify-center rounded-xl [&_svg]:size-5', s.icon)}>{icon}</span>
        <ArrowUpRight className="size-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
      </div>
      <p className="mt-4 text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      {progress !== undefined ? (
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} progress`}>
            <div className={cn('h-full rounded-full', s.bar)} style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-muted">{hint}</span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted">{hint}</p>
      )}
    </Link>
  );
}

const DONUT_COLOURS: Record<TaskStatus, string> = {
  todo: 'stroke-slate-400',
  in_progress: 'stroke-blue-500',
  in_review: 'stroke-amber-500',
  done: 'stroke-emerald-500',
};

export function StatusDonut({ byStatus, total }: { byStatus: Record<TaskStatus, number>; total: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const gap = total > 0 ? 3 : 0;
  let offset = 0;

  return (
    <Card className="h-full">
      <CardHeader title="Status breakdown" description="Where every task stands right now" />
      <div className="flex flex-col items-center gap-6 p-5 sm:flex-row">
        <div className="relative size-40 shrink-0">
          <svg viewBox="0 0 128 128" className="size-full -rotate-90" role="img" aria-label={`Status breakdown of ${total} tasks`}>
            <circle cx="64" cy="64" r={r} fill="none" strokeWidth="14" className="stroke-foreground/[0.06]" />
            {TASK_STATUSES.map((s) => {
              const len = total ? (byStatus[s] / total) * c : 0;
              const el =
                len > 0 ? (
                  <circle
                    key={s}
                    cx="64"
                    cy="64"
                    r={r}
                    fill="none"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.max(len - gap, 0.1)} ${c}`}
                    strokeDashoffset={-offset}
                    className={DONUT_COLOURS[s]}
                  />
                ) : null;
              offset += len;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">{total}</span>
            <span className="text-xs text-muted">total tasks</span>
          </div>
        </div>
        <ul className="w-full flex-1 space-y-2.5">
          {TASK_STATUSES.map((s) => {
            const pct = total ? Math.round((byStatus[s] / total) * 100) : 0;
            return (
              <li key={s}>
                <Link
                  href={`/tasks?status=${s}`}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-surface-muted"
                >
                  <span className={cn('size-2.5 rounded-full', STATUS_META[s].dot)} aria-hidden />
                  <span className="flex-1 text-foreground">{STATUS_META[s].label}</span>
                  <span className="font-medium text-foreground tabular-nums">{byStatus[s]}</span>
                  <span className="w-10 text-right text-xs text-muted tabular-nums">{pct}%</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

export function PriorityBars({ byPriority, total }: { byPriority: Record<TaskPriority, number>; total: number }) {
  const max = Math.max(1, ...Object.values(byPriority));
  return (
    <Card className="h-full">
      <CardHeader title="By priority" description="Open and closed tasks" />
      <ul className="space-y-4 p-5">
        {[...TASK_PRIORITIES].reverse().map((p) => (
          <li key={p}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-foreground">{PRIORITY_META[p].label}</span>
              <span className="text-muted tabular-nums">
                <span className="font-medium text-foreground">{byPriority[p]}</span>
                {total > 0 && ` · ${Math.round((byPriority[p] / total) * 100)}%`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-foreground/[0.06]">
              <div
                className={cn('h-full rounded-full transition-[width] duration-700', PRIORITY_META[p].bar)}
                style={{ width: `${(byPriority[p] / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function TaskMiniList({
  title,
  description,
  tasks,
  emptyText,
  variant,
}: {
  title: string;
  description: string;
  tasks: Task[];
  emptyText: string;
  variant: 'due' | 'recent';
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader
        title={title}
        description={description}
        action={
          <Link href="/tasks" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        }
      />
      {tasks.length === 0 ? (
        <p className="flex-1 px-5 py-10 text-center text-sm text-muted">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-border p-2">
          {tasks.map((t) => (
            <li key={t.id}>
              <Link
                href={`/tasks/${t.id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar name={t.assignee} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{t.title}</p>
                  <p className="truncate text-xs text-muted">
                    {t.assignee}
                    {variant === 'recent' && ` · updated ${relativeTime(t.updatedAt)}`}
                  </p>
                </div>
                {variant === 'due' ? (
                  <DueDate dueDate={t.dueDate} compact />
                ) : (
                  <StatusBadge status={t.status} />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="space-y-4 p-5">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Skeleton className="h-64 rounded-2xl lg:col-span-3" />
        <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
      </div>
    </div>
  );
}
