import React, { useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";

export default function GameHero() {
  const { totalGP } = useWallet();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // DEBUG LOG (PART 6)
      console.log("Logged user:", user._id, "GP:", user.totalGP);
    }
  }, [user]);

  return (
    <section className="w-full pb-4">
      <div className="header-row relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Puzzle Challenge
          </h1>
        </div>

        <div className="gp-container absolute right-0">
          <div className="coin">GP</div>
          <span className="value">{totalGP}</span>
        </div>
      </div>
    </section>
  );
}

