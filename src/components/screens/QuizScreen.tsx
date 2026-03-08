import { useState } from 'react';
import { QuizCard } from '@/components/quiz/QuizCard';
import { quizQuestions } from '@/data/mockData';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizScreenProps {
  onBack: () => void;
}

export function QuizScreen({ onBack }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100;

  const handleComplete = (correct: boolean) => {
    if (correct) setCorrectCount(prev => prev + 1);

    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const percentage = Math.round((correctCount / quizQuestions.length) * 100);
    const isPerfect = percentage === 100;

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center slide-up">
        <div className="text-6xl mb-4">{isPerfect ? '🏆' : percentage >= 70 ? '🌟' : '💪'}</div>
        <h1 className="text-3xl font-black mb-2">
          {isPerfect ? 'Perfect!' : percentage >= 70 ? 'Great Job!' : 'Keep Practicing!'}
        </h1>
        <p className="text-muted-foreground mb-6">
          You got {correctCount} out of {quizQuestions.length} correct
        </p>
        <div className="w-48 h-48 relative mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={isPerfect ? 'hsl(var(--correct-green))' : 'hsl(var(--primary))'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 5.53} 553`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black">{percentage}%</span>
          </div>
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
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onBack} className="tap-target">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary progress-fill rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            {currentIndex + 1}/{quizQuestions.length}
          </span>
        </div>
      </div>

      {/* Question */}
      <QuizCard
        key={currentQuestion.id}
        question={currentQuestion}
        onComplete={handleComplete}
      />
    </div>
  );
}
