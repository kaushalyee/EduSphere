import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [totalGP, setTotalGP] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, user } = useAuth();

  const fetchWallet = useCallback(async () => {
    if (!isAuth) return;
    
    setIsLoading(true);
    try {
      // Use the project's default axios configuration or the one set globally
      const res = await axios.get("/api/user/wallet");
      if (res.data && res.data.totalGP !== undefined) {
        setTotalGP(res.data.totalGP);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuth]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuth) {
      fetchWallet();
    } else {
      setTotalGP(0);
    }
  }, [isAuth, fetchWallet]);

  return (
    <WalletContext.Provider value={{ totalGP, setTotalGP, fetchWallet, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
