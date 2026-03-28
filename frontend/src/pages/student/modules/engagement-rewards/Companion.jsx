import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import RewardsSidebar from "./components/RewardsSidebar";
import AvatarViewer from "./components/AvatarViewer";
import CompanionSelector from "./components/CompanionSelector";
import useWallet from "../../../../hooks/useWallet";

export default function Companion() {
  const [activeTab, setActiveTab] = useState("companion");
  const { balance } = useWallet();

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#0a0e19] font-sans text-white selection:bg-purple-500/30">
      <RewardsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative flex h-full flex-grow flex-col overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[600px] w-[600px] rounded-full bg-indigo-900/10 blur-[150px]"></div>

        <header className="relative z-20 flex h-[90px] shrink-0 items-center border-b border-white/5 bg-[#0a0e19]/80 px-10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-white via-indigo-100 to-gray-400 bg-clip-text text-3xl font-extrabold tracking-tighter text-transparent drop-shadow-sm">
              Reward Rush
            </div>
          </div>

          <div className="ml-auto flex flex-col items-end gap-2">
            <div className="flex items-center gap-4">
              <button className="group relative text-gray-400 transition-colors hover:text-white">
                <Bell size={22} className="transition-transform group-hover:scale-110" />
                <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0e19] bg-gradient-to-br from-purple-400 to-indigo-600 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              </button>
              <div className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-white/10 transition-colors hover:border-purple-500/50">
                <img
                  src="https://ui-avatars.com/api/?name=Alex&background=random"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_18px_rgba(168,85,247,0.25)] backdrop-blur-md">
              Reward Points: {balance.toLocaleString()}
            </div>
          </div>
        </header>

        <main className="relative z-10 min-h-0 flex-grow overflow-y-auto p-6 md:p-10">
          <CompanionSelector>
            {({ currentCompanion, next, prev }) => (
              <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-center">
                <div className="grid w-full grid-cols-[64px_minmax(0,1fr)_64px] items-center gap-4 md:gap-8">
                  <button
                    type="button"
                    onClick={prev}
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                    aria-label="Previous companion"
                  >
                    <ChevronLeft className="h-7 w-7 transition-transform group-hover:-translate-x-0.5" />
                  </button>

                  <div className="flex flex-col items-center">
                    <AvatarViewer
                      modelPath={currentCompanion.model}
                      cameraOffset={currentCompanion.cameraOffset}
                      heightOffset={currentCompanion.heightOffset}
                    />
                    <h1 className="mt-8 text-5xl font-extrabold uppercase tracking-[0.08em] text-white">
                      {currentCompanion.name}
                    </h1>
                    <p className="mt-2 text-center text-sm text-cyan-100/70">
                      {currentCompanion.unlocked
                        ? "Unlocked Companion"
                        : "Locked - Complete more challenges to unlock"}
                    </p>
                    <button
                      type="button"
                      className="mt-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_25px_rgba(124,58,237,0.45)] transition hover:brightness-110"
                    >
                      View Companion
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={next}
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                    aria-label="Next companion"
                  >
                    <ChevronRight className="h-7 w-7 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            )}
          </CompanionSelector>
        </main>
      </div>
    </div>
  );
}
