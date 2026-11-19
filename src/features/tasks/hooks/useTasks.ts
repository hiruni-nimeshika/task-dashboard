import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskService } from '../api/task.service';
import type { TaskQuery } from '../types';
import type { TaskFormValues } from '../schemas/task.schema';

export const taskKeys = {
  all: ['tasks'] as const,
  list: (q: TaskQuery) => ['tasks', 'list', q] as const,
  detail: (id: number) => ['tasks', 'detail', id] as const,
  stats: ['tasks', 'stats'] as const,
};

export const useTasks = (q: TaskQuery) =>
  useQuery({ 
    queryKey: taskKeys.list(q), 
    queryFn: () => taskService.list(q),
    placeholderData: keepPreviousData 
  });

export const useTask = (id: number) =>
  useQuery({ 
    queryKey: taskKeys.detail(id), 
    queryFn: () => taskService.getById(id), 
    enabled: Number.isFinite(id) 
  });

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: TaskFormValues) => taskService.create(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Task created');
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<TaskFormValues> }) => taskService.update(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Task updated');
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => taskService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Task deleted');
    },
    onError: (err) => toast.error(err.message),
  });
}