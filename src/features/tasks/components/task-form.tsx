'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, type TaskFormValues } from '../schemas/task.schema';
import { TASK_STATUSES, TASK_PRIORITIES } from '../types';
import { STATUS_META, PRIORITY_META } from './task-badges';
import { Input, Select, Textarea } from '@/components/ui/form-controls';
import { Button } from '@/components/ui/button';
import { TagInput } from './tag-input';

export const EMPTY_TASK: TaskFormValues = {
  title: '', description: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '', tags: [],
};

type Props = {
  defaultValues?: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
};

export function TaskForm({ defaultValues = EMPTY_TASK, submitLabel, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
    mode: 'onTouched',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Title <span className="text-rose-500">*</span></label>
          <Input {...register('title')} aria-invalid={!!errors.title} autoFocus />
          {errors.title && <p className="mt-1.5 text-xs text-rose-500">{errors.title.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
            <Select {...register('status')} aria-invalid={!!errors.status}>
              {TASK_STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Priority</label>
            <Select {...register('priority')} aria-invalid={!!errors.priority}>
              {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Assignee <span className="text-rose-500">*</span></label>
            <Input {...register('assignee')} aria-invalid={!!errors.assignee} />
            {errors.assignee && <p className="mt-1.5 text-xs text-rose-500">{errors.assignee.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Due Date <span className="text-rose-500">*</span></label>
            <Input type="date" {...register('dueDate')} aria-invalid={!!errors.dueDate} />
            {errors.dueDate && <p className="mt-1.5 text-xs text-rose-500">{errors.dueDate.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Tags</label>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} error={!!errors.tags} />
            )}
          />
          {errors.tags && <p className="mt-1.5 text-xs text-rose-500">{errors.tags.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
          <Textarea {...register('description')} rows={4} aria-invalid={!!errors.description} />
          {errors.description && <p className="mt-1.5 text-xs text-rose-500">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>{isSubmitting ? 'Saving...' : submitLabel}</Button>
      </div>
    </form>
  );
}