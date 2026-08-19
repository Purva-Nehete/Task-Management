import type { Metadata } from 'next';
import './globals.css';

import AppShell from '@/components/auth/AppShell';

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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
