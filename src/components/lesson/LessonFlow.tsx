import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ThinkingLockSection } from '@/components/lesson/ThinkingLockSection';
import { useGame } from '@/contexts/GameContext';
import { sampleLesson } from '@/data/mockData';
import { 
  X, 
  ChevronRight, 
  Lightbulb, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';
import type { 
  ExplainContent, 
  PracticeContent, 
  ThinkingLockContent 
} from '@/types/game';

interface LessonFlowProps {
  onBack: () => void;
}

export function LessonFlow({ onBack }: LessonFlowProps) {
  const { gainXp, loseHeart, stats } = useGame();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [thinkingSubmitted, setThinkingSubmitted] = useState(false);
  const [thinkingResult, setThinkingResult] = useState<'correct' | 'partial' | 'wrong' | null>(null);

  const lesson = sampleLesson;
  const step = lesson.steps[currentStep];
  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  const handleNext = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setSelectedApproach(null);
      setReasoning('');
      setThinkingSubmitted(false);
      setThinkingResult(null);
    } else {
      gainXp(lesson.xpReward);
      onBack();
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    
    const content = step.content as PracticeContent;
    if (selectedAnswer === content.question.correctAnswer) {
      gainXp(content.question.xpReward);
    } else {
      loseHeart();
    }
  };

  const handleThinkingSubmit = (
    approach: number,
    reason: string,
    verdict: 'correct' | 'partial' | 'wrong',
    feedback: string,
    xp: number
  ) => {
    setThinkingSubmitted(true);
    setThinkingResult(verdict);
    
    // Evaluate the verdict provided by the AI (or local fallback)
    if (verdict === 'correct') {
      gainXp(xp); // Give the thinking lock bonus xp
      // XP button shown dynamically in bottom action bar
    } else if (verdict === 'partial') {
      gainXp(xp);
    } else {
      loseHeart();
    }
  };

  const handleThinkingContinue = () => {
     // Now navigating straight back to home
     gainXp(lesson.xpReward);
     onBack();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-6 h-6" />
          </Button>
          <span className="font-bold text-sm">{lesson.title}</span>
          <div className="flex items-center gap-1 text-heart">
            <span className="text-lg">❤️</span>
            <span className="font-bold">{stats.hearts}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-32">
        {/* Explain Step */}
        {step.type === 'explain' && (
          <div className="space-y-6 slide-up">
            {(() => {
              const content = step.content as ExplainContent;
              return (
                <>
                  <div className="text-center">
                    <span className="text-5xl mb-4 block">📖</span>
                    <h2 className="text-2xl font-black text-foreground">{content.title}</h2>
                  </div>

                  <Card className="p-4">
                    <p className="text-foreground leading-relaxed">{content.explanation}</p>
                  </Card>

                  <Card className="p-4 bg-code-bg">
                    <p className="text-xs text-muted-foreground mb-2">Example:</p>
                    <pre className="text-sm font-mono text-correct whitespace-pre-wrap">
                      {content.example}
                    </pre>
                  </Card>

                  <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
                    <div className="flex gap-3">
                      <Lightbulb className="w-6 h-6 text-xp flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm mb-1">Think of it like this...</p>
                        <p className="text-sm text-muted-foreground">{content.analogy}</p>
                      </div>
                    </div>
                  </Card>
                </>
              );
            })()}
          </div>
        )}

        {/* Practice Step */}
        {step.type === 'practice' && (
          <div className="space-y-6 slide-up">
            {(() => {
              const content = step.content as PracticeContent;
              const question = content.question;
              const isCorrect = selectedAnswer === question.correctAnswer;
              
              return (
                <>
                  <div className="text-center">
                    <span className="text-5xl mb-4 block">🧠</span>
                    <h2 className="text-xl font-bold text-foreground">{question.question}</h2>
                  </div>

                  {question.code && (
                    <Card className="p-4 bg-code-bg">
                      <pre className="text-sm font-mono text-correct whitespace-pre-wrap">
                        {question.code}
                      </pre>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <Card
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`p-4 cursor-pointer transition-all tap-target ${
                          showResult
                            ? index === question.correctAnswer
                              ? 'ring-2 ring-correct bg-correct/10'
                              : selectedAnswer === index
                                ? 'ring-2 ring-incorrect bg-incorrect/10'
                                : ''
                            : selectedAnswer === index
                              ? 'ring-2 ring-primary bg-primary/10'
                              : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {showResult && index === question.correctAnswer && (
                            <CheckCircle2 className="w-5 h-5 text-correct" />
                          )}
                          {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                            <XCircle className="w-5 h-5 text-incorrect" />
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {showResult && (
                    <Card className={`p-4 ${isCorrect ? 'bg-correct/10 border-correct' : 'bg-incorrect/10 border-incorrect'}`}>
                      <div className="flex gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-correct flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-incorrect flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-sm mb-1">
                            {isCorrect ? 'Correct! 🎉' : 'Not quite! 💪'}
                          </p>
                          <p className="text-sm text-muted-foreground">{question.explanation}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Thinking Lock Step - Now using dedicated component */}
        {step.type === 'thinking-lock' && (
          <ThinkingLockSection
            content={step.content as ThinkingLockContent}
            onSubmit={handleThinkingSubmit}
            thinkingSubmitted={thinkingSubmitted}
            thinkingResult={thinkingResult}
            selectedApproach={selectedApproach}
            setSelectedApproach={setSelectedApproach}
            reasoning={reasoning}
            setReasoning={setReasoning}
          />
        )}

        {/* Feedback Step */}
        {step.type === 'feedback' && (
          <div className="space-y-6 slide-up text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-correct/20 flex items-center justify-center">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-2xl font-black text-foreground">Lesson Complete!</h2>
            <p className="text-muted-foreground">
              You've mastered the basics of loops. Keep up the great work!
            </p>
            <Card className="p-6 bg-gradient-to-r from-xp/10 to-xp/5">
              <div className="text-center">
                <span className="text-4xl font-black text-xp xp-pop">+{lesson.xpReward} XP</span>
                <p className="text-sm text-muted-foreground mt-2">Added to your total</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        {step.type === 'practice' && !showResult ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={selectedAnswer === null}
            className="w-full h-14 text-lg font-bold game-button"
          >
            Check Answer
          </Button>
        ) : step.type === 'thinking-lock' && (!thinkingSubmitted || thinkingResult === null) ? (
          // ThinkingLockSection handles its own submit button while evaluating
          null
        ) : step.type === 'thinking-lock' && (thinkingResult === 'correct' || thinkingResult === 'partial') ? (
           <Button
             onClick={handleThinkingContinue}
             className="w-full h-14 text-lg font-bold game-button bg-xp hover:bg-xp/90 text-xp-foreground"
           >
             <Sparkles className="w-5 h-5 mr-2" />
             Collect XP
           </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full h-14 text-lg font-bold game-button"
          >
            {currentStep === lesson.steps.length - 1 ? 'Finish Lesson' : 'Continue'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
