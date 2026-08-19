'use client';

import type { ColorMode } from '@/components/theme/ThemeProvider';

const colors: ColorMode[] = ['Amber', 'Blue', 'Pink', 'Rose', 'Emerald', 'Black'];

interface ColorSelectorProps {
  selected: ColorMode;
  onChange: (color: ColorMode) => void;
}

export default function ColorSelector({
  selected,
  onChange,
}: ColorSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold">Color Mode</h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            aria-pressed={selected === color}
            className={`rounded-lg border px-4 py-2 text-sm ${selected === color ? 'theme-selected' : ''}`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}
