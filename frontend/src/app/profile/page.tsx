'use client';

import { useEffect, useState } from 'react';

import ColorSelector from '@/components/profile/ColorSelector';
import ThemeSelector from '@/components/profile/ThemeSelector';
import { getUser, updateUser } from '@/lib/api';
import type { User } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const [profile, setProfile] = useState<User | null>(null);
  const [fullName, setFullName] = useState('Dexter');
  const [title, setTitle] = useState('Designer');
  const [username, setUsername] = useState('Dexuser');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        if (!user) {
          return;
        }

        const data = await getUser(user.id);
        setProfile(data);
        setFullName(data.name || 'Dexter');
        setTitle(data.title || 'Designer');
        setUsername(data.username || 'Dexuser');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [user]);

  async function handleSave() {
    try {
      if (!user) {
        return;
      }

      const updated = await updateUser(user.id, {
        name: fullName,
        title,
        username,
      });

      setProfile(updated);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading profile...</div>;
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b p-5">
          <span className="text-sm font-medium">Profile picture</span>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-sm font-semibold text-white">
            {(fullName || 'U').charAt(0)}
          </div>
        </div>

        <div className="flex items-center justify-between border-b p-5">
          <span className="text-sm font-medium">Email</span>
          <span className="text-sm text-gray-500">{profile?.email ?? '—'}</span>
        </div>

        <div className="border-b p-5">
          <label className="text-sm font-medium">Full name</label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="border-b p-5">
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="p-5">
          <label className="text-sm font-medium">Username</label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="border-t p-5">
          <div className="mb-5 space-y-4">
            <ThemeSelector theme={theme} onChange={setTheme} />
            <ColorSelector selected={colorMode} onChange={setColorMode} />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                void handleSave();
              }}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Workspace access</h2>

        <div className="flex items-center justify-between rounded-xl border bg-white p-5">
          <div>
            <p className="text-sm font-medium">Remove yourself from the workspace</p>
            <p className="mt-1 text-xs text-gray-500">This action will remove your workspace access.</p>
          </div>

          <button type="button" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            Leave Workspace
          </button>
        </div>
      </div>
    </div>
  );
}