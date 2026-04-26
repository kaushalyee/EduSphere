export default function EngagementChart() {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const values = [30, 45, 90, 60, 40, 20, 10];

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
          WEEKLY ENGAGEMENT
        </h3>
        <span className="text-xs font-bold text-blue-600 uppercase">
          CONSISTENCY LEVEL 8
        </span>
      </div>

      <div className="mt-auto flex h-32 w-full items-end justify-between gap-2 pt-4">
        {days.map((day, index) => {
          const isHighest = values[index] === Math.max(...values);
          return (
            <div key={day} className="flex w-full flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end justify-center">
                <div
                  className={`w-full max-w-[2rem] rounded-t-md transition-all ${
                    isHighest ? "bg-blue-600" : "bg-blue-100 hover:bg-blue-200"
                  }`}
                  style={{ height: `${values[index]}%` }}
                ></div>
              </div>
              <span className={`text-[10px] font-bold ${isHighest ? "text-blue-600" : "text-gray-500"}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
