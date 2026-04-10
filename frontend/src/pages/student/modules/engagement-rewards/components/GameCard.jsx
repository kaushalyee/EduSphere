import React from "react";
import { Timer, RefreshCcw, Trophy, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import puzzleImg from "@/assets/puzzle.jpg";
import textureBg from "@/assets/texture.png";

const GameCard = ({ gameAttempts = 0, mode = "featured" }) => {
  const navigate = useNavigate();

  const COLORS = {
    red: "#ef4444",
    yellow: "#facc15",
    green: "#22c55e",
    blue: "#38bdf8",
    purple: "#a855f7",
  };

  const gridData = [
    { isDot: true, color: COLORS.red },  { type: "h", color: COLORS.red }, { type: "h", color: COLORS.red }, { type: "h", color: COLORS.red }, { type: "tr", color: COLORS.red },
    { isDot: true, color: COLORS.green },{ type: "h", color: COLORS.green },{ type: "h", color: COLORS.green },{ isDot: true, color: COLORS.green }, { type: "v", color: COLORS.red },
    { isDot: true, color: COLORS.blue }, { type: "h", color: COLORS.blue }, { type: "h", color: COLORS.blue }, { isDot: true, color: COLORS.blue }, { type: "v", color: COLORS.red },
    { isDot: true, color: COLORS.yellow },{ type: "h", color: COLORS.yellow },{ type: "h", color: COLORS.yellow },{ isDot: true, color: COLORS.yellow }, { isDot: true, color: COLORS.red },
    { isDot: true, color: COLORS.purple },{ type: "h", color: COLORS.purple },{ type: "h", color: COLORS.purple },{ type: "h", color: COLORS.purple }, { isDot: true, color: COLORS.purple },
  ];

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
        {/* Right half — puzzle.jpg */}
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

          <h2 style={{ color: '#004d40', fontWeight: 800, fontSize: '2.25rem', margin: 0 }}>FlowFree</h2>
          <p style={{ color: '#00695c', fontSize: '15px', fontWeight: 500, margin: 0, maxWidth: '280px' }}>
            Connect matching colors and fill the grid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-400 to-purple-400 shadow-xl">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white lg:flex-row transition-all duration-300">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col p-8 lg:w-[55%]">
          <div className="mb-6 w-fit rounded-full bg-blue-50/50 px-4 py-1.5 text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border border-blue-100/50">
            FEATURED CHALLENGE
          </div>
          
          <h2 className="mb-3 text-3xl font-black text-slate-900 uppercase tracking-tight">
            PUZZLE CHALLENGE
          </h2>
          
          <p className="mb-8 text-sm font-semibold text-slate-500 leading-relaxed max-w-[90%]">
            Connect matching colors, complete the grid, and earn Game Points (GP) to climb the leaderboard.
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">REWARD SYSTEM</h4>
                <p className="text-sm font-bold text-slate-700">Earn GP based on speed and accuracy</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">DAILY RESET</h4>
                <p className="text-sm font-bold text-slate-700">GP resets daily at 12:00 AM (Asia/Colombo)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ATTEMPTS</h4>
                <p className="text-sm font-bold text-slate-700">Limited attempts — earn more through academic engagement</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/student/rewards/game")}
            className="w-full sm:w-fit rounded-xl px-10 py-4 text-sm font-black tracking-widest transition-all uppercase shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-blue-200 hover:-translate-y-0.5 active:scale-95"
          >
            PLAY NOW
          </button>
        </div>

        {/* RIGHT VISUAL (FLOW GRID) */}
        <div className="flex items-center justify-center bg-slate-50/50 p-8 lg:w-[45%] border-t lg:border-t-0 lg:border-l border-slate-100">
          <div 
            className="grid grid-cols-5 gap-2 bg-[#0b1020] p-4 rounded-2xl shadow-2xl transform scale-95"
            style={{ width: '100%', maxWidth: '300px' }}
          >
            {gridData.map((cell, idx) => (
              <div key={idx} className="relative aspect-square bg-[#0f172a] rounded-lg flex items-center justify-center border border-white/5">
                {cell.isDot && (
                  <div 
                    className="w-[60%] h-[60%] rounded-full z-10"
                    style={{ 
                      backgroundColor: cell.color, 
                      boxShadow: `0 0 12px ${cell.color}` 
                    }}
                  />
                )}
                {cell.type === "h" && (
                  <div 
                    className="absolute w-full h-[30%] z-0 rounded-full opacity-80"
                    style={{ 
                      backgroundColor: cell.color, 
                      filter: "drop-shadow(0 0 6px rgba(255,255,255,0.2))"
                    }}
                  />
                )}
                {cell.type === "v" && (
                  <div 
                    className="absolute h-full w-[30%] z-0 rounded-full opacity-80"
                    style={{ 
                      backgroundColor: cell.color, 
                      filter: "drop-shadow(0 0 6px rgba(255,255,255,0.2))"
                    }}
                  />
                )}
                {cell.type === "tr" && (
                  <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-center justify-center">
                    <div className="absolute h-[160%] w-[30%] left-1/2 -ml-[15%] bottom-0 rounded-full" style={{ backgroundColor: cell.color }} />
                    <div className="absolute w-[160%] h-[30%] top-1/2 -mt-[15%] right-0 rounded-full" style={{ backgroundColor: cell.color }} />
                  </div>
                )}
                {cell.type === "br" && (
                   <div className="absolute inset-x-0 top-0 h-1/2 flex items-center justify-center">
                    <div className="absolute h-[160%] w-[30%] left-1/2 -ml-[15%] top-0 rounded-full" style={{ backgroundColor: cell.color }} />
                    <div className="absolute w-[160%] h-[30%] top-1/2 -mt-[15%] right-0 rounded-full" style={{ backgroundColor: cell.color }} />
                  </div>
                )}
                {cell.type === "bl" && (
                   <div className="absolute inset-x-0 top-0 h-1/2 flex items-center justify-center">
                    <div className="absolute h-[160%] w-[30%] left-1/2 -ml-[15%] top-0 rounded-full" style={{ backgroundColor: cell.color }} />
                    <div className="absolute w-[160%] h-[30%] top-1/2 -mt-[15%] left-0 rounded-full" style={{ backgroundColor: cell.color }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GameCard);

