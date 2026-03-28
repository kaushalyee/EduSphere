import { Wallet } from "lucide-react";

export default function RewardWallet({ points, attempts }) {
  const weeklyEarn = Math.max(0, Math.round(points * 0.15));

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/5 bg-[#121629] p-7 shadow-xl">
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-500/10 blur-[40px] transition-all duration-500 group-hover:bg-purple-500/20"></div>

      <div className="relative mb-6 flex items-start justify-between">
        <h3 className="text-xs font-bold tracking-widest text-gray-400">
          REWARD WALLET
        </h3>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-2.5 text-purple-400 shadow-sm">
          <Wallet size={20} />
        </div>
      </div>

      <div className="relative mb-auto">
        <div className="mb-1 flex items-baseline gap-2 text-5xl font-extrabold tracking-tight text-white">
          {points.toLocaleString()}
          <span className="text-base font-bold tracking-wider text-purple-400">
            R-PTS
          </span>
        </div>
        <p className="text-sm font-medium text-gray-500">
          Balance ready for redeem
        </p>
      </div>

      <div className="relative mt-8 space-y-6">
        <div>
          <div className="mb-3 flex justify-between text-xs font-bold tracking-wide text-white">
            <span>GAME ATTEMPTS</span>
            <span className="text-gray-400">{attempts} / 20</span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-800/80 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-1000 ease-out"
              style={{ width: `${(attempts / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
            <div className="mb-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              WEEKLY EARN
            </div>
            <div className="text-xl font-extrabold tracking-tight text-white">
              +{weeklyEarn.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
            <div className="mb-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              NEXT RANK
            </div>
            <div className="text-xl font-extrabold tracking-tight text-white">
              Elite II
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
