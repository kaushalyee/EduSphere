import { CheckCircle2, Circle, Flame, MoreHorizontal } from "lucide-react";

export default function DailyTargets({ balance = 0 }) {
  const safeBalance = balance ?? 0;
  const targetA = Math.max(1, Math.round(safeBalance * 0.04));
  const targetB = Math.max(1, Math.round(safeBalance * 0.08));
  const targetC = Math.max(1, Math.round(safeBalance * 0.12));

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
    <div className="relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-md overflow-hidden transition-all duration-200">
      {/* Top Gradient Strip */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 absolute top-0 left-0 right-0 rounded-t-2xl" />

      <div className="mb-6 mt-1 flex items-center justify-between">
        <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">
          Daily Targets
        </h3>
        <div className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-black text-orange-600 uppercase tracking-tight shadow-sm">
          <Flame size={12} className="fill-orange-500" />
          7 Day Streak
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {targets.map((target, index) => {
          const Icon = target.icon;
          return (
            <div
              key={index}
              className={`flex items-center justify-between rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
                target.active
                  ? "border-blue-200 bg-blue-50/50 shadow-sm"
                  : "border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-xl border transition-colors ${
                    target.completed
                      ? "border-green-200 bg-green-50 text-green-500 shadow-sm shadow-green-100"
                      : target.active
                        ? "border-blue-200 bg-blue-100 text-blue-600 shadow-sm shadow-blue-100"
                        : "border-gray-200 bg-white text-gray-400 shadow-sm"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div className={`text-sm font-bold tracking-tight ${target.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
                    {target.title}
                  </div>
                  <div className={`text-[11px] font-black tracking-wide ${target.completed ? "text-gray-300" : "text-blue-600"}`}>
                    {target.points}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-1">
                {target.completed && <CheckCircle2 size={18} className="text-green-500 animate-[bounce_0.5s_ease-out]" />}
                {target.active && <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                {!target.completed && !target.active && <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
