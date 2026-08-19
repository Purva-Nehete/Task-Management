'use client';

import Link from 'next/link';

import {
  CalendarDays,
  MoreHorizontal,
} from 'lucide-react';

import type { Task } from '@/types';

import Avatar from '@/components/common/Avatar';

interface TaskCardProps {
  task: Task;
}

const priorityStyles = {
  NONE: 'bg-gray-100 text-gray-700',
  URGENT: 'bg-purple-100 text-purple-800',
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-700',
};

export default function TaskCard({
  task,
}: TaskCardProps) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block rounded-md border bg-white p-3 shadow-none transition hover:border-gray-400 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-5">
          {task.title}
        </h3>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-gray-500">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <CalendarDays size={12} />

            {new Date(
              task.dueDate,
            ).toLocaleDateString()}
          </span>
        )}
      </div>

      {task.members && task.members.length > 0 && (
        <div className="mt-3 flex -space-x-2">
            {task.members.slice(0, 3).map(
            (member, index) => (
                <Avatar
                key={
                    member.id ??
                    member.email ??
                    member.username ??
                    `member-${index}`
                }
                name={
                    member.name ??
                    member.username ??
                    'User'
                }
                size="sm"
                />
            ),
            )}
        </div>
      )}
    </Link>
  );
}