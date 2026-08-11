'use client';

import { useEffect, useState } from 'react';

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from '@/types';

interface EditTaskModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onSave: (
    data: Partial<Task>,
  ) => Promise<void>;
}

export default function EditTaskModal({
  task,
  open,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] =
    useState(task.title);

  const [description, setDescription] =
    useState(task.description ?? '');

  const [status, setStatus] =
    useState<TaskStatus>(task.status);

  const [priority, setPriority] =
    useState<TaskPriority>(
      task.priority,
    );

  useEffect(() => {
    setTitle(task.title);
    setDescription(
      task.description ?? '',
    );
    setStatus(task.status);
    setPriority(task.priority);
  }, [task]);

  if (!open) {
    return null;
  }

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    await onSave({
      title,
      description,
      status,
      priority,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold">
          Edit Task
        </h2>

        <div className="mt-5 space-y-4">
          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          />

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            rows={4}
            className="w-full rounded-lg border px-3 py-2"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as TaskStatus,
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="TODO">
              To Do
            </option>

            <option value="DOING">
              Doing
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="ON_HOLD">
              On Hold
            </option>
          </select>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target
                  .value as TaskPriority,
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}