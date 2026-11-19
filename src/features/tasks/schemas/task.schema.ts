import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '../types';

export const taskFormSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100, 'Keep the title under 100 characters'),
  description: z.string().trim().max(1000, 'Description is too long'),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  assignee: z.string().trim().min(2, 'Assignee is required'),
  dueDate: z.string().min(1, 'Pick a due date'),
  tags: z.array(z.string().trim().min(1)).max(5, 'Up to 5 tags'),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;