import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/features/tasks/api/task.service';
import { TASK_STATUSES, type TaskStatus } from '@/features/tasks/types';

export function useTaskStats() {
  return useQuery({
    queryKey: ['tasks', 'stats'],
    queryFn: async () => {
      const tasks = await taskService.getAll();
      const total = tasks.length;
      const byStatus = Object.fromEntries(TASK_STATUSES.map((s) => [s, 0])) as Record<TaskStatus, number>;
      
      for (const t of tasks) {
        byStatus[t.status] += 1;
      }
      
      return { total, byStatus };
    },
  });
}