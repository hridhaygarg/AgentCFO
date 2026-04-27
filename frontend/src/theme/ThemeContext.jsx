import { createContext, useContext, useEffect, useState } from 'react';
import { darkTheme, lightTheme } from './themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() =>
    localStorage.getItem('layeroi-theme-mode') || 'dark'
  );

  const [resolved, setResolved] = useState('dark');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      if (mode === 'auto') {
        setResolved(mq.matches ? 'dark' : 'light');
      } else {
        setResolved(mode);
      }
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('layeroi-theme-mode', mode);
    document.documentElement.setAttribute('data-theme', resolved);
  }, [mode, resolved]);

  const colors = resolved === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    console.warn('useTheme called outside ThemeProvider — falling back to dark theme');
    return { mode: 'dark', setMode: () => {}, resolved: 'dark', colors: darkTheme };
  }
  return ctx;
};
