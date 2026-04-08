import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const normalizeBalance = (value) => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const WALLET_CACHE_KEY = "engagement-reward-wallet-cache";
const WALLET_STALE_TIME = 60 * 1000;

let walletCache = {
  balance: 0,
  fetchedAt: 0,
  promise: null,
};

const canUseStorage = () => typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const getCachedWallet = () => {
  const memoryAge = Date.now() - walletCache.fetchedAt;
  if (walletCache.fetchedAt && memoryAge < WALLET_STALE_TIME) {
    return {
      balance: normalizeBalance(walletCache.balance),
      isFresh: true,
    };
  }

  if (!canUseStorage()) {
    return {
      balance: normalizeBalance(walletCache.balance),
      isFresh: false,
    };
  }

  try {
    const raw = window.sessionStorage.getItem(WALLET_CACHE_KEY);
    if (!raw) {
      return {
        balance: normalizeBalance(walletCache.balance),
        isFresh: false,
      };
    }

    const parsed = JSON.parse(raw);
    const fetchedAt = Number(parsed?.fetchedAt ?? 0);
    const balance = normalizeBalance(parsed?.balance);
    const isFresh = fetchedAt > 0 && Date.now() - fetchedAt < WALLET_STALE_TIME;

    if (fetchedAt > walletCache.fetchedAt) {
      walletCache = {
        ...walletCache,
        balance,
        fetchedAt,
      };
    }

    return { balance, isFresh };
  } catch {
    return {
      balance: normalizeBalance(walletCache.balance),
      isFresh: false,
    };
  }
};

const persistWalletCache = (balance) => {
  const normalizedBalance = normalizeBalance(balance);
  const fetchedAt = Date.now();

  walletCache = {
    balance: normalizedBalance,
    fetchedAt,
    promise: null,
  };

  if (!canUseStorage()) return;

  try {
    window.sessionStorage.setItem(
      WALLET_CACHE_KEY,
      JSON.stringify({ balance: normalizedBalance, fetchedAt })
    );
  } catch {
    // Ignore storage write failures and keep serving the in-memory cache.
  }
};

export default function useWallet() {
  const { token, user } = useAuth();
  const initialCache = useMemo(() => getCachedWallet(), []);
  const [balance, setBalance] = useState(initialCache.balance);
  const [loading, setLoading] = useState(Boolean(token) && !initialCache.isFresh);
  const [error, setError] = useState("");

  const fetchWallet = useCallback(async (options = {}) => {
    const { force = false } = options;

    if (!token) {
      walletCache = {
        balance: 0,
        fetchedAt: 0,
        promise: null,
      };
      if (canUseStorage()) {
        window.sessionStorage.removeItem(WALLET_CACHE_KEY);
      }
      setBalance(0);
      setLoading(false);
      setError("");
      return;
    }

    const cachedWallet = getCachedWallet();
    if (!force && cachedWallet.isFresh) {
      setBalance(cachedWallet.balance);
      setLoading(false);
      return cachedWallet.balance;
    }

    if (!force && walletCache.promise) {
      setLoading(true);
      return walletCache.promise;
    }

    try {
      setLoading(true);
      setError("");
      walletCache.promise = api
        .get("/engagement-reward/wallet/me")
        .then(({ data }) => {
          const nextBalance = normalizeBalance(data?.data?.balance);
          persistWalletCache(nextBalance);
          setBalance(nextBalance);
          return nextBalance;
        });

      return await walletCache.promise;
    } catch (err) {
      walletCache.promise = null;
      setBalance(0);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load wallet balance"
      );
    } finally {
      walletCache.promise = null;
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

    const cachedWallet = getCachedWallet();
    setBalance(cachedWallet.balance);
    setLoading(!cachedWallet.isFresh);
    fetchWallet({ force: !cachedWallet.isFresh });
  }, [token, user?._id, fetchWallet]);

  return {
    balance: normalizeBalance(balance),
    loading,
    error,
    refresh: fetchWallet,
  };
}
