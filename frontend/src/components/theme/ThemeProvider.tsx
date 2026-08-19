'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark';
export type ColorMode = 'Amber' | 'Blue' | 'Pink' | 'Rose' | 'Emerald' | 'Black';

interface ThemeContextValue {
  theme: ThemeMode;
  colorMode: ColorMode;
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (colorMode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_KEY = 'task-manager-theme';
const COLOR_KEY = 'task-manager-color';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

function isColorMode(value: string | null): value is ColorMode {
  return value === 'Amber' || value === 'Blue' || value === 'Pink' || value === 'Rose' || value === 'Emerald' || value === 'Black';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [colorMode, setColorMode] = useState<ColorMode>('Blue');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    const savedColor = window.localStorage.getItem(COLOR_KEY);

    if (isThemeMode(savedTheme)) {
      setTheme(savedTheme);
    }

    if (isColorMode(savedColor)) {
      setColorMode(savedColor);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.color = colorMode.toLowerCase();
    window.localStorage.setItem(THEME_KEY, theme);
    window.localStorage.setItem(COLOR_KEY, colorMode);
  }, [colorMode, theme]);

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
