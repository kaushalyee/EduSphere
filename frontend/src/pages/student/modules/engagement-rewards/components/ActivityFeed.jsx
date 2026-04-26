export default function ActivityFeed({ balance = 0, loading = false }) {
  const safeBalance = balance ?? 0;
  const rewardA = Math.max(1, Math.round(safeBalance * 0.01));
  const rewardB = Math.max(1, Math.round(safeBalance * 0.03));

  if (loading) return <div className="animate-pulse bg-slate-100 rounded-2xl h-32 w-full" />;

  const activities = [
    { title: "Solved Puzzle #442", time: "2 hours ago", points: `+${rewardA} pts`, active: true },
    { title: "Assignment Uploaded", time: "5 hours ago", points: `+${rewardB} pts`, active: false },
  ];

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-md">
      <h3 className="mb-6 text-sm font-bold tracking-wide text-gray-900 uppercase">
        RECENT ACTIVITY
      </h3>

      <div className="relative flex-grow space-y-5 before:absolute before:inset-0 before:left-[11px] before:h-full before:w-[2px] before:bg-gray-100">
        {activities.map((activity, index) => (
          <div key={index} className="relative flex items-center justify-between pl-8 cursor-pointer">
            <div className={`absolute left-0 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white ${activity.active ? "border-blue-500" : "border-gray-300"}`}>
              {activity.active && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{activity.title}</h4>
              <div className="text-xs font-semibold text-gray-500">{activity.time}</div>
            </div>
            <div className={`text-xs font-bold ${activity.active ? "text-green-600" : "text-gray-500"}`}>
              {activity.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
