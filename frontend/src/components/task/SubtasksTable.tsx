'use client';

import { useState } from 'react';

import {
  Check,
  Plus,
  Trash2,
} from 'lucide-react';

import type { Subtask } from '@/types';

interface SubtasksTableProps {
  subtasks: Subtask[];
  onCreate: (title: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggle: (
    subtask: Subtask,
  ) => Promise<void>;
}

export default function SubtasksTable({
  subtasks,
  onCreate,
  onDelete,
  onToggle,
}: SubtasksTableProps) {
  const [title, setTitle] = useState('');

  async function handleCreate() {
    if (!title.trim()) {
      return;
    }

    await onCreate(title.trim());
    setTitle('');
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Subtasks
        </h2>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border bg-white">
        <div className="grid grid-cols-[1fr_120px_80px] border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500">
          <span>Task</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="grid grid-cols-[1fr_120px_80px] items-center border-b px-4 py-3 last:border-b-0"
          >
            <span className="text-sm">
              {subtask.title}
            </span>

            <button
              type="button"
              onClick={() =>
                onToggle(subtask)
              }
              className="flex w-fit items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs"
            >
              {subtask.completed
                ? 'Completed'
                : 'To Do'}

              {subtask.completed && (
                <Check size={12} />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete(subtask.id)
              }
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <div className="flex gap-2 p-3">
          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleCreate();
              }
            }}
            placeholder="Add subtask..."
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          />

          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-1 rounded-lg bg-black px-3 py-2 text-sm text-white"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>
    </section>
  );
}