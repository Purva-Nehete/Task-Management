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
    <div className="grid min-w-250 grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.status,
        );

        return (
          <section
            key={column.status}
            className="min-h-125 rounded-xl bg-gray-100/70 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">
                  {column.label}
                </h2>

                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="rounded-lg border border-dashed bg-white/50 p-6 text-center text-xs text-gray-400">
                  No tasks
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}