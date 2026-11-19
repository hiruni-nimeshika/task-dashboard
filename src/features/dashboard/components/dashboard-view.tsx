'use client';

import { CircleCheck, Clock, Inbox, ListTodo, Plus, TriangleAlert } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Card, PageHeader } from '@/components/ui/card';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { useDashboard, type DashboardData } from '../hooks/useDashboard';
import { DashboardSkeleton, PriorityBars, StatCard, StatusDonut, TaskMiniList } from './dashboard-widgets';

/** Presentational: renders a full dashboard from computed data. */
export function DashboardContent({ data }: { data: DashboardData }) {
  if (data.total === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Inbox />}
          title="Your workspace is empty"
          description="Create a task to start seeing progress, priorities and deadlines here."
          action={
            <ButtonLink href="/tasks/new">
              <Plus aria-hidden />
              Create your first task
            </ButtonLink>
          }
        />
      </Card>
    );
  }

  const open = data.total - data.byStatus.done;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={data.total} hint={`${open} still open`} icon={<ListTodo />} tone="indigo" href="/tasks" />
        <StatCard
          label="In progress"
          value={data.byStatus.in_progress}
          hint={`${data.byStatus.in_review} waiting for review`}
          icon={<Clock />}
          tone="blue"
          href="/tasks?status=in_progress"
        />
        <StatCard
          label="Completed"
          value={data.byStatus.done}
          hint={`${data.completionRate}%`}
          progress={data.completionRate}
          icon={<CircleCheck />}
          tone="emerald"
          href="/tasks?status=done"
        />
        <StatCard
          label="Overdue"
          value={data.overdue}
          hint={data.overdue ? 'Needs attention' : 'All on track'}
          icon={<TriangleAlert />}
          tone="rose"
          href="/tasks?sort=dueDate&order=asc"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <StatusDonut byStatus={data.byStatus} total={data.total} />
        </div>
        <div className="lg:col-span-2">
          <PriorityBars byPriority={data.byPriority} total={data.total} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TaskMiniList
          title="Due this week"
          description="Open tasks due in the next 7 days, plus overdue"
          tasks={data.dueSoon}
          emptyText="Nothing due this week. Nice."
          variant="due"
        />
        <TaskMiniList
          title="Recently updated"
          description="The latest changes across the workspace"
          tasks={data.recent}
          emptyText="No recent activity."
          variant="recent"
        />
      </div>
    </div>
  );
}

export function DashboardView() {
  const { data, isPending, isError, error, refetch } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="An overview of your team’s tasks, progress and deadlines."
        actions={
          <ButtonLink href="/tasks/new">
            <Plus aria-hidden />
            New task
          </ButtonLink>
        }
      />
      {isPending ? (
        <DashboardSkeleton />
      ) : isError ? (
        <Card>
          <ErrorState title="Couldn’t load the dashboard" message={error.message} onRetry={() => refetch()} />
        </Card>
      ) : (
        <DashboardContent data={data} />
      )}
    </div>
  );
}
