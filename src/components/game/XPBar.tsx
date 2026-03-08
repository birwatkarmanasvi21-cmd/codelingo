import { useGame } from '@/contexts/GameContext';
import { Zap } from 'lucide-react';

export function XPBar() {
  const { stats, showXpAnimation, lastXpGain } = useGame();
  const progress = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-xp text-primary-foreground font-bold text-sm">
          {stats.level}
        </div>
        <div className="flex-1">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full xp-shimmer progress-fill rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {stats.xp}/{stats.xpToNextLevel}
        </span>
      </div>

      {/* XP gain animation */}
      {showXpAnimation && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 xp-pop flex items-center gap-1 text-xp font-bold">
          <Zap className="w-4 h-4 fill-xp" />
          +{lastXpGain} XP
        </div>
      )}
    </div>
  );
}
