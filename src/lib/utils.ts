import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Today's date as 'YYYY-MM-DD' in the user's local time zone. */
export const localToday = () => new Date().toLocaleDateString('en-CA');

/** Parse 'YYYY-MM-DD' as a local date (new Date('2026-11-27') would be UTC midnight). */
const parseLocal = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

export function formatDate(iso: string) {
  const date = parseLocal(iso);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

export type DueTone = 'overdue' | 'soon' | 'normal' | 'done';

/** Human label and tone for a due date, e.g. "2 days overdue", "Tomorrow", "In 5 days". */
export function dueInfo(dueDate: string, isDone = false): { label: string; tone: DueTone } {
  const days = Math.round((parseLocal(dueDate).getTime() - parseLocal(localToday()).getTime()) / 86_400_000);
  if (isDone) return { label: 'Completed', tone: 'done' };
  if (days < 0) return { label: `${-days} day${days === -1 ? '' : 's'} overdue`, tone: 'overdue' };
  if (days === 0) return { label: 'Due today', tone: 'soon' };
  if (days === 1) return { label: 'Tomorrow', tone: 'soon' };
  if (days <= 7) return { label: `In ${days} days`, tone: 'normal' };
  return { label: `In ${Math.round(days / 7)} wk`, tone: 'normal' };
}

export function relativeTime(isoTimestamp: string) {
  const diff = Date.now() - new Date(isoTimestamp).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(isoTimestamp);
}
