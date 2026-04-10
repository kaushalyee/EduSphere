import { useAuth } from "@/context/AuthContext";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

import AvatarViewer from "./components/AvatarViewer";
import CompanionSelector from "./components/CompanionSelector";
import useWallet from "@/hooks/useWallet";

export default function Companion() {
  const { user } = useAuth();
  const { balance } = useWallet();

  const safeBalance = balance ?? 0;

  return (
    <div className="companion-page">
      {/* Title & Reward Points Badge */}
      <div className="flex w-full items-center justify-between mb-8 px-4">
        <div>
          <h1 className="text-[28px] font-bold text-white mb-0 leading-tight">Your Companions</h1>
          <p className="text-[#a78bfa] text-sm mt-1">Unlock and select your study companions</p>
        </div>
        <div className="reward-badge flex items-center gap-2">
          <Zap size={14} className="text-amber-400 fill-amber-400" />
          Reward Points: {safeBalance.toLocaleString()}
        </div>
      </div>
      
      <CompanionSelector>
        {({ currentCompanion, next, prev, index, companions }) => {
          if (!currentCompanion) return null;

          return (
            <div className="mx-auto flex w-full max-w-4xl items-center justify-center pb-10 px-4">
              <div 
                className="companion-card w-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(100vh - 220px)',
                  overflow: 'hidden',
                  padding: 0
                }}
              >
                {/* Character Display Area — Dark stage (Takes flex space) */}
                <div 
                  className="character-stage w-full relative"
                  style={{ 
                    flex: 1, 
                    minHeight: 0, 
                    borderRadius: '20px 20px 0 0',
                    overflow: 'hidden',
                    paddingTop: '50px',
                    boxSizing: 'border-box'
                  }}
                >
                   <div className="w-full h-full flex items-center justify-center">
                    <AvatarViewer modelPath={currentCompanion.model} />
                   </div>
                   
                   {/* Navigation Arrows */}
                   <button 
                    onClick={prev}
                    disabled={index === 0}
                    className={`nav-arrow absolute left-6 top-1/2 -translate-y-1/2 ${index === 0 ? 'disabled' : ''}`}
                   >
                     <ChevronLeft size={24} />
                   </button>
                   
                   <button 
                    onClick={next}
                    disabled={index === companions.length - 1}
                    className={`nav-arrow absolute right-6 top-1/2 -translate-y-1/2 ${index === companions.length - 1 ? 'disabled' : ''}`}
                   >
                     <ChevronRight size={24} />
                   </button>
                </div>

                {/* Info section — Fixed at bottom, no scroll */}
                <div style={{ padding: '1.5rem 2rem', flexShrink: 0, background: 'rgba(0,0,0,0.2)' }}>
                  <div className="text-center">
                    <h2 className="companion-name mb-1" style={{ fontSize: '24px' }}>{currentCompanion.name}</h2>
                    <p className="companion-desc mb-6 max-w-lg mx-auto leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap">
                      {currentCompanion.name === "Dr Strange" 
                        ? "Master of the mystic arts, providing mystical focus during long study sessions."
                        : currentCompanion.name === "Invincible"
                        ? "Provides indomitable will and stamina for conquering difficult academic modules."
                        : "A loyal study partner to help you achieve your unique learning goals."}
                    </p>
                    
                    {/* SELECT BUTTON — Above dots */}
                    <button
                      type="button"
                      className="select-btn flex items-center justify-center gap-2 group transition-all mb-4"
                    >
                      <Zap size={18} className="fill-white group-hover:scale-110 transition-transform" />
                      SELECT COMPANION
                    </button>

                    {/* Pagination dots — At very bottom */}
                    <div className="pagination-dots mt-0">
                      {companions.map((_, i) => (
                        <div 
                          key={i} 
                          className={`dot ${i === index ? 'active' : ''}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </CompanionSelector>

      <style dangerouslySetInnerHTML={{ __html: `
        .character-stage {
          min-height: 380px;
          max-height: 420px;
          overflow: hidden !important;
          padding-top: 50px !important;
          box-sizing: border-box !important;
        }
        .companion-card {
          overflow: hidden !important;
        }
        .avatar-viewer,
        .avatar-viewer canvas {
          width: 100% !important;
          height: 420px !important;
        }
      `}} />
    </div>
  );
}
