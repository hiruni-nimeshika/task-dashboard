'use client';

import { forwardRef } from 'react';
import { ArrowUpDown, Flag, Search, X } from 'lucide-react';
import { Input, Kbd, Select } from '@/components/ui/form-controls';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority, type TaskStatus } from '../types';
import { PRIORITY_META, STATUS_META } from './task-badges';

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'dueDate:asc', label: 'Due date (soonest)' },
  { value: 'priorityRank:desc', label: 'Priority (highest)' },
  { value: 'title:asc', label: 'Title (A–Z)' },
] as const;

type StatusFilter = TaskStatus | 'all';

/** Segmented status filter with live counts. */
export function StatusTabs({
  value,
  counts,
  onChange,
}: {
  value: StatusFilter;
  counts?: Partial<Record<StatusFilter, number>>;
  onChange: (value: StatusFilter) => void;
}) {
  const options: { value: StatusFilter; label: string; dot?: string }[] = [
    { value: 'all', label: 'All tasks' },
    ...TASK_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label, dot: STATUS_META[s].dot })),
  ];
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
      <div role="group" aria-label="Filter by status" className="inline-flex gap-1 rounded-2xl border border-border bg-surface p-1 shadow-xs">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                'inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted hover:bg-surface-muted hover:text-foreground',
              )}
            >
              {o.dot && <span className={cn('size-1.5 rounded-full', o.dot)} aria-hidden />}
              {o.label}
              {counts?.[o.value] !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-px text-[11px] tabular-nums',
                    active ? 'bg-background/20 text-background' : 'bg-foreground/[0.06] text-muted',
                  )}
                >
                  {counts[o.value]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type ToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  priority: TaskPriority | 'all';
  onPriorityChange: (value: TaskPriority | 'all') => void;
  sort: string;
  onSortChange: (value: string) => void;
  hasFilters: boolean;
  onReset: () => void;
};

export const TaskToolbar = forwardRef<HTMLInputElement, ToolbarProps>(function TaskToolbar(
  { search, onSearchChange, priority, onPriorityChange, sort, onSortChange, hasFilters, onReset },
  searchRef,
) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        ref={searchRef}
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks, people, tags…"
        aria-label="Search tasks"
        icon={<Search />}
        trailing={<Kbd className="hidden md:inline-flex">/</Kbd>}
        wrapperClassName="flex-1 md:max-w-md"
      />
      <div className="grid grid-cols-2 gap-3 md:ml-auto md:flex">
        <Select
          aria-label="Filter by priority"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
          icon={<Flag />}
          wrapperClassName="md:w-44"
        >
          <option value="all">All priorities</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_META[p].label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Sort tasks"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          icon={<ArrowUpDown />}
          wrapperClassName="md:w-52"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        {hasFilters && (
          <Button variant="ghost" onClick={onReset} className="col-span-2 md:col-span-1">
            <X aria-hidden />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
});
