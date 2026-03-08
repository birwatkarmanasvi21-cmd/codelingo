import { useState, useCallback } from 'react';
import { ParsonsProblem, ParsonsLine } from '@/types/game';
import { DraggableCodeLine } from './DraggableCodeLine';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Lightbulb, RotateCcw, CheckCircle2 } from 'lucide-react';

interface ParsonsEditorProps {
  problem: ParsonsProblem;
  onComplete: (correct: boolean) => void;
}

interface PlacedLine extends ParsonsLine {
  currentIndent: number;
}

export function ParsonsEditor({ problem, onComplete }: ParsonsEditorProps) {
  // Shuffle lines initially
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [placedLines, setPlacedLines] = useState<PlacedLine[]>(() =>
    shuffleArray(problem.scrambledLines).map(line => ({
      ...line,
      currentIndent: 0,
    }))
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lineResults, setLineResults] = useState<boolean[]>([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const { gainXp, loseHeart } = useGame();

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    setPlacedLines(prev => {
      const newLines = [...prev];
      const [draggedItem] = newLines.splice(draggedIndex, 1);
      newLines.splice(dropIndex, 0, draggedItem);
      return newLines;
    });

    setDraggedIndex(null);
    setOverIndex(null);
  }, [draggedIndex]);

  const handleIndentChange = useCallback((index: number, delta: number) => {
    setPlacedLines(prev => {
      const newLines = [...prev];
      const newIndent = Math.max(0, Math.min(4, newLines[index].currentIndent + delta));
      newLines[index] = { ...newLines[index], currentIndent: newIndent };
      return newLines;
    });
  }, []);

  const checkSolution = () => {
    const results = placedLines.map((line, index) => {
      const solutionItem = problem.solution[index];
      return line.id === solutionItem.id;
    });

    setLineResults(results);
    setShowResult(true);

    const isCorrect = results.every(r => r);
    if (isCorrect) {
      gainXp(problem.xpReward);
    } else {
      loseHeart();
    }
  };

  const resetProblem = () => {
    setPlacedLines(
      shuffleArray(problem.scrambledLines).map(line => ({
        ...line,
        currentIndent: 0,
      }))
    );
    setShowResult(false);
    setLineResults([]);
    setShowHint(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint && hintIndex < problem.hints.length - 1) {
      setHintIndex(prev => prev + 1);
    }
  };

  const isAllCorrect = lineResults.length > 0 && lineResults.every(r => r);

  return (
    <div className="flex flex-col h-full slide-up">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            problem.difficulty === 'easy' ? 'bg-correct/20 text-correct' :
            problem.difficulty === 'medium' ? 'bg-xp/20 text-xp' :
            'bg-destructive/20 text-destructive'
          }`}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </span>
          <div className="flex gap-2">
            <button onClick={toggleHint} className="p-2 rounded-lg bg-muted hover:bg-muted/80 tap-target">
              <Lightbulb className="w-5 h-5 text-xp" />
            </button>
            <button onClick={resetProblem} className="p-2 rounded-lg bg-muted hover:bg-muted/80 tap-target">
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <h2 className="text-xl font-bold">{problem.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{problem.description}</p>

        {showHint && (
          <div className="mt-3 p-3 rounded-lg bg-xp/10 border border-xp/30">
            <p className="text-sm text-xp">💡 {problem.hints[Math.min(hintIndex, problem.hints.length - 1)]}</p>
          </div>
        )}
      </div>

      {/* Code Lines */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {placedLines.map((line, index) => (
            <DraggableCodeLine
              key={line.id}
              line={line}
              index={index}
              indent={line.currentIndent}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onIndentChange={(delta) => handleIndentChange(index, delta)}
              isDragging={draggedIndex === index}
              isOver={overIndex === index}
              isCorrect={showResult && lineResults[index]}
              isWrong={showResult && !lineResults[index]}
            />
          ))}
        </div>
      </div>

      {/* Result message */}
      {showResult && (
        <div className={`mx-4 p-4 rounded-xl ${
          isAllCorrect ? 'bg-correct/10 border border-correct/30' : 'bg-incorrect/10 border border-incorrect/30'
        }`}>
          <div className="flex items-center gap-3">
            {isAllCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-correct" />
                <div>
                  <p className="font-bold text-correct">Perfect! 🎉</p>
                  <p className="text-sm text-muted-foreground">You got all the lines in the right order!</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-incorrect flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {lineResults.filter(r => !r).length}
                </div>
                <div>
                  <p className="font-bold text-incorrect">Almost there!</p>
                  <p className="text-sm text-muted-foreground">
                    {lineResults.filter(r => !r).length} line(s) need adjusting. Check the order.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="p-4 border-t border-border">
        {!showResult ? (
          <Button
            onClick={checkSolution}
            className="w-full h-14 text-lg font-bold game-button"
          >
            Check Solution
          </Button>
        ) : isAllCorrect ? (
          <Button
            onClick={() => onComplete(true)}
            className="w-full h-14 text-lg font-bold game-button bg-correct hover:bg-correct/90"
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={resetProblem}
            className="w-full h-14 text-lg font-bold game-button"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
