import RewardsHero from "./components/RewardsHero";
import RewardWallet from "./components/RewardWallet";
import GameCard from "./components/GameCard";
import DailyTargets from "./components/DailyTargets";
import LeaderboardPreview from "./components/Leaderboard"; 
import EngagementChart from "./components/EngagementChart";
import ActivityFeed from "./components/ActivityFeed";
import CompanionCard from "./components/CompanionCard";

import useWallet from "@/hooks/useWallet";
import { useAuth } from "@/context/AuthContext";

export default function RewardsDashboard() {
  const { user } = useAuth();
  const { balance, loading } = useWallet();
  
  const safeBalance = balance ?? 0;
  const gameAttempts = Math.max(0, Math.min(20, Math.floor(safeBalance / 10)));

  if (loading) {
    return <div className="rewards-glass-card animate-pulse h-32 w-full" />;
  }

  return (
    <div className="min-h-full bg-transparent">
      {/* Grid Content */}
      <div className="mx-auto grid max-w-[1700px] auto-rows-min grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 pb-10">
        <div className="h-full lg:col-span-2 xl:col-span-3 rewards-glass-card p-1 transition-all duration-200">
          <RewardsHero studentName={user?.name} gameAttempts={gameAttempts} />
        </div>
        <div className="h-full lg:col-span-1 xl:col-span-1 rewards-glass-card p-1 transition-all duration-200">
          <RewardWallet points={safeBalance} attempts={gameAttempts} />
        </div>
        <div className="h-full lg:col-span-2 xl:col-span-2 rewards-glass-card p-1 transition-all duration-200">
          <GameCard gameAttempts={gameAttempts} />
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
