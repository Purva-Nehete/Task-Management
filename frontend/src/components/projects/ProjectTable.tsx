'use client';

import Link from 'next/link';

import type { Project } from '@/types';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectTable({
  projects,
  onEdit,
  onDelete,
}: ProjectTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="grid grid-cols-[1.2fr_1.4fr_140px] border-b bg-gray-50 px-5 py-3 text-xs font-medium text-gray-500">
        <span>Project</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      {projects.map((project) => (
        <div
          key={project.id}
          className="grid grid-cols-[1.2fr_1.4fr_140px] items-center border-b px-5 py-4 text-sm last:border-b-0"
        >
          <div className="min-w-0">
            <Link
              href={`/projects/${project.id}`}
              className="block font-medium text-gray-900 hover:text-black"
            >
              {project.name}
            </Link>
          </div>

          <span className="text-gray-500">
            {project.description ?? 'No description'}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(project)}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {projects.length === 0 && (
        <div className="p-10 text-center text-sm text-gray-500">
          No projects found.
        </div>
      )}
    </div>
  );
}
