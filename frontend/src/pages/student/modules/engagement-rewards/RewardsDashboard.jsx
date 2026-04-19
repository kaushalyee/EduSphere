import { useEffect, useMemo, lazy, Suspense } from "react";
import RewardsHero from "./components/RewardsHero";
import RewardWallet from "./components/RewardWallet";
import GameCard from "./components/GameCard";
import ActivityFeed from "./components/ActivityFeed";
import CompanionCard from "./components/CompanionCard";

import useWallet from "@/hooks/useWallet";
import useAttemptConfig from "@/hooks/useAttemptConfig";
import { useAuth } from "@/context/AuthContext";

// 🧩 LAZY LOAD HEAVY COMPONENTS
const LeaderboardPreview = lazy(() => import("./components/Leaderboard"));
const EngagementChart = lazy(() => import("./components/EngagementChart"));

export default function RewardsDashboard() {
  const { user } = useAuth();

  const { balance, loading: walletLoading, error: walletError, refresh: refetchWallet } = useWallet();
  const { config: attemptConfig, loading: configLoading, error: configError, refresh: refetchConfig } = useAttemptConfig();

  // 🔥 PARALLEL DATA FETCHING (CRITICAL)
  useEffect(() => {
    if (!user?._id) return;

    Promise.all([
      refetchWallet(),
      refetchConfig()
    ]);
  }, [user?._id, refetchWallet, refetchConfig]);

  // 🎯 REDUCE RE-RENDERS
  const safeBalance = useMemo(() => balance ?? 0, [balance]);
  const safeAttemptConfig = useMemo(() => attemptConfig ?? {}, [attemptConfig]);

  const attemptsUsedToday = safeAttemptConfig.attemptsUsedToday ?? 0;
  const maxAttempts = safeAttemptConfig.maxAttempts ?? 3;
  const availableAttempts = safeAttemptConfig.availableAttempts ?? 0;

  const error = walletError || configError;

  if (!user) {
    return <div className="p-6 text-gray-400">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50/10 rounded-2xl border border-red-500/20">
        <p className="text-red-400 font-medium">Failed to load rewards data</p>
        <p className="mt-2 text-xs text-red-400/60">{error}</p>
        <button 
          onClick={() => { refetchWallet(); refetchConfig(); }}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition-colors"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-transparent">
      {/* 2rd COLUMN RATIO: 2fr 1fr (using lg:grid-cols-3) */}
      <div className="mx-auto grid max-w-[1700px] auto-rows-min grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 pb-10">
        
        {/* ROW 1: HERO (2/3) + WALLET (1/3) */}
        <div className="h-full lg:col-span-2 rewards-glass-card p-1 transition-all duration-200">
          <RewardsHero studentName={user?.name} gameAttempts={availableAttempts} />
        </div>

        <div className="h-full lg:col-span-1 rewards-glass-card p-1 transition-all duration-200">
          {walletLoading ? (
             <div className="h-full w-full bg-slate-800/5 animate-pulse rounded-xl min-h-[200px]" />
          ) : (
            <RewardWallet points={user?.rewardPoints || 0} attemptsUsedToday={attemptsUsedToday} maxAttempts={maxAttempts} />
          )}
        </div>

        {/* ROW 2: PUZZLE (2/3) + LEADERBOARD (1/3) */}
        <div className="h-full lg:col-span-2 rewards-glass-card p-1 transition-all duration-200">
          <GameCard gameAttempts={availableAttempts} />
        </div>

        <div className="h-full lg:col-span-1 rewards-glass-card p-1 transition-all duration-200">
          <Suspense fallback={<div className="h-64 bg-slate-800/5 animate-pulse rounded-xl" />}>
            <LeaderboardPreview loading={walletLoading} />
          </Suspense>
        </div>

        {/* ROW 3: CHART/FEED (2/3) + COMPANION (1/3) */}
        <div className="grid h-[420px] grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2 lg:gap-8 rewards-glass-card p-1 transition-all duration-200">
          <Suspense fallback={<div className="h-full bg-slate-800/5 animate-pulse rounded-xl" />}>
            <EngagementChart />
          </Suspense>
          <ActivityFeed balance={user?.rewardPoints || 0} loading={walletLoading} />
        </div>

        <div className="h-full lg:col-span-1 rewards-glass-card p-1 transition-all duration-200">
          <CompanionCard />
        </div>
      </div>
    </div>
  );
}

