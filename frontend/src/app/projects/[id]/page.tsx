'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { getProject } from '@/lib/api';
import type { Project } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load project',
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProject();
    }
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading project...</div>;
  }

  if (error || !project) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        {error ?? 'Project not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {project.description ?? 'No description'}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Tasks</h2>
          <span className="text-xs text-gray-500">
            {project.tasks?.length ?? 0} task{(project.tasks?.length ?? 0) === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-4">
          {project.tasks && project.tasks.length > 0 ? (
            <div className="space-y-2">
              {project.tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">{task.title}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {task.status}
                    </div>
                  </div>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {task.priority}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tasks in this project.</p>
          )}
        </div>
      </div>
    </div>
  );
}