import { useGame } from '@/contexts/GameContext';
import { leagues, topics } from '@/data/mockData';
import { ThemeSwitch } from '@/components/ui/theme-toggle';
import { Flame, Zap, Trophy, Target, Calendar, Award, Settings } from 'lucide-react';

export function ProfileScreen() {
  const { stats } = useGame();
  const currentLeague = leagues.find(l => l.id === stats.league) || leagues[0];

  const achievements = [
    { icon: '🔥', name: '7-Day Streak', earned: stats.streak >= 7 || (stats.badges?.includes('7-Day Streak') ?? false) },
    { icon: '💯', name: 'Perfect Quiz', earned: stats.badges?.includes('Perfect Quiz') ?? false },
    { icon: '🧩', name: 'Puzzle Master', earned: stats.badges?.includes('Puzzle Master') ?? false },
    { icon: '🚀', name: 'Speed Demon', earned: stats.badges?.includes('Speed Demon') ?? false },
    { icon: '📚', name: 'Bookworm', earned: stats.badges?.includes('Bookworm') ?? false },
    { icon: '⭐', name: 'Top 10 League', earned: stats.badges?.includes('Top 10 League') ?? false },
  ];

  return (
    <div className="p-4 pb-24 slide-up">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-4 text-5xl float">
          😎
        </div>
        <h1 className="text-2xl font-black">CodeLearner</h1>
        <p className="text-muted-foreground">Joined 3 months ago</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-2xl p-4 border border-border text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-streak" />
          <p className="text-2xl font-black">{stats.streak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border text-center">
          <Zap className="w-8 h-8 mx-auto mb-2 text-xp" />
          <p className="text-2xl font-black">{stats.xp + (stats.level - 1) * 500}</p>
          <p className="text-xs text-muted-foreground">Total XP</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-black">{currentLeague.icon}</p>
          <p className="text-xs text-muted-foreground">{currentLeague.name}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-black">Level {stats.level}</p>
          <p className="text-xs text-muted-foreground">Current Level</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-card rounded-2xl p-4 border border-border mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
          Settings
        </h3>
        <div className="space-y-4">
          <ThemeSwitch />
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-card rounded-2xl p-4 border border-border mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          This Week
        </h3>
        <div className="flex justify-between">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  i < 5 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < 5 ? '✓' : ''}
              </div>
              <span className="text-xs text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Progress */}
      <div className="bg-card rounded-2xl p-4 border border-border mb-6">
        <h3 className="font-bold mb-4">Topic Mastery</h3>
        <div className="space-y-3">
          {topics.slice(0, 4).map(topic => (
            <div key={topic.id} className="flex items-center gap-3">
              <span className="text-xl">{topic.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{topic.name}</span>
                  <span className="text-sm text-primary font-semibold">{topic.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary progress-fill rounded-full"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-xp" />
          Achievements
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, i) => (
            <div
              key={i}
              className={`flex flex-col items-center p-3 rounded-xl ${
                achievement.earned ? 'bg-xp/10' : 'bg-muted/50 grayscale'
              }`}
            >
              <span className="text-2xl mb-1">{achievement.icon}</span>
              <span className="text-xs text-center font-medium">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
