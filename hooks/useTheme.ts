import { useState, useEffect } from 'react';
import { ThemeMode } from '../types';

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme-mode');
        if (stored === 'dark' || stored === 'light' || stored === 'system') {
          return stored as ThemeMode;
        }
      }
    } catch (e) {
      console.warn('Failed to access local storage for theme', e);
    }
    return 'system'; // Default to system
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      
      if (themeMode === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = themeMode === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Apply immediately
    applyTheme();

    // If system, listen for changes
    if (themeMode === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [themeMode]);

  useEffect(() => {
    try {
      localStorage.setItem('theme-mode', themeMode);
    } catch (e) {
      console.warn('Failed to save theme to local storage', e);
    }
  }, [themeMode]);

  const cycleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return { themeMode, cycleTheme };
};