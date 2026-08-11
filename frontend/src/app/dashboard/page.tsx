'use client';

import { useEffect, useMemo, useState } from 'react';

import { Plus } from 'lucide-react';

import Button from '@/components/common/Button';

import CreateTaskModal from '@/components/task/CreateTaskModal';
import TaskBoard from '@/components/task/TaskBoard';
import TaskFilters from '@/components/task/TaskFilters';
import TaskTable from '@/components/task/TaskTable';

import {
  createTask,
  getTasks,
} from '@/lib/api';

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from '@/types';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState('');

  const [view, setView] = useState<
    'board' | 'list'
  >('board');

  const [modalOpen, setModalOpen] =
    useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);

        const data = await getTasks();

        setTasks(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load tasks',
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title
          .toLowerCase()
          .includes(value) ||
        task.description
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [tasks, search]);

  async function handleCreateTask(data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
  }) {
    // TEMPORARY:
    // Replace these with real project/user selection
    // when we build the complete task form.

    const created = await createTask({
      ...data,
      projectId: 1,
      reporterId: 1,
      memberIds: [],
    });

    setTasks((current) => [
      created,
      ...current,
    ]);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold">
              Tasks
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track your tasks.
            </p>
          </div>

          <Button
            onClick={() =>
              setModalOpen(true)
            }
          >
            <span className="flex items-center gap-2">
              <Plus size={17} />
              Add Task
            </span>
          </Button>
        </div>

        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          view={view}
          onViewChange={setView}
        />

        {loading && (
          <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
            Loading tasks...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredTasks.length === 0 && (
            <div className="rounded-xl border border-dashed bg-white p-12 text-center">
              <h2 className="font-medium">
                No tasks found
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Create a task or change your search.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredTasks.length > 0 &&
          view === 'board' && (
            <div className="overflow-x-auto">
              <TaskBoard
                tasks={filteredTasks}
              />
            </div>
          )}

        {!loading &&
          !error &&
          filteredTasks.length > 0 &&
          view === 'list' && (
            <TaskTable
              tasks={filteredTasks}
            />
          )}
      </div>

      <CreateTaskModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSubmit={handleCreateTask}
      />
    </>
  );
}