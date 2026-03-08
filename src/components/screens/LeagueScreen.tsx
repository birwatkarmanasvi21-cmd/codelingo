import { useGame } from '@/contexts/GameContext';
import { leagues, leaderboard } from '@/data/mockData';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function LeagueScreen() {
  const { stats } = useGame();
  const currentLeague = leagues.find(l => l.id === stats.league) || leagues[0];
  const nextLeague = leagues[leagues.findIndex(l => l.id === stats.league) + 1];

  const getRankChange = (rank: number) => {
    if (rank <= 3) return { icon: TrendingUp, color: 'text-correct', label: 'Promoting' };
    if (rank >= 8) return { icon: TrendingDown, color: 'text-incorrect', label: 'Demotion zone' };
    return { icon: Minus, color: 'text-muted-foreground', label: 'Safe zone' };
  };

  const myRankChange = getRankChange(stats.rank);

  return (
    <div className="p-4 pb-24 slide-up">
      {/* Current League */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 mb-4 league-glow">
          <span className="text-5xl">{currentLeague.icon}</span>
        </div>
        <h1 className="text-2xl font-black">{currentLeague.name}</h1>
        <p className="text-muted-foreground">Week 12 • 3 days left</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Your Rank</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black">#{stats.rank}</span>
            <myRankChange.icon className={`w-5 h-5 ${myRankChange.color}`} />
          </div>
          <p className={`text-xs ${myRankChange.color}`}>{myRankChange.label}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Weekly XP</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-xp">{stats.weeklyXp}</span>
          </div>
          <p className="text-xs text-muted-foreground">Top 10 promote</p>
        </div>
      </div>

      {/* Progress to next league */}
      {nextLeague && (
        <div className="bg-card rounded-2xl p-4 border border-border mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Next League: {nextLeague.name}</span>
            <span className="text-2xl">{nextLeague.icon}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent progress-fill rounded-full"
              style={{ width: `${Math.min(100, (stats.xp / nextLeague.minXp) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {nextLeague.minXp - stats.xp} XP needed
          </p>
        </div>
      )}

      {/* Leaderboard */}
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-xp" />
        Leaderboard
      </h2>
      <div className="space-y-2">
        {leaderboard.map((user, index) => {
          const isCurrentUser = user.rank === stats.rank;
          const rankStyle = getRankChange(user.rank);

          return (
            <div
              key={user.rank}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isCurrentUser
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-card border border-border'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                user.rank === 1 ? 'bg-xp text-primary-foreground' :
                user.rank === 2 ? 'bg-league-silver text-primary-foreground' :
                user.rank === 3 ? 'bg-league-bronze text-primary-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                {user.rank}
              </div>
              <span className="text-2xl">{user.avatar}</span>
              <div className="flex-1">
                <p className={`font-semibold ${isCurrentUser ? 'text-primary' : ''}`}>
                  {isCurrentUser ? 'You' : user.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xp">{user.xp} XP</p>
                <p className={`text-xs ${rankStyle.color}`}>{rankStyle.label}</p>
              </div>
            </div>
          );
        })}

        {/* Current user if not in top 5 */}
        {stats.rank > 5 && (
          <>
            <div className="text-center py-2 text-muted-foreground">• • •</div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border-2 border-primary">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                {stats.rank}
              </div>
              <span className="text-2xl">😎</span>
              <div className="flex-1">
                <p className="font-semibold text-primary">You</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xp">{stats.weeklyXp} XP</p>
                <p className={`text-xs ${myRankChange.color}`}>{myRankChange.label}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
