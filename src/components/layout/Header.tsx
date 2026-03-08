import { Hearts } from '@/components/game/Hearts';
import { StreakBadge } from '@/components/game/StreakBadge';
import { XPBar } from '@/components/game/XPBar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Hearts />
          <div className="flex items-center gap-2">
            <StreakBadge />
            <ThemeToggle />
          </div>
        </div>
        <XPBar />
      </div>
    </header>
  );
}
