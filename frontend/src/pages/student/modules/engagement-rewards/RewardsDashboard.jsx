import { useState } from "react";
import { Bell, Settings } from "lucide-react";
import RewardsSidebar from "./components/RewardsSidebar";
import RewardsHero from "./components/RewardsHero";
import RewardWallet from "./components/RewardWallet";
import GameCard from "./components/GameCard";
import DailyTargets from "./components/DailyTargets";
import Leaderboard from "./components/Leaderboard";
import EngagementChart from "./components/EngagementChart";
import ActivityFeed from "./components/ActivityFeed";
import CompanionCard from "./components/CompanionCard";

export default function RewardsDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [gameAttempts] = useState(12);
  const [points] = useState(1240);

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#0a0e19] font-sans text-white selection:bg-purple-500/30">
      <RewardsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative flex h-full flex-grow flex-col overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[600px] w-[600px] rounded-full bg-indigo-900/10 blur-[150px]"></div>

        <header className="relative z-20 flex h-[90px] shrink-0 items-center border-b border-white/5 bg-[#0a0e19]/80 px-10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-white via-indigo-100 to-gray-400 bg-clip-text text-3xl font-extrabold tracking-tighter text-transparent drop-shadow-sm">
              Reward Rush
            </div>
          </div>

          <div className="ml-auto flex items-center gap-8">
            <div className="flex items-center gap-5">
              <button className="group relative text-gray-400 transition-colors hover:text-white">
                <Bell size={22} className="transition-transform group-hover:scale-110" />
                <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0e19] bg-gradient-to-br from-purple-400 to-indigo-600 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              </button>
              <button className="group text-gray-400 transition-colors hover:text-white">
                <Settings size={22} className="transition-transform duration-300 group-hover:rotate-45" />
              </button>
              <div className="ml-2 h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-white/10 transition-colors hover:border-purple-500/50">
                <img
                  src="https://ui-avatars.com/api/?name=Alex&background=random"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="no-scrollbar relative z-10 min-h-0 flex-grow overflow-y-auto p-5 pb-24 scroll-smooth md:p-10">
          <div className="mx-auto grid max-w-[1700px] auto-rows-min grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
            <div className="h-full lg:col-span-2 xl:col-span-3">
              <RewardsHero gameAttempts={gameAttempts} />
            </div>
            <div className="h-full lg:col-span-1 xl:col-span-1">
              <RewardWallet points={points} attempts={gameAttempts} />
            </div>
            <div className="h-full lg:col-span-2 xl:col-span-2">
              <GameCard gameAttempts={gameAttempts} />
            </div>
            <div className="h-full lg:col-span-1 xl:col-span-1 xl:col-start-3">
              <DailyTargets />
            </div>
            <div className="lg:col-span-1 xl:col-span-1">
              <Leaderboard />
            </div>
            <div className="grid h-[420px] grid-cols-1 gap-6 lg:col-span-1 lg:grid-cols-2 xl:col-span-2 xl:gap-8">
              <EngagementChart />
              <ActivityFeed />
            </div>
            <div className="h-full lg:col-span-1 xl:col-span-1">
              <CompanionCard />
            </div>
          </div>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .no-scrollbar::-webkit-scrollbar-track {
              background: #0a0e19;
            }
            .no-scrollbar::-webkit-scrollbar-thumb {
              background: #1a1f3c;
              border-radius: 10px;
            }
            .no-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #2a315c;
            }
          `,
        }}
      />
    </div>
  );
}
