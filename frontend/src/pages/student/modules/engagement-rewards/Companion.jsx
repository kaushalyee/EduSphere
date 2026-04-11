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
            <div className="mx-auto flex w-full max-w-6xl items-center justify-center pb-10 px-4">
              <section className="relative w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 min-h-[70vh]">
                
                {/* LEFT: Character Display Area — Free floating */}
                <div className="flex-1 flex justify-center items-center relative w-full h-[400px] lg:h-[500px]">
                   {/* Background Glow */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="character-glow" />
                   </div>

                   <div className="w-full h-full flex items-center justify-center relative z-10 drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                    <AvatarViewer modelPath={currentCompanion.model} />
                   </div>
                   
                   {/* Navigation Arrows (Positioned near character) */}
                   <button 
                    onClick={prev}
                    disabled={index === 0}
                    className={`nav-arrow absolute left-0 top-1/2 -translate-y-1/2 ${index === 0 ? 'disabled' : ''}`}
                   >
                     <ChevronLeft size={24} />
                   </button>
                   
                   <button 
                    onClick={next}
                    disabled={index === companions.length - 1}
                    className={`nav-arrow absolute right-0 top-1/2 -translate-y-1/2 ${index === companions.length - 1 ? 'disabled' : ''}`}
                   >
                     <ChevronRight size={24} />
                   </button>
                </div>

                {/* RIGHT: Info Box — Glassmorphism style */}
                <div className="flex-1 w-full max-w-md">
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl relative z-20">
                    <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight uppercase">
                      {currentCompanion.name}
                    </h2>
                    
                    <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                      {currentCompanion.name === "Dr Strange" 
                        ? "Master of the mystic arts, providing mystical focus during long study sessions."
                        : currentCompanion.name === "Invincible"
                        ? "Provides indomitable will and stamina for conquering difficult academic modules."
                        : "A loyal study partner to help you achieve your unique learning goals."}
                    </p>
                    
                    {/* SELECT BUTTON */}
                    <button
                      type="button"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-purple-900/20 flex items-center justify-center gap-3 group"
                    >
                      <Zap size={20} className="fill-white group-hover:animate-pulse" />
                      SELECT COMPANION
                    </button>
                  </div>
                </div>

                {/* Pagination Dots — Centered at bottom */}
                <div className="absolute -bottom-10 lg:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  {companions.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-[#a78bfa] shadow-[0_0_10px_#a78bfa]' : 'w-2 bg-white/20'}`} 
                    />
                  ))}
                </div>
              </section>
            </div>
          );
        }}
      </CompanionSelector>

      <style dangerouslySetInnerHTML={{ __html: `
        .avatar-viewer,
        .avatar-viewer canvas {
          width: 100% !important;
          height: 100% !important;
          max-height: 450px !important;
        }
        .character-glow {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%);
          filter: blur(40px);
          border-radius: 50%;
        }
      `}} />
    </div>
  );
}
