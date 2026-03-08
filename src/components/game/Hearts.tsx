import { Heart } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export function Hearts() {
  const { stats } = useGame();

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: stats.maxHearts }).map((_, i) => (
        <Heart
          key={i}
          className={`w-6 h-6 transition-all duration-300 ${
            i < stats.hearts
              ? 'fill-heart text-heart heart-pulse'
              : 'text-muted-foreground/30'
          }`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
      {stats.hearts < stats.maxHearts && (
        <span className="text-xs text-muted-foreground ml-1">
          +1 in 30m
        </span>
      )}
    </div>
  );
}
