import { useState } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { QuizScreen } from '@/components/screens/QuizScreen';
import { ParsonsScreen } from '@/components/screens/ParsonsScreen';
import { LeagueScreen } from '@/components/screens/LeagueScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { LessonFlow } from '@/components/lesson/LessonFlow';
import { ProblemScreen } from '@/components/screens/ProblemScreen';
import { DebugHunterScreen } from '@/components/screens/DebugHunterScreen';
import { HackathonScreen } from '@/components/screens/HackathonScreen';
import { SkillInsightsScreen } from '@/components/screens/SkillInsightsScreen';
import { CommunityScreen } from '@/components/screens/CommunityScreen';
import { AICodeAnalyzerScreen } from '@/components/screens/AICodeAnalyzerScreen';
import { AIInterviewScreen } from '@/components/screens/AIInterviewScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';

type Screen =
  | 'home'
  | 'quiz'
  | 'parsons'
  | 'practice'
  | 'league'
  | 'profile'
  | 'lesson'
  | 'debug'
  | 'hackathon'
  | 'skills'
  | 'community'
  | 'ai-analyzer'
  | 'ai-interview'
  | 'problem';

function AppContent() {
  const { isOnboarded, userProfile } = useGame();
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') setActiveScreen('home');
    else if (tab === 'practice') setActiveScreen('skills');
    else if (tab === 'league') setActiveScreen('league');
    else if (tab === 'profile') setActiveScreen('profile');
    else if (tab === 'community') setActiveScreen('community');
  };

  const handleStartQuiz = () => setActiveScreen('quiz');
  const handleStartParsons = () => setActiveScreen('parsons');
  const handleStartLesson = () => setActiveScreen('problem');
  const handleStartDebug = () => setActiveScreen('debug');
  const handleStartHackathon = () => setActiveScreen('hackathon');
  const handleOpenAI = () => setActiveScreen('ai-analyzer');
  const handleStartInterview = () => setActiveScreen('ai-interview');
  
  const handleBackToHome = () => {
    setActiveScreen('home');
    setActiveTab('home');
  };

  // First-time: collect basic user info
  if (!userProfile) {
    return <AuthScreen />;
  }

  // Show onboarding only if not completed (either in session or from backend)
  const profileOnboardingComplete = (userProfile as { onboardingComplete?: boolean })?.onboardingComplete === true;
  if (!isOnboarded && !profileOnboardingComplete) {
    return <OnboardingFlow />;
  }

  const isInGame = ['quiz', 'parsons', 'lesson', 'debug', 'hackathon', 'ai-interview', 'problem'].includes(activeScreen);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Show header only when not in game mode */}
      {!isInGame && <Header />}

      {/* Main content area */}
      <main className={`flex-1 ${!isInGame ? 'overflow-y-auto' : ''}`}>
        <div className="container max-w-lg mx-auto h-full">
          {activeScreen === 'home' && (
            <HomeScreen
              onStartLesson={handleStartLesson}
              onStartQuiz={handleStartQuiz}
              onStartParsons={handleStartParsons}
              onStartDebug={handleStartDebug}
              onStartHackathon={handleStartHackathon}
              onOpenAI={handleOpenAI}
              onStartInterview={handleStartInterview}
            />
          )}
          {activeScreen === 'quiz' && (
            <QuizScreen onBack={handleBackToHome} />
          )}
          {activeScreen === 'parsons' && (
            <ParsonsScreen onBack={handleBackToHome} />
          )}
          {activeScreen === 'lesson' && (
            <LessonFlow onBack={handleBackToHome} />
          )}
          {activeScreen === 'problem' && (
            <ProblemScreen onBack={handleBackToHome} />
          )}
          {activeScreen === 'debug' && (
            <DebugHunterScreen onBack={handleBackToHome} />
          )}
          {activeScreen === 'hackathon' && (
            <HackathonScreen onBack={handleBackToHome} />
          )}
          {activeScreen === 'ai-interview' && (
            <AIInterviewScreen onBack={handleBackToHome} />
          )}
          {activeScreen === 'league' && <LeagueScreen />}
          {activeScreen === 'profile' && <ProfileScreen />}
          {activeScreen === 'skills' && <SkillInsightsScreen />}
          {activeScreen === 'community' && <CommunityScreen />}
          {activeScreen === 'ai-analyzer' && <AICodeAnalyzerScreen onBack={handleBackToHome} />}
        </div>
      </main>

      {/* Show bottom nav only when not in game mode */}
      {!isInGame && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}

const Index = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default Index;
