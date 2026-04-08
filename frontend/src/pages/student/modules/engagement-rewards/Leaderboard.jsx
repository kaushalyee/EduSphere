import { useState } from "react";

import { Timer, TrendingDown, TrendingUp, Star } from "lucide-react";

const NEXT_RESET_DISPLAY = "05h : 22m";

const topThreeDisplay = [
  {
    rank: 2,
    name: "Nightfall_X",
    timeSec: 20,
    avatar: "https://ui-avatars.com/api/?name=Nightfall+X&background=0f172a&color=fff",
    tier: "silver",
  },
  {
    rank: 1,
    name: "CyberViper",
    timeSec: 15,
    avatar: "https://ui-avatars.com/api/?name=Cyber+Viper&background=1e1b4b&color=fff",
    tier: "gold",
  },
  {
    rank: 3,
    name: "Ethereal_01",
    timeSec: 45,
    avatar: "https://ui-avatars.com/api/?name=Ethereal&background=7c2d12&color=fff",
    tier: "bronze",
  },
];

const yourRank = {
  rank: 42,
  name: "Neon Prestige",
  bestTimeSec: 38,
  movement: 5,
  avatar: "https://ui-avatars.com/api/?name=Neon+Prestige&background=a855f7&color=fff",
};

const fullRankings = [
  { rank: 4, name: "Zero_Gravity", trend: 1, timeSec: 22, avatar: "https://ui-avatars.com/api/?name=Zero&background=475569&color=fff" },
  { rank: 5, name: "PulseRunner", trend: -1, timeSec: 30, avatar: "https://ui-avatars.com/api/?name=PR&background=475569&color=fff" },
  { rank: 6, name: "Voxel_Shift", trend: 0, timeSec: 35, avatar: "https://ui-avatars.com/api/?name=VS&background=475569&color=fff" },
  { rank: 7, name: "GlitchFox", trend: 2, timeSec: 41, avatar: "https://ui-avatars.com/api/?name=GF&background=475569&color=fff" },
  { rank: 8, name: "NovaTrace", trend: -2, timeSec: 48, avatar: "https://ui-avatars.com/api/?name=NT&background=475569&color=fff" },
  { rank: 9, name: "Synth_Wave", trend: 0, timeSec: 52, avatar: "https://ui-avatars.com/api/?name=SW&background=475569&color=fff" },
  { rank: 10, name: "DataDrift", trend: 1, timeSec: 58, avatar: "https://ui-avatars.com/api/?name=DD&background=475569&color=fff" },
];

function formatTime(sec) {
  return `${sec}s`;
}

function PodiumAvatar({ tier, rank, name, avatar, timeSec, elevated }) {
  const styles = {
    gold: {
      gradient: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      ring: "ring-2 ring-yellow-300 shadow-lg",
      size: elevated ? "h-[5rem] w-[5rem] mb-2" : "h-16 w-16 mb-2",
    },
    silver: {
      gradient: "bg-gradient-to-br from-gray-300 to-gray-500",
      ring: "shadow-md",
      size: "h-14 w-14 mb-2",
    },
    bronze: {
      gradient: "bg-gradient-to-br from-orange-400 to-orange-600",
      ring: "shadow-md",
      size: "h-14 w-14 mb-2",
    },
  };
  const s = styles[tier];

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl text-white ${s.gradient} ${s.ring} relative ${elevated ? '-translate-y-4 shadow-xl' : ''}`}>
      {tier === "gold" && (
        <div className="absolute -top-4 bg-white rounded-full p-1 shadow-md text-yellow-500">
          <Star className="h-5 w-5 fill-current" />
        </div>
      )}
      <img src={avatar} alt="" className={`rounded-full object-cover border-2 border-white ${s.size} shadow-md`} />
      <span className="text-sm font-medium opacity-90 mb-1">#{rank}</span>
      <h3 className="text-lg font-semibold truncate max-w-[120px] text-center">{name}</h3>
      <p className="text-2xl font-bold mt-1 drop-shadow-sm">{formatTime(timeSec)}</p>
    </div>
  );
}

function TrendCell({ delta }) {
  if (delta === 0) {
    return <span className="text-gray-400 text-sm font-bold">-</span>;
  }
  const up = delta > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-bold ${up ? "text-emerald-500" : "text-rose-500"}`}>
      {up ? <TrendingUp className="h-3 w-3" strokeWidth={2} /> : <TrendingDown className="h-3 w-3" strokeWidth={2} />}
      {Math.abs(delta)}
    </span>
  );
}

export default function Leaderboard() {
  return (
      <div className="mx-auto max-w-4xl pb-12">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold rewards-heading">
              Daily Challenge Leaderboard
            </h1>
            <p className="rewards-subtext text-sm mt-1">
              Ranked by fastest completion time
            </p>
          </div>
          <div className="rewards-glass-card flex items-center gap-2 rounded-full px-5 py-2">
            <Timer className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-semibold rewards-subtext uppercase tracking-wider">Next Reset In</p>
              <p className="text-sm font-bold rewards-heading">{NEXT_RESET_DISPLAY}</p>
            </div>
          </div>
        </header>

        {/* Podium Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="order-2 md:order-1 pt-4">
              <PodiumAvatar {...topThreeDisplay[0]} />
            </div>
            <div className="order-1 md:order-2 z-10">
              <PodiumAvatar {...topThreeDisplay[1]} elevated />
            </div>
            <div className="order-3 md:order-3 pt-4">
              <PodiumAvatar {...topThreeDisplay[2]} />
            </div>
          </div>
        </section>

        {/* Highlight Your Rank */}
        <section className="mb-8">
          <div className="rewards-glass-card border-2 border-[#3b82f6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center w-12">
                <span className="text-xl font-bold text-[#3b82f6]">#{yourRank.rank}</span>
              </div>
              <img src={yourRank.avatar} alt="You" className="h-10 w-10 rounded-full border border-blue-200 shadow-sm" />
              <div>
                <p className="font-semibold rewards-heading">{yourRank.name} (You)</p>
                <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  Up {yourRank.movement} spots
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-semibold rewards-subtext uppercase">Your Best</p>
                <p className="font-bold rewards-heading">{formatTime(yourRank.bestTimeSec)}</p>
              </div>
              <button type="button" className="rewards-primary-btn px-5 py-2 text-sm font-bold">
                Play Now
              </button>
            </div>
          </div>
        </section>

        {/* Other Players List */}
        <section className="space-y-3">
          {fullRankings.map((row) => (
            <div key={row.rank} className="rewards-glass-card rounded-lg p-4 flex justify-between items-center hover:bg-white/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 text-center rewards-subtext font-semibold text-sm">#{row.rank}</div>
                <img src={row.avatar} alt={row.name} className="h-9 w-9 rounded-full object-cover border border-gray-100" />
                <span className="font-medium rewards-heading">{row.name}</span>
                <div className="ml-2">
                  <TrendCell delta={row.trend} />
                </div>
              </div>
              <div>
                <span className="px-3 py-1 bg-white/70 text-[#3b82f6] rounded-full text-sm font-semibold border border-white/60">
                  {formatTime(row.timeSec)}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
  );
}
