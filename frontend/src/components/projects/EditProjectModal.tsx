'use client';

import { useEffect, useState } from 'react';

import type { Project } from '@/types';

interface EditProjectModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onUpdate: (name: string, description: string) => Promise<void>;
}

export default function EditProjectModal({
  open,
  project,
  onClose,
  onUpdate,
}: EditProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? '');
    }
  }, [project, open]);

  if (!open || !project) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    await onUpdate(name.trim(), description.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold">Edit Project</h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Project Name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter project name"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Enter description"
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
