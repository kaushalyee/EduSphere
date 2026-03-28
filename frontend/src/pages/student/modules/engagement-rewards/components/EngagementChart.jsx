export default function EngagementChart() {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const values = [30, 45, 90, 60, 40, 20, 10];

  return (
    <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/5 bg-[#121629] p-7 shadow-xl">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-xs font-extrabold tracking-widest text-white uppercase drop-shadow-sm">
          WEEKLY ENGAGEMENT
        </h3>
        <span className="text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase">
          CONSISTENCY LEVEL 8
        </span>
      </div>

      <div className="mt-auto flex h-32 w-full items-end justify-between gap-3 pt-4">
        {days.map((day, index) => {
          const isHighest = values[index] === Math.max(...values);

          return (
            <div
              key={day}
              className="group relative flex w-full flex-col items-center gap-4"
            >
              <div className="flex h-24 w-full items-end justify-center">
                <div
                  className={`w-full max-w-[2.5rem] rounded-t-xl transition-all duration-500 ease-out ${
                    isHighest
                      ? "relative z-10 bg-gradient-to-t from-indigo-600 to-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      : "bg-white/5 group-hover:bg-white/15 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  }`}
                  style={{ height: `${values[index]}%` }}
                >
                  {isHighest ? (
                    <div className="absolute -top-1 left-0 right-0 h-1 rounded-full bg-white/50 blur-[2px]"></div>
                  ) : null}
                </div>
              </div>
              <span
                className={`text-[9px] font-extrabold tracking-widest transition-colors ${
                  isHighest
                    ? "text-gray-200"
                    : "text-gray-600 group-hover:text-gray-400"
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
