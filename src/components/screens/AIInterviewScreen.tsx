import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useGame } from '@/contexts/GameContext';
import { 
  X, 
  ChevronRight, 
  MessageSquare, 
  Bot, 
  User, 
  Brain, 
  Target, 
  MessageCircle, 
  TrendingUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface AIInterviewScreenProps {
  onBack: () => void;
}

type InterviewPhase = 'setup' | 'interview' | 'evaluation' | 'feedback';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

const INTERVIEW_API_URL =
  'https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview';

type GenerateResponse = { question: string };
type EvaluateResponse = {
  verdict: 'correct' | 'partial' | 'wrong';
  score: number;
  feedback: string;
  followUp?: string;
};

const roles = [
  { id: 'frontend', name: 'Frontend Dev', icon: '🎨' },
  { id: 'backend', name: 'Backend Dev', icon: '⚙️' },
  { id: 'dsa', name: 'DSA Focus', icon: '🧮' },
  { id: 'fullstack', name: 'Full Stack', icon: '🚀' },
];

const difficulties = [
  { id: 'easy', name: 'Easy', description: 'Entry level' },
  { id: 'medium', name: 'Medium', description: 'Intermediate' },
  { id: 'hard', name: 'Hard', description: 'Senior level' },
];

const interviewTypes = [
  { id: 'hr', name: 'HR Round', icon: '👔' },
  { id: 'technical', name: 'Technical', icon: '💻' },
  { id: 'thinking', name: 'Thinking', icon: '🧠' },
];

const mockQuestions = [
  "Let's start with a warm-up. Can you explain what happens when you type a URL in a browser?",
  "Good! Now, how would you approach building a real-time chat application?",
  "Interesting! What data structures would you use to implement an autocomplete feature?",
  "Nice thinking! How would you optimize a slow database query?",
  "Final question: Describe a challenging bug you fixed and your debugging process.",
];

export function AIInterviewScreen({ onBack }: AIInterviewScreenProps) {
  const { gainXp, userProfile } = useGame();
  const [phase, setPhase] = useState<InterviewPhase>('setup');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedType, setSelectedType] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const isMountedRef = useRef(true);

  // Mock scores
  const scores = {
    logic: 85,
    confidence: 72,
    communication: 90,
    depth: 78,
  };

  const appendAIMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      { id: (Date.now() + Math.random()).toString(), role: 'ai', content },
    ]);
  };

  const appendUserMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      { id: (Date.now() + Math.random()).toString(), role: 'user', content },
    ]);
  };

  const postInterview = async <T,>(
    body: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<T> => {
    const res = await fetch(INTERVIEW_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Request failed (${res.status})`);
    }

    return (await res.json()) as T;
  };

  const generateQuestion = async (signal?: AbortSignal) => {
    const data = await postInterview<GenerateResponse>({ mode: 'generate' }, signal);
    const q = typeof data?.question === 'string' ? data.question.trim() : '';
    if (!q) throw new Error('Invalid generate response.');
    return q;
  };

  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();

    (async () => {
      try {
        const q = await generateQuestion(controller.signal);
        if (!isMountedRef.current) return;
        setCurrentQuestion(q);
      } catch {
        // Prefetch failure: keep UI functional; we’ll surface errors when interview starts/sends.
      }
    })();

    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, []);

  const handleStartInterview = () => {
    if (!selectedRole || !selectedType) return;
    
    setPhase('interview');
    setMessages([
      {
        id: '1',
        role: 'ai',
        content: `Welcome to your ${interviewTypes.find(t => t.id === selectedType)?.name} interview for ${roles.find(r => r.id === selectedRole)?.name}! I'll be your AI interviewer today. Remember, I'm evaluating your thinking process, not just your answers. Ready? Let's begin!\n\n${currentQuestion || 'Loading your first question...'}`,
      },
    ]);

    if (!currentQuestion) {
      setIsTyping(true);
      (async () => {
        try {
          const q = await generateQuestion();
          if (!isMountedRef.current) return;
          setCurrentQuestion(q);
          appendAIMessage(q);
        } catch {
          if (!isMountedRef.current) return;
          appendAIMessage(
            "I couldn't load a question right now. Please try sending your answer again or restart the interview."
          );
        } finally {
          if (!isMountedRef.current) return;
          setIsTyping(false);
        }
      })();
    }
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    if (isTyping) return;

    const explanation = currentInput;
    appendUserMessage(explanation);
    setCurrentInput('');
    setIsTyping(true);

    (async () => {
      try {
        const qForEval = currentQuestion.trim();
        if (!qForEval) {
          const fresh = await generateQuestion();
          if (!isMountedRef.current) return;
          setCurrentQuestion(fresh);
          appendAIMessage(fresh);
          return;
        }

        const result = await postInterview<EvaluateResponse>({
          mode: 'evaluate',
          email: userProfile?.email ?? '',
          name: userProfile?.name ?? '',
          question: qForEval,
          explanation,
        });

        if (!isMountedRef.current) return;

        const verdict = result?.verdict ?? 'partial';
        const score = typeof result?.score === 'number' ? result.score : 0;
        const feedback = typeof result?.feedback === 'string' ? result.feedback : '';

        appendAIMessage(
          `Verdict: ${verdict}\nScore: ${score}\n\nFeedback:\n${feedback || '—'}`
        );

        const followUp = typeof result?.followUp === 'string' ? result.followUp.trim() : '';
        if (followUp) {
          appendAIMessage(followUp);
          setCurrentQuestion(followUp);
          setQuestionIndex(prev => prev + 1);
          return;
        }

        // No follow-up provided: end the interview similarly to the previous mock flow.
        setPhase('evaluation');
        gainXp(50);
      } catch (err) {
        if (!isMountedRef.current) return;
        appendAIMessage(
          'Sorry — something went wrong while contacting the interview service. Please try again.'
        );
      } finally {
        if (!isMountedRef.current) return;
        setIsTyping(false);
      }
    })();
  };

  const handleRetry = () => {
    setPhase('setup');
    setMessages([]);
    setQuestionIndex(0);
    setSelectedRole('');
    setSelectedType('');
    setCurrentQuestion('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-6 h-6" />
          </Button>
          <span className="font-bold">AI Interview</span>
          <div className="w-10" />
        </div>
        {phase === 'interview' && (
          <Progress value={(questionIndex / mockQuestions.length) * 100} className="h-2" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Setup Phase */}
        {phase === 'setup' && (
          <div className="p-4 space-y-6 slide-up">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-2xl font-black">AI Interview Prep</h1>
              <p className="text-muted-foreground mt-2">Practice with our AI interviewer</p>
            </div>

            {/* Role Selection */}
            <div>
              <p className="font-bold text-sm mb-3">Select Role</p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(role => (
                  <Card
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 cursor-pointer text-center transition-all ${
                      selectedRole === role.id ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{role.icon}</span>
                    <span className="font-medium text-sm">{role.name}</span>
                  </Card>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="font-bold text-sm mb-3">Difficulty</p>
              <div className="flex gap-2">
                {difficulties.map(diff => (
                  <Card
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`flex-1 p-3 cursor-pointer text-center transition-all ${
                      selectedDifficulty === diff.id ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-muted'
                    }`}
                  >
                    <span className="font-bold text-sm block">{diff.name}</span>
                    <span className="text-xs text-muted-foreground">{diff.description}</span>
                  </Card>
                ))}
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <p className="font-bold text-sm mb-3">Interview Type</p>
              <div className="space-y-2">
                {interviewTypes.map(type => (
                  <Card
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedType === type.id ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-bold">{type.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interview Phase */}
        {phase === 'interview' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-32">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'ai' ? 'bg-accent/20' : 'bg-primary/20'
                  }`}>
                    {message.role === 'ai' ? (
                      <Bot className="w-4 h-4 text-accent" />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <Card className={`p-3 max-w-[80%] ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : ''
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </Card>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                  <Card className="p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evaluation Phase */}
        {phase === 'evaluation' && (
          <div className="p-4 space-y-6 slide-up">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-correct/20 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-correct" />
              </div>
              <h1 className="text-2xl font-black">Interview Complete!</h1>
              <p className="text-muted-foreground mt-2">Here's your performance breakdown</p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-black text-accent">{scores.logic}%</p>
                <p className="text-xs text-muted-foreground">Logic Clarity</p>
              </Card>
              <Card className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-black text-primary">{scores.confidence}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </Card>
              <Card className="p-4 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-xp" />
                <p className="text-2xl font-black text-xp">{scores.communication}%</p>
                <p className="text-xs text-muted-foreground">Communication</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-streak" />
                <p className="text-2xl font-black text-streak">{scores.depth}%</p>
                <p className="text-xs text-muted-foreground">Thinking Depth</p>
              </Card>
            </div>

            {/* Overall Score */}
            <Card className="p-6 bg-gradient-to-r from-accent/10 to-primary/10">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                <p className="text-5xl font-black text-primary">
                  {Math.round((scores.logic + scores.confidence + scores.communication + scores.depth) / 4)}%
                </p>
                <p className="text-sm font-medium text-primary mt-2">Great Performance! 🎉</p>
              </div>
            </Card>

            <Button
              onClick={() => setPhase('feedback')}
              className="w-full h-14 text-lg font-bold game-button"
            >
              View Detailed Feedback
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Feedback Phase */}
        {phase === 'feedback' && (
          <div className="p-4 space-y-6 slide-up pb-32">
            <div className="text-center">
              <h1 className="text-2xl font-black">Your Feedback</h1>
              <p className="text-muted-foreground mt-2">Personalized improvement tips</p>
            </div>

            {/* Strengths */}
            <Card className="p-4 bg-correct/10 border-correct/30">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-lg">💪</span> Strengths
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-correct">✓</span>
                  <span>Clear and structured communication style</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-correct">✓</span>
                  <span>Good understanding of fundamental concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-correct">✓</span>
                  <span>Ability to break down complex problems</span>
                </li>
              </ul>
            </Card>

            {/* Areas to Improve */}
            <Card className="p-4 bg-xp/10 border-xp/30">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-lg">📈</span> Areas to Improve
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-xp">→</span>
                  <span>Consider edge cases more proactively</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xp">→</span>
                  <span>Discuss time/space complexity tradeoffs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xp">→</span>
                  <span>Ask clarifying questions before diving in</span>
                </li>
              </ul>
            </Card>

            {/* Improvement Roadmap */}
            <Card className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-lg">🗺️</span> Improvement Roadmap
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">1</div>
                  <div>
                    <p className="font-medium text-sm">Practice System Design</p>
                    <p className="text-xs text-muted-foreground">Focus on scalability patterns</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">2</div>
                  <div>
                    <p className="font-medium text-sm">Review Big-O Notation</p>
                    <p className="text-xs text-muted-foreground">Master complexity analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">3</div>
                  <div>
                    <p className="font-medium text-sm">Mock Interviews Daily</p>
                    <p className="text-xs text-muted-foreground">Build confidence with practice</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* XP Earned */}
            <Card className="p-4 bg-gradient-to-r from-xp/10 to-xp/5">
              <div className="text-center">
                <span className="text-3xl font-black text-xp xp-pop">+50 XP</span>
                <p className="text-sm text-muted-foreground mt-1">Interview completed!</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        {phase === 'setup' && (
          <Button
            onClick={handleStartInterview}
            disabled={!selectedRole || !selectedType}
            className="w-full h-14 text-lg font-bold game-button"
          >
            Start Interview
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
        
        {phase === 'interview' && (
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your answer..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="min-h-14 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              className="h-14 px-6 game-button"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        )}

        {phase === 'feedback' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRetry}
              className="flex-1 h-14 text-lg font-bold"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retry
            </Button>
            <Button
              onClick={onBack}
              className="flex-1 h-14 text-lg font-bold game-button"
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
