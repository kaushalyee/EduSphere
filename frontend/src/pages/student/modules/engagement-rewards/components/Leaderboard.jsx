import useWallet from "../../../../../hooks/useWallet";

export default function Leaderboard() {
  const { balance } = useWallet();

  const topThree = [
    {
      name: "SARAH K.",
      avatar: "https://ui-avatars.com/api/?name=SK&background=3b82f6&color=fff",
    },
    {
      name: "MARCUS R.",
      avatar: "https://ui-avatars.com/api/?name=MR&background=f59e0b&color=fff",
    },
    {
      name: "ELENA W.",
      avatar: "https://ui-avatars.com/api/?name=EW&background=10b981&color=fff",
    },
  ];

  const runnersUp = [
    {
      name: "Alex Vance",
      rank: 4,
      points: Math.max(0, balance + 200).toLocaleString(),
      avatar: "https://ui-avatars.com/api/?name=AV&background=475569&color=fff",
    },
    {
      name: "Jason Thorne",
      rank: 5,
      points: Math.max(0, balance + 100).toLocaleString(),
      avatar: "https://ui-avatars.com/api/?name=JT&background=475569&color=fff",
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-white/5 bg-[#121629] p-7 shadow-xl">
      <h3 className="mb-10 text-base font-extrabold tracking-widest text-white uppercase drop-shadow-sm">
        LEADERBOARD
      </h3>

      <div className="relative mb-10 flex items-end justify-center gap-5">
        <div className="pointer-events-none absolute inset-0 -bottom-10 h-32 rounded-full bg-gradient-to-t from-yellow-500/5 to-transparent blur-3xl"></div>

        <div className="group z-10 flex cursor-pointer flex-col items-center">
          <div className="relative mb-3 transition-transform duration-300 group-hover:-translate-y-2">
            <div className="absolute -inset-1 rounded-full bg-gray-400 blur-[8px] opacity-40 transition-opacity group-hover:opacity-70"></div>
            <img
              src={topThree[0].avatar}
              alt=""
              className="relative z-10 h-16 w-16 rounded-full border-[3px] border-gray-400"
            />
            <div className="absolute -top-3 -right-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-600 bg-gradient-to-br from-gray-300 to-gray-500 text-[10px] font-extrabold text-black shadow-lg">
              2
            </div>
          </div>
          <div className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase">
            {topThree[0].name}
          </div>
        </div>

        <div className="group z-20 flex cursor-pointer flex-col items-center pb-6">
          <div className="relative mb-3 transition-transform duration-300 group-hover:-translate-y-2">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 blur-[10px] opacity-60 transition-opacity group-hover:opacity-100"></div>
            <img
              src={topThree[1].avatar}
              alt=""
              className="relative z-10 h-[5.5rem] w-[5.5rem] rounded-full border-4 border-yellow-400"
            />
            <div className="absolute -top-4 -right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-yellow-200 bg-gradient-to-br from-yellow-300 to-yellow-600 text-xs font-extrabold text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]">
              1
            </div>
          </div>
          <div className="text-xs font-extrabold tracking-widest text-yellow-400 uppercase drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
            {topThree[1].name}
          </div>
        </div>

        <div className="group z-10 flex cursor-pointer flex-col items-center">
          <div className="relative mb-3 transition-transform duration-300 group-hover:-translate-y-2">
            <div className="absolute -inset-1 rounded-full bg-orange-600 blur-[8px] opacity-40 transition-opacity group-hover:opacity-70"></div>
            <img
              src={topThree[2].avatar}
              alt=""
              className="relative z-10 h-16 w-16 rounded-full border-[3px] border-orange-500"
            />
            <div className="absolute -top-3 -right-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-orange-700 bg-gradient-to-br from-orange-400 to-orange-600 text-[10px] font-extrabold text-black shadow-lg">
              3
            </div>
          </div>
          <div className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase">
            {topThree[2].name}
          </div>
        </div>
      </div>

      <div className="z-10 flex-grow space-y-3">
        {runnersUp.map((user) => (
          <div
            key={user.rank}
            className="group flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <span className="w-5 text-center text-xs font-bold text-gray-500">
                {user.rank}
              </span>
              <img
                src={user.avatar}
                alt=""
                className="h-9 w-9 rounded-full border border-white/10 bg-gray-800"
              />
              <span className="text-sm font-bold text-gray-200 transition-colors group-hover:text-white">
                {user.name}
              </span>
            </div>
            <span className="text-sm font-extrabold tracking-wide text-indigo-400">
              {user.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
