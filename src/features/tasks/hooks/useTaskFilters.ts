'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { TASK_PRIORITIES, TASK_STATUSES, type TaskQuery } from '../types';

const PAGE_SIZE = 10;
const SORTS = ['createdAt', 'dueDate', 'title', 'priorityRank'] as const;

const oneOf = <T extends string>(v: string | null, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(v ?? '') ? (v as T) : fallback;

export function useTaskFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = useMemo<TaskQuery>(() => ({
    search: params.get('q') ?? '',
    status: oneOf(params.get('status'), ['all', ...TASK_STATUSES] as const, 'all'),
    priority: oneOf(params.get('priority'), ['all', ...TASK_PRIORITIES] as const, 'all'),
    sort: oneOf(params.get('sort'), SORTS, 'createdAt'),
    order: params.get('order') === 'asc' ? 'asc' : 'desc',
    page: Math.max(1, Number(params.get('page')) || 1),
    limit: PAGE_SIZE,
  }), [params]);

  const setFilters = useCallback((patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(params.toString());
    
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === '' || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }
    
    if (!('page' in patch)) {
      next.delete('page');
    }
    
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [params, pathname, router]);

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const hasFilters = !!(query.search || query.status !== 'all' || query.priority !== 'all');

  return { query, setFilters, reset, hasFilters };
}