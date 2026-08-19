'use client';

import Link from 'next/link';
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar flex h-screen w-56 shrink-0 flex-col border-r bg-white">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-xs font-bold text-white">T</div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">Task Manager</h1>
          <p className="truncate text-[10px] text-gray-400">Personal workspace</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-[13px] ${
                active
                  ? 'bg-gray-100 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}