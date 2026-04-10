import { useMemo, useState } from "react";
import {
  CalendarDays,
  Coins,
  Flame,
  Sparkles,
  Target,
  Wallet as WalletIcon,
} from "lucide-react";

import useWallet from "@/hooks/useWallet";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
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
      <div className="mx-auto grid max-w-[1700px] auto-rows-min grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8 pb-10">
        <section className="rewards-glass-card relative overflow-hidden p-8 xl:col-span-2">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium rewards-subtext">Reward Rush</p>
              <h1 className="mt-2 text-5xl font-black tracking-tight text-[#7c3aed]">
                {walletPoints.toLocaleString()}
              </h1>
              <p className="mt-2 text-sm rewards-subtext">
                Earned through consistent academic engagement
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#3b82f6] border border-white/60 md:self-center">
              <Sparkles size={16} />
              +{Math.max(1, Math.round(walletPoints * 0.01))} R-Points today
            </div>
          </div>
        </section>

        <section className="rewards-glass-card p-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-[#3b82f6] font-medium">
            <WalletIcon size={18} />
            Wallet Snapshot
          </div>
          <p className="text-3xl font-extrabold rewards-heading">
            {walletLoading ? "..." : walletPoints.toLocaleString()}
          </p>
          <p className="mt-1 text-sm rewards-subtext">R-Points available now</p>
          <div className="mt-5 h-2 rounded-full bg-gray-100">
            <div className="h-2 w-[78%] rounded-full bg-[#3b82f6]"></div>
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
                className="rewards-glass-card p-6"
              >
                <div className="mb-4 inline-flex rounded-xl bg-white/70 p-3 text-[#3b82f6]">
                  <Icon size={18} />
                </div>
                <p className="text-sm rewards-subtext font-medium">{item.title}</p>
                <p className="mt-1 text-3xl font-extrabold rewards-heading">
                  {item.value}
                </p>
                <div className="mt-5 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-[#3b82f6]"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rewards-glass-card p-7 xl:col-span-2">
          <h2 className="text-xl font-bold rewards-heading">Recent Activity</h2>
          <div className="mt-6 space-y-4">
            {activities.map((item) => (
              <article
                key={item.id}
                className="rounded-xl bg-white/60 p-4 border border-white/60 transition-colors hover:bg-white/80 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                    <div>
                      <p className="font-semibold rewards-heading">{item.title}</p>
                      <p className="mt-1 text-sm rewards-subtext">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        item.points.startsWith("+")
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.points}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rewards-glass-card p-7">
          <h2 className="text-xl font-bold rewards-heading">Your Companions</h2>
          <div className="mt-5 space-y-4">
            {companions.map((companion) => (
              <article
                key={companion.id}
                className="rounded-xl bg-white/60 p-4 border border-white/60 transition-colors hover:bg-white/80 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={companion.avatar}
                    alt={companion.name}
                    className="h-12 w-12 rounded-full bg-gray-200 object-cover"
                  />
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold rewards-heading">
                        {companion.name}
                      </p>
                      <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-[#7c3aed]">
                        {companion.level}
                      </span>
                    </div>
                    <p className="mt-1 text-xs rewards-subtext">
                      {companion.description}
                    </p>
                  </div>
                </div>
                <button className="rewards-primary-btn mt-4 px-3.5 py-1.5 text-xs font-semibold">
                  Select
                </button>
              </article>
            ))}
          </div>

          <button className="rewards-primary-btn mt-6 w-full px-5 py-3 text-sm font-bold">
            View My Companions
          </button>
        </section>
      </div>
  );
}
