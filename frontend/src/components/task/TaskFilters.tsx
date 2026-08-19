'use client';

import {
  Filter,
  List,
  Search,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';
import type { Project, TaskPriority, TaskStatus } from '@/types';
import type { TaskTableFields } from './TaskTable';

export interface TaskFiltersState {
  status: TaskStatus | 'ALL';
  priority: TaskPriority | 'ALL';
  projectId: number | 'ALL';
}

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  view: 'board' | 'list';
  onViewChange: (
    view: 'board' | 'list',
  ) => void;
  filters: TaskFiltersState;
  onFiltersChange: (filters: TaskFiltersState) => void;
  fields: TaskTableFields;
  onFieldsChange: (fields: TaskTableFields) => void;
  projects: Project[];
}

export default function TaskFilters({
  search,
  onSearchChange,
  view,
  onViewChange,
  filters,
  onFiltersChange,
  fields,
  onFieldsChange,
  projects,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-2 rounded-lg border bg-white px-3 py-2 sm:max-w-sm">
        <Search
          size={17}
          className="text-gray-400"
        />

        <input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search tasks..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50">
            <Filter size={16} /> Filter
          </summary>
          <div className="absolute right-0 z-20 mt-2 grid w-64 gap-3 rounded-lg border bg-white p-4 shadow-lg">
            <label className="text-xs font-medium">Status
              <select value={filters.status} onChange={(event) => onFiltersChange({ ...filters, status: event.target.value as TaskFiltersState['status'] })} className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm">
                <option value="ALL">All statuses</option>
                <option value="TODO">To Do</option>
                <option value="DOING">Doing</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </label>
            <label className="text-xs font-medium">Priority
              <select value={filters.priority} onChange={(event) => onFiltersChange({ ...filters, priority: event.target.value as TaskFiltersState['priority'] })} className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm">
                <option value="ALL">All priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>
            <label className="text-xs font-medium">Project
              <select value={filters.projectId} onChange={(event) => onFiltersChange({ ...filters, projectId: event.target.value === 'ALL' ? 'ALL' : Number(event.target.value) })} className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm">
                <option value="ALL">All projects</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </label>
          </div>
        </details>

        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50">
            <SlidersHorizontal size={16} /> Fields
          </summary>
          <div className="absolute right-0 z-20 mt-2 grid w-48 gap-2 rounded-lg border bg-white p-4 text-sm shadow-lg">
            {(Object.keys(fields) as Array<keyof TaskTableFields>).map((field) => (
              <label key={field} className="flex items-center gap-2 capitalize">
                <input type="checkbox" checked={fields[field]} onChange={(event) => onFieldsChange({ ...fields, [field]: event.target.checked })} />
                {field === 'dueDate' ? 'Due date' : field}
              </label>
            ))}
          </div>
        </details>

        <div className="flex rounded-lg border bg-white p-1">
          <button
            type="button"
            onClick={() => onViewChange('board')}
            className={`rounded-md p-2 ${
              view === 'board'
                ? 'bg-gray-100'
                : 'text-gray-400'
            }`}
          >
            <LayoutGrid size={17} />
          </button>

          <button
            type="button"
            onClick={() => onViewChange('list')}
            className={`rounded-md p-2 ${
              view === 'list'
                ? 'bg-gray-100'
                : 'text-gray-400'
            }`}
          >
            <List size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}