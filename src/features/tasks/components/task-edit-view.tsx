'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useTask, useUpdateTask } from '../hooks/useTasks';
import { TaskForm } from './task-form';
import { Card, PageHeader, Skeleton } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/states';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function TaskEditView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const taskId = Number(id);
  
  const { data: task, isPending, isError, error, refetch } = useTask(taskId);
  const update = useUpdateTask();

  if (isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <Card className="p-6"><Skeleton className="h-96 w-full" /></Card>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <ErrorState title="Couldn't load task" message={error?.message ?? 'Task not found.'} onRetry={() => refetch()} />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href={`/tasks/${taskId}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-4">
        <ChevronLeft className="size-4" /> Back to task
      </Link>
      <PageHeader title="Edit task" description={`Updating "${task.title}"`} />
      <Card className="p-6">
        <TaskForm
          submitLabel="Save changes"
          defaultValues={{
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignee: task.assignee,
            dueDate: task.dueDate,
            tags: task.tags,
          }}
          onCancel={() => router.back()}
          onSubmit={async (values) => {
            try {
              await update.mutateAsync({ id: taskId, values });
              router.push(`/tasks/${taskId}`);
            } catch {
              // Error handled by toast
            }
          }}
        />
      </Card>
    </div>
  );
}