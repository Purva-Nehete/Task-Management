'use client';

import type { Project } from '@/types';

interface DeleteProjectModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteProjectModal({
  open,
  project,
  onClose,
  onConfirm,
}: DeleteProjectModalProps) {
  if (!open || !project) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Delete Project?</h2>

        <p className="mt-3 text-sm text-gray-600">
          Are you sure you want to delete <span className="font-medium text-gray-900">{project.name}</span>?
        </p>

        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
