import { Flame } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export function StreakBadge() {
  const { stats } = useGame();

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-streak/10 rounded-full">
      <Flame className="w-5 h-5 text-streak fill-streak streak-glow" />
      <span className="font-bold text-streak">{stats.streak}</span>
    </div>
  );
}
