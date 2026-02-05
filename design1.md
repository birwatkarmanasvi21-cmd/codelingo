# Thinking-First AI Learning App - System Design

## System Overview
Mobile-first AI learning platform that evaluates user thinking before coding and adapts content based on cognitive patterns and mistakes.

## Technology Stack

**Frontend**: React Native + Expo, Redux Toolkit, NativeBase  
**Backend**: Node.js + Express, MongoDB, Redis, OpenAI GPT-4  
**Deployment**: Railway/Render, MongoDB Atlas, Expo EAS Build

## High-Level Architecture

```
Mobile App (React Native) ←→ Express API ←→ AI Services (OpenAI)
                                    ↓
                            MongoDB + Redis + S3
```

## Core Components

### 1. AI Tutor Engine
- **Purpose**: Explains concepts, generates practice questions, adapts difficulty
- **Key Features**: 
  - Personalized explanations based on user level and learning style
  - Dynamic difficulty adjustment based on mistake patterns
  - Context-aware practice question generation

### 2. Thinking Lock™ Engine
- **Purpose**: Evaluates user reasoning before unlocking code editor
- **Workflow**: 
  - User selects approach (Brute Force, Two Pointers, Hash Map, etc.)
  - User explains reasoning in natural language
  - AI evaluates thinking quality and provides feedback
  - Code editor unlocks only after approval

### 3. Parsons Problem Generator
- **Purpose**: Creates drag-and-drop code arrangement puzzles
- **Features**:
  - AI generates infinite variations based on user weaknesses
  - Indentation-aware line arrangement
  - Adaptive complexity based on performance

### 4. Debug Hunter Engine
- **Purpose**: Gamified bug-finding minigame
- **Mechanics**:
  - AI injects subtle, realistic bugs into code snippets
  - Time-limited challenges (2 minutes)
  - User identifies bug line and provides fix
  - Scoring based on accuracy and speed

### 5. Skill Validation Engine
- **Purpose**: Analyzes user decisions and code quality
- **Evaluation Criteria**:
  - Logic soundness, edge case handling, efficiency
  - Code readability, problem-solving approach
  - Awards skill badges: Logic Master, Edge Case Hunter, etc.

### 6. Gamification Engine
- **Features**:
  - XP system with performance multipliers
  - Daily streak tracking ("Days of Commits")
  - League system (Bronze/Silver/Gold)
  - Weekly leaderboards and competitions

## Data Flow Architecture

```
1. User Login → JWT Auth → Load Profile
2. AI Recommends Next Topic → User Selects Lesson
3. Thinking Lock Phase → AI Evaluates → Unlock/Retry
4. Practice Phase → Real-time Feedback → Mistake Analysis
5. Skill Validation → Badge Awards → XP Calculation
6. Progress Update → Leaderboard → Next Recommendation
```

## Database Design (MongoDB)

### User Schema
```javascript
{
  username, email, password,
  level: 'beginner/intermediate/advanced',
  totalXP, weeklyXP, streak, hearts, league,
  badges: [String],
  weakAreas: [String], strongAreas: [String],
  lastActiveDate
}
```

### Problem Schema
```javascript
{
  title, description, 
  type: 'parsons/debug/thinking/mcq',
  topic, difficulty: 'easy/medium/hard',
  content: Mixed, // Flexible for different problem types
  solution: Mixed, hints: [String],
  xpReward, timeLimit
}
```

### Progress Tracking
```javascript
{
  userId, problemId,
  attempts, completed, bestScore, timeSpent,
  approaches: [String], // Thinking patterns
  mistakes: [{ type, description, timestamp }]
}
```

## Key API Endpoints

**Authentication**: `/api/auth/login`, `/api/auth/register`  
**Learning**: `/api/lessons/next`, `/api/thinking/evaluate`  
**Problems**: `/api/problems/generate`, `/api/problems/:id/submit`  
**Gamification**: `/api/leaderboard`, `/api/user/progress`

## Mobile App Structure

```
src/
├── components/
│   ├── learning/ (ThinkingLock, Parsons, DebugHunter)
│   ├── gamification/ (ProgressHeader, Badges, Streaks)
│   └── common/ (Button, Input, LoadingSpinner)
├── screens/
│   ├── auth/ (Login, Register, Onboarding)
│   ├── learning/ (Home, Lesson, Problem, Result)
│   └── profile/ (Profile, Progress, Badges)
├── services/ (api, auth, storage)
└── store/ (Redux slices for auth, learning, gamification)
```

## Performance Optimizations

### Caching Strategy
- Redis caching for AI responses (24-hour TTL for explanations)
- Common problem templates cached locally
- User session data cached for quick access

### Rate Limiting
- 100 AI requests per 15 minutes per user
- Async AI processing for non-blocking operations
- Batch operations for progress updates

## Security Measures

- JWT authentication with secure token storage
- Input validation and sanitization for AI prompts
- Rate limiting on AI endpoints
- Encrypted sensitive user data

## Scalability Considerations

- Horizontal scaling with load balancers
- Database sharding by user regions
- CDN for static assets and problem templates
- Microservices architecture for different components

## AI Cost Management

- Cache frequent AI responses
- Use GPT-3.5 for simple tasks, GPT-4 for complex reasoning
- Batch AI requests where possible
- Implement usage quotas per user tier

## Design Philosophy

**"Teach thinking, not typing"**

- Force reasoning before coding through Thinking Lock™
- Diagnose cognitive errors, not just syntax mistakes
- Adapt based on thinking patterns, not just performance
- Reward understanding over memorization
- Gamify the learning process to maintain engagement

This architecture ensures a scalable, cost-effective system that prioritizes cognitive skill development over traditional code-typing practice.