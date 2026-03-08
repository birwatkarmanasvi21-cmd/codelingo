import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Brain,
  Sparkles,
  ShieldCheck,
  Code2,
  Zap
} from 'lucide-react';
import type { ThinkingLockContent } from '@/types/game';

interface ThinkingLockSectionProps {
  content: ThinkingLockContent;
  onSubmit: (
    selectedApproach: number,
    reasoning: string,
    verdict: 'correct' | 'partial' | 'wrong',
    feedback: string,
    xp: number
  ) => void;
  thinkingSubmitted: boolean;
  thinkingResult: 'correct' | 'partial' | 'wrong' | null;
  selectedApproach: number | null;
  setSelectedApproach: (index: number | null) => void;
  reasoning: string;
  setReasoning: (value: string) => void;
}

export function ThinkingLockSection({
  content,
  onSubmit,
  thinkingSubmitted,
  thinkingResult,
  selectedApproach,
  setSelectedApproach,
  reasoning,
  setReasoning,
}: ThinkingLockSectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const [generatedProblem, setGeneratedProblem] = useState<string | null>(null);
  const [generatedApproaches, setGeneratedApproaches] = useState<string[] | null>(null);
  const [generatedCorrectApproach, setGeneratedCorrectApproach] = useState<number | null>(null);
  const [pythonCode, setPythonCode] = useState<string | null>(null);
  const [localVerdict, setLocalVerdict] = useState<'correct' | 'partial' | 'wrong' | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadThinkingLock = async () => {
      try {
        const response = await fetch(
          "https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "generate-thinking-lock",
            }),
          },
        );

        const data = await response.json();
        console.log("[ThinkingLock] raw generate response", data);
        const result =
          typeof data.body === "string" ? JSON.parse(data.body) : data;
        console.log("[ThinkingLock] parsed generate result", result);

        if (
          !isCancelled &&
          result &&
          typeof result.problemStatement === "string" &&
          Array.isArray(result.approaches)
        ) {
          setGeneratedProblem(result.problemStatement);
          setGeneratedApproaches(result.approaches);

          if (typeof result.correctApproach === "string") {
            const idx = result.approaches.indexOf(result.correctApproach);
            setGeneratedCorrectApproach(idx >= 0 ? idx : 0);
          } else if (typeof result.correctApproach === "number") {
            setGeneratedCorrectApproach(result.correctApproach);
          }
        }
      } catch (err) {
        console.error("[ThinkingLock] generate failed", err);
      }
    };

    loadThinkingLock();

    return () => {
      isCancelled = true;
    };
  }, []);

  const problemStatement =
    generatedProblem ?? content.problemStatement;
  const approaches = generatedApproaches ?? content.approaches;
  const correctApproachIndex =
    generatedCorrectApproach ?? content.correctApproach;

  const effectiveResult = thinkingResult ?? localVerdict;

  const handleSubmit = async () => {
    if (selectedApproach === null || reasoning.length < 10) return;

    setIsAnalyzing(true);
    setAnalyzeProgress(0);

    let interval: number | undefined;
    interval = window.setInterval(() => {
      setAnalyzeProgress(prev => {
        const next = prev + 15;
        return next >= 95 ? 95 : next;
      });
    }, 200);

    let verdict: 'correct' | 'partial' | 'wrong' = 'partial';
    let feedback =
      'We are analyzing your thinking. This may take a moment.';
    let xp = 0;

    try {
      const response = await fetch(
        "https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "thinking-evaluate",
            problem: problemStatement,
            approach: approaches[selectedApproach],
            reasoning,
          }),
        },
      );

      const data = await response.json();
      console.log("[ThinkingLock] raw API response", data);
      const result =
        typeof data.body === "string" ? JSON.parse(data.body) : data;
      console.log("[ThinkingLock] parsed result", result);

      const apiVerdict = result.verdict as string | undefined;
      const apiFeedback =
        typeof result.feedback === "string"
          ? result.feedback
          : undefined;

      if (typeof result.pythonCode === "string") {
        setPythonCode(result.pythonCode);
      }

      if (
        apiVerdict === "correct" ||
        apiVerdict === "partial" ||
        apiVerdict === "wrong"
      ) {
        verdict = apiVerdict;
      } else {
        verdict = "partial";
      }

      feedback =
        apiFeedback ??
        (verdict === "correct"
          ? "Your approach and reasoning demonstrate solid understanding. The code editor is now unlocked!"
          : verdict === "partial"
            ? "Right approach! Your reasoning could be more detailed. Consider time complexity and edge cases."
            : "This approach might not be optimal. Think about the time complexity and consider alternative strategies.");

      if (verdict === "correct") {
        xp = 20;
      } else if (verdict === "partial") {
        xp = 10;
      } else {
        xp = 0;
      }
    } catch {
      verdict = "partial";
      feedback =
        "We could not fully analyze your thinking right now. Please try again.";
      xp = 0;
    } finally {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
      setAnalyzeProgress(100);
      setIsAnalyzing(false);
    }

    setAiFeedback(feedback);
    setEarnedXp(xp);
    setLocalVerdict(verdict);
    onSubmit(selectedApproach, reasoning, verdict, feedback, xp);
  };

  const isUnlocked = effectiveResult === 'correct' || effectiveResult === 'partial';
  const reasoningProgress = Math.min((reasoning.length / 50) * 100, 100);

  return (
    <div className="space-y-5 slide-up">
      {/* Prominent Lock Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 rounded-3xl blur-xl" />
        <Card className="relative p-6 text-center bg-gradient-to-b from-card to-muted/30 border-2 border-accent/30">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
            isUnlocked 
              ? 'bg-gradient-to-br from-correct to-correct/60 shadow-lg shadow-correct/30' 
              : isAnalyzing
                ? 'bg-gradient-to-br from-accent to-accent/60 animate-pulse'
                : 'bg-gradient-to-br from-muted to-muted/60'
          }`}>
            {isUnlocked ? (
              <Unlock className="w-12 h-12 text-correct-foreground animate-bounce" />
            ) : isAnalyzing ? (
              <Brain className="w-12 h-12 text-accent-foreground animate-spin" />
            ) : (
              <Lock className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          
          <h2 className="text-2xl font-black text-foreground flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-accent" />
            Thinking Lock™
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            {isUnlocked 
              ? "Your thinking is approved! Code editor unlocked." 
              : "Explain your approach before seeing the solution"
            }
          </p>

          {/* Lock Status Indicators */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedApproach !== null ? 'bg-correct/20 text-correct' : 'bg-muted text-muted-foreground'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              Approach
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              reasoning.length >= 10 ? 'bg-correct/20 text-correct' : 'bg-muted text-muted-foreground'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              Reasoning
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isUnlocked ? 'bg-correct/20 text-correct' : 'bg-muted text-muted-foreground'
            }`}>
              {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              Code
            </div>
          </div>
        </Card>
      </div>

      {/* Problem Statement */}
      <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">Problem</p>
            <p className="font-medium text-foreground leading-relaxed">{problemStatement}</p>
          </div>
        </div>
      </Card>

      {/* Approach Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <p className="font-bold text-sm">Step 1: Choose your approach</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {approaches.map((approach, index) => (
            <Card
              key={index}
              onClick={() => !thinkingSubmitted && setSelectedApproach(index)}
              className={`p-4 cursor-pointer transition-all tap-target relative overflow-hidden ${
                thinkingSubmitted
                  ? index === correctApproachIndex
                    ? 'ring-2 ring-correct bg-correct/10 border-correct'
                    : selectedApproach === index && index !== correctApproachIndex
                      ? 'ring-2 ring-incorrect bg-incorrect/10 border-incorrect'
                      : 'opacity-40'
                  : selectedApproach === index
                    ? 'ring-2 ring-primary bg-primary/10 border-primary scale-[1.02]'
                    : 'hover:bg-muted hover:border-primary/50'
              }`}
            >
              {selectedApproach === index && !thinkingSubmitted && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
              )}
              {thinkingSubmitted && index === correctApproachIndex && (
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-5 h-5 text-correct" />
                </div>
              )}
              <span className="font-semibold text-sm block pr-6">{approach}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Reasoning Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-secondary" />
            <p className="font-bold text-sm">Step 2: Explain your reasoning</p>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            reasoning.length >= 50 ? 'bg-correct/20 text-correct' : 
            reasoning.length >= 10 ? 'bg-xp/20 text-xp' : 
            'bg-muted text-muted-foreground'
          }`}>
            {reasoning.length}/50
          </span>
        </div>
        <Textarea
          placeholder="Why would this approach work? What's the time/space complexity? What are the steps?"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          disabled={thinkingSubmitted}
          className="min-h-28 text-base resize-none border-2 focus:border-primary"
        />
        <div className="space-y-1">
          <Progress value={reasoningProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {reasoning.length < 10 
              ? `Need ${10 - reasoning.length} more characters to submit` 
              : reasoning.length < 50
                ? `Good start! Add ${50 - reasoning.length} more for bonus XP`
                : "Great explanation! 🎯"
            }
          </p>
        </div>
      </div>

      {/* AI Analysis Progress */}
      {isAnalyzing && (
        <Card className="p-4 bg-accent/10 border-accent/30">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-accent animate-pulse" />
            <div className="flex-1">
              <p className="font-bold text-sm mb-2">AI is analyzing your thinking...</p>
              <Progress value={analyzeProgress} className="h-2" />
            </div>
          </div>
        </Card>
      )}

      {/* AI Feedback Result */}
      {effectiveResult && !isAnalyzing && (
        <Card className={`p-5 transition-all ${
          effectiveResult === 'correct' ? 'bg-correct/10 border-correct border-2' : 
          effectiveResult === 'partial' ? 'bg-xp/10 border-xp border-2' :
          'bg-incorrect/10 border-incorrect border-2'
        }`}>
          <div className="flex gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
              effectiveResult === 'correct' ? 'bg-correct/20' :
              effectiveResult === 'partial' ? 'bg-xp/20' :
              'bg-incorrect/20'
            }`}>
              {effectiveResult === 'correct' && <CheckCircle2 className="w-8 h-8 text-correct" />}
              {effectiveResult === 'partial' && <AlertCircle className="w-8 h-8 text-xp" />}
              {effectiveResult === 'wrong' && <XCircle className="w-8 h-8 text-incorrect" />}
            </div>
            <div className="flex-1">
              <p className={`font-bold text-lg mb-1 ${
                effectiveResult === 'correct' ? 'text-correct' :
                effectiveResult === 'partial' ? 'text-xp' :
                'text-incorrect'
              }`}>
                {effectiveResult === 'correct' && 'Excellent Thinking! 🧠✨'}
                {effectiveResult === 'partial' && 'Good Direction! 💡'}
                {effectiveResult === 'wrong' && 'Let\'s Reconsider 🔄'}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {aiFeedback ??
                  ((effectiveResult === 'correct' && 'Your approach and reasoning demonstrate solid understanding. The code editor is now unlocked!') ??
                  (effectiveResult === 'partial' && 'Right approach! Your reasoning could be more detailed. Consider time complexity and edge cases.') ??
                  (effectiveResult === 'wrong' && 'This approach might not be optimal. Think about the time complexity - a simpler iteration pattern could work better here.') ??
                  'We could not fully analyze your thinking right now. Please try again.')}
              </p>
              {earnedXp !== null && earnedXp > 0 && (
                <div className="flex items-center gap-2 mt-3 text-correct">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    +{earnedXp} XP Thinking Bonus!
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Blurred Code Editor Preview */}
      <div className="relative">
        <div className={`transition-all duration-500 ${isUnlocked ? '' : 'blur-sm pointer-events-none select-none'}`}>
          <Card className="p-4 bg-code-bg border-code-line">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-foreground">solution.py</span>
              {isUnlocked ? (
                <span className="text-xs text-correct flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> Unlocked
                </span>
              ) : (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </div>
            <pre className="text-sm font-mono text-correct/80 whitespace-pre-wrap leading-relaxed">
{pythonCode ?? `def find_max(arr):
    if not arr:
        return None
    
    max_val = arr[0]
    for num in arr[1:]:
        if num > max_val:
            max_val = num
    
    return max_val`}
            </pre>
          </Card>
        </div>

        {/* Lock Overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-bold text-foreground">Code Editor Locked</p>
              <p className="text-xs text-muted-foreground mt-1">
                Submit your thinking to unlock
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      {!thinkingSubmitted && (
        <Button
          onClick={handleSubmit}
          disabled={selectedApproach === null || reasoning.length < 10 || isAnalyzing}
          className="w-full h-14 text-lg font-bold game-button"
        >
          {isAnalyzing ? (
            <>
              <Brain className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Submit Thinking
            </>
          )}
        </Button>
      )}
    </div>
  );
}
