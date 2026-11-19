import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Task } from '../types';
import { DueDate, PriorityBadge, StatusBadge } from './task-badges';

const iconBtn =
  'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4';

function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {tags.slice(0, 3).map((tag) => (
        <span key={tag} className="rounded-md bg-foreground/[0.05] px-1.5 py-0.5 text-[11px] font-medium text-muted">
          #{tag}
        </span>
      ))}
    </div>
  );
}

/** Desktop and tablet: a real table with proper headers. */
export function TaskTable({ tasks, onDelete }: { tasks: Task[]; onDelete: (task: Task) => void }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_3px_rgb(15_20_38/0.04)] md:block">
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted/70 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <th scope="col" className="w-[38%] px-5 py-3">Task</th>
            <th scope="col" className="w-[14%] px-3 py-3">Status</th>
            <th scope="col" className="w-[12%] px-3 py-3">Priority</th>
            <th scope="col" className="w-[18%] px-3 py-3">Assignee</th>
            <th scope="col" className="w-[12%] px-3 py-3">Due</th>
            <th scope="col" className="w-[104px] px-3 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tasks.map((task) => (
            <tr key={task.id} className="group transition-colors hover:bg-surface-muted/60">
              <td className="px-5 py-4 align-top">
                <Link
                  href={`/tasks/${task.id}`}
                  className="block truncate font-medium text-foreground transition-colors hover:text-primary focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {task.title}
                </Link>
                {task.description && <p className="mt-0.5 truncate text-xs text-muted">{task.description}</p>}
                <TagList tags={task.tags} />
              </td>
              <td className="px-3 py-4 align-top">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-3 py-4 pt-5 align-top">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-3 py-4 align-top">
                <div className="flex items-center gap-2.5">
                  <Avatar name={task.assignee} />
                  <span className="truncate text-sm text-foreground">{task.assignee}</span>
                </div>
              </td>
              <td className="px-3 py-4 align-top">
                <DueDate dueDate={task.dueDate} done={task.status === 'done'} />
              </td>
              <td className="px-3 py-4 align-top">
                <div className="flex justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <Link href={`/tasks/${task.id}`} className={iconBtn} aria-label={`View ${task.title}`}>
                    <Eye aria-hidden />
                  </Link>
                  <Link href={`/tasks/${task.id}/edit`} className={iconBtn} aria-label={`Edit ${task.title}`}>
                    <Pencil aria-hidden />
                  </Link>
                  <button
                    onClick={() => onDelete(task)}
                    className={cn(iconBtn, 'hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400')}
                    aria-label={`Delete ${task.title}`}
                  >
                    <Trash2 aria-hidden />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Mobile: the same data as stacked cards. */
export function TaskCardList({ tasks, onDelete }: { tasks: Task[]; onDelete: (task: Task) => void }) {
  return (
    <ul className="space-y-3 md:hidden">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-2xl border border-border bg-surface p-4 shadow-[0_1px_3px_rgb(15_20_38/0.04)]">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/tasks/${task.id}`} className="min-w-0 font-medium text-foreground hover:text-primary">
              <span className="line-clamp-2">{task.title}</span>
            </Link>
            <StatusBadge status={task.status} className="shrink-0" />
          </div>
          {task.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{task.description}</p>}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar name={task.assignee} className="size-6 text-[10px]" />
              <span className="truncate text-xs text-muted">{task.assignee}</span>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <PriorityBadge priority={task.priority} />
              <DueDate dueDate={task.dueDate} done={task.status === 'done'} compact />
              <button
                onClick={() => onDelete(task)}
                className="-mr-1.5 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-rose-500/10 hover:text-rose-600"
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TaskListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface" aria-busy="true" aria-label="Loading tasks">
      <div className="h-11 border-b border-border bg-surface-muted/70" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-6 border-b border-border px-5 py-4 last:border-0">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 max-w-72" />
            <Skeleton className="h-3 w-1/2 max-w-56" />
          </div>
          <Skeleton className="hidden h-6 w-24 rounded-full md:block" />
          <Skeleton className="hidden h-4 w-16 md:block" />
          <div className="hidden items-center gap-2 md:flex">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
