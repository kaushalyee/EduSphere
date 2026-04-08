import { Grid2x2, Star, Timer, Zap } from "lucide-react";
import useWallet from "@/hooks/useWallet";

export default function GameCard({ gameAttempts = 0, mode = "featured" }) {
  const { balance } = useWallet();
  const rewardCap = Math.max(1, Math.round((balance ?? 0) * 0.4));

  if (mode === "locked") {
    return (
      <div className="relative w-full rounded-2xl border border-[#3A3A38] bg-[#2C2C2A] p-8 text-center overflow-hidden h-full flex flex-col justify-center transition-all duration-200 shadow-md">
        <div className="mx-auto mb-4 inline-flex items-center gap-1 rounded-full bg-[#3B3B39] px-3 py-1 text-[10px] font-black tracking-widest text-gray-200 uppercase">
          <Grid2x2 size={12} />
          LOCKED
        </div>
        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#363634]">
          <svg width="92" height="92" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" fill="#E24B4A" />
            <path
              d="M8 11V8a4 4 0 0 1 8 0v3"
              stroke="#E24B4A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="16" r="1.5" fill="#F8EAEA" />
            <rect x="11.3" y="16.8" width="1.4" height="2.6" rx="0.7" fill="#F8EAEA" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">FlowFree</h2>
        <p className="mt-2 text-sm text-gray-300 font-medium px-4 tracking-wide">Connect matching colors and fill the grid.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-400 to-purple-400 shadow-md">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white md:flex-row transition-all duration-200">
        <div className="flex flex-col justify-center p-6 md:w-[60%]">
          <div className="mb-4 w-fit rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100">
            FEATURED CHALLENGE
          </div>
          <h2 className="mb-2 text-2xl font-black text-gray-900 uppercase tracking-tight">
            PUZZLE CHALLENGE
          </h2>
          <p className="mb-6 text-sm font-medium text-gray-400 leading-relaxed tracking-wide">
            Test your logic and earn up to <span className="text-blue-600 font-bold">{rewardCap} R-Points</span> in this week's special arena.
          </p>

          <div className="mb-6 flex flex-wrap gap-4 text-xs font-bold text-gray-500">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 italic tracking-wide"><Timer size={14} className="text-blue-400" /> 5 MINS</div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 italic tracking-wide"><Zap size={14} className="text-purple-400" /> HARD</div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 italic tracking-wide"><Star size={14} className="text-amber-400" /> 500 XP</div>
          </div>

          <button
            disabled={gameAttempts === 0}
            className={`mt-auto w-fit rounded-lg px-8 py-3 text-sm font-black tracking-widest transition-all uppercase shadow-sm ${
              gameAttempts > 0
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            {gameAttempts > 0 ? "Start Game" : "Add Attempts"}
          </button>
        </div>

        <div className="flex items-center justify-center border-t border-gray-50 bg-gray-50 p-6 md:w-[40%] md:border-t-0 md:border-l">
          <div className="grid grid-cols-4 gap-2.5">
            {[...Array(16)].map((_, index) => {
              const isDot = [0, 2, 5, 7, 8, 11, 15].includes(index);
              return (
                <div
                  key={index}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    isDot ? "bg-blue-100 border border-blue-200" : "bg-white border border-gray-200"
                  }`}
                >
                  {isDot && <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
