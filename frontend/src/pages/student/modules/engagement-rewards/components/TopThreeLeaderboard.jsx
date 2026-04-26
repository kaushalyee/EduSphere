import React from "react";
import { useLocation } from "react-router-dom";
import LeaderboardAvatarScene from "./LeaderboardAvatarScene";

/**
 * TopThreeLeaderboard
 * Rebuilds the podium with 3D animated companions and a clean UI overlay.
 * Now synchronized with the companion-page design for better product consistency.
 */
export default function TopThreeLeaderboard({ topPlayers = [] }) {
  const [sceneKey, setSceneKey] = React.useState(0);

  // Force actual remount on every page visit to prevent Three.js state corruption
  React.useEffect(() => {
    setSceneKey(prev => prev + 1);
  }, []);

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center bg-transparent">
      
      {/* 3D Scene Area - Passes real data to the 3D renderer */}
      <div className="w-full h-[450px] relative">
        <LeaderboardAvatarScene key={sceneKey} topPlayers={topPlayers} />
      </div>

      {/* UI Overlay - Minimal Text Aligned under characters at ±2.5 */}
      <div className="absolute bottom-8 w-full px-4 z-20">
        <div className="grid grid-cols-3 w-full max-w-4xl mx-auto items-start">
          
          {/* Rank 2 (Left) - Character x = -2.5 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-800 font-bold shadow-lg mb-4">#2</div>
            <div className="w-full max-w-[140px]">
              <p className="text-white text-xs font-bold truncate mb-1" title={topPlayers[1]?.name || "Empty"}>
                {topPlayers[1]?.name || "-"}
              </p>
              <p className="text-[#a78bfa] text-[10px] font-black tracking-widest uppercase">{topPlayers[1]?.score || 0} GP</p>
            </div>
          </div>

          {/* Rank 1 (Center) - Character x = 0 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(234,179,8,0.5)] mb-4 scale-110">#1</div>
            <div className="w-full max-w-[160px]">
              <p className="text-white text-sm font-black truncate mb-1" title={topPlayers[0]?.name || "Empty"}>
                {topPlayers[0]?.name || "-"}
              </p>
              <p className="text-yellow-400 text-[10px] font-black tracking-widest uppercase">{topPlayers[0]?.score || 0} GP</p>
            </div>
          </div>

          {/* Rank 3 (Right) - Character x = 2.5 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-7 rounded-full bg-[#b45309] flex items-center justify-center text-white font-bold shadow-lg mb-4">#3</div>
            <div className="w-full max-w-[140px]">
              <p className="text-white text-xs font-bold truncate mb-1" title={topPlayers[2]?.name || "Empty"}>
                {topPlayers[2]?.name || "-"}
              </p>
              <p className="text-[#a78bfa] text-[10px] font-black tracking-widest uppercase">{topPlayers[2]?.score || 0} GP</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

