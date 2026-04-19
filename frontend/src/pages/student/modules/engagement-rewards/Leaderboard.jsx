import { useState, useEffect, useCallback } from "react";
import { Timer, TrendingDown, TrendingUp, Star, Loader2 } from "lucide-react";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { io } from "socket.io-client";
import TopThreeLeaderboard from "./components/TopThreeLeaderboard";
import LeaderboardRow from "./components/LeaderboardRow";



function formatGP(gp) {
  return `${gp} GP`;
}

function formatTime(s) {
  return `${s}s`;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [top3Players, setTop3Players] = useState([]);
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
      // Fetch separatedly
      const [{ data: fullRes }, { data: top3Res }] = await Promise.all([
        api.get("/game/leaderboard"),
        api.get("/leaderboard/top3")
      ]);

      if (fullRes.success) {
        setLeaderboard(fullRes.leaderboard);
      }
      setTop3Players(top3Res.topPlayers);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
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
    <div className="w-full pb-12">
      {/* Header with wider container to match Navbar padding */}
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-10 flex items-center justify-between w-full pt-4">
          <div>
            <h1 className="text-4xl font-black text-white leaderboard-title-glow tracking-tight">
              Leaderboard
            </h1>
          </div>
          <div className="status-timer-glass flex items-center gap-4 border-white/10 shadow-2xl">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Timer className="h-5 w-5 text-blue-400 animate-pulse" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <p className="timer-label">Status</p>
              <p className="timer-value">Ends in {timeLeft}</p>
            </div>
          </div>
        </header>
      </div>

      <div className="mx-auto max-w-4xl px-6">


        {leaderboard.length === 0 ? (
          <div className="rewards-glass-card p-12 text-center">
            <p className="text-gray-400">No scores recorded yet for today. Be the first!</p>
          </div>
        ) : (
          <>
            {/* Podium Section */}
            <section className="mb-10">
               <TopThreeLeaderboard topPlayers={top3Players} />
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
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs font-semibold rewards-subtext uppercase">Today's Score</p>
                    <div className="flex flex-col items-end gap-0.5">
                      <p className="font-bold rewards-heading text-lg">{formatGP(yourEntry.totalGP)}</p>
                      <p className="text-[10px] rewards-subtext font-medium italic opacity-75">Time: {formatTime(yourEntry.totalTime)}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Other Players List */}
            <section className="space-y-3">
              {remaining.map((row, idx) => (
                <LeaderboardRow 
                  key={row._id} 
                  row={row} 
                  rank={idx + 4} 
                />
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
