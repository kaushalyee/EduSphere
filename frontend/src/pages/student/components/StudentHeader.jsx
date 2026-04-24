import { useLocation } from "react-router-dom";
import { useWallet } from "../../../context/WalletContext";

export default function StudentHeader({
  activeTab,
  options,
  handleLogout,
}) {
  const location = useLocation();
  const current = options.find((o) => o.id === activeTab);
  const { totalGP } = useWallet();

  const isGamePage = location.pathname.includes('/rewards/game');

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 mb-6">
      {current && (
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {current.title}
        </h1>
      )}

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