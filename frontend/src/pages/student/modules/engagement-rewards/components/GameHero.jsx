import React from "react";
import { useWallet } from "@/context/WalletContext";

export default function GameHero() {
  const { sessionGP } = useWallet();

  return (
    <section className="w-full pb-4">
      <div className="header-row relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900 md:text-4xl" style={{ fontWeight: 700, margin: '0 0 6px' }}>
            Puzzle Challenge
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-500 md:text-base" style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Master the logic, unlock the grid, and earn rewards.
          </p>
        </div>

        <div className="gp-container absolute right-0">
          <div className="coin">GP</div>
          <span className="value">{sessionGP}</span>
        </div>
      </div>
    </section>
  );
}
