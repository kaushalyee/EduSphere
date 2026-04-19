import React from "react";
import AvatarViewer from "./AvatarViewer";

export default function PlayerAvatar({ player, rank, highlight = false }) {
  if (!player) return null;

  const modelFile = player.activeCompanion ? `${player.activeCompanion}.glb` : "robot.glb";

  return (
    <div className={`podium-player rank-${rank} flex flex-col items-center relative overflow-visible`}>
      {/* Rank Indicator */}
      <div className={`rank-badge absolute -top-2 flex items-center justify-center rounded-full font-black shadow-lg z-[40]
        ${rank === 1 ? "w-10 h-10 text-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-2 border-white/50" : 
          rank === 2 ? "w-8 h-8 text-sm bg-gradient-to-br from-gray-300 to-gray-500 text-white border-2 border-white/30" : 
          "w-7 h-7 text-xs bg-gradient-to-br from-orange-400 to-orange-700 text-white border-2 border-white/20"}`}>
        #{rank}
      </div>

      {/* THREE.JS CANVAS CONTAINER */}
      <div className="avatar-wrapper relative overflow-visible" style={{ width: "240px", height: "360px" }}>
        {highlight && (
          <div className="absolute inset-x-0 bottom-4 h-24 bg-purple-500/10 blur-3xl rounded-full scale-125 pointer-events-none" />
        )}
        <AvatarViewer modelPath={modelFile} />
      </div>

      {/* Player Labels */}
      <div className="mt-0 text-center w-full z-10 bg-white/5 backdrop-blur-sm rounded-lg py-1 px-3">
        <h3 className="font-black uppercase tracking-tight text-slate-800 mb-0 text-xs">
          {player.name}
        </h3>
        <p className="font-bold tracking-widest text-purple-600 text-[9px] leading-tight">
          {player.score.toLocaleString()} GP
        </p>
      </div>
    </div>
  );
}
