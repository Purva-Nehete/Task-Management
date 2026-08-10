import type { Metadata } from 'next';
import './globals.css';

import Sidebar from '@/components/sidebar/Sidebar';
import Taskbar from '@/components/taskbar/Taskbar';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Task management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Taskbar />

            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
