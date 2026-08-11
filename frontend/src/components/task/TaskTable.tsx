'use client';

import Link from 'next/link';

import type { Task } from '@/types';

import Avatar from '@/components/common/Avatar';

interface TaskTableProps {
  tasks: Task[];
}

const priorityStyles = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-700',
};

export default function TaskTable({
  tasks,
}: TaskTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-3 font-medium">
                Task
              </th>

              <th className="px-5 py-3 font-medium">
                Status
              </th>

              <th className="px-5 py-3 font-medium">
                Priority
              </th>

              <th className="px-5 py-3 font-medium">
                Members
              </th>

              <th className="px-5 py-3 font-medium">
                Due Date
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="font-medium hover:underline"
                  >
                    {task.title}
                  </Link>

                  {task.description && (
                    <p className="mt-1 max-w-md truncate text-xs text-gray-500">
                      {task.description}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">
                    {task.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {task.members &&
                  task.members.length > 0 ? (
                    <div className="flex -space-x-2">
                      {task.members
                        .slice(0, 3)
                        .map((member) => (
                          <Avatar
                            key={member.id}
                            name={member.name}
                            size="sm"
                          />
                        ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">
                      No members
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {task.dueDate
                    ? new Date(
                        task.dueDate,
                      ).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}