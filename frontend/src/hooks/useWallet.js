import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const WALLET_STALE_TIME = 60 * 1000;

export default function useWallet() {
  const { token, user } = useAuth();
  const userId = user?._id;
  const cacheKey = `wallet_${userId}`;

  const initialBalance = useMemo(() => {
    if (!userId) return 0;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.userId === userId && (Date.now() - parsed.timestamp < WALLET_STALE_TIME)) {
          return Number(parsed.balance ?? 0);
        }
      }
    } catch (e) {
      // Cache Read Error silenced for production
    }
    return 0;
  }, [userId, cacheKey]);

  const [balance, setBalance] = useState(initialBalance);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const latestRequestRef = useRef(0);

  useEffect(() => {
    setBalance(initialBalance);
  }, [initialBalance]);

  const fetchWallet = useCallback(async () => {
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    if (!token || !userId) {
      setBalance(0);
      setError("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/engagement-reward/wallet/me");

      if (latestRequestRef.current !== requestId) {
        return;
      }

      const balanceValue = Number(data?.data?.balance ?? 0);
      
      setBalance(balanceValue);
      
      // Persist to user-specific cache
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          userId: userId,
          balance: balanceValue,
          timestamp: Date.now()
        })
      );
    } catch (err) {
      if (latestRequestRef.current !== requestId) {
        return;
      }
      setBalance(0);
      setError(err?.response?.data?.message || "Failed to load wallet");
    } finally {
      if (latestRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [token, userId, cacheKey]);

  useEffect(() => {
    if (!token || !userId) return;
    fetchWallet();
  }, [token, userId, fetchWallet]);

  return {
    balance: Number(balance ?? 0),
    loading,
    error,
    refresh: fetchWallet,
  };
}
