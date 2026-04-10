import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [totalGP, setTotalGP] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, user, setUser } = useAuth();

  const fetchWallet = useCallback(async () => {
    if (!isAuth) return;
    
    setIsLoading(true);
    try {
      // 🎯 FETCH CORRECT USER GP (PART 4)
      const res = await api.get("/users/me");
      
      if (res.data) {
        // DEBUG LOG (PART 6)
        console.log("Logged user:", res.data._id, "GP:", res.data.totalGP);
        
        setTotalGP(res.data.totalGP || 0);
        
        // SYNC AUTH CONTEXT (PART 4)
        setUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching wallet/user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuth, setUser]);

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
