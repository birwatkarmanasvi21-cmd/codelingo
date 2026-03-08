import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ThinkingLockSection } from '@/components/lesson/ThinkingLockSection';
import { useGame } from '@/contexts/GameContext';
import { 
  X, 
  ChevronRight,
  Clock,
  Target,
  Flame,
  Trophy
} from 'lucide-react';
import type { ThinkingLockContent } from '@/types/game';

interface ProblemScreenProps {
  onBack: () => void;
}

// Sample problem data
const sampleProblem: ThinkingLockContent = {
  problemStatement: "....",
  approaches: ['....', '....', '....', '....'],
  correctApproach: 0,
  hint: 'Think about what information you need to track as you iterate through the array.'
};

export function ProblemScreen({ onBack }: ProblemScreenProps) {
  const { stats, gainXp } = useGame();
  const [selectedApproach, setSelectedApproach] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [thinkingSubmitted, setThinkingSubmitted] = useState(false);
  const [thinkingResult, setThinkingResult] = useState<'correct' | 'partial' | 'wrong' | null>(null);

  const handleThinkingSubmit = (approach: number, reason: string) => {
    setThinkingSubmitted(true);
    
    // Simulate AI evaluation
    if (approach === sampleProblem.correctApproach && reason.length > 30) {
      setThinkingResult('correct');
      gainXp(20);
    } else if (approach === sampleProblem.correctApproach) {
      setThinkingResult('partial');
      gainXp(10);
    } else {
      setThinkingResult('wrong');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">Thinking Challenge</span>
          </div>
          <div className="flex items-center gap-1 text-heart">
            <span className="text-lg">❤️</span>
            <span className="font-bold">{stats.hearts}</span>
          </div>
        </div>
        
        {/* Problem Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> ~5 min
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-streak" /> Easy
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-xp" /> +20 XP
          </span>
        </div>
        
        <Progress value={thinkingSubmitted ? 100 : 50} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-32">
        <ThinkingLockSection
          content={sampleProblem}
          onSubmit={handleThinkingSubmit}
          thinkingSubmitted={thinkingSubmitted}
          thinkingResult={thinkingResult}
          selectedApproach={selectedApproach}
          setSelectedApproach={setSelectedApproach}
          reasoning={reasoning}
          setReasoning={setReasoning}
        />
      </div>

      {/* Bottom Action - Only show Continue after success */}
      {thinkingResult && (
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          <Button
            onClick={onBack}
            className="w-full h-14 text-lg font-bold game-button"
          >
            {thinkingResult === 'correct' ? 'Continue to Code' : 'Try Another Problem'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
