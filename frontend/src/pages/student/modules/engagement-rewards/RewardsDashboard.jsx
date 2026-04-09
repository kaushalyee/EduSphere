import { useEffect } from "react";
import RewardsHero from "./components/RewardsHero";
import RewardWallet from "./components/RewardWallet";
import GameCard from "./components/GameCard";
import DailyTargets from "./components/DailyTargets";
import LeaderboardPreview from "./components/Leaderboard"; 
import EngagementChart from "./components/EngagementChart";
import ActivityFeed from "./components/ActivityFeed";
import CompanionCard from "./components/CompanionCard";

import useWallet from "@/hooks/useWallet";
import useAttemptConfig from "@/hooks/useAttemptConfig";
import { useAuth } from "@/context/AuthContext";

export default function RewardsDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6">Loading user...</div>;
  }

  const userId = user?._id;
  
  const { balance, loading: walletLoading, error: walletError, refresh: refetchWallet } = useWallet();
  const { config: attemptConfig, loading: configLoading, error: configError, refresh: refetchConfig } = useAttemptConfig();
  
  const loading = walletLoading || configLoading;
  const error = walletError || configError;
  const safeAttemptConfig = attemptConfig ?? {};

  // Force refetch on user change
  useEffect(() => {
    if (user?._id) {
      console.log("User changed -> refetching data");
      refetchWallet();
      refetchConfig();
    }
  }, [user?._id, refetchWallet, refetchConfig]);

  const safeBalance = balance ?? 0;
  const attemptsUsedToday = safeAttemptConfig.attemptsUsedToday ?? 0;
  const maxAttempts = safeAttemptConfig.maxAttempts ?? 3;
  const availableAttempts = safeAttemptConfig.availableAttempts ?? 0;

  // Added debug visibility (TEMP)
  console.log("User:", user?._id);
  console.log("Wallet:", balance);
  console.log("Attempts:", attemptConfig);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rewards-glass-card animate-pulse h-48 w-full flex items-center justify-center">
           <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading rewards...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rewards-glass-card animate-pulse h-32" />
          <div className="rewards-glass-card animate-pulse h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p>Warning: Failed to load rewards data</p>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button onClick={() => { refetchWallet(); refetchConfig(); }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-transparent">
      {/* Grid Content */}
      <div className="mx-auto grid max-w-[1700px] auto-rows-min grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 pb-10">
        <div className="h-full lg:col-span-2 xl:col-span-3 rewards-glass-card p-1 transition-all duration-200">
          <RewardsHero studentName={user?.name} gameAttempts={availableAttempts} />
        </div>
        <div className="h-full lg:col-span-1 xl:col-span-1 rewards-glass-card p-1 transition-all duration-200">
          <RewardWallet points={safeBalance} attemptsUsedToday={attemptsUsedToday} maxAttempts={maxAttempts} />
        </div>
        <div className="h-full lg:col-span-2 xl:col-span-2 rewards-glass-card p-1 transition-all duration-200">
          <GameCard gameAttempts={availableAttempts} />
        </div>
        <div className="h-full lg:col-span-1 xl:col-span-1 xl:col-start-3 rewards-glass-card p-1 transition-all duration-200">
          <DailyTargets />
        </div>
        <div className="lg:col-span-1 xl:col-span-1 rewards-glass-card p-1 transition-all duration-200">
          <LeaderboardPreview loading={loading} />
        </div>
        <div className="grid h-[420px] grid-cols-1 gap-6 lg:col-span-1 lg:grid-cols-2 xl:col-span-2 xl:gap-8 rewards-glass-card p-1 transition-all duration-200">
          <EngagementChart />
          <ActivityFeed balance={safeBalance} loading={loading} />
        </div>
        <div className="h-full lg:col-span-1 xl:col-span-1 rewards-glass-card p-1 transition-all duration-200">
          <CompanionCard />
        </div>
      </div>
    </div>
  );
}
