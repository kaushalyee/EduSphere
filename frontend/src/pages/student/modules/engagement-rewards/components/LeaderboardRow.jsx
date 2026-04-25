import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import CompanionHoverCard from './CompanionHoverCard';

const formatGP = (gp) => `${gp} GP`;
const formatTime = (s) => `${s}s`;

const LeaderboardRow = ({ row, rank }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="rewards-glass-card relative rounded-lg p-4 flex justify-between items-center hover:bg-white/80 transition-colors cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div className="w-8 text-center rewards-subtext font-semibold text-sm">#{rank}</div>
        <img 
          src={row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=475569&color=fff`} 
          alt={row.name} 
          className="h-9 w-9 rounded-full object-cover border border-gray-100" 
        />
        <span className="font-medium rewards-heading">{row.name}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-white/70 text-[#3b82f6] rounded-full text-sm font-semibold border border-white/60">
          {formatGP(row.totalGP)}
        </span>
        <span className="text-[11px] font-medium rewards-subtext italic">
          {formatTime(row.totalTime)}
        </span>
      </div>

      {/* Companion Hover Card - Anchored to row center-right */}
      <CompanionHoverCard 
        companionId={row.activeCompanion || 'robot'} 
        visible={isHovered} 
      />
    </div>
  );
};

export default LeaderboardRow;
