'use client';

import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="cursor-pointer rounded-lg border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
      ) : (
        <Sun className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
      )}
    </Button>
  );
}
export default ThemeToggle;
