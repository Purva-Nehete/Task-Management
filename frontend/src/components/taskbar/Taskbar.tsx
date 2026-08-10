'use client';

import {
  Bell,
  Search,
  Settings,
} from 'lucide-react';

export default function Taskbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex w-full max-w-md items-center gap-2 rounded-lg border px-3 py-2">
        <Search size={18} className="text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="ml-6 flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <Bell size={19} />
        </button>

        <button
          type="button"
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <Settings size={19} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
          P
        </div>
      </div>
    </header>
  );
}