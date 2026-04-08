export default function Leaderboard({ balance = 0, loading = false }) {
  if (loading) return <div className="animate-pulse bg-slate-100 rounded-2xl h-64 w-full" />;

  const topThree = [
    { name: "SARAH K.", avatar: "https://ui-avatars.com/api/?name=SK&background=3b82f6&color=fff" },
    { name: "MARCUS R.", avatar: "https://ui-avatars.com/api/?name=MR&background=f59e0b&color=fff" },
    { name: "ELENA W.", avatar: "https://ui-avatars.com/api/?name=EW&background=10b981&color=fff" },
  ];

  const runnersUp = [
    { name: "Alex Vance", rank: 4, points: Math.max(0, (balance ?? 0) + 200).toLocaleString(), avatar: "https://ui-avatars.com/api/?name=AV&background=475569&color=fff" },
    { name: "Jason Thorne", rank: 5, points: Math.max(0, (balance ?? 0) + 100).toLocaleString(), avatar: "https://ui-avatars.com/api/?name=JT&background=475569&color=fff" },
  ];

  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-md overflow-hidden transition-all duration-200">
      {/* Top Gradient Strip */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 absolute top-0 left-0 right-0 rounded-t-2xl" />

      <h3 className="mb-6 mt-1 text-xs font-black tracking-widest text-gray-400 uppercase">
        LEADERBOARD
      </h3>

      <div className="mb-8 flex items-end justify-center gap-4">
        {/* Rank 2 - Silver */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <img src={topThree[0].avatar} alt="" className="h-12 w-12 rounded-full border-2 border-gray-100 shadow-sm" />
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white">2</div>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{topThree[0].name}</div>
        </div>

        {/* Rank 1 - Gold */}
        <div className="flex flex-col items-center pb-2">
          <div className="relative mb-2">
            <img src={topThree[1].avatar} alt="" className="h-15 w-15 rounded-full border-4 border-yellow-300 shadow-lg ring-2 ring-yellow-300 m-1" />
            <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-sm font-black text-white shadow-md ring-2 ring-white">1</div>
          </div>
          <div className="text-xs font-black text-yellow-600 uppercase tracking-widest bg-yellow-50 px-3 py-0.5 rounded-full ring-1 ring-yellow-100 shadow-sm">
            {topThree[1].name}
          </div>
        </div>

        {/* Rank 3 - Bronze */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <img src={topThree[2].avatar} alt="" className="h-12 w-12 rounded-full border-2 border-orange-100 shadow-sm" />
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-700 text-[10px] font-black text-white shadow-sm ring-2 ring-white">3</div>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{topThree[2].name}</div>
        </div>
      </div>

      <div className="flex-grow space-y-1.5 mt-2">
        {runnersUp.map((user) => (
          <div key={user.rank} className="flex items-center justify-between rounded-xl p-2.5 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100 group">
            <div className="flex items-center gap-3">
              <span className="w-4 text-center text-xs font-black text-gray-300 group-hover:text-blue-500">#{user.rank}</span>
              <img src={user.avatar} alt="" className="h-9 w-9 rounded-full border border-gray-100 shadow-sm" />
              <span className="text-sm font-bold text-gray-700 tracking-tight">{user.name}</span>
            </div>
            <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-100 transition-colors tracking-wide">
              {user.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
