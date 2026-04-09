import { Grid2x2, Star, Timer, Zap } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import puzzleImg from "@/assets/puzzle.jpg";
import textureBg from "@/assets/texture.png";

export default function GameCard({ gameAttempts = 0, mode = "featured" }) {
  const { balance } = useWallet();
  const rewardCap = Math.max(1, Math.round((balance ?? 0) * 0.4));

  if (mode === "locked") {
    return (
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: '280px',
        backgroundImage: `url(${textureBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        {/* Right half — puzzle.jpg with a subtle gradient fade to blend with texture */}
        <div style={{
          position: 'absolute',
          top: 0, 
          right: 0,
          width: '50%', 
          height: '100%',
          backgroundImage: `linear-gradient(to left, rgba(224, 247, 250, 0), rgba(224, 247, 250, 0.4)), url(${puzzleImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7
        }} />

        {/* Center overlay — lock content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '280px',
          gap: '12px',
          padding: '2rem',
        }}>
          <div style={{
            height: '110px',
            width: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            border: '2px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            margin: '8px 0'
          }}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2.5" fill="#E24B4A" />
              <path
                d="M8 11V8a4 4 0 0 1 8 0v3"
                stroke="#E24B4A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="16" r="1.5" fill="white" />
            </svg>
          </div>

          <h2 style={{ 
            color: '#004d40', 
            fontWeight: 800, 
            fontSize: '2.25rem',
            margin: 0,
            textShadow: '0 1px 8px rgba(255,255,255,0.6)',
            letterSpacing: '-0.02em'
          }}>
            FlowFree
          </h2>
          <p style={{ 
            color: '#00695c', 
            fontSize: '15px', 
            fontWeight: 500,
            margin: 0,
            maxWidth: '280px',
            textShadow: '0 1px 6px rgba(255,255,255,0.5)',
            lineHeight: 1.4
          }}>
            Connect matching colors and fill the grid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-400 to-purple-400 shadow-md">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white md:flex-row transition-all duration-200">
        <div className="flex flex-col justify-center p-6 md:w-[60%]">
          <div className="mb-4 w-fit rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100">
            FEATURED CHALLENGE
          </div>
          <h2 className="mb-2 text-2xl font-black text-gray-900 uppercase tracking-tight">
            PUZZLE CHALLENGE
          </h2>
          <p className="mb-6 text-sm font-medium text-gray-400 leading-relaxed tracking-wide">
            Test your logic and earn up to <span className="text-blue-600 font-bold">{rewardCap} R-Points</span> in this week's special arena.
          </p>

          <div className="mb-6 flex flex-wrap gap-4 text-xs font-bold text-gray-500">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 italic tracking-wide"><Timer size={14} className="text-blue-400" /> 5 MINS</div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 italic tracking-wide"><Zap size={14} className="text-purple-400" /> HARD</div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 italic tracking-wide"><Star size={14} className="text-amber-400" /> 500 XP</div>
          </div>

          <button
            disabled={gameAttempts === 0}
            className={`mt-auto w-fit rounded-lg px-8 py-3 text-sm font-black tracking-widest transition-all uppercase shadow-sm ${
              gameAttempts > 0
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            {gameAttempts > 0 ? "Start Game" : "Add Attempts"}
          </button>
        </div>

        <div className="flex items-center justify-center border-t border-gray-50 bg-gray-50 p-6 md:w-[40%] md:border-t-0 md:border-l">
          <div className="grid grid-cols-4 gap-2.5">
            {[...Array(16)].map((_, index) => {
              const isDot = [0, 2, 5, 7, 8, 11, 15].includes(index);
              return (
                <div
                  key={index}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    isDot ? "bg-blue-100 border border-blue-200" : "bg-white border border-gray-200"
                  }`}
                >
                  {isDot && <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
