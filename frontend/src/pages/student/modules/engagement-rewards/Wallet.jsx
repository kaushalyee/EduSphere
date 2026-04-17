import { useMemo, useState, useEffect } from "react";
import {
  CalendarDays,
  Coins,
  Flame,
  Sparkles,
  Target,
  Wallet as WalletIcon,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  Gamepad2
} from "lucide-react";

import useWallet from "@/hooks/useWallet";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/api";

import { io } from "socket.io-client";

// Helper for relative time formatting
const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Helper to get icon based on type
const getActivityIcon = (type) => {
  switch (type) {
    case "QUIZ": return <Target size={16} />;
    case "ASSIGNMENT": return <ArrowUpCircle size={16} />;
    case "STREAK": return <Flame size={16} />;
    case "GAME_WIN": return <Gamepad2 size={16} />;
    case "GAME_LOSS": return <Gamepad2 size={16} />;
    case "GAME_START": return <Gamepad2 size={16} />;
    default: return <ArrowUpCircle size={16} />;
  }
};

const getActivityColor = (type) => {
  if (type === "GAME_LOSS" || type === "GAME_START") return "bg-rose-50 text-rose-500";
  if (type === "GAME_WIN") return "bg-purple-50 text-purple-500";
  if (type === "STREAK") return "bg-amber-50 text-amber-500";
  if (type === "QUIZ") return "bg-blue-50 text-blue-500";
  return "bg-blue-50 text-blue-500";
};

export default function Wallet() {
  const { user } = useAuth();
  const { balance: walletPoints, loading: walletLoading, refresh: refreshWallet } = useWallet();
  
  const [todayGP, setTodayGP] = useState(0);
  const [weeklyAttempts, setWeeklyAttempts] = useState({ current: 0, max: 20 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [todayRes, weeklyRes, activityRes] = await Promise.all([
        api.get("/rewards/today"),
        api.get("/game/weekly-attempts"),
        api.get("/activity/recent")
      ]);

      setTodayGP(todayRes.data.todayGP);
      setWeeklyAttempts({
        current: weeklyRes.data.currentAttempts,
        max: weeklyRes.data.maxAttempts
      });
      setActivities(activityRes.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();

    // 🎯 INITIALIZE SOCKET (PART 4)
    // In production, the URL would come from env
    const socket = io(window.location.origin === 'http://localhost:5173' ? 'http://localhost:5000' : window.location.origin);

    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("wallet:update", (payload) => {
      console.log("Real-time wallet update received:", payload);
      // Room-based delivery ensures this is only received by the correct user
      fetchWalletData();
      refreshWallet();
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, refreshWallet]);

  const stats = useMemo(() => {
    return [
      {
        id: "today-gp",
        title: "Today GP",
        value: todayGP.toLocaleString(),
        progress: Math.max(5, Math.min(100, (todayGP / 500) * 100)), // Assuming 500 is a daily goal
        icon: Sparkles,
        color: "text-amber-500",
        bgColor: "bg-amber-50"
      },
      {
        id: "attempts",
        title: "This Week Attempts",
        value: `${weeklyAttempts.current}/${weeklyAttempts.max}`,
        progress: Math.max(5, Math.min(100, (weeklyAttempts.current / weeklyAttempts.max) * 100)),
        icon: Target,
        color: "text-blue-500",
        bgColor: "bg-blue-50"
      },
    ];
  }, [todayGP, weeklyAttempts]);

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
            <button onClick={fetchWalletData} className="hover:rotate-180 transition-transform duration-500">
               <Sparkles size={16} />
            </button>
            {loading ? "..." : `+${todayGP}`} R-Points today
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
          <div 
            className="h-2 rounded-full bg-[#3b82f6]" 
            style={{ width: `${Math.min(100, (walletPoints / 5000) * 100)}%` }} // Dynamic bar
          ></div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          Updated moments ago
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.id}
              className="rewards-glass-card p-6"
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${item.color} ${item.bgColor}`}>
                <Icon size={18} />
              </div>
              <p className="text-sm rewards-subtext font-medium">{item.title}</p>
              <p className="mt-1 text-3xl font-extrabold rewards-heading">
                {loading ? "..." : item.value}
              </p>
              <div className="mt-5 h-2 rounded-full bg-gray-100">
                <div
                  className={`h-2 rounded-full ${item.color.replace('text', 'bg')}`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rewards-glass-card p-7 xl:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold rewards-heading">Recent Activity</h2>
          <Clock size={16} className="text-gray-400" />
        </div>
        <div className="mt-6 space-y-4">
          {loading ? (
             <div className="py-10 text-center text-gray-400">Loading activities...</div>
          ) : activities.length > 0 ? (
            activities.map((item, idx) => (
              <article
                key={idx}
                className="rounded-xl bg-white/60 p-4 border border-white/60 transition-colors hover:bg-white/80 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-lg ${getActivityColor(item.type)}`}>
                      {getActivityIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-semibold rewards-heading">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {item.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        item.points >= 0
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.points >= 0 ? `+${item.points}` : item.points} R-Points
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(item.createdAt)}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="py-10 text-center text-gray-400">No recent activity</div>
          )}
        </div>
      </section>

      <section className="rewards-glass-card p-7">
        <h2 className="text-xl font-bold rewards-heading">Your Achievement</h2>
        <div className="mt-5 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target size={20} />
              </div>
              <span className="font-bold">Next Milestone</span>
           </div>
           <p className="text-sm opacity-90 mb-2">Reach 5,000 points to unlock Elite Avatar</p>
           <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full" 
                style={{ width: `${Math.min(100, (walletPoints / 5000) * 100)}%` }}
              ></div>
           </div>
           <p className="text-xs mt-3 text-right font-medium">
              {Math.max(0, 5000 - walletPoints)} points remaining
           </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
           <button className="rewards-primary-btn w-full px-5 py-3 text-sm font-bold">
              Explore Missions
           </button>
           <button className="w-full px-5 py-3 text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors">
              How it works?
           </button>
        </div>
      </section>
    </div>
  );
}
