import { useState } from 'react';
import { ParsonsEditor } from '@/components/parsons/ParsonsEditor';
import { parsonsProblems } from '@/data/mockData';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParsonsScreenProps {
  onBack: () => void;
}

export function ParsonsScreen({ onBack }: ParsonsScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentProblem = parsonsProblems[currentIndex];
  const progress = ((currentIndex + 1) / parsonsProblems.length) * 100;

  const handleComplete = (correct: boolean) => {
    if (correct) setCompletedCount(prev => prev + 1);

    if (currentIndex < parsonsProblems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const isPerfect = completedCount === parsonsProblems.length;

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center slide-up">
        <div className="text-6xl mb-4">{isPerfect ? '🧩' : '✨'}</div>
        <h1 className="text-3xl font-black mb-2">
          {isPerfect ? 'Code Master!' : 'Well Done!'}
        </h1>
        <p className="text-muted-foreground mb-6">
          You solved {completedCount} out of {parsonsProblems.length} puzzles
        </p>
        <div className="flex gap-2 mb-8">
          {parsonsProblems.map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full ${
                index < completedCount ? 'bg-correct' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <Button onClick={onBack} className="w-full max-w-xs h-14 text-lg font-bold game-button">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress Header */}
      <div className="sticky top-0 z-10 bg-background p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="tap-target">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent progress-fill rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            {currentIndex + 1}/{parsonsProblems.length}
          </span>
        </div>
      </div>

      {/* Parsons Problem */}
      <ParsonsEditor
        key={currentProblem.id}
        problem={currentProblem}
        onComplete={handleComplete}
      />
    </div>
  );
}
