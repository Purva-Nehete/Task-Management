'use client';

import type { Task, TaskStatus } from '@/types';

import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
}

const columns: {
  status: TaskStatus;
  label: string;
}[] = [
  {
    status: 'TODO',
    label: 'To Do',
  },
  {
    status: 'DOING',
    label: 'Doing',
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
  },
  {
    status: 'ON_HOLD',
    label: 'On Hold',
  },
];

export default function TaskBoard({
  tasks,
}: TaskBoardProps) {
  return (
    <div className="grid min-w-[920px] grid-cols-4 gap-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.status,
        );

        return (
          <section
            key={column.status}
            className="min-h-[520px] rounded-md border bg-gray-50/70 p-2.5"
          >
            <div className="mb-2 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: column.status === 'COMPLETED' ? '#10b981' : column.status === 'DOING' ? '#f59e0b' : column.status === 'ON_HOLD' ? '#ef4444' : 'var(--accent)' }} />
                <h2 className="text-xs font-semibold">
                  {column.label}
                </h2>

                <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] text-gray-500">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="rounded-md border border-dashed bg-white/50 p-5 text-center text-[11px] text-gray-400">
                  No tasks
                </div>
              )}
              <button type="button" className="w-full rounded-md border border-dashed py-2 text-[11px] text-gray-400 hover:border-gray-400 hover:text-gray-600">+ Add task</button>
            </div>
          </section>
        );
      })}
    </div>
  );
}