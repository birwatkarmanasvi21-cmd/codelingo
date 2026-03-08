import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { leagues } from '@/data/mockData';

import { 
  Flame, 
  Trophy, 
  Sparkles, 
  Lock, 
  Zap, 
  Code, 
  Bug,
  MessageCircle,
  ChevronRight,
  Brain,
  Bot,
  ShieldCheck,
  Target
} from 'lucide-react';

interface HomeScreenProps {
  onStartLesson: () => void;
  onStartQuiz: () => void;
  onStartParsons: () => void;
  onStartDebug: () => void;
  onStartHackathon: () => void;
  onOpenAI: () => void;
  onStartInterview: () => void;
}

export function HomeScreen({ 
  onStartLesson, 
  onStartQuiz, 
  onStartParsons, 
  onStartDebug,
  onStartHackathon,
  onOpenAI,
  onStartInterview
}: HomeScreenProps) {
  const { stats, onboardingData, refreshUserStats, userProfile } = useGame();
  const currentLeague = leagues.find(l => l.id === stats.league) || leagues[0];

  useEffect(() => {
    refreshUserStats();
  }, [refreshUserStats]);
  
  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

  const leagueColors = {
    bronze: 'bg-league-bronze/20 text-league-bronze border-league-bronze',
    silver: 'bg-league-silver/20 text-league-silver border-league-silver',
    gold: 'bg-league-gold/20 text-league-gold border-league-gold',
    purple: 'bg-league-purple/20 text-league-purple border-league-purple',
  };

  return (
    <div className="p-4 pb-24 space-y-6 slide-up">
      {/* Welcome & Stats Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">
  Welcome {userProfile?.name || ""}! 👋
</h1>
          <p className="text-muted-foreground">
            Ready to level up your {onboardingData?.language || 'coding'} skills?
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 ${leagueColors[currentLeague.color as keyof typeof leagueColors]}`}>
          <span className="text-xl">{currentLeague.icon}</span>
          <span className="text-xs font-bold">{currentLeague.name}</span>
        </div>
      </div>

      {/* Big Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Streak */}
        <Card className="p-4 text-center bg-gradient-to-br from-streak/10 to-streak/5">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-6 h-6 text-streak fill-streak streak-glow" />
          </div>
          <span className="text-2xl font-black text-streak">{stats.streak}</span>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </Card>

        {/* XP */}
        <Card className="p-4 text-center bg-gradient-to-br from-xp/10 to-xp/5">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Sparkles className="w-6 h-6 text-xp" />
          </div>
          <span className="text-2xl font-black text-xp">{stats.xp}</span>
          <p className="text-xs text-muted-foreground">Total XP</p>
        </Card>

        {/* Rank */}
        <Card className="p-4 text-center bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
          <span className="text-2xl font-black text-accent">#{stats.rank}</span>
          <p className="text-xs text-muted-foreground">League Rank</p>
        </Card>
      </div>

      {/* XP Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold">Level {stats.level}</span>
          <span className="text-sm text-muted-foreground">
            {stats.xp}/{stats.xpToNextLevel} XP
          </span>
        </div>
        <Progress value={xpProgress} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {stats.xpToNextLevel - stats.xp} XP to Level {stats.level + 1} 🎯
        </p>
      </Card>

      {/* FEATURED: Thinking Lock Challenge */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-primary/30 to-accent/30 rounded-2xl blur-xl" />
        <Card 
          className="relative p-5 bg-gradient-to-br from-accent/20 via-card to-primary/20 border-2 border-accent/40 cursor-pointer game-button overflow-hidden"
          onClick={onStartLesson}
        >
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <Lock className="w-full h-full" />
          </div>
          
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/30">
              <ShieldCheck className="w-9 h-9 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  THINKING LOCK™
                </span>
                <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm shadow-accent/20 flex-shrink-0 relative z-10">
                  NEW
                </span>
              </div>
              <h3 className="font-black text-lg text-foreground">Today's Challenge</h3>
              <p className="text-sm text-muted-foreground">Think first, code later</p>
            </div>
            <ChevronRight className="w-6 h-6 text-accent" />
          </div>
          
          <div className="relative mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Target className="w-4 h-4" /> Finding Max Element
              </span>
            </div>
            <span className="flex items-center gap-1 text-xp font-bold">
              <Sparkles className="w-4 h-4" /> +50 XP
            </span>
          </div>
        </Card>
      </div>

      {/* What is Thinking Lock Explainer */}
      <Card className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 border-dashed">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">What is Thinking Lock™?</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Unlike traditional coding apps, you must <span className="text-primary font-semibold">explain your approach</span> before the code editor unlocks. 
              This forces you to think like a real developer! 🧠
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors tap-target"
          onClick={onStartQuiz}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <span className="font-bold text-sm">Daily Challenge</span>
            <span className="text-xs text-muted-foreground">Quick quiz • +25 XP</span>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors tap-target relative overflow-hidden group"
          onClick={onStartHackathon}
        >
          <div className="absolute top-0 right-0">
            <div className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg shadow-sm">
              NEW
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-2 mt-2">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Code className="w-6 h-6 text-accent" />
            </div>
            <span className="font-bold text-sm">Mini Hackathon</span>
            <span className="text-xs text-muted-foreground">15 min • +100 XP</span>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors tap-target"
          onClick={onStartParsons}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-sm">Code Puzzles</span>
            <span className="text-xs text-muted-foreground">Drag & drop</span>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors tap-target"
          onClick={onStartDebug}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <Bug className="w-6 h-6 text-destructive" />
            </div>
            <span className="font-bold text-sm">Debug Hunter</span>
            <span className="text-xs text-muted-foreground">Find the bug!</span>
          </div>
        </Card>
      </div>

      {/* AI Interview Button */}
      <Card 
        className="p-4 cursor-pointer bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30 hover:from-accent/30 hover:to-accent/20 transition-all tap-target"
        onClick={onStartInterview}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-bold">AI Interview Prep</h3>
              <p className="text-sm text-muted-foreground">Practice with AI interviewer</p>
            </div>
          </div>
          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-bold">
            NEW
          </span>
        </div>
      </Card>

      {/* Ask AI Button */}
      <Button
        onClick={onOpenAI}
        variant="outline"
        className="w-full h-14 gap-3 text-base font-bold border-2"
      >
        <MessageCircle className="w-5 h-5" />
        Ask AI Helper
      </Button>

      {/* AI Recommendation */}
      <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center float">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">AI Insight</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're doing great with <span className="text-primary font-semibold">Variables</span>! 
              Based on your progress, try practicing <span className="text-accent font-semibold">Loops</span> next.
              Your pattern recognition is <span className="text-correct font-semibold">84%</span> - impressive! 🌟
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
