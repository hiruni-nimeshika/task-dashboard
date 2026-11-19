'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Pencil, Trash2 } from 'lucide-react';
import { useTask, useDeleteTask } from '../hooks/useTasks';
import { Card, PageHeader, Skeleton } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/states';
import { Button, ButtonLink } from '@/components/ui/button';
import { StatusBadge, PriorityBadge, DueDate } from './task-badges';
import { Avatar } from '@/components/ui/avatar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { formatDate } from '@/lib/utils';

export function TaskDetailsView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const taskId = Number(id);

  const { data: task, isPending, isError, error, refetch } = useTask(taskId);
  const deleteTask = useDeleteTask();
  const [showDelete, setShowDelete] = useState(false);

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </Card>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <ErrorState title="Couldn't load task" message={error?.message ?? 'Task not found.'} onRetry={() => refetch()} />
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    deleteTask.mutate(taskId, {
      onSuccess: () => router.push('/tasks'),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/tasks" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-4">
        <ChevronLeft className="size-4" /> Back to tasks
      </Link>

      <PageHeader
        title={task.title}
        description={`Created on ${formatDate(task.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <ButtonLink href={`/tasks/${taskId}/edit`} variant="secondary">
              <Pencil aria-hidden /> Edit
            </ButtonLink>
            <Button variant="ghost" onClick={() => setShowDelete(true)} className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-600">
              <Trash2 aria-hidden /> Delete
            </Button>
          </div>
        }
      />

      <Card className="p-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Status</h3>
              <StatusBadge status={task.status} />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Priority</h3>
              <PriorityBadge priority={task.priority} />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Due Date</h3>
              <DueDate dueDate={task.dueDate} done={task.status === 'done'} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Assignee</h3>
              <div className="flex items-center gap-2.5">
                <Avatar name={task.assignee} />
                <span className="text-sm font-medium text-foreground">{task.assignee}</span>
              </div>
            </div>
            {task.tags.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-foreground/[0.05] px-2 py-1 text-xs font-medium text-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Description</h3>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={showDelete}
        title="Delete this task?"
        description={<><span className="font-medium text-foreground">"{task.title}"</span> will be permanently removed. This can't be undone.</>}
        confirmLabel="Delete task"
        loading={deleteTask.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}