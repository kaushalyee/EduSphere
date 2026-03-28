import { CheckCircle2, Circle, Flame, MoreHorizontal } from "lucide-react";
import useWallet from "../../../../../hooks/useWallet";

export default function DailyTargets() {
  const { balance } = useWallet();
  const targetA = Math.max(1, Math.round(balance * 0.04));
  const targetB = Math.max(1, Math.round(balance * 0.08));
  const targetC = Math.max(1, Math.round(balance * 0.12));

  const targets = [
    {
      title: "Attend Morning Session",
      points: `+${targetA} R-PTS`,
      completed: true,
      icon: CheckCircle2,
      active: false,
    },
    {
      title: "Complete Physics Quiz",
      points: `+${targetB} R-PTS`,
      completed: false,
      icon: MoreHorizontal,
      active: true,
    },
    {
      title: "Maintain Focus Streak",
      points: `+${targetC} R-PTS`,
      completed: false,
      icon: Circle,
      active: false,
    },
  ];

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-[#121629] p-7 shadow-xl">
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <h3 className="text-base font-extrabold tracking-widest text-white uppercase drop-shadow-sm">
          Daily Targets
        </h3>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold tracking-widest text-gray-200 uppercase shadow-sm">
          <Flame
            size={14}
            className="fill-orange-500 text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]"
          />
          7 Day Streak
        </div>
      </div>

      <div className="relative z-10 flex flex-grow flex-col justify-center gap-4">
        {targets.map((target, index) => {
          const Icon = target.icon;

          return (
            <div
              key={index}
              className={`flex cursor-pointer items-center justify-between rounded-[1.25rem] border p-4 transition-all duration-300 ${
                target.active
                  ? "border-indigo-500/40 bg-gradient-to-r from-white/5 to-white/10 shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-indigo-400"
                  : "border-transparent bg-black/20 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors ${
                    target.completed
                      ? "border-purple-500/20 bg-purple-600/10 text-purple-400"
                      : target.active
                        ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                        : "border-white/5 bg-white/5 text-gray-500"
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      target.completed
                        ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                        : ""
                    }
                  />
                </div>
                <div>
                  <div
                    className={`font-bold tracking-wide ${
                      target.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-100"
                    }`}
                  >
                    {target.title}
                  </div>
                  <div
                    className={`mt-1 text-[11px] font-extrabold tracking-widest ${
                      target.completed ? "text-gray-600" : "text-indigo-400"
                    }`}
                  >
                    {target.points}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-2">
                {target.completed ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                ) : null}
                {target.active ? (
                  <div className="h-3.5 w-3.5 animate-pulse rounded-full border-2 border-[#121629] bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>
                ) : null}
                {!target.completed && !target.active ? (
                  <div className="h-7 w-7 rounded-full border-2 border-gray-700 bg-black/30"></div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
