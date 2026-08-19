'use client';

import { FormEvent, useState } from 'react';

import { X } from 'lucide-react';

import Button from '@/components/common/Button';

import type {
  Project,
  TaskPriority,
  TaskStatus,
  User,
} from '@/types';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    projectId: number;
    memberIds: number[];
  }) => Promise<void>;
  projects: Project[];
  users: User[];
}

export default function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  projects,
  users,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');

  const [priority, setPriority] =
    useState<TaskPriority>('MEDIUM');

  const [status, setStatus] =
    useState<TaskStatus>('TODO');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [memberIds, setMemberIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (!projectId) {
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        title,
        description,
        status,
        priority,
        dueDate: dueDate || undefined,
        projectId: Number(projectId),
        memberIds,
      });

      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('TODO');
      setDueDate('');
      setProjectId('');
      setMemberIds([]);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Create Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Task title"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Task description"
              rows={4}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as TaskStatus,
                  )
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
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
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as TaskPriority,
                  )
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="NONE">
                  None
                </option>
                <option value="URGENT">
                  Urgent
                </option>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Project</label>
              <select required value={projectId} onChange={(event) => setProjectId(event.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="">Select project</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Due date</label>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Members</label>
            <select multiple value={memberIds.map(String)} onChange={(event) => setMemberIds(Array.from(event.target.selectedOptions, (option) => Number(option.value)))} className="w-full rounded-lg border px-3 py-2 text-sm">
              {users.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Creating...'
                : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}