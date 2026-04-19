import React, { useState, useEffect } from "react";
import api from "@/api/api";

export default function Leaderboard({ loading = false }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const top3Res = await api.get("/leaderboard/top3");
        // Ensure data exists and is sorted by score DESC
        const players = (top3Res.data.topPlayers || []).sort((a, b) => (b.score || 0) - (a.score || 0));
        setTopPlayers(players);
      } catch (err) {
        console.error("Leaderboard fetch failed", err);
      } finally {
        setFetching(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading || fetching) {
    return (
      <div className="bg-[#0f1923] border border-white/5 rounded-[12px] p-4 h-[180px] w-full animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Styling helpers
  const getGPColor = (rank) => {
    if (rank === 0) return "#f5c518"; // Gold
    if (rank === 1) return "#c0c9d8"; // Silver
    if (rank === 2) return "#cd7f32"; // Bronze
    return "#94a3b8";
  };

  const getRankBackground = (rank) => {
    if (rank === 0) return "#f5c518";
    if (rank === 1) return "#c0c9d8";
    if (rank === 2) return "#cd7f32";
    return "#475569";
  };

  const getGlowEffect = (rank) => {
    if (rank === 0) return "0 0 16px 4px rgba(245, 197, 24, 0.75)";
    if (rank === 1) return "0 0 12px 3px rgba(192, 201, 216, 0.65)";
    if (rank === 2) return "0 0 12px 3px rgba(205, 127, 50, 0.65)";
    return "none";
  };

  // Reorder for podium display: Rank 2 (index 1), Rank 1 (index 0), Rank 3 (index 2)
  const podiumIndices = [1, 0, 2];

  return (
    <div className="top-performers-card bg-[#0f1923] border border-white/10 rounded-[12px] p-4 shadow-xl transition-all duration-300 h-auto">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase leading-none">
          TOP PERFORMERS
        </h3>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
      </div>

      {/* Podium Row */}
      <div className="flex items-end justify-center gap-4">
        {podiumIndices.map((idx) => {
          const player = topPlayers[idx];
          const isRank1 = idx === 0;
          const imageSize = isRank1 ? "100px" : "80px";
          
          return (
            <div 
              key={idx} 
              className="flex flex-col items-center flex-1 max-w-[100px]"
              style={isRank1 ? { marginBottom: '20px' } : {}}
            >
              {/* Image Container with Glow */}
              <div 
                className="relative overflow-hidden rounded-[8px] border border-white/10 bg-slate-900/40 transition-transform duration-300"
                style={{ 
                  width: imageSize, 
                  height: imageSize,
                  boxShadow: getGlowEffect(idx)
                }}
              >
                <img 
                  src={`/assets/avatars/previews/${player?.activeCompanion || 'robot'}.jpg`} 
                  className="w-full h-full object-cover" 
                  alt=""
                  onError={(e) => { e.target.src = '/assets/avatars/previews/robot.jpg'; }}
                />
                
                {/* Rank Badge Overlay */}
                <div 
                  className="absolute bottom-0 left-0 right-0 py-0.5 text-[9px] font-black text-center"
                  style={{ 
                    backgroundColor: getRankBackground(idx),
                    color: idx === 2 ? '#fff' : '#0f172a'
                  }}
                >
                  #{idx + 1}
                </div>
              </div>

              {/* Name & GP */}
              <div className="text-center w-full mt-2">
                <p 
                  className="text-white text-[11px] font-bold truncate leading-tight w-full" 
                  title={player?.name || "-"}
                >
                  {player?.name || "-"}
                </p>
                <p 
                  className="text-[10px] font-black mt-1"
                  style={{ color: getGPColor(idx) }}
                >
                  {player?.score ? player.score.toLocaleString() : 0} GP
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
