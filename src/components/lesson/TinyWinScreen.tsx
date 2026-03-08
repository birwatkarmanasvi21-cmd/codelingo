import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Zap, Flame, Award } from 'lucide-react';

interface TinyWinScreenProps {
  xpGained: number;
  streakCount: number;
  badgeUnlocked?: { name: string; icon: string } | null;
  onContinue: () => void;
}

export function TinyWinScreen({ xpGained, streakCount, badgeUnlocked, onContinue }: TinyWinScreenProps) {
  const [showXp, setShowXp] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowXp(true), 300),
      setTimeout(() => setShowStreak(true), 800),
      setTimeout(() => setShowBadge(true), 1300),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Celebration Animation */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-correct to-primary rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="w-16 h-16 text-white" />
        </div>
        {/* Confetti particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                top: `${50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                animationDelay: `${i * 100}ms`,
              }}
            >
              {['🎉', '⭐', '✨', '🔥'][i % 4]}
            </span>
          ))}
        </div>
      </div>

      <h1 className="text-3xl font-black text-foreground mb-2">Amazing! 🎯</h1>
      <p className="text-muted-foreground text-center mb-8">You crushed that challenge!</p>

      <div className="w-full max-w-sm space-y-4">
        {/* XP Card */}
        <Card className={`p-6 bg-gradient-to-r from-xp/20 to-xp/10 border-xp/30 transition-all duration-500 ${
          showXp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-xp/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-xp" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP Earned</p>
                <p className="text-2xl font-black text-xp">+{xpGained}</p>
              </div>
            </div>
            <span className="text-4xl xp-pop">⚡</span>
          </div>
        </Card>

        {/* Streak Card */}
        <Card className={`p-6 bg-gradient-to-r from-streak/20 to-streak/10 border-streak/30 transition-all duration-500 ${
          showStreak ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-streak/20 flex items-center justify-center streak-glow">
                <Flame className="w-6 h-6 text-streak" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-black text-streak">{streakCount} days</p>
              </div>
            </div>
            <span className="text-4xl">🔥</span>
          </div>
        </Card>

        {/* Badge Unlocked */}
        {badgeUnlocked && (
          <Card className={`p-6 bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30 transition-all duration-500 ${
            showBadge ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center league-glow">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Badge Unlocked!</p>
                  <p className="text-lg font-black text-accent">{badgeUnlocked.name}</p>
                </div>
              </div>
              <span className="text-4xl">{badgeUnlocked.icon}</span>
            </div>
          </Card>
        )}
      </div>

      <Button
        onClick={onContinue}
        className="w-full max-w-sm h-14 text-lg font-bold game-button mt-8"
      >
        Continue
      </Button>
    </div>
  );
}
