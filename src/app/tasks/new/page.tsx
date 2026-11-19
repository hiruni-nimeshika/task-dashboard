'use client';
import { useRouter } from 'next/navigation';
import { useCreateTask } from '@/features/tasks/hooks/useTasks';
import { TaskForm, EMPTY_TASK } from '@/features/tasks/components/task-form';
import { Card, PageHeader } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTaskPage() {
  const router = useRouter();
  const create = useCreateTask();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/tasks" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-4">
        <ChevronLeft className="size-4" /> Back to tasks
      </Link>
      <PageHeader title="Create new task" description="Add a new task to your workspace." />
      <Card className="p-6">
        <TaskForm
          submitLabel="Create task"
          defaultValues={EMPTY_TASK}
          onCancel={() => router.back()}
          onSubmit={async (values) => {
            try {
              const task = await create.mutateAsync(values);
              router.push(`/tasks/${task.id}`);
            } catch {
              // Error handled by toast
            }
          }}
        />
      </Card>
    </div>
  );
}