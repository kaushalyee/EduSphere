import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useWallet } from "../../../context/WalletContext";

export default function StudentHeader({
  setIsSidebarOpen,
  activeTab,
  options,
  handleLogout,
}) {
  const location = useLocation();
  const current = options.find((o) => o.id === activeTab);
  const { totalGP } = useWallet();

  const isGamePage = location.pathname.includes('/rewards/game');

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        {/* Toggle remains for mobile/manual if needed, but width is CSS driven */}
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        {activeTab !== "Market" && (
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {current?.title || "Student Dashboard"}
            </h2>
            <p className="text-sm text-gray-500">Welcome back</p>
          </div>
        )}
      </div>

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
    </header>
  );
}