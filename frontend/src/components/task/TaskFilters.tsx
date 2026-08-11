'use client';

import {
  Filter,
  List,
  Search,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  view: 'board' | 'list';
  onViewChange: (
    view: 'board' | 'list',
  ) => void;
}

export default function TaskFilters({
  search,
  onSearchChange,
  view,
  onViewChange,
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
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          <Filter size={16} />
          Filter
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          <SlidersHorizontal size={16} />
          Fields
        </button>

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