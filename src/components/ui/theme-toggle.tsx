import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Sun className={`h-5 w-5 transition-all ${resolvedTheme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
          <Moon className={`absolute h-5 w-5 transition-all ${resolvedTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-muted' : ''}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-muted' : ''}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className={theme === 'system' ? 'bg-muted' : ''}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="w-full justify-between h-14"
    >
      <div className="flex items-center gap-3">
        {resolvedTheme === 'dark' ? (
          <Moon className="h-5 w-5 text-accent" />
        ) : (
          <Sun className="h-5 w-5 text-xp" />
        )}
        <span className="font-medium">
          {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${resolvedTheme === 'dark' ? 'bg-accent' : 'bg-muted'}`}>
        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${resolvedTheme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </Button>
  );
}
