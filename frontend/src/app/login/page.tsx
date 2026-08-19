'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const { login, guestLogin } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(identifier, password);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to log in');
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    setError(null);
    setLoading(true);

    try {
      await guestLogin();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to start guest session');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <section className="w-full max-w-[360px] rounded-xl border bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">T</div>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-gray-400">Task Manager</p>
          <h1 className="mt-2 text-xl font-semibold text-gray-950">Let&apos;s get back on track</h1>
          <p className="mt-2 text-xs text-gray-500">Sign in to continue to your workspace.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-medium" htmlFor="identifier">Email or username</label>
            <input
              id="identifier"
              required
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <button disabled={loading} className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          or
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <button type="button" disabled={loading} onClick={() => void handleGuestLogin()} className="w-full rounded-md border px-4 py-2.5 text-sm font-medium text-gray-800 disabled:opacity-50">
          Continue as guest
        </button>
        <p className="mt-5 text-center text-[10px] text-gray-400">By continuing, you agree to the workspace terms.</p>
      </section>
    </main>
  );
}