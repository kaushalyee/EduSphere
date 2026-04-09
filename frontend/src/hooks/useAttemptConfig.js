import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

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
      console.log("[useAttemptConfig] Fetching config for User:", user?._id);
      const res = await api.get("/rewards/attempt-config");

      if (latestRequestRef.current !== requestId) {
        return;
      }

      setConfig(res.data);
    } catch (err) {
      console.error("[useAttemptConfig] Load Error:", err);
      if (latestRequestRef.current !== requestId) {
        return;
      }
      setError(err?.response?.data?.message || "Failed to load attempt config");
    } finally {
      if (latestRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [token, user?._id]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    loading,
    error,
    refresh: fetchConfig
  };
}
