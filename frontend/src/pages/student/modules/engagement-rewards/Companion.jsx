import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import AvatarViewer from "./components/AvatarViewer";
import CompanionSelector from "./components/CompanionSelector";
import useWallet from "@/hooks/useWallet";

export default function Companion() {
  const { user } = useAuth();
  const { balance } = useWallet();

  return (
    <>
      <div className="flex w-full items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold rewards-heading">Your Companions</h1>
          <p className="text-sm rewards-subtext mt-1">Unlock and select your study companions</p>
        </div>
        <div className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-[#3b82f6] border border-white/60">
          Reward Points: {balance.toLocaleString()}
        </div>
      </div>
      
      <CompanionSelector>
        {({ currentCompanion, next, prev, index, companions }) => {
          if (!currentCompanion) return null;

          return (
            <div className="mx-auto flex w-full max-w-[1280px] items-center justify-center pb-10">
              <div className="rewards-glass-card flex flex-col items-center p-8 w-full max-w-4xl">
                <AvatarViewer
                  modelPath={currentCompanion.model}
                  onNext={next}
                  onPrev={prev}
                  index={index}
                  total={companions.length}
                />
                <h1 className="mt-8 text-4xl font-extrabold uppercase tracking-wide rewards-heading">
                  {currentCompanion.name}
                </h1>
                <p className="mt-2 text-center text-sm font-medium rewards-subtext">
                  {currentCompanion.unlocked
                    ? "Unlocked Companion"
                    : "Locked - Complete more challenges to unlock"}
                </p>
                <button
                  type="button"
                  className="rewards-primary-btn mt-6 px-8 py-3 text-sm font-bold uppercase tracking-wider"
                >
                  View Companion
                </button>
              </div>
            </div>
          );
        }}
      </CompanionSelector>
    </>
  );
}
