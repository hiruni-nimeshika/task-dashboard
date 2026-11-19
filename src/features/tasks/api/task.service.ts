import { request } from '@/lib/api-client';
import type { Paginated, Task, TaskQuery } from '../types';
import type { TaskFormValues } from '../schemas/task.schema';

const RANK = { low: 1, medium: 2, high: 3, urgent: 4 } as const;

export function toSearchParams(q: TaskQuery): string {
  const p = new URLSearchParams();
  if (q.search) p.set('q', q.search);
  if (q.status && q.status !== 'all') p.set('status', q.status);
  if (q.priority && q.priority !== 'all') p.set('priority', q.priority);
  p.set('sort', q.sort ?? 'createdAt');
  p.set('order', q.order ?? 'desc');
  p.set('page', String(q.page));
  p.set('limit', String(q.limit));
  return p.toString();
}

export const taskService = {
  async list(q: TaskQuery): Promise<Paginated<Task>> {
    const { data, headers } = await request<Task[]>(`/tasks?${toSearchParams(q)}`);
    const total = Number(headers.get('X-Total-Count') ?? data.length);
    return { items: data, total, page: q.page, totalPages: Math.max(1, Math.ceil(total / q.limit)) };
  },
  
  async getAll(): Promise<Task[]> {
    return (await request<Task[]>(`/tasks`)).data;
  },
  
  async getById(id: number): Promise<Task> {
    return (await request<Task>(`/tasks/${id}`)).data;
  },
  
  async create(values: TaskFormValues): Promise<Task> {
    const now = new Date().toISOString();
    const body = { ...values, priorityRank: RANK[values.priority!], createdAt: now, updatedAt: now };
    return (await request<Task>(`/tasks`, { method: 'POST', body: JSON.stringify(body) })).data;
  },
  
  async update(id: number, values: Partial<TaskFormValues>): Promise<Task> {
    const body = {
      ...values,
      ...(values.priority && { priorityRank: RANK[values.priority!] }),
      updatedAt: new Date().toISOString(),
    };
    return (await request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) })).data;
  },
  
  async remove(id: number): Promise<void> {
    await request<void>(`/tasks/${id}`, { method: 'DELETE' });
  },
};