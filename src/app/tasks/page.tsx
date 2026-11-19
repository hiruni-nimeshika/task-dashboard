import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TasksView } from '@/features/tasks/components/tasks-view';
import { TaskListSkeleton } from '@/features/tasks/components/task-table';

export const metadata: Metadata = { title: 'Tasks' };

export default function TasksPage() {
  // useSearchParams (inside TasksView) needs a Suspense boundary for `next build`.
  return (
    <Suspense fallback={<TaskListSkeleton />}>
      <TasksView />
    </Suspense>
  );
}
