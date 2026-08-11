'use client';

interface ThemeSelectorProps {
  theme: 'light' | 'dark';
  onChange: (theme: 'light' | 'dark') => void;
}

export default function ThemeSelector({
  theme,
  onChange,
}: ThemeSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold">Theme</h3>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onChange('light')}
          className={`rounded-lg border px-4 py-2 text-sm ${
            theme === 'light' ? 'border-black' : ''
          }`}
        >
          Light
        </button>

        <button
          type="button"
          onClick={() => onChange('dark')}
          className={`rounded-lg border px-4 py-2 text-sm ${
            theme === 'dark' ? 'border-black' : ''
          }`}
        >
          Dark
        </button>
      </div>
    </div>
  );
}
