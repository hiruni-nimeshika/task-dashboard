import { useQuery } from '@tanstack/react-query';
import { localToday } from '@/lib/utils';
// ↓ From your existing data layer. Adjust the path if yours differs.
import { taskService } from '@/features/tasks/api/task.service';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '@/features/tasks/types';

export type DashboardData = ReturnType<typeof buildDashboard>;

/** Pure function: easy to unit-test. */
export function buildDashboard(tasks: Task[], today = localToday()) {
  const byStatus = Object.fromEntries(TASK_STATUSES.map((s) => [s, 0])) as Record<TaskStatus, number>;
  const byPriority = Object.fromEntries(TASK_PRIORITIES.map((p) => [p, 0])) as Record<TaskPriority, number>;
  const open = tasks.filter((t) => t.status !== 'done');

  for (const t of tasks) {
    byStatus[t.status] += 1;
    byPriority[t.priority] += 1;
  }

  const inAWeek = new Date();
  inAWeek.setDate(inAWeek.getDate() + 7);
  const weekLimit = inAWeek.toLocaleDateString('en-CA');

  const total = tasks.length;
  return {
    total,
    byStatus,
    byPriority,
    overdue: open.filter((t) => t.dueDate < today).length,
    completionRate: total ? Math.round((byStatus.done / total) * 100) : 0,
    dueSoon: open
      .filter((t) => t.dueDate <= weekLimit)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5),
    recent: [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
  };
}

export const useDashboard = () =>
  useQuery({
    // Starts with 'tasks', so every create/update/delete invalidation refreshes the dashboard too.
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => taskService.getAll(),
    select: (tasks) => buildDashboard(tasks),
  });
