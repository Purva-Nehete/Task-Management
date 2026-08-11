'use client';

import Link from 'next/link';

import {
  ArrowLeft,
  MoreHorizontal,
} from 'lucide-react';

interface TaskHeaderProps {
  title: string;
  projectName?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskHeader({
  title,
  projectName,
  onEdit,
  onDelete,
}: TaskHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Tasks
        </Link>

        {projectName && (
          <>
            <span>/</span>
            <span>{projectName}</span>
          </>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>

          <button
            type="button"
            className="rounded-lg border p-2 hover:bg-gray-50"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}