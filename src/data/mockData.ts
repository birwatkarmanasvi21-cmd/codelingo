import { 
  UserStats, 
  LeagueInfo, 
  QuizQuestion, 
  ParsonsProblem, 
  Lesson, 
  DebugChallenge, 
  MiniHackathon, 
  SkillInsight, 
  CommunityMessage 
} from '@/types/game';

export const initialUserStats: UserStats = {
  hearts: 1,
  maxHearts: 5,
  xp: 100,
  level: 1,
  xpToNextLevel: 500,
  streak: 12,
  league: 'hacker',
  weeklyXp: 100,
  rank: 25,
  badges: [],
};

export const leagues: LeagueInfo[] = [
  { id: 'script-kiddie', name: 'Script Kiddie', icon: '🐣', color: 'bronze', minXp: 0 },
  { id: 'hacker', name: 'Hacker', icon: '💻', color: 'silver', minXp: 1000 },
  { id: 'senior-dev', name: 'Senior Developer', icon: '🚀', color: 'gold', minXp: 5000 },
  { id: '10x-engineer', name: '10x Engineer', icon: '⚡', color: 'purple', minXp: 15000 },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'mcq',
    topic: 'variables',
    difficulty: 'easy',
    question: 'What will be the output of this code?',
    code: 'let x = 5;\nlet y = x + 3;\nconsole.log(y);',
    options: ['5', '8', '3', 'undefined'],
    correctAnswer: 1,
    explanation: 'The variable y is assigned the value of x (5) plus 3, which equals 8.',
    xpReward: 10,
  },
  {
    id: 'q2',
    type: 'logic',
    topic: 'conditionals',
    difficulty: 'medium',
    question: 'Which condition will be TRUE when age is 18?',
    options: ['age < 18', 'age > 18', 'age >= 18', 'age == 17'],
    correctAnswer: 2,
    explanation: 'age >= 18 means "age greater than or equal to 18", which is true when age is exactly 18.',
    xpReward: 15,
  },
  {
    id: 'q3',
    type: 'debug',
    topic: 'loops',
    difficulty: 'medium',
    question: 'What\'s wrong with this loop?',
    code: 'for (let i = 0; i < 5; i--) {\n  console.log(i);\n}',
    options: [
      'The loop will never end (infinite loop)',
      'The loop won\'t run at all',
      'Syntax error',
      'Nothing is wrong'
    ],
    correctAnswer: 0,
    explanation: 'The loop decrements i (i--) instead of incrementing, so i will never reach 5, causing an infinite loop.',
    xpReward: 20,
  },
  {
    id: 'q4',
    type: 'fill-blank',
    topic: 'arrays',
    difficulty: 'easy',
    question: 'Complete the code to get the first element:',
    code: 'const fruits = ["apple", "banana"];\nconst first = fruits[___];',
    options: ['1', '0', '-1', 'first'],
    correctAnswer: 1,
    explanation: 'Arrays are zero-indexed, so the first element is at index 0.',
    xpReward: 10,
  },
  {
    id: 'q5',
    type: 'predict-output',
    topic: 'functions',
    difficulty: 'hard',
    question: 'What does this function return?',
    code: 'function mystery(n) {\n  return n <= 1 ? n : mystery(n-1) + mystery(n-2);\n}\nmystery(5);',
    options: ['5', '8', '3', '13'],
    correctAnswer: 0,
    explanation: 'This is a Fibonacci function! F(5) = F(4) + F(3) = 3 + 2 = 5',
    xpReward: 25,
  },
];

export const parsonsProblems: ParsonsProblem[] = [
  {
    id: 'p1',
    title: 'Hello World Function',
    description: 'Create a function that prints "Hello, World!"',
    topic: 'functions',
    difficulty: 'easy',
    scrambledLines: [
      { id: 'l1', code: 'function sayHello() {', indent: 0 },
      { id: 'l2', code: 'console.log("Hello, World!");', indent: 1 },
      { id: 'l3', code: '}', indent: 0 },
      { id: 'l4', code: 'sayHello();', indent: 0 },
    ],
    solution: [
      { id: 'l1', indent: 0 },
      { id: 'l2', indent: 1 },
      { id: 'l3', indent: 0 },
      { id: 'l4', indent: 0 },
    ],
    xpReward: 15,
    hints: ['Functions start with the "function" keyword', 'Don\'t forget to call the function!'],
  },
  {
    id: 'p2',
    title: 'Sum Array Elements',
    description: 'Write a loop to sum all numbers in an array',
    topic: 'loops',
    difficulty: 'medium',
    scrambledLines: [
      { id: 'l1', code: 'let sum = 0;', indent: 0 },
      { id: 'l2', code: 'const numbers = [1, 2, 3, 4, 5];', indent: 0 },
      { id: 'l3', code: 'for (let i = 0; i < numbers.length; i++) {', indent: 0 },
      { id: 'l4', code: 'sum += numbers[i];', indent: 1 },
      { id: 'l5', code: '}', indent: 0 },
      { id: 'l6', code: 'console.log(sum);', indent: 0 },
    ],
    solution: [
      { id: 'l2', indent: 0 },
      { id: 'l1', indent: 0 },
      { id: 'l3', indent: 0 },
      { id: 'l4', indent: 1 },
      { id: 'l5', indent: 0 },
      { id: 'l6', indent: 0 },
    ],
    xpReward: 25,
    hints: ['Initialize sum before the loop', 'The array must be defined first'],
  },
  {
    id: 'p3',
    title: 'FizzBuzz Logic',
    description: 'Implement the classic FizzBuzz conditional',
    topic: 'conditionals',
    difficulty: 'hard',
    scrambledLines: [
      { id: 'l1', code: 'function fizzBuzz(n) {', indent: 0 },
      { id: 'l2', code: 'if (n % 3 === 0 && n % 5 === 0) {', indent: 1 },
      { id: 'l3', code: 'return "FizzBuzz";', indent: 2 },
      { id: 'l4', code: '} else if (n % 3 === 0) {', indent: 1 },
      { id: 'l5', code: 'return "Fizz";', indent: 2 },
      { id: 'l6', code: '} else if (n % 5 === 0) {', indent: 1 },
      { id: 'l7', code: 'return "Buzz";', indent: 2 },
      { id: 'l8', code: '} else {', indent: 1 },
      { id: 'l9', code: 'return n;', indent: 2 },
      { id: 'l10', code: '}', indent: 1 },
      { id: 'l11', code: '}', indent: 0 },
    ],
    solution: [
      { id: 'l1', indent: 0 },
      { id: 'l2', indent: 1 },
      { id: 'l3', indent: 2 },
      { id: 'l4', indent: 1 },
      { id: 'l5', indent: 2 },
      { id: 'l6', indent: 1 },
      { id: 'l7', indent: 2 },
      { id: 'l8', indent: 1 },
      { id: 'l9', indent: 2 },
      { id: 'l10', indent: 1 },
      { id: 'l11', indent: 0 },
    ],
    xpReward: 40,
    hints: ['Check for FizzBuzz (both 3 and 5) first!', 'Order of conditions matters'],
  },
];

export const topics = [
  { id: 'variables', name: 'Variables', icon: '📦', progress: 85 },
  { id: 'conditionals', name: 'Conditionals', icon: '🔀', progress: 60 },
  { id: 'loops', name: 'Loops', icon: '🔁', progress: 45 },
  { id: 'functions', name: 'Functions', icon: '⚡', progress: 30 },
  { id: 'arrays', name: 'Arrays', icon: '📚', progress: 20 },
  { id: 'objects', name: 'Objects', icon: '🎯', progress: 0 },
];

export const leaderboard = [
  { rank: 1, name: 'CodeMaster', xp: 892, avatar: '🦊' },
  { rank: 2, name: 'ByteNinja', xp: 756, avatar: '🐱' },
  { rank: 3, name: 'DevWizard', xp: 698, avatar: '🦉' },
  { rank: 4, name: 'AlgoKing', xp: 654, avatar: '🦁' },
  { rank: 5, name: 'PixelPro', xp: 612, avatar: '🐼' },
];

export const sampleLesson: Lesson = {
  id: 'lesson-1',
  title: 'Understanding For Loops',
  topic: 'loops',
  difficulty: 'easy',
  xpReward: 50,
  steps: [
    {
      type: 'explain',
      content: {
        title: 'What is a For Loop? 🔁',
        explanation: 'A for loop repeats code a specific number of times. It has three parts: initialization, condition, and update.',
        example: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n// Prints: 0, 1, 2, 3, 4',
        analogy: 'Think of it like climbing stairs 🪜 - you start at step 0, keep climbing while you haven\'t reached step 5, and go up one step at a time!',
      },
    },
    {
      type: 'practice',
      content: {
        question: quizQuestions[2],
      },
    },
    {
      type: 'thinking-lock',
      content: {
        problemStatement: '....',
        approaches: ['....', '....', '....', '....'],
        correctApproach: 0,
      },
    },
    {
      type: 'feedback',
      content: {
        status: 'correct',
        explanation: 'Great thinking! A simple loop is the most intuitive approach for beginners. You iterate through each element, check if it\'s even, and add it to a sum.',
        hint: 'For bonus efficiency, you could use filter().reduce() in JavaScript!',
      },
    },
  ],
};

export const debugChallenges: DebugChallenge[] = [
  {
    id: 'debug-1',
    code: `function greet(name) {
  console.log("Hello, " + Name);
}

greet("Alice");`,
    buggyLine: 1,
    bugDescription: 'Variable name is case-sensitive. "Name" should be "name".',
    fix: 'console.log("Hello, " + name);',
    timeLimit: 30,
    xpReward: 15,
  },
  {
    id: 'debug-2',
    code: `const numbers = [1, 2, 3, 4, 5];
let sum = 0;

for (let i = 0; i <= numbers.length; i++) {
  sum += numbers[i];
}

console.log(sum);`,
    buggyLine: 3,
    bugDescription: 'Off-by-one error. Should be i < numbers.length, not i <= numbers.length.',
    fix: 'for (let i = 0; i < numbers.length; i++) {',
    timeLimit: 45,
    xpReward: 20,
  },
  {
    id: 'debug-3',
    code: `function isEven(num) {
  if (num % 2 = 0) {
    return true;
  }
  return false;
}`,
    buggyLine: 1,
    bugDescription: 'Assignment operator (=) used instead of comparison operator (===).',
    fix: 'if (num % 2 === 0) {',
    timeLimit: 30,
    xpReward: 15,
  },
];

export const miniHackathons: MiniHackathon[] = [
  {
    id: 'hackathon-dsa-1',
    type: 'dsa',
    title: '.',
    description: '....',
    timeLimit: 900,
    xpReward: 100,
    steps: [
      {
        title: 'Choose Your Approach',
        description: 'Select the algorithm you would use to solve this problem.',
        type: 'approach',
      },
      {
        title: 'Explain Your Logic',
        description: 'Describe step-by-step how your chosen approach would work.',
        type: 'logic',
      },
      {
        title: 'Write the Code',
        description: 'Implement your solution (optional for thinking practice).',
        type: 'code',
      },
    ],
  },
  {
    id: 'hackathon-project-1',
    type: 'micro-project',
    title: 'Build a Counter App',
    description: 'Design a simple counter with increment, decrement, and reset functionality.',
    timeLimit: 1200,
    xpReward: 150,
    steps: [
      {
        title: 'Plan the Structure',
        description: 'What components and state will you need?',
        type: 'design',
      },
      {
        title: 'Handle Edge Cases',
        description: 'What happens at 0? Negative numbers? Max value?',
        type: 'logic',
      },
      {
        title: 'Build It',
        description: 'Create the counter UI and logic.',
        type: 'code',
      },
    ],
  },
];

export const skillInsights: SkillInsight[] = [
  { name: 'Logic Sound', percentage: 78, trend: 'up' },
  { name: 'Edge-Case Aware', percentage: 65, trend: 'up' },
  { name: 'Efficient Thinker', percentage: 52, trend: 'stable' },
  { name: 'Debug Master', percentage: 71, trend: 'down' },
  { name: 'Pattern Recognition', percentage: 84, trend: 'up' },
];

export const communityMessages: CommunityMessage[] = [
  {
    id: 'm1',
    user: 'CodeNinja',
    avatar: '🥷',
    message: 'Just completed my first binary search problem! 🎉',
    isAI: false,
    timestamp: '2 min ago',
  },
  {
    id: 'm2',
    user: 'AI Mentor',
    avatar: '🤖',
    message: 'Great job! Binary search is fundamental for efficient algorithms. Try the "Search in Rotated Array" next!',
    isAI: true,
    timestamp: '1 min ago',
  },
  {
    id: 'm3',
    user: 'DevQueen',
    avatar: '👑',
    message: 'Can someone explain recursion in simple terms?',
    isAI: false,
    timestamp: '5 min ago',
  },
  {
    id: 'm4',
    user: 'AI Mentor',
    avatar: '🤖',
    message: 'Recursion is when a function calls itself to solve smaller versions of the same problem. Think of it like Russian nesting dolls! 🪆',
    isAI: true,
    timestamp: '4 min ago',
  },
  {
    id: 'm5',
    user: 'ByteWizard',
    avatar: '🧙‍♂️',
    message: 'Just hit a 30-day streak! 🔥',
    isAI: false,
    timestamp: '10 min ago',
  },
];
