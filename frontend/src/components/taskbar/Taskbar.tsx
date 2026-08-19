'use client';

import {
  Bell,
  Search,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Taskbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4 sm:px-5 lg:px-6">
      <div className="flex w-full max-w-sm items-center gap-2 rounded-md border bg-gray-50 px-3 py-1.5">
        <Search size={18} className="text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-[13px] outline-none"
        />
      </div>

      <div className="ml-4 flex items-center gap-2">
        <button
          type="button"
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
        >
          <Bell size={19} />
        </button>

        <button
          type="button"
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
        >
          <Settings size={19} />
        </button>

        <button
          type="button"
          title="Log out"
          onClick={() => void logout()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium"
        >
          {(user?.name || 'U').charAt(0).toUpperCase()}
          <span className="sr-only">Log out</span>
        </button>
      </div>
    </header>
  );
}