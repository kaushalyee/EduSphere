import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import api from "@/api/api";
import avatarConfig from "@/assets/avatars/avatarConfig";

import AvatarViewer from "./components/AvatarViewer";
import CompanionSelector from "./components/CompanionSelector";
export default function Companion() {
  const { user, setUser, token } = useAuth();
  
  const [companionsList, setCompanionsList] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  // 1. ✅ SOURCE OF TRUTH (AuthContext)
  const rewardPoints = user?.rewardPoints || 0;
  const companionsOwned = user?.companionsOwned || ["robot"];
  const activeCompanion = user?.activeCompanion || "robot";

  // 8. ✅ DEBUG LOG
  useEffect(() => {
    console.log("User State in Companion:", user);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        // Fetch companions config
        const { data: compData } = await api.get("/companions", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 3. ✅ SYNC STATE AFTER FETCH (Initial load)
        const { data: userData } = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(userData);

        const merged = avatarConfig.map(ac => {
          const backendData = compData.find(c => c.id === ac.id);
          return backendData ? { ...ac, ...backendData } : null;
        }).filter(Boolean);

        setCompanionsList(merged);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setListLoading(false);
      }
    };
    fetchData();
  }, [token, setUser]);

  const handleBuy = async (companionId) => {
    try {
      const { data } = await api.post("/companions/buy", { companionId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // 4. ✅ FIX PURCHASE UPDATE
      setUser(prev => ({
        ...prev,
        rewardPoints: data.rewardPoints,
        companionsOwned: data.companionsOwned
      }));
      
      alert("Purchase successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to purchase");
    }
  };

  const handleEquip = async (companionId) => {
    try {
      const { data } = await api.put("/companions/equip", { companionId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 5. ✅ FIX EQUIP UPDATE
      setUser(prev => ({
        ...prev,
        activeCompanion: data.activeCompanion
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to equip");
    }
  };

  if (listLoading) return <div className="text-white p-8">Loading Companions...</div>;

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
          Reward Points: {rewardPoints.toLocaleString()}
        </div>
      </div>
      
      <CompanionSelector companionsList={companionsList}>
        {({ currentCompanion, next, prev, index, companions }) => {
          if (!currentCompanion) return null;

          const isOwned = companionsOwned.includes(currentCompanion.id);
          const isEquipped = activeCompanion === currentCompanion.id;
          const isAffordable = rewardPoints >= currentCompanion.price;

          return (
            <div className="mx-auto flex w-full max-w-6xl items-center justify-center pb-10 px-4">
              <section className="relative w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 min-h-[70vh]">
                
                {/* LEFT: Character Display Area */}
                <div className="flex-1 flex justify-center items-center relative w-full h-[400px] lg:h-[500px]">
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="character-glow" />
                   </div>

                   <div className="w-full h-full flex items-center justify-center relative z-10 drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                    {!isOwned && (
                       <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 px-4 py-1 rounded-full text-white font-bold text-sm z-20">
                         LOCKED
                       </div>
                    )}
                    <AvatarViewer modelPath={currentCompanion.file} />
                   </div>
                   
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

                {/* RIGHT: Info Box */}
                <div className="flex-1 w-full max-w-md">
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl relative z-20">
                    <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight uppercase">
                      {currentCompanion.name}
                    </h2>
                    
                    <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                      {currentCompanion.description || "A loyal study partner to help you achieve your unique learning goals."}
                    </p>
                    
                    {/* BUTTON STATE LOGIC */}
                    {isEquipped ? (
                       <button
                         disabled
                         className="w-full py-4 rounded-2xl bg-gray-600 text-white font-bold text-lg flex items-center justify-center gap-3 cursor-not-allowed"
                       >
                         EQUIPPED
                       </button>
                    ) : isOwned ? (
                       <button
                         onClick={() => handleEquip(currentCompanion.id)}
                         className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-purple-900/20 flex items-center justify-center gap-3 group"
                       >
                         <Zap size={20} className="fill-white group-hover:animate-pulse" />
                         SELECT COMPANION
                       </button>
                    ) : (
                       <button
                         onClick={() => handleBuy(currentCompanion.id)}
                         className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${isAffordable ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:scale-[1.03] active:scale-[0.98] text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                       >
                         BUY FOR {currentCompanion.price} <Zap size={16} />
                       </button>
                    )}
                  </div>
                </div>

                {/* Pagination Dots */}
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
