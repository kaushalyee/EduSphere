import { Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useWallet } from "../../../context/WalletContext";
import { useState, useRef, useEffect } from "react";

export default function StudentHeader({
  activeTab,
  options,
  handleLogout,
  onProfileClick,
}) {
  const location = useLocation();
  const current = options.find((o) => o.id === activeTab);
  const { totalGP } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isGamePage = location.pathname.includes('/rewards/game');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const initial = storedUser?.name?.charAt(0).toUpperCase() || "S";

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 mb-6">
      {current && (
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {current.title}
        </h1>
      )}

      <div className="flex items-center gap-3">
        {/* Wallet / GP Display - Only on Game Page */}
        {isGamePage && (
          <div className="gp-badge flex items-center bg-[#1e293b] rounded-full pl-1 pr-4 py-1 border border-gray-700 shadow-lg transition-all hover:scale-105 cursor-pointer group" style={{ position: 'fixed', top: 16, right: 16, zIndex: 300 }}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-200 flex items-center justify-center border-2 border-yellow-700 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
              <span className="text-yellow-900 font-black text-xs">GP</span>
            </div>
            <span className="ml-2 text-white font-black tracking-tight text-sm">
              {totalGP.toLocaleString()}
            </span>
            <div className="ml-3 w-6 h-6 rounded-md bg-[#22c55e] flex items-center justify-center hover:bg-[#16a34a] transition-colors">
              <span className="text-white font-bold text-sm">+</span>
            </div>
          </div>
        )}

        {/* ── Avatar dropdown ── */}
        {!["Dashboard", "PeerLearning", "Market", "Progress"].includes(activeTab) && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-[#2F66E0] flex items-center justify-center text-white text-sm font-bold">
                {initial}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onProfileClick();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
