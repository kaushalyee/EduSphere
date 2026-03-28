import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function useWallet() {
  const { token, user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWallet = useCallback(async () => {
    if (!token) {
      setBalance(0);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/engagement-reward/wallet/me");
      setBalance(Number(data?.data?.balance || 0));
    } catch (err) {
      setBalance(0);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load wallet balance"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Reset immediately when auth context changes to avoid cross-user leaks.
    if (!token) {
      setBalance(0);
      setLoading(false);
      setError("");
      return;
    }

    fetchWallet();
  }, [token, user?._id, fetchWallet]);

  return { balance, loading, error, refresh: fetchWallet };
}
