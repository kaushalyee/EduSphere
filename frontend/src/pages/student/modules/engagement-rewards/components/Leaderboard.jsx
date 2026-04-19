import React, { useState, useEffect } from "react";
import api from "@/api/api";
import TopThreeLeaderboard from "./TopThreeLeaderboard";

export default function Leaderboard({ balance = 0, loading = false }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const [runnersUp, setRunnersUp] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch top 3 separately as requested
        const top3Res = await api.get("/leaderboard/top3");
        setTopPlayers(top3Res.data.topPlayers);

        // Fetch full leaderboard for runners up
        const fullRes = await api.get("/game/leaderboard");
        // Filter out top 3 from runners up
        const remaining = fullRes.data.leaderboard.slice(3, 8).map((u, i) => ({
          name: u.name,
          rank: i + 4,
          points: u.totalGP,
          avatar: `https://ui-avatars.com/api/?name=${u.name}&background=475569&color=fff`
        }));
        setRunnersUp(remaining);
      } catch (err) {
        console.error("Leaderboard fetch failed", err);
      } finally {
        setFetching(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading || fetching) return <div className="animate-pulse bg-slate-100 rounded-2xl h-64 w-full" />;

  return (
    <div className="leaderboard-page">
      <div className="relative flex h-full flex-col rounded-3xl border border-white/5 bg-transparent p-6 shadow-2xl overflow-hidden transition-all duration-300">
        {/* Top Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] absolute top-0 left-0 right-0" />

        <h3 className="mb-6 mt-1 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">
          Leaderboard Ranking
        </h3>

        {/* TOP 3 PODIUM */}
        <div className="mb-8">
          <TopThreeLeaderboard topPlayers={topPlayers} />
        </div>

        <div className="flex-grow space-y-2 mt-4">
          {runnersUp.map((user) => (
            <div key={user.rank} className="flex items-center justify-between rounded-2xl p-3 bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-white/10 group">
              <div className="flex items-center gap-4">
                <span className={`w-6 text-center text-xs font-black ${user.rank === 4 ? 'text-amber-500/80' : 'text-gray-500'}`}>#{user.rank}</span>
                <img src={user.avatar} alt="" className="h-10 w-10 rounded-full border border-white/10 shadow-sm" />
                <span className="text-sm font-bold text-gray-200 tracking-tight group-hover:text-white transition-colors">{user.name}</span>
              </div>
              <span className="text-[11px] font-black text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full group-hover:bg-purple-500/20 transition-all tracking-wider">
                {user.points.toLocaleString()} GP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
