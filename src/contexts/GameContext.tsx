import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { UserStats, OnboardingData, UserProfile } from '@/types/game';
import { initialUserStats, leagues } from '@/data/mockData';
import { fetchUserStats, updateUserStats as updateUserStatsApi } from '@/lib/statsApi';

interface GameContextType {
  stats: UserStats;
  loseHeart: () => boolean;
  gainXp: (amount: number) => void;
  incrementStreak: () => void;
  resetHearts: () => void;
  updateUserStats: (params: { xpDelta?: number; heartsDelta?: number; streakDelta?: number; newBadge?: string | null }) => Promise<void>;
  refreshUserStats: () => Promise<void>;
  showXpAnimation: boolean;
  lastXpGain: number;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  isOnboarded: boolean;
  onboardingData: OnboardingData | null;
  completeOnboarding: (data: OnboardingData) => void;
}

function xpToLevelAndNext(xp: number): { level: number; xpToNextLevel: number } {
  let level = 1;
  let xpToNextLevel = 500;
  let remaining = xp;

  while (remaining >= xpToNextLevel) {
    remaining -= xpToNextLevel;
    level++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.2);
  }

  return { level, xpToNextLevel };
}

function xpToLeague(xp: number): UserStats['league'] {
  const sorted = [...leagues].sort((a, b) => b.minXp - a.minXp);
  const match = sorted.find((l) => xp >= l.minXp);
  return (match?.id as UserStats['league']) ?? 'script-kiddie';
}

function mergeApiStatsIntoUserStats(
  api: { xp: number; hearts: number; streak: number; badges: string[] },
  prev: UserStats
): UserStats {

  const { level, xpToNextLevel } = xpToLevelAndNext(api.xp);

  return {
    ...prev,
    xp: api.xp,
    hearts: api.hearts,
    streak: api.streak,
    badges: Array.isArray(api.badges) ? api.badges : [],
    level,
    xpToNextLevel,
    league: xpToLeague(api.xp),
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {

  const [stats, setStats] = useState<UserStats>(initialUserStats);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [lastXpGain, setLastXpGain] = useState(0);

  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);

  const [isOnboarded, setIsOnboarded] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  const updateUserStats = useCallback(
    async (params: { xpDelta?: number; heartsDelta?: number; streakDelta?: number; newBadge?: string | null }) => {

      const email = userProfile?.email;

      if (!email) return;

      try {

        const res = await updateUserStatsApi(email, {
          xpDelta: params.xpDelta ?? 0,
          heartsDelta: params.heartsDelta ?? 0,
          streakDelta: params.streakDelta ?? 0,
          newBadge: params.newBadge ?? null,
        });

        setStats(prev => mergeApiStatsIntoUserStats(res, prev));

      } catch {

        // ignore API failures

      }

    },
    [userProfile?.email]
  );

  const loseHeart = useCallback(() => {
    if (stats.hearts <= 0) return false;
    
    // Optimistic UI update
    setStats(prev => ({ ...prev, hearts: prev.hearts - 1 }));
    
    // Sync with backend
    if (userProfile?.email) {
      updateUserStats({ heartsDelta: -1 });
    }
    
    return true;
  }, [stats.hearts, userProfile?.email, updateUserStats]);

  const gainXp = useCallback((amount: number) => {

    setLastXpGain(amount);
    setShowXpAnimation(true);

    setTimeout(() => setShowXpAnimation(false), 1000);

    setStats(prev => {

      const totalXp = prev.xp + amount;
      const { level, xpToNextLevel } = xpToLevelAndNext(totalXp);

      return {
        ...prev,
        xp: totalXp,
        level,
        xpToNextLevel,
        weeklyXp: prev.weeklyXp + amount,
      };

    });

    // Sync with backend
    if (userProfile?.email) {
      updateUserStats({ xpDelta: amount });
    }

  }, [userProfile?.email, updateUserStats]);

  const incrementStreak = useCallback(() => {
    // Optimistic UI update
    setStats(prev => ({ ...prev, streak: prev.streak + 1 }));
    
    // Sync with backend
    if (userProfile?.email) {
      updateUserStats({ streakDelta: 1 });
    }
  }, [userProfile?.email, updateUserStats]);

  const resetHearts = useCallback(() => {
    setStats(prev => ({ ...prev, hearts: prev.maxHearts }));
  }, []);

  const setUserProfile = useCallback((profile: UserProfile | null) => {
    setUserProfileState(profile);
  }, []);

  const completeOnboarding = useCallback((data: OnboardingData) => {
    setOnboardingData(data);
    setIsOnboarded(true);
  }, []);

  const refreshUserStats = useCallback(async () => {

    const email = userProfile?.email;

    if (!email) return;

    try {

      const res = await fetchUserStats(email);

      setStats(prev => mergeApiStatsIntoUserStats(res, prev));

    } catch {}

  }, [userProfile?.email]);

  useEffect(() => {

    if (userProfile?.email) {
      refreshUserStats();
    }

  }, [userProfile?.email, refreshUserStats]);

  return (
    <GameContext.Provider
      value={{
        stats,
        loseHeart,
        gainXp,
        incrementStreak,
        resetHearts,
        updateUserStats,
        refreshUserStats,
        showXpAnimation,
        lastXpGain,
        userProfile,
        setUserProfile,
        isOnboarded,
        onboardingData,
        completeOnboarding,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {

  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;

}