'use client';

import { useEffect, useRef, useState } from 'react';
import { Inbox, Plus, SearchX } from 'lucide-react';
import { ButtonLink, Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
// ↓ These come from your existing data layer (Phase 5–6 of the guide). Adjust the paths if yours differ.
import { useDeleteTask, useTasks } from '../hooks/useTasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useTaskStats } from '@/features/dashboard/hooks/useTaskStats';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { StatusTabs, TaskToolbar } from './task-toolbar';
import { TaskCardList, TaskListSkeleton, TaskTable } from './task-table';

export function TasksView() {
  const { query, setFilters, reset, hasFilters } = useTaskFilters();
  const { data, isPending, isError, error, refetch, isFetching } = useTasks(query);
  const stats = useTaskStats();
  const deleteTask = useDeleteTask();

  const [search, setSearch] = useState(query.search ?? '');
  const debouncedSearch = useDebounce(search, 300);
  const [toDelete, setToDelete] = useState<Task | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Push the debounced search into the URL.
  useEffect(() => {
    if (debouncedSearch !== (query.search ?? '')) setFilters({ q: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the input in sync when filters are cleared or the URL changes.
  useEffect(() => setSearch(query.search ?? ''), [query.search]);

  // Press "/" anywhere to jump to search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // If a delete empties the last page, step back one page.
  useEffect(() => {
    if (data && query.page > data.totalPages) setFilters({ page: data.totalPages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.totalPages, query.page]);

  const counts = stats.data
    ? { all: stats.data.total, ...stats.data.byStatus }
    : undefined;

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteTask.mutate(toDelete.id, { onSettled: () => setToDelete(null) });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Plan, track and ship your team’s work."
        actions={
          <ButtonLink href="/tasks/new">
            <Plus aria-hidden />
            New task
          </ButtonLink>
        }
      />

      <div className="space-y-4">
        <StatusTabs
          value={query.status ?? 'all'}
          counts={counts}
          onChange={(status: TaskStatus | 'all') => setFilters({ status })}
        />
        <TaskToolbar
          ref={searchRef}
          search={search}
          onSearchChange={setSearch}
          priority={query.priority ?? 'all'}
          onPriorityChange={(priority: TaskPriority | 'all') => setFilters({ priority })}
          sort={`${query.sort ?? 'createdAt'}:${query.order ?? 'desc'}`}
          onSortChange={(value) => {
            const [sort, order] = value.split(':');
            setFilters({ sort, order });
          }}
          hasFilters={hasFilters}
          onReset={() => {
            setSearch('');
            reset();
          }}
        />
      </div>

      <section aria-label="Task results" aria-busy={isFetching} className={cn('transition-opacity', isFetching && !isPending && 'opacity-70')}>
        {isPending ? (
          <TaskListSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border border-border bg-surface">
            <ErrorState title="Couldn’t load tasks" message={error.message} onRetry={() => refetch()} />
          </div>
        ) : data.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/60">
            {hasFilters ? (
              <EmptyState
                icon={<SearchX />}
                title="No tasks match your filters"
                description="Try a different search term, or clear the filters to see everything."
                action={
                  <Button variant="secondary" onClick={() => { setSearch(''); reset(); }}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={<Inbox />}
                title="No tasks yet"
                description="Create your first task and it will show up here."
                action={
                  <ButtonLink href="/tasks/new">
                    <Plus aria-hidden />
                    Create a task
                  </ButtonLink>
                }
              />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <TaskTable tasks={data.items} onDelete={setToDelete} />
            <TaskCardList tasks={data.items} onDelete={setToDelete} />
            <Pagination
              page={query.page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={query.limit}
              onPageChange={(page) => setFilters({ page })}
            />
          </div>
        )}
      </section>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this task?"
        description={
          <>
            <span className="font-medium text-foreground">“{toDelete?.title}”</span> will be permanently removed. This
            can’t be undone.
          </>
        }
        confirmLabel="Delete task"
        loading={deleteTask.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
