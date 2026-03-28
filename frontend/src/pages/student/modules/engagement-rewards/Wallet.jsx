import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Coins,
  Flame,
  Settings,
  Sparkles,
  Target,
  Wallet as WalletIcon,
} from "lucide-react";
import RewardsSidebar from "./components/RewardsSidebar";
import useWallet from "../../../../hooks/useWallet";

const companions = [
  {
    id: 1,
    name: "Nova",
    level: "Lv. 7",
    description: "Boosts consistency rewards for study streaks.",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=Nova",
  },
  {
    id: 2,
    name: "Pixel",
    level: "Lv. 5",
    description: "Improves quiz challenge rewards each week.",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=Pixel",
  },
  {
    id: 3,
    name: "Echo",
    level: "Lv. 4",
    description: "Unlocks bonus chances in mini-game sessions.",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=Echo",
  },
];

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("wallet");
  const { balance: walletPoints, loading: walletLoading } = useWallet();

  const stats = useMemo(() => {
    const weeklyPoints = Math.max(0, Math.round(walletPoints * 0.2));
    const attemptsUsed = Math.max(0, Math.min(20, 20 - Math.floor(walletPoints / 10)));

    return [
      {
        id: "lifetime",
        title: "Lifetime Points",
        value: walletPoints.toLocaleString(),
        progress: Math.max(5, Math.min(100, Math.round((walletPoints / 2000) * 100))),
        icon: Coins,
      },
      {
        id: "weekly",
        title: "Weekly Points",
        value: weeklyPoints.toLocaleString(),
        progress: Math.max(5, Math.min(100, Math.round((weeklyPoints / 600) * 100))),
        icon: Flame,
      },
      {
        id: "attempts",
        title: "Game Attempts Used",
        value: `${attemptsUsed}/20`,
        progress: Math.max(5, Math.min(100, Math.round((attemptsUsed / 20) * 100))),
        icon: Target,
      },
    ];
  }, [walletPoints]);

  const activities = useMemo(
    () => [
      {
        id: 1,
        title: "Assignment Improvement",
        description: "Data Structures assignment score boosted",
        points: `+${Math.max(1, Math.round(walletPoints * 0.01))} R-Points`,
        time: "2h ago",
      },
      {
        id: 2,
        title: "Quiz Mastery",
        description: "Weekly quiz completed with top percentile",
        points: `+${Math.max(1, Math.round(walletPoints * 0.015))} R-Points`,
        time: "5h ago",
      },
      {
        id: 3,
        title: "Companion Boost",
        description: "Used hint pack in Reward Rush challenge",
        points: `-${Math.max(1, Math.round(walletPoints * 0.005))} R-Points`,
        time: "Yesterday",
      },
      {
        id: 4,
        title: "Study Streak Bonus",
        description: "Maintained 7-day engagement streak",
        points: `+${Math.max(1, Math.round(walletPoints * 0.02))} R-Points`,
        time: "2 days ago",
      },
    ],
    [walletPoints]
  );

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
                <Bell
                  size={22}
                  className="transition-transform group-hover:scale-110"
                />
                <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0e19] bg-gradient-to-br from-purple-400 to-indigo-600 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              </button>
              <button className="group text-gray-400 transition-colors hover:text-white">
                <Settings
                  size={22}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
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
          <div className="mx-auto grid max-w-[1700px] auto-rows-min grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#6366F1] p-8 shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.01] xl:col-span-2">
              <div className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"></div>
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    Reward Rush
                  </p>
                  <h1 className="mt-2 text-5xl font-black tracking-tight">
                    {walletPoints.toLocaleString()}
                  </h1>
                  <p className="mt-2 text-sm text-white/90">
                    Earned through consistent academic engagement
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,255,255,0.2)] backdrop-blur-md md:self-center">
                  <Sparkles size={16} />
                  +{Math.max(1, Math.round(walletPoints * 0.01))} R-Points today
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white/5 p-6 shadow-[0_0_28px_rgba(168,85,247,0.16)] backdrop-blur-xl transition-all duration-300 hover:scale-105">
              <div className="mb-4 flex items-center gap-2 text-sm text-purple-300">
                <WalletIcon size={18} />
                Wallet Snapshot
              </div>
              <p className="text-3xl font-extrabold">
                {walletLoading ? "..." : walletPoints.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-gray-300">
                R-Points available now
              </p>
              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#6366F1]"></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <CalendarDays size={14} />
                Updated moments ago
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:col-span-3">
              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-white/5 p-6 shadow-[0_0_26px_rgba(168,85,247,0.15)] backdrop-blur-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="mb-4 inline-flex rounded-xl bg-purple-500/20 p-3 text-purple-300">
                      <Icon size={18} />
                    </div>
                    <p className="text-sm text-gray-300">{item.title}</p>
                    <p className="mt-1 text-3xl font-extrabold">
                      {item.value}
                    </p>
                    <div className="mt-5 h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#6366F1]"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="rounded-3xl bg-white/5 p-7 shadow-[0_0_28px_rgba(168,85,247,0.16)] backdrop-blur-xl xl:col-span-2">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <div className="mt-6 space-y-4">
                {activities.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-white/5 p-4 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.9)]"></span>
                        <div>
                          <p className="font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            item.points.startsWith("+")
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {item.points}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white/5 p-7 shadow-[0_0_28px_rgba(168,85,247,0.16)] backdrop-blur-xl">
              <h2 className="text-xl font-bold">Your Companions</h2>
              <div className="mt-5 space-y-4">
                {companions.map((companion) => (
                  <article
                    key={companion.id}
                    className="rounded-2xl bg-white/5 p-4 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={companion.avatar}
                        alt={companion.name}
                        className="h-12 w-12 rounded-full bg-white/10 object-cover"
                      />
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-semibold">
                            {companion.name}
                          </p>
                          <span className="rounded-full bg-purple-500/20 px-2.5 py-1 text-xs font-semibold text-purple-300">
                            {companion.level}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-300">
                          {companion.description}
                        </p>
                      </div>
                    </div>
                    <button className="mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3.5 py-1.5 text-xs font-semibold shadow-[0_0_10px_rgba(99,102,241,0.25)] transition-all duration-300 hover:scale-105">
                      Select
                    </button>
                  </article>
                ))}
              </div>

              <button className="mt-6 w-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 px-5 py-3 text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105">
                View My Companions
              </button>
            </section>
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
