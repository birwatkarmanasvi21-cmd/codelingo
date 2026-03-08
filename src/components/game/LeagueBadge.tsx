import { useGame } from '@/contexts/GameContext';
import { leagues } from '@/data/mockData';
import { Trophy } from 'lucide-react';

export function LeagueBadge() {
  const { stats } = useGame();
  const currentLeague = leagues.find(l => l.id === stats.league) || leagues[0];

  const colorClasses = {
    bronze: 'bg-league-bronze/20 text-league-bronze border-league-bronze',
    silver: 'bg-league-silver/20 text-league-silver border-league-silver',
    gold: 'bg-league-gold/20 text-league-gold border-league-gold',
    purple: 'bg-league-purple/20 text-league-purple border-league-purple league-glow',
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 ${colorClasses[currentLeague.color as keyof typeof colorClasses]}`}>
      <span className="text-xl">{currentLeague.icon}</span>
      <div className="flex flex-col">
        <span className="text-xs font-semibold">{currentLeague.name}</span>
        <span className="text-[10px] opacity-70 flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          Rank #{stats.rank}
        </span>
      </div>
    </div>
  );
}
