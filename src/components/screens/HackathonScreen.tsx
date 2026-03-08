import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { miniHackathons } from '@/data/mockData';
import { 
  X, 
  Clock, 
  Code, 
  ChevronRight, 
  CheckCircle2, 
  Trophy,
  Brain,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface HackathonScreenProps {
  onBack: () => void;
}

const approaches = [
  'Brute Force',
  'Hash Map',
  'Two Pointers',
  'Sorting',
  'Binary Search',
  'Dynamic Programming',
];

const INTERVIEW_API_URL =
  'https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview';

export function HackathonScreen({ onBack }: HackathonScreenProps) {
  const { gainXp, stats } = useGame();
  const [hackathon] = useState(miniHackathons[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(hackathon.timeLimit);
  const [selectedApproach, setSelectedApproach] = useState<string | null>(null);
  const [explanation, setExplanation] = useState('');
  const [code, setCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [aiProblem, setAiProblem] = useState<{
    title: string;
    description: string;
    difficulty: string;
  } | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const step = hackathon.steps[currentStep];
  const progress = ((currentStep + 1) / hackathon.steps.length) * 100;

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete]);

  useEffect(() => {
    let cancelled = false;
    const generateHackathon = async () => {
      setIsGenerating(true);
      try {
        const res = await fetch(INTERVIEW_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'generate-hackathon' }),
        });
        if (!res.ok) {
          throw new Error(`Generate failed (${res.status})`);
        }
        const data = await res.json();
        if (cancelled) return;
        const title = typeof data?.title === 'string' ? data.title : hackathon.title;
        const description =
          typeof data?.description === 'string' ? data.description : hackathon.description;
        const difficulty = typeof data?.difficulty === 'string' ? data.difficulty : 'unknown';
        setAiProblem({ title, description, difficulty });
      } catch {
        if (cancelled) return;
        // Keep default hackathon data; user can still play.
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    };

    generateHackathon();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const evaluateStep = async () => {
    const problemTitle = aiProblem?.title ?? hackathon.title;
    const problemDescription = aiProblem?.description ?? hackathon.description;

    let approach = '';
    let explanationPayload = '';
    let codePayload = '';

    if (step.type === 'approach') {
      approach = selectedApproach ?? '';
    } else if (step.type === 'logic' || step.type === 'design') {
      explanationPayload = explanation;
      approach = selectedApproach ?? '';
    } else if (step.type === 'code') {
      codePayload = code;
      approach = selectedApproach ?? '';
      explanationPayload = explanation;
    }

    const res = await fetch(INTERVIEW_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'hackathon-evaluate',
        problemTitle,
        problemDescription,
        approach,
        explanation: explanationPayload,
        code: codePayload,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Evaluate failed (${res.status})`);
    }

    return res.json() as Promise<{
      verdict?: string;
      score?: number;
      feedback?: string;
    }>;
  };

  const handleNext = async () => {
    if (isGenerating || isEvaluating) return;

    if (!canProceed() && step.type !== 'code') {
      return;
    }

    setIsEvaluating(true);
    setAiFeedback(null);

    try {
      const result = await evaluateStep();
      const verdict = result.verdict ?? null;
      const score = typeof result.score === 'number' ? result.score : null;
      const feedback = typeof result.feedback === 'string' ? result.feedback : null;

      setAiVerdict(verdict);
      setAiScore(score);
      setAiFeedback(feedback);

      const isApproachStep = step.type === 'approach';
      const passed =
        isApproachStep ||
        verdict === 'pass' ||
        (typeof score === 'number' && score >= 6);

      if (!passed) {
        return; // Stay on the same step
      }

      const isLastStep = currentStep === hackathon.steps.length - 1;

      if (isLastStep) {
        setIsComplete(true);
        const baseReward = hackathon.xpReward;
        const gainedXp =
          typeof score === 'number'
            ? Math.floor((score / 10) * baseReward)
            : baseReward;
        gainXp(gainedXp);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch {
      setAiFeedback('Could not evaluate your submission. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const canProceed = () => {
    switch (step?.type) {
      case 'approach':
        return selectedApproach !== null;
      case 'logic':
        return explanation.length > 20;
      case 'code':
      case 'design':
        return true; // Optional
      default:
        return false;
    }
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / hackathon.timeLimit) * 100;
    if (percentage > 50) return 'text-correct';
    if (percentage > 25) return 'text-xp';
    return 'text-incorrect';
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-xp/20 flex items-center justify-center mb-6 xp-pop">
            <Trophy className="w-12 h-12 text-xp" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">
            Hackathon Complete! 🎉
          </h1>
          <p className="text-muted-foreground mb-8">
            Great job tackling the {hackathon.title}!
          </p>

          <Card className="p-6 w-full max-w-sm bg-gradient-to-r from-xp/10 to-xp/5 mb-6">
            <div className="text-center">
              <span className="text-5xl font-black text-xp">+{hackathon.xpReward}</span>
              <p className="text-xp font-bold mt-1">XP Earned!</p>
            </div>
          </Card>

          <div className="space-y-3 w-full max-w-sm">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Time Remaining</span>
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Steps Completed</span>
              <span className="font-bold">{hackathon.steps.length}/{hackathon.steps.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Approach Used</span>
              <span className="font-bold">{selectedApproach || 'N/A'}</span>
            </div>
          </div>

          <Button onClick={onBack} className="w-full max-w-sm mt-8 h-14 text-lg font-bold game-button">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-6 h-6" />
          </Button>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted ${getTimeColor()}`}>
            <Clock className="w-5 h-5" />
            <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-1 text-heart">
            <span className="text-lg">❤️</span>
            <span className="font-bold">{stats.hearts}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {hackathon.steps.map((s, i) => (
            <span key={i} className={i <= currentStep ? 'text-primary font-bold' : ''}>
              Step {i + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6 slide-up">
          {/* Hackathon Title */}
          <Card className="p-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8" />
              <div>
                <h2 className="font-bold text-lg">{aiProblem?.title ?? hackathon.title}</h2>
                <p className="text-sm opacity-90">
                  {aiProblem?.description ?? hackathon.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Current Step */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3">
              {step.type === 'approach' && <Brain className="w-8 h-8 text-primary" />}
              {step.type === 'logic' && <Lightbulb className="w-8 h-8 text-xp" />}
              {step.type === 'code' && <Code className="w-8 h-8 text-accent" />}
              {step.type === 'design' && <Rocket className="w-8 h-8 text-secondary" />}
            </div>
            <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
          </div>

          {/* Step Content */}
          {step.type === 'approach' && (
            <div className="grid grid-cols-2 gap-2">
              {approaches.map((approach) => (
                <Card
                  key={approach}
                  onClick={() => setSelectedApproach(approach)}
                  className={`p-3 cursor-pointer text-center text-sm transition-all tap-target ${
                    selectedApproach === approach
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-muted'
                  }`}
                >
                  {approach}
                </Card>
              ))}
            </div>
          )}

          {step.type === 'logic' && (
            <div>
              <Textarea
                placeholder="Explain your approach step by step..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="min-h-32"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {explanation.length} characters (min 20)
              </p>
            </div>
          )}

          {step.type === 'code' && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Optional: Write your solution</p>
              <Textarea
                placeholder="// Write your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-40 font-mono text-sm bg-code-bg text-correct"
              />
            </div>
          )}

          {step.type === 'design' && (
            <div>
              <Textarea
                placeholder="Describe your component structure, state management, and key decisions..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="min-h-32"
              />
            </div>
          )}

          {aiFeedback && (
            <Card className="p-4">
              <p className="font-bold text-sm mb-1">AI Feedback</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {aiFeedback}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Verdict: {aiVerdict ?? 'N/A'}
                {aiScore !== null && ` • Score: ${aiScore}/10`}
              </p>
            </Card>
          )}

          {/* Tips */}
          <Card className="p-4 bg-accent/10 border-accent/30">
            <div className="flex gap-3">
              <Lightbulb className="w-6 h-6 text-xp flex-shrink-0" />
              <div>
                <p className="font-bold text-sm mb-1">Pro Tip 💡</p>
                <p className="text-sm text-muted-foreground">
                  {step.type === 'approach' && 'Think about time and space complexity before choosing!'}
                  {step.type === 'logic' && 'Break down the problem into smaller steps. What would you do first?'}
                  {step.type === 'code' && 'Don\'t worry about perfect syntax - focus on the logic!'}
                  {step.type === 'design' && 'Consider edge cases and user interactions.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <Button
          onClick={handleNext}
          disabled={isGenerating || isEvaluating || (!canProceed() && step.type !== 'code')}
          className="w-full h-14 text-lg font-bold game-button"
        >
          {isGenerating
            ? 'Generating problem...'
            : isEvaluating
            ? 'Evaluating...'
            : currentStep === hackathon.steps.length - 1
            ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Complete Hackathon
              </>
              )
            : (
              <>
                Next Step
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
              )}
        </Button>
      </div>
    </div>
  );
}
