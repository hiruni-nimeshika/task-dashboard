import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TaskDetailsView } from '@/features/tasks/components/task-details-view';
import { Skeleton } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Task Details' };

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    }>
      <TaskDetailsView params={params} />
    </Suspense>
  );
}