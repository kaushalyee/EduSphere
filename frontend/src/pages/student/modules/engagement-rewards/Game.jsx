import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

import GameHero from "./components/GameHero";
import GameCard from "./components/GameCard";
import GameStats from "./components/GameStats";
import UnlockButton from "./components/UnlockButton";

export default function Game() {
  const navigate = useNavigate();
  const [attemptConfig, setAttemptConfig] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async (showLoader = false) => {
    try {
      if (showLoader) setIsLoadingStatus(true);
      const res = await api.get("/rewards/attempt-config");
      setAttemptConfig(res.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load attempt configuration");
    } finally {
      if (showLoader) setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus(true);
    const timer = setInterval(() => {
      fetchStatus(false);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const unlockGame = async () => {
    if (isUnlocking) return;

    try {
      setIsUnlocking(true);
      setError("");
      const res = await api.post("/rewards/unlock-attempt");
      const success = Boolean(res?.data?.success);
      if (!success) {
        setError("Unlock failed");
        return;
      }
      const levelId = res?.data?.levelId;
      const attemptId = res?.data?.attemptId;
      if (!levelId) {
        setError("Unlock succeeded but no level was assigned");
        return;
      }
      await fetchStatus(false);
      if (attemptId) {
        localStorage.setItem("currentGameAttemptId", String(attemptId));
      }
      localStorage.setItem("currentPuzzleId", String(levelId));
      console.log("Unlock success, navigating...");
      navigate(`/student/rewards/game/play/${levelId}`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Cannot unlock attempt");
    } finally {
      setIsUnlocking(false);
    }
  };

  const walletBalance = Number(attemptConfig?.walletBalance ?? 0);
  const attemptCost = Number(attemptConfig?.attemptCost ?? 0);
  const maxAttempts = Number(attemptConfig?.maxAttempts ?? 0);
  const attemptsUsedToday = Number(attemptConfig?.attemptsUsedToday ?? 0);
  const availableAttempts = Number(attemptConfig?.availableAttempts ?? 0);
  const balanceTooLow = walletBalance < attemptCost;
  const attemptsExhausted = availableAttempts <= 0;
  const unlockDisabled = useMemo(
    () => isLoadingStatus || isUnlocking || balanceTooLow || attemptsExhausted,
    [isLoadingStatus, isUnlocking, balanceTooLow, attemptsExhausted]
  );

  return (
    <div className="game-page-container mx-auto flex w-full max-w-[1200px] flex-col justify-start gap-5 pb-10">
      <GameHero />
      <div className="rewards-glass-card p-1">
        <GameCard mode="locked" />
      </div>
      <UnlockButton
        onClick={unlockGame}
        disabled={unlockDisabled}
      />
      <div className="rewards-glass-card p-3">
        <GameStats
          walletBalance={walletBalance}
          attemptCost={attemptCost}
          availableAttempts={availableAttempts}
        />
      </div>
      {balanceTooLow ? <p className="text-center text-sm font-medium text-orange-600 mt-2">Insufficient balance for next unlock.</p> : null}
      {attemptsExhausted ? <p className="text-center text-sm font-medium text-red-600 mt-2">You have used all 3 attempts today. Come back tomorrow.</p> : null}
      {error ? <p className="text-center text-sm font-medium text-red-600 mt-2">{error}</p> : null}
    </div>
  );
}
