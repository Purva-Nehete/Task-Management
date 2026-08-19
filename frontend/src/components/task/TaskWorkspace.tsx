'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/common/Button';
import CreateTaskModal from '@/components/task/CreateTaskModal';
import TaskBoard from '@/components/task/TaskBoard';
import TaskFilters, { type TaskFiltersState } from '@/components/task/TaskFilters';
import TaskTable, { type TaskTableFields } from '@/components/task/TaskTable';
import { createTask, getProjects, getTasks, getUsers } from '@/lib/api';
import type { Project, Task, TaskPriority, TaskStatus, User } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

const defaultFilters: TaskFiltersState = {
  status: 'ALL',
  priority: 'ALL',
  projectId: 'ALL',
};

const defaultFields: TaskTableFields = {
  status: true,
  priority: true,
  members: true,
  dueDate: true,
};

export default function TaskWorkspace() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'board' | 'list'>('board');
  const [filters, setFilters] = useState<TaskFiltersState>(defaultFilters);
  const [fields, setFields] = useState<TaskTableFields>(defaultFields);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        setLoading(true);
        const [taskData, projectData, userData] = await Promise.all([
          getTasks(),
          getProjects(),
          getUsers(),
        ]);
        setTasks(taskData);
        setProjects(projectData);
        setUsers(userData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load task workspace');
      } finally {
        setLoading(false);
      }
    }

    void loadWorkspace();
  }, []);

  const filteredTasks = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = !searchValue || task.title.toLowerCase().includes(searchValue) || task.description?.toLowerCase().includes(searchValue);
      const matchesStatus = filters.status === 'ALL' || task.status === filters.status;
      const matchesPriority = filters.priority === 'ALL' || task.priority === filters.priority;
      const matchesProject = filters.projectId === 'ALL' || task.projectId === Number(filters.projectId);

      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }, [filters, search, tasks]);

  async function handleCreateTask(data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    projectId: number;
    memberIds: number[];
  }) {
    if (!user) {
      throw new Error('You must be logged in to create a task');
    }

    const created = await createTask({
      ...data,
      reporterId: user.id,
    });
    setTasks((currentTasks) => [created, ...currentTasks]);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold">Tasks</h1>
            <p className="mt-1 text-xs text-gray-500">Manage and track your tasks.</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <span className="flex items-center gap-2"><Plus size={17} />Add Task</span>
          </Button>
        </div>

        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          view={view}
          onViewChange={setView}
          filters={filters}
          onFiltersChange={setFilters}
          fields={fields}
          onFieldsChange={setFields}
          projects={projects}
        />

        {loading && <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">Loading tasks...</div>}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}
        {!loading && !error && filteredTasks.length === 0 && (
          <div className="rounded-xl border border-dashed bg-white p-12 text-center">
            <h2 className="font-medium">No tasks found</h2>
            <p className="mt-1 text-sm text-gray-500">Create a task or change your search.</p>
          </div>
        )}
        {!loading && !error && filteredTasks.length > 0 && view === 'board' && (
          <div className="overflow-x-auto"><TaskBoard tasks={filteredTasks} /></div>
        )}
        {!loading && !error && filteredTasks.length > 0 && view === 'list' && (
          <TaskTable tasks={filteredTasks} fields={fields} />
        )}
      </div>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={projects}
        users={users}
      />
    </>
  );
}
