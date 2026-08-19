'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import Taskbar from '@/components/taskbar/Taskbar';
import { AuthProvider, useAuth } from './AuthProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, user } = useAuth();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="app-shell flex min-h-screen bg-gray-50" style={{ backgroundColor: 'var(--background)' }}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Taskbar />
        <main className="flex-1 overflow-auto p-4 sm:p-5 lg:p-6" style={{ backgroundColor: 'var(--background)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedShell>{children}</ProtectedShell>
      </AuthProvider>
    </ThemeProvider>
  );
}
