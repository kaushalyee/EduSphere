import React, { useState, useEffect, useMemo } from "react";
import { Wallet } from "lucide-react";
import { useWallet as useWalletContext } from "@/context/WalletContext";

function getTimeUntilMidnight() {
  const now = new Date();
  
  // SRI LANKA TIMEZONE ENFORCEMENT
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === 'hour').value);
  const minute = parseInt(parts.find(p => p.type === 'minute').value);

  const remainingHours = 23 - hour;
  const remainingMinutes = 59 - minute;
  
  return { h: remainingHours, m: remainingMinutes };
}

const RewardWallet = ({ points, attemptsUsedToday, maxAttempts }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());
  const { totalGP } = useWalletContext();
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (totalGP > 0) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [totalGP]);

  const safePoints = points ?? 0;
  const used = attemptsUsedToday ?? 0;
  const limit = maxAttempts ?? 3;
  const remaining = Math.max(0, limit - used);
  const filledSegments = used;

  return (
    <div className="relative flex h-full flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-md overflow-hidden">
      {/* Top Gradient Strip */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 absolute top-0 left-0 right-0 rounded-t-xl" />

      <div className="mb-6 mt-1 flex items-start justify-between">
        <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mt-1">
          Reward Wallet
        </h3>
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100 transition-colors hover:bg-blue-100">
          <Wallet size={20} />
        </div>
      </div>

      <div className="mb-auto">
        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">
          Reward Points (RP)
        </p>
        <div 
          className="mb-1 flex items-baseline gap-1 text-6xl font-black tracking-tight leading-none"
          style={{ 
            transform: 'scale(1.05)',
            transformOrigin: 'left bottom',
            background: 'linear-gradient(90deg, #6a5cff, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}
        >
          {safePoints.toLocaleString()}
        </div>
        <p className="text-xs text-gray-400 tracking-wide mt-1">
          Balance ready for redeem
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-3 flex justify-between text-[10px] font-black tracking-widest text-gray-400 uppercase">
            <span>GAME ATTEMPTS</span>
            <span className="text-gray-500 font-bold">{used} / {limit} USED TODAY</span>
          </div>
          
          <div className="flex gap-1.5 h-1.5 w-full">
            {[1, 2, 3].map((segIdx) => (
              <div 
                key={segIdx}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  segIdx <= filledSegments 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                    : "bg-gray-100"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] font-medium text-gray-400">
            {remaining > 0 
              ? `${remaining} attempt${remaining === 1 ? '' : 's'} remaining` 
              : `Resets in ${timeLeft.h}h ${timeLeft.m}m`
            }
          </p>
        </div>

        {/* GP HIGHLIGHT SECTION (PART 3B & 4) */}
        <div 
          className={`bg-amber-50 rounded-xl px-4 py-4 border border-amber-100 transition-all duration-300 transform active:scale-95 ${shouldPulse ? 'animate-gp-pulse' : ''}`}
          style={{ 
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
          }}
        >
          <div className="text-[10px] font-black text-amber-600 tracking-widest uppercase mb-1">
            Game Points (GP)
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-500 tracking-tight transition-all duration-300">
              {totalGP.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-gp {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-gp-pulse {
          animation: pulse-gp 0.5s ease-in-out;
        }
      `}} />
    </div>
  );
};

export default React.memo(RewardWallet);


