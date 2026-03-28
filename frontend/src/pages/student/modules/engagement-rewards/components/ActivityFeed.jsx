export default function ActivityFeed({ balance = 0 }) {
  const rewardA = Math.max(1, Math.round(balance * 0.01));
  const rewardB = Math.max(1, Math.round(balance * 0.03));

  const activities = [
    {
      title: "Solved Puzzle #442",
      time: "2 hours ago",
      points: `+${rewardA} pts`,
      active: true,
    },
    {
      title: "Assignment Uploaded",
      time: "5 hours ago",
      points: `+${rewardB} pts`,
      active: false,
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-white/5 bg-[#121629] p-7 shadow-xl">
      <h3 className="mb-8 text-xs font-extrabold tracking-widest text-white uppercase drop-shadow-sm">
        RECENT ACTIVITY
      </h3>

      <div className="relative flex-grow space-y-6 before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-[2px] before:-translate-x-px before:bg-gradient-to-b before:from-purple-500/50 before:to-transparent">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="group relative flex cursor-pointer items-center justify-between"
          >
            <div className="flex items-center">
              <div
                className={`z-10 flex h-6 w-6 items-center justify-center rounded-full border-[2px] bg-[#121629] transition-colors ${
                  activity.active
                    ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    : "border-gray-700"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    activity.active
                      ? "bg-purple-300 shadow-[0_0_5px_rgba(216,180,254,0.8)]"
                      : "bg-transparent"
                  }`}
                ></div>
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-bold tracking-wide text-gray-200 transition-colors group-hover:text-purple-300">
                  {activity.title}
                </h4>
                <div className="mt-1 text-[11px] font-bold tracking-wider text-gray-500">
                  {activity.time}
                </div>
              </div>
            </div>
            <div
              className={`text-[11px] font-extrabold tracking-widest ${
                activity.active ? "text-purple-400" : "text-gray-500"
              }`}
            >
              {activity.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
