import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { debugChallenges } from '@/data/mockData';
import { X, Bug, Clock, CheckCircle2, XCircle, Zap } from 'lucide-react';

interface DebugHunterScreenProps {
  onBack: () => void;
}

export function DebugHunterScreen({ onBack }: DebugHunterScreenProps) {
  const { gainXp, loseHeart, stats } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(debugChallenges[0].timeLimit);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'wrong' | 'timeout'>('playing');
  const [score, setScore] = useState(0);

  const challenge = debugChallenges[currentChallenge];
  const codeLines = challenge.code.split('\n');

  const handleTimeout = useCallback(() => {
    setGameState('timeout');
    loseHeart();
  }, [loseHeart]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, handleTimeout]);

  const handleLineSelect = (lineIndex: number) => {
    if (gameState !== 'playing') return;
    setSelectedLine(lineIndex);
  };

  const handleSubmit = () => {
    if (selectedLine === null) return;

    if (selectedLine === challenge.buggyLine) {
      setGameState('correct');
      const xpEarned = Math.floor(challenge.xpReward * (timeLeft / challenge.timeLimit));
      setScore(score + xpEarned);
      gainXp(xpEarned);
    } else {
      setGameState('wrong');
      loseHeart();
    }
  };

  const handleNext = () => {
    if (currentChallenge < debugChallenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedLine(null);
      setTimeLeft(debugChallenges[currentChallenge + 1].timeLimit);
      setGameState('playing');
    } else {
      onBack();
    }
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / challenge.timeLimit) * 100;
    if (percentage > 50) return 'text-correct';
    if (percentage > 25) return 'text-xp';
    return 'text-incorrect';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Zap className="w-5 h-5 text-xp" />
              <span className="font-bold">{score}</span>
            </div>
            <div className={`flex items-center gap-1 ${getTimeColor()}`}>
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">{timeLeft}s</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-heart">
            <span className="text-lg">❤️</span>
            <span className="font-bold">{stats.hearts}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6 slide-up">
          {/* Title */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center mb-3">
              <Bug className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Find the Bug! 🐛</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tap the line with the error
            </p>
          </div>

          {/* Code Block */}
          <Card className="p-0 overflow-hidden bg-code-bg">
            {codeLines.map((line, index) => (
              <div
                key={index}
                onClick={() => handleLineSelect(index)}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all tap-target ${
                  gameState !== 'playing' && index === challenge.buggyLine
                    ? 'bg-incorrect/30'
                    : selectedLine === index
                      ? 'bg-primary/30'
                      : 'hover:bg-muted/20'
                } ${
                  gameState === 'correct' && index === challenge.buggyLine
                    ? 'ring-2 ring-correct ring-inset'
                    : ''
                }`}
              >
                <span className="text-xs text-muted-foreground w-6">{index + 1}</span>
                <code className="text-sm font-mono text-correct whitespace-pre">
                  {line || ' '}
                </code>
              </div>
            ))}
          </Card>

          {/* Result */}
          {gameState !== 'playing' && (
            <Card className={`p-4 ${
              gameState === 'correct' ? 'bg-correct/10 border-correct' :
              'bg-incorrect/10 border-incorrect'
            }`}>
              <div className="flex gap-3">
                {gameState === 'correct' ? (
                  <CheckCircle2 className="w-6 h-6 text-correct flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-incorrect flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-sm mb-1">
                    {gameState === 'correct' && 'Bug Found! 🎯'}
                    {gameState === 'wrong' && 'Not quite! 🔍'}
                    {gameState === 'timeout' && 'Time\'s up! ⏰'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {challenge.bugDescription}
                  </p>
                  <div className="mt-2 p-2 bg-code-bg rounded">
                    <code className="text-xs text-correct">{challenge.fix}</code>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        {gameState === 'playing' ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedLine === null}
            className="w-full h-14 text-lg font-bold game-button bg-destructive hover:bg-destructive/90"
          >
            <Bug className="w-5 h-5 mr-2" />
            Submit Bug Location
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full h-14 text-lg font-bold game-button"
          >
            {currentChallenge === debugChallenges.length - 1 ? 'Finish' : 'Next Challenge'}
          </Button>
        )}
      </div>
    </div>
  );
}
