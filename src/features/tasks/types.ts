export const TASK_STATUSES = ['todo', 'in_progress', 'in_review', 'done'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  priorityRank: number;
  assignee: string;
  tags: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'createdAt' | 'dueDate' | 'title' | 'priorityRank';
export type SortOrder = 'asc' | 'desc';

export interface TaskQuery {
  search?: string;
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  sort?: SortField;
  order?: SortOrder;
  page: number;
  limit: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}