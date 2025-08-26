import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  mode: 'system', // 'system' | 'dark' | 'light'
  theme: 'light', // actual theme applied
  setMode: () => {},
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('system'); // user choice: system, dark, light
  const [theme, setTheme] = useState('light'); // actual applied theme

  // Determine the actual theme based on mode and system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('qs-theme-mode');
    if (savedMode === 'dark' || savedMode === 'light' || savedMode === 'system') {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    if (mode === 'dark') {
      setTheme('dark');
    } else if (mode === 'light') {
      setTheme('light');
    } else {
      // system mode
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, [mode]);

  // Listen to system preference changes if in system mode
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [mode]);

  // Apply theme to document and persist mode choice
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('qs-theme-mode', mode);
  }, [theme, mode]);

  const value = useMemo(() => ({ mode, theme, setMode }), [mode, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
