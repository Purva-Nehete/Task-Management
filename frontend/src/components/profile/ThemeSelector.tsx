'use client';

import type { ThemeMode } from '@/components/theme/ThemeProvider';

interface ThemeSelectorProps {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

export default function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold">Theme</h3>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onChange('light')}
          aria-pressed={theme === 'light'}
          className={`rounded-lg border px-4 py-2 text-sm ${theme === 'light' ? 'theme-selected' : ''}`}
        >
          Light
        </button>

        <button
          type="button"
          onClick={() => onChange('dark')}
          aria-pressed={theme === 'dark'}
          className={`rounded-lg border px-4 py-2 text-sm ${theme === 'dark' ? 'theme-selected' : ''}`}
        >
          Dark
        </button>
      </div>
    </div>
  );
}
