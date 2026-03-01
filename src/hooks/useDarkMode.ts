import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useDarkMode() {
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [isDark, setIsDark] = useLocalStorage('vibe-check-dark-mode', prefersDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev: boolean) => !prev);
  }, [setIsDark]);

  return { isDark, toggle };
}
