import { useState } from "react";
import { QuizQuestion } from "@/types/game";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface QuizCardProps {
  question: QuizQuestion;
  onComplete: (correct: boolean) => void;
}

export function QuizCard({ question, onComplete }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { gainXp, loseHeart } = useGame();

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);

    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) {
      gainXp(question.xpReward);
    } else {
      loseHeart();
    }
  };

  const handleContinue = () => {
    onComplete(selectedAnswer === question.correctAnswer);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="flex flex-col h-full slide-up">
      {/* Question */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              question.difficulty === "easy"
                ? "bg-correct/20 text-correct"
                : question.difficulty === "medium"
                  ? "bg-xp/20 text-xp"
                  : "bg-destructive/20 text-destructive"
            }`}
          >
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-4">{question.question}</h2>

        {question.code && (
          <div className="code-block mb-6">
            <pre className="whitespace-pre-wrap">{question.code}</pre>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all tap-target ${
                showResult
                  ? index === question.correctAnswer
                    ? "border-correct bg-correct/10 text-correct correct-bounce"
                    : index === selectedAnswer
                      ? "border-incorrect bg-incorrect/10 text-incorrect wrong-shake"
                      : "border-muted bg-muted/30 text-muted-foreground"
                  : selectedAnswer === index
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    showResult
                      ? index === question.correctAnswer
                        ? "bg-correct text-primary-foreground"
                        : index === selectedAnswer
                          ? "bg-incorrect text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      : selectedAnswer === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                {showResult && index === question.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 ml-auto text-correct" />
                )}
                {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                  <XCircle className="w-5 h-5 ml-auto text-incorrect" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showResult && (
          <div
            className={`mt-6 p-4 rounded-xl ${
              isCorrect ? "bg-correct/10 border border-correct/30" : "bg-incorrect/10 border border-incorrect/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <Lightbulb className={`w-5 h-5 mt-0.5 ${isCorrect ? "text-correct" : "text-incorrect"}`} />
              <div>
                <p className={`font-semibold mb-1 ${isCorrect ? "text-correct" : "text-incorrect"}`}>
                  {isCorrect ? "Excellent! 🎉" : "Not quite!"}
                </p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-4 border-t border-border">
        {!showResult ? (
          <Button
            onClick={handleCheck}
            disabled={selectedAnswer === null}
            className="w-full h-14 text-lg font-bold game-button"
          >
            Check Answer
          </Button>
        ) : (
          <Button
            onClick={handleContinue}
            className={`w-full h-14 text-lg font-bold game-button ${
              isCorrect ? "bg-correct hover:bg-correct/90" : "bg-primary hover:bg-primary/90"
            }`}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
