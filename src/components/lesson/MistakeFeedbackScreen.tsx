import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle, Lightbulb, ArrowRight, Brain } from 'lucide-react';

interface MistakeFeedbackScreenProps {
  wrongAnswer: string;
  correctAnswer: string;
  explanation: string;
  mentalModel: string;
  easierQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
  onContinue: () => void;
  onTryEasier?: () => void;
}

export function MistakeFeedbackScreen({
  wrongAnswer,
  correctAnswer,
  explanation,
  mentalModel,
  easierQuestion,
  onContinue,
  onTryEasier,
}: MistakeFeedbackScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto bg-incorrect/20 rounded-full flex items-center justify-center mb-4 wrong-shake">
          <XCircle className="w-10 h-10 text-incorrect" />
        </div>
        <h1 className="text-2xl font-black text-foreground">Not Quite Right</h1>
        <p className="text-muted-foreground mt-2">But that's okay! Let's learn from it 💪</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* What went wrong */}
        <Card className="p-4 bg-incorrect/10 border-incorrect/30">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <span className="text-incorrect">✗</span> Your Answer
          </h3>
          <p className="text-sm text-muted-foreground">{wrongAnswer}</p>
        </Card>

        {/* Correct answer */}
        <Card className="p-4 bg-correct/10 border-correct/30">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <span className="text-correct">✓</span> Correct Answer
          </h3>
          <p className="text-sm text-foreground font-medium">{correctAnswer}</p>
        </Card>

        {/* Explanation */}
        <Card className="p-4">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-xp" />
            Why?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
        </Card>

        {/* Mental Model */}
        <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent" />
            Think of it this way...
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{mentalModel}</p>
        </Card>

        {/* Easier follow-up suggestion */}
        {easierQuestion && (
          <Card className="p-4 border-2 border-dashed border-primary/30">
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
              <span className="text-lg">🎯</span> Want to try an easier one?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Build your confidence with a simpler version of this concept.
            </p>
            <Button
              variant="outline"
              onClick={onTryEasier}
              className="w-full"
            >
              Try Easier Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>

      {/* Continue Button */}
      <div className="sticky bottom-0 pt-4 bg-background">
        <Button
          onClick={onContinue}
          className="w-full h-14 text-lg font-bold game-button"
        >
          Got it! Continue
        </Button>
      </div>
    </div>
  );
}
