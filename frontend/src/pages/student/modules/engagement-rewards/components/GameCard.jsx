import { Grid2x2, Lock, Star, Timer, Zap } from "lucide-react";

export default function GameCard({ gameAttempts = 0, mode = "featured" }) {
  if (mode === "locked") {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-gradient-to-br from-white/5 to-white/10 p-5 shadow-[0_0_60px_rgba(124,58,237,0.15)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-red-500 shadow-[0_0_50px_rgba(124,58,237,0.35)]">
            <Lock className="h-8 w-8 text-white" />
          </div>

          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold tracking-widest text-red-400">
            <Grid2x2 size={12} />
            LOCKED
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white">FlowFree</h2>
          <p className="mt-2 text-sm text-gray-300">Connect matching colors and fill the grid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#121629] to-[#0f1222] transition-all duration-500 hover:border-purple-500/30 md:flex-row">
      <div className="relative flex flex-col justify-center p-8 md:w-[60%]">
        <div className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-[60px] transition-all group-hover:bg-indigo-500/10"></div>

        <div className="relative">
          <div className="mb-5 w-fit rounded-full border border-purple-500/30 bg-purple-900/40 px-3 py-1.5 text-[10px] font-bold tracking-widest text-purple-300 uppercase">
            FEATURED CHALLENGE
          </div>
          <h2 className="mb-3 text-3xl font-extrabold tracking-wide text-white drop-shadow-sm">
            PUZZLE CHALLENGE
          </h2>
          <p className="mb-8 max-w-sm text-sm font-medium leading-relaxed text-gray-400">
            Test your logic and earn up to 500 R-Points in this week&apos;s
            special arena.
          </p>

          <div className="mb-8 flex flex-wrap gap-5 text-xs font-bold">
            <div className="flex items-center gap-2 text-white">
              <Timer size={16} className="text-purple-400" /> 5 MINS
            </div>
            <div className="flex items-center gap-2 text-white">
              <Zap size={16} className="text-purple-400" /> HARD
            </div>
            <div className="flex items-center gap-2 text-white">
              <Star size={16} className="text-purple-400" /> 500 XP
            </div>
          </div>
        </div>

        <button
          disabled={gameAttempts === 0}
          className={`mt-auto self-start rounded-full border-2 px-8 py-3.5 font-bold tracking-wide transition-all duration-300 ${
            gameAttempts > 0
              ? "border-purple-600/50 bg-purple-600/10 text-purple-300 shadow-[0_0_20px_rgba(147,51,234,0.15)] hover:border-purple-600 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
              : "cursor-not-allowed border-gray-800 bg-gray-900/50 text-gray-500"
          }`}
        >
          {gameAttempts > 0 ? "Start Game" : "Need Attempts"}
        </button>
      </div>

      <div className="relative flex h-64 items-center justify-center overflow-hidden border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0c16] p-8 md:h-auto md:w-[40%] md:border-t-0 md:border-l md:bg-gradient-to-r">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] opacity-60 transition-opacity duration-700 group-hover:opacity-100"></div>

        <div className="relative z-10 grid scale-90 grid-cols-4 gap-4 transition-transform duration-700 group-hover:scale-105 sm:scale-100">
          {[...Array(16)].map((_, index) => {
            const isDot = [0, 2, 5, 7, 8, 11, 15].includes(index);

            return (
              <div
                key={index}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${
                  isDot
                    ? "border border-purple-500/50 bg-purple-900/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                    : "border border-white/5 bg-gray-800/20"
                }`}
              >
                {isDot ? (
                  <div
                    className="h-2.5 w-2.5 animate-pulse rounded-full bg-purple-300 shadow-[0_0_10px_rgba(216,180,254,0.8)]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  ></div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
