import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TaskEditView } from '@/features/tasks/components/task-edit-view';
import { Skeleton } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Edit Task' };

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    }>
      <TaskEditView params={params} />
    </Suspense>
  );
}