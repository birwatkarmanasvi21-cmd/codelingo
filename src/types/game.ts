export interface UserStats {
  hearts: number;
  maxHearts: number;
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
  league: LeagueTier;
  weeklyXp: number;
  rank: number;
  badges: string[];
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
}

export type LeagueTier = 'script-kiddie' | 'hacker' | 'senior-dev' | '10x-engineer';

export interface LeagueInfo {
  id: LeagueTier;
  name: string;
  icon: string;
  color: string;
  minXp: number;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'logic' | 'debug' | 'fill-blank' | 'predict-output';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  xpReward: number;
}

export interface ParsonsLine {
  id: string;
  code: string;
  indent: number;
  isDistractor?: boolean;
}

export interface ParsonsProblem {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  scrambledLines: ParsonsLine[];
  solution: { id: string; indent: number }[];
  xpReward: number;
  hints: string[];
}

export interface UserPerformance {
  topicStrengths: Record<string, number>;
  averageResponseTime: number;
  mistakePatterns: string[];
  recommendedTopics: string[];
}

export interface OnboardingData {
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  dailyTime: number;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  steps: LessonStep[];
}

export interface LessonStep {
  type: 'explain' | 'practice' | 'thinking-lock' | 'feedback';
  content: ExplainContent | PracticeContent | ThinkingLockContent | FeedbackContent;
}

export interface ExplainContent {
  title: string;
  explanation: string;
  example: string;
  analogy: string;
}

export interface PracticeContent {
  question: QuizQuestion;
}

export interface ThinkingLockContent {
  problemStatement: string;
  approaches: string[];
  correctApproach: number;
  hint?: string;
  sampleSolution?: string;
}

export interface FeedbackContent {
  status: 'correct' | 'partial' | 'wrong';
  explanation: string;
  hint?: string;
}

export interface DebugChallenge {
  id: string;
  code: string;
  buggyLine: number;
  bugDescription: string;
  fix: string;
  timeLimit: number;
  xpReward: number;
}

export interface MiniHackathon {
  id: string;
  type: 'dsa' | 'micro-project';
  title: string;
  description: string;
  timeLimit: number;
  steps: HackathonStep[];
  xpReward: number;
}

export interface HackathonStep {
  title: string;
  description: string;
  type: 'approach' | 'logic' | 'code' | 'design';
}

export interface SkillInsight {
  name: string;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CommunityMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  isAI: boolean;
  timestamp: string;
}
