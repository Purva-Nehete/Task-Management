'use client';

import { CalendarDays } from 'lucide-react';

interface CalendarProps {
  dueDate?: string | null;
}

export default function Calendar({
  dueDate,
}: CalendarProps) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="flex items-center gap-2">
        <CalendarDays size={17} />

        <h2 className="text-sm font-semibold">
          Calendar
        </h2>
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-500">
          Due Date
        </p>

        <p className="mt-1 text-sm font-medium">
          {dueDate
            ? new Date(
                dueDate,
              ).toLocaleDateString(
                undefined,
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                },
              )
            : 'No due date'}
        </p>
      </div>
    </section>
  );
}