import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_ATTEMPT_CONFIG = {
  attemptCost: 50,
  maxAttempts: 3,
  attemptsUsedToday: 0,
  availableAttempts: 3,
  walletBalance: 0,
  usageMultiplier: 1,
  performanceMultiplier: 1,
  lastQuizPerformance: 0,
  totalAttemptsLast7Days: 0,
  companionSpendingLast7Days: 0,
};

export default function useAttemptConfig() {
  const { token, user } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequestRef = useRef(0);

  const fetchConfig = useCallback(async () => {
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    if (!token || !user?._id) {
      setConfig(null);
      setError("");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/rewards/attempt-config");

      if (latestRequestRef.current !== requestId) {
        return;
      }

      setConfig({
        ...DEFAULT_ATTEMPT_CONFIG,
        ...(res.data ?? {}),
      });
    } catch (err) {
      if (latestRequestRef.current !== requestId) {
        return;
      }
      setConfig(DEFAULT_ATTEMPT_CONFIG);
      setError(err?.response?.data?.message || "Failed to load attempt config");
    } finally {
      if (latestRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [token, user?._id]);

  useEffect(() => {
    if (!token || !user?._id) return;
    fetchConfig();
  }, [token, user?._id, fetchConfig]);

  return {
    config,
    loading,
    error,
    refresh: fetchConfig
  };
}
