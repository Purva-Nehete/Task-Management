'use client';

import { useEffect, useState } from 'react';

import { api } from '@/lib/api';

export default function DashboardPage() {
  const [status, setStatus] = useState('Checking API...');

  useEffect(() => {
    api
      .get<{
        status: string;
        message: string;
      }>('/health')
      .then((data) => {
        setStatus(data.message);
      })
      .catch(() => {
        setStatus('API connection failed');
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        {status}
      </p>
    </div>
  );
}