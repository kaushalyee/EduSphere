import { useState, useEffect, useCallback } from "react";
import { Timer, TrendingDown, TrendingUp, Star, Loader2 } from "lucide-react";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { io } from "socket.io-client";



function formatGP(gp) {
  return `${gp} GP`;
}

function formatTime(s) {
  return `${s}s`;
}

function PodiumAvatar({ tier, rank, name, avatar, totalGP, totalTime, elevated }) {
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
  
  const displayName = name || "Unknown Student";
  const displayAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl text-white ${s.gradient} ${s.ring} relative ${elevated ? '-translate-y-4 shadow-xl' : ''}`}>
      {tier === "gold" && (
        <div className="absolute -top-4 bg-white rounded-full p-1 shadow-md text-yellow-500">
          <Star className="h-5 w-5 fill-current" />
        </div>
      )}
      <img src={displayAvatar} alt="" className={`rounded-full object-cover border-2 border-white ${s.size} shadow-md`} />
      <span className="text-sm font-medium opacity-90 mb-1">#{rank}</span>
      <h3 className="text-lg font-semibold truncate max-w-[120px] text-center">{displayName}</h3>
      <p className="text-2xl font-bold mt-1 drop-shadow-sm">{formatGP(totalGP)}</p>
      {totalTime > 0 && (
        <span className="text-[10px] px-2 py-0.5 bg-black/10 rounded-full font-medium opacity-80 mt-1">
          Time: {formatTime(totalTime)}
        </span>
      )}
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown timer logic for Asia/Colombo midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      });
      const parts = formatter.formatToParts(now);
      const p = {}; parts.forEach(pt => p[pt.type] = pt.value);
      
      const h_c = parseInt(p.hour);
      const m_c = parseInt(p.minute);
      const s_c = parseInt(p.second);
      
      const secondsSinceMidnight = h_c * 3600 + m_c * 60 + s_c;
      const remainingSeconds = Math.max(0, (24 * 3600) - secondsSinceMidnight);
      
      const h = Math.floor(remainingSeconds / 3600);
      const m = Math.floor((remainingSeconds % 3600) / 60);
      const s = remainingSeconds % 60;
      
      const pad = (n) => n.toString().padStart(2, "0");
      setTimeLeft(`${pad(h)}h : ${pad(m)}m : ${pad(s)}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/game/leaderboard");
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load rankings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();

    const socket = io(window.location.origin === 'http://localhost:5173' ? 'http://localhost:5000' : window.location.origin);
    
    // Listen for score updates to refresh leaderboard in real-time
    socket.on("leaderboard:update", () => {
      fetchLeaderboard();
    });

    return () => socket.disconnect();
  }, [fetchLeaderboard]);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);
  
  const yourEntry = leaderboard.find(entry => entry._id === user?._id);
  const yourRank = leaderboard.findIndex(entry => entry._id === user?._id) + 1;

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

  return (
      <div className="mx-auto max-w-4xl pb-12">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold rewards-heading">
              Leaderboard
            </h1>
          </div>
          <div className="rewards-glass-card flex items-center gap-2 rounded-full px-5 py-2">
            <Timer className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs font-semibold rewards-subtext uppercase tracking-wider">Status</p>
              <p className="text-sm font-bold rewards-heading">Ends in {timeLeft}</p>
            </div>
          </div>
        </header>

        {leaderboard.length === 0 ? (
          <div className="rewards-glass-card p-12 text-center">
            <p className="text-gray-400">No scores recorded yet for today. Be the first!</p>
          </div>
        ) : (
          <>
            {/* Podium Section */}
            <section className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="order-2 md:order-1 pt-4">
                  {topThree[1] && <PodiumAvatar {...topThree[1]} tier="silver" rank={2} elevated={false} />}
                </div>
                <div className="order-1 md:order-2 z-10">
                  {topThree[0] && <PodiumAvatar {...topThree[0]} tier="gold" rank={1} elevated={true} />}
                </div>
                <div className="order-3 md:order-3 pt-4">
                  {topThree[2] && <PodiumAvatar {...topThree[2]} tier="bronze" rank={3} elevated={false} />}
                </div>
              </div>
            </section>

            {/* Highlight Your Rank if not in top 3 */}
            {yourEntry && yourRank > 3 && (
              <section className="mb-8">
                <div className="rewards-glass-card border-2 border-[#3b82f6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center w-12">
                      <span className="text-xl font-bold text-[#3b82f6]">#{yourRank}</span>
                    </div>
                    <img 
                      src={yourEntry.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(yourEntry.name)}&background=a855f7&color=fff`} 
                      alt="You" 
                      className="h-10 w-10 rounded-full border border-blue-200 shadow-sm" 
                    />
                    <div>
                      <p className="font-semibold rewards-heading">{yourEntry.name} (You)</p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <TrendingUp className="h-3 w-3" />
                        Daily Participant
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-semibold rewards-subtext uppercase">Today's Score</p>
                      <div className="flex flex-col items-end">
                        <p className="font-bold rewards-heading">{formatGP(yourEntry.totalGP)}</p>
                        <p className="text-[10px] rewards-subtext font-medium italic opacity-75">Time: {formatTime(yourEntry.totalTime)}</p>
                      </div>
                    </div>
                    <button type="button" className="rewards-primary-btn px-5 py-2 text-sm font-bold">
                      Boost Score
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Other Players List */}
            <section className="space-y-3">
              {remaining.map((row, idx) => (
                <div key={row._id} className="rewards-glass-card rounded-lg p-4 flex justify-between items-center hover:bg-white/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center rewards-subtext font-semibold text-sm">#{idx + 4}</div>
                    <img 
                      src={row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=475569&color=fff`} 
                      alt={row.name} 
                      className="h-9 w-9 rounded-full object-cover border border-gray-100" 
                    />
                    <span className="font-medium rewards-heading">{row.name}</span>
                  </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white/70 text-[#3b82f6] rounded-full text-sm font-semibold border border-white/60">
                        {formatGP(row.totalGP)}
                      </span>
                      <span className="text-[11px] font-medium rewards-subtext italic">
                        {formatTime(row.totalTime)}
                      </span>
                    </div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
  );
}
