import { Wallet } from "lucide-react";

export default function RewardWallet({ points, attempts }) {
  const safePoints = points ?? 0;
  const safeAttempts = attempts ?? 0;
  const weeklyEarn = Math.max(0, Math.round(safePoints * 0.15));
  
  // Calculate segments (Max 20 attempts, 4 per segment = 5 segments)
  const filledSegments = Math.ceil(safeAttempts / 4);

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
        <div className="mb-1 flex items-baseline gap-1 text-6xl font-black text-gray-900 tracking-tight leading-none">
          {safePoints.toLocaleString()}
          <span className="text-sm font-bold text-gray-400 self-end mb-1 ml-1">
            R-PTS
          </span>
        </div>
        <p className="text-xs text-gray-400 tracking-wide">
          Balance ready for redeem
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-3 flex justify-between text-[10px] font-black tracking-widest text-gray-400 uppercase">
            <span>GAME ATTEMPTS</span>
            <span className="text-gray-500 font-bold">{safeAttempts} / 20</span>
          </div>
          
          <div className="flex gap-1.5 h-1.5 w-full">
            {[1, 2, 3, 4, 5].map((segIdx) => (
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl px-3 py-3 border border-gray-100/50">
            <div className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-1">WEEKLY EARN</div>
            <div className="text-lg font-black text-blue-600 leading-tight">+{weeklyEarn.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-3 border border-gray-100/50">
            <div className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-1">NEXT RANK</div>
            <div className="text-lg font-black text-purple-600 leading-tight">Elite II</div>
          </div>
        </div>
      </div>
    </div>
  );
}
