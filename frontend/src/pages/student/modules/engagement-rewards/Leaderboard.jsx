import {
  ChevronDown,
  Star,
  Timer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import RewardsSidebar from "./components/RewardsSidebar";

const NEXT_RESET_DISPLAY = "05h : 22m";

const topThreeDisplay = [
  {
    rank: 2,
    name: "Nightfall_X",
    timeSec: 20,
    avatar:
      "https://ui-avatars.com/api/?name=Nightfall+X&background=94a3b8&color=0f172a",
    tier: "silver",
  },
  {
    rank: 1,
    name: "CyberViper",
    timeSec: 15,
    avatar:
      "https://ui-avatars.com/api/?name=Cyber+Viper&background=eab308&color=1e1b4b",
    tier: "gold",
  },
  {
    rank: 3,
    name: "Ethereal_01",
    timeSec: 45,
    avatar:
      "https://ui-avatars.com/api/?name=Ethereal&background=ea580c&color=fff",
    tier: "bronze",
  },
];

const yourRank = {
  rank: 42,
  name: "Neon Prestige",
  bestTimeSec: 38,
  movement: 5,
  avatar:
    "https://ui-avatars.com/api/?name=Neon+Prestige&background=a855f7&color=fff",
};

const fullRankings = [
  {
    rank: 4,
    name: "Zero_Gravity",
    trend: 1,
    timeSec: 22,
    avatar: "https://ui-avatars.com/api/?name=Zero&background=475569&color=fff",
  },
  {
    rank: 5,
    name: "PulseRunner",
    trend: -1,
    timeSec: 30,
    avatar: "https://ui-avatars.com/api/?name=PR&background=475569&color=fff",
  },
  {
    rank: 6,
    name: "Voxel_Shift",
    trend: 0,
    timeSec: 35,
    avatar: "https://ui-avatars.com/api/?name=VS&background=475569&color=fff",
  },
  {
    rank: 7,
    name: "GlitchFox",
    trend: 2,
    timeSec: 41,
    avatar: "https://ui-avatars.com/api/?name=GF&background=475569&color=fff",
  },
  {
    rank: 8,
    name: "NovaTrace",
    trend: -2,
    timeSec: 48,
    avatar: "https://ui-avatars.com/api/?name=NT&background=475569&color=fff",
  },
  {
    rank: 9,
    name: "Synth_Wave",
    trend: 0,
    timeSec: 52,
    avatar: "https://ui-avatars.com/api/?name=SW&background=475569&color=fff",
  },
  {
    rank: 10,
    name: "DataDrift",
    trend: 1,
    timeSec: 58,
    avatar: "https://ui-avatars.com/api/?name=DD&background=475569&color=fff",
  },
];

function formatTime(sec) {
  return `${sec}s`;
}

function PodiumBlock({ tier, children }) {
  const labels = {
    gold: "GOLD",
    silver: "SILVER",
    bronze: "BRONZE",
  };
  const gradients = {
    gold: "from-amber-500/25 via-yellow-600/10 to-transparent",
    silver: "from-slate-300/20 via-slate-400/10 to-transparent",
    bronze: "from-amber-700/25 via-orange-800/10 to-transparent",
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-end overflow-hidden rounded-t-3xl bg-gradient-to-b ${gradients[tier]} px-4 pt-10 pb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/20 before:to-transparent`}
    >
      <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 select-none text-4xl font-black tracking-tighter text-white/[0.04]">
        {labels[tier]}
      </span>
      <div className="relative z-10 flex flex-col items-center">{children}</div>
    </div>
  );
}

function PodiumAvatar({ tier, rank, name, avatar, timeSec, elevated }) {
  const styles = {
    gold: {
      ring: "shadow-[0_0_28px_rgba(234,179,8,0.55)] ring-2 ring-amber-300/90",
      badge: "bg-gradient-to-br from-amber-200 to-amber-600 text-black border-amber-100",
      glow: "bg-amber-400/50",
      time: "text-amber-300 drop-shadow-[0_0_12px_rgba(234,179,8,0.45)]",
      size: elevated
        ? "h-[5.75rem] w-[5.75rem] border-[3px] border-amber-200/90"
        : "",
      badgeSize: elevated
        ? "h-8 w-8 text-xs -top-3 -right-1"
        : "h-6 w-6 text-[10px] -top-2 -right-1",
    },
    silver: {
      ring: "shadow-[0_0_22px_rgba(148,163,184,0.55)] ring-2 ring-slate-300/80",
      badge: "bg-gradient-to-br from-slate-200 to-slate-500 text-slate-950 border-slate-400/60",
      glow: "bg-slate-300/40",
      time: "text-sky-200 drop-shadow-[0_0_10px_rgba(125,211,252,0.35)]",
      size: "h-20 w-20 border-[3px] border-slate-200/70",
      badgeSize: "h-6 w-6 text-[10px] -top-2 -right-1",
    },
    bronze: {
      ring: "shadow-[0_0_22px_rgba(234,88,12,0.45)] ring-2 ring-orange-400/80",
      badge: "bg-gradient-to-br from-orange-300 to-orange-700 text-orange-950 border-orange-500/50",
      glow: "bg-orange-500/35",
      time: "text-orange-300 drop-shadow-[0_0_10px_rgba(251,146,60,0.35)]",
      size: "h-20 w-20 border-[3px] border-orange-400/80",
      badgeSize: "h-6 w-6 text-[10px] -top-2 -right-1",
    },
  };

  const s = styles[tier];

  return (
    <>
      <div
        className={`group relative mb-3 ${elevated ? "translate-y-0 pb-2" : ""}`}
      >
        <div
          className={`absolute -inset-3 rounded-full ${s.glow} blur-2xl opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
        />
        <div className="relative">
          {tier === "gold" && (
            <div className="absolute -top-6 left-1/2 z-20 -translate-x-1/2 text-amber-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]">
              <Star className="h-5 w-5 fill-amber-300" strokeWidth={1.25} />
            </div>
          )}
          <img
            src={avatar}
            alt=""
            className={`relative z-10 rounded-full object-cover ${s.size} ${s.ring}`}
          />
          <div
            className={`absolute ${s.badgeSize} z-20 flex items-center justify-center rounded-full border font-extrabold shadow-lg ${s.badge}`}
          >
            {rank}
          </div>
        </div>
      </div>
      <p className="mb-1 max-w-[140px] truncate text-center text-sm font-bold tracking-tight text-white">
        {name}
      </p>
      <p className={`text-center text-lg font-extrabold tabular-nums ${s.time}`}>
        {formatTime(timeSec)}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Completion Time
      </p>
    </>
  );
}

function TrendCell({ delta }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-white/35">
        -
      </span>
    );
  }

  const up = delta > 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
        up
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-rose-500/15 text-rose-400"
      }`}
    >
      {up ? (
        <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" strokeWidth={2} />
      )}
      {Math.abs(delta)}
    </span>
  );
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("leaderboard");

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#0a0e19] font-sans text-white selection:bg-purple-500/30">
      <RewardsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative min-h-0 flex-grow overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-purple-600/[0.07] blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[480px] w-[480px] rounded-full bg-indigo-600/[0.06] blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
          <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white/45">
                Daily Puzzle Challenge
              </p>
              <h1 className="mb-2 text-3xl font-black uppercase tracking-[0.12em] text-white md:text-4xl">
                Daily Challenge Results
              </h1>
              <p className="mb-1 text-base text-white/70">
                Fastest players ranked by completion time
              </p>
              <p className="text-sm text-white/40">Resets every 24 hours</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/[0.06] px-5 py-3 shadow-[0_0_40px_-8px_rgba(168,85,247,0.35)] backdrop-blur-xl">
              <Timer className="h-5 w-5 text-purple-400" strokeWidth={1.75} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Next Reset In
                </p>
                <p className="text-lg font-bold tabular-nums tracking-tight text-white">
                  {NEXT_RESET_DISPLAY}
                </p>
              </div>
            </div>
          </header>

          <section className="mb-10">
            <div className="grid grid-cols-3 items-end gap-3 md:gap-6">
              <PodiumBlock tier="silver">
                <div className="w-full pb-2">
                  <PodiumAvatar {...topThreeDisplay[0]} />
                </div>
              </PodiumBlock>
              <PodiumBlock tier="gold">
                <div className="w-full pb-4 md:pb-6">
                  <PodiumAvatar {...topThreeDisplay[1]} elevated />
                </div>
              </PodiumBlock>
              <PodiumBlock tier="bronze">
                <div className="w-full pb-2">
                  <PodiumAvatar {...topThreeDisplay[2]} />
                </div>
              </PodiumBlock>
            </div>
          </section>

          <section className="mb-10">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-6 shadow-[0_0_60px_-12px_rgba(168,85,247,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl md:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                      Your Rank
                    </p>
                    <p className="text-4xl font-black tabular-nums text-white md:text-5xl">
                      #{yourRank.rank}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      src={yourRank.avatar}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-purple-400/50 shadow-[0_0_24px_rgba(168,85,247,0.4)]"
                    />
                    <div>
                      <p className="text-lg font-bold text-white">
                        {yourRank.name}
                      </p>
                      <p className="text-sm font-semibold text-emerald-400">
                        ~ +{yourRank.movement} positions
                      </p>
                    </div>
                  </div>
                  <div className="min-w-[120px] border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                      Your Best Time
                    </p>
                    <p className="text-3xl font-black tabular-nums text-white">
                      {formatTime(yourRank.bestTimeSec)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_28px_rgba(168,85,247,0.45)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  Play Challenge
                </button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="border-b border-white/[0.06] px-5 py-4 md:px-8">
              <div className="grid grid-cols-[minmax(0,0.7fr)_1fr_minmax(0,0.55fr)_minmax(0,0.5fr)] gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 md:grid-cols-12">
                <span className="md:col-span-2">Rank</span>
                <span className="md:col-span-5">Player</span>
                <span className="text-center md:col-span-2">Trend</span>
                <span className="text-right md:col-span-3">Time</span>
              </div>
            </div>
            <ul className="divide-y divide-white/[0.04]">
              {fullRankings.map((row) => (
                <li key={row.rank}>
                  <div className="grid grid-cols-[minmax(0,0.7fr)_1fr_minmax(0,0.55fr)_minmax(0,0.5fr)] items-center gap-3 px-5 py-4 transition-colors hover:bg-white/[0.04] md:grid-cols-12 md:px-8">
                    <span className="font-mono text-sm font-bold tabular-nums text-white/90 md:col-span-2">
                      #{String(row.rank).padStart(2, "0")}
                    </span>
                    <div className="flex min-w-0 items-center gap-3 md:col-span-5">
                      <img
                        src={row.avatar}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <span className="truncate text-sm font-semibold text-white">
                        {row.name}
                      </span>
                    </div>
                    <div className="flex justify-center md:col-span-2">
                      <TrendCell delta={row.trend} />
                    </div>
                    <span className="text-right text-sm font-extrabold tabular-nums text-white md:col-span-3">
                      {formatTime(row.timeSec)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-center border-t border-white/[0.05] py-5">
              <button
                type="button"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400/90 transition hover:text-purple-300"
              >
                Load Full Rankings
                <span className="flex flex-col leading-none">
                  <ChevronDown
                    className="h-3.5 w-3.5 opacity-80"
                    strokeWidth={2.5}
                  />
                  <ChevronDown
                    className="-mt-1.5 h-3.5 w-3.5 opacity-50"
                    strokeWidth={2.5}
                  />
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
