import { Gamepad2, GraduationCap, Home, PawPrint, Trophy, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RewardsSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "wallet", icon: Wallet, label: "Wallet" },
    { id: "game", icon: Gamepad2, label: "Game" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
    { id: "companion", icon: PawPrint, label: "Companion" },
  ];

  return (
    <div className="z-10 flex h-full w-24 flex-shrink-0 flex-col items-center border-r border-[#1a1f3c] bg-[#0a0e19] py-6">
      <div className="mb-12">
        <div
          onClick={() => navigate("/student/dashboard")}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
          title="Back to Dashboard"
        >
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active =
            tab.id === "home"
              ? isActive("/student/rewards")
              : tab.id === "wallet"
                ? isActive("/student/rewards/wallet")
                : tab.id === "game"
                  ? isActive("/student/rewards/game")
                  : tab.id === "leaderboard"
                    ? isActive("/student/rewards/leaderboard")
                    : tab.id === "companion"
                      ? isActive("/student/companion")
                      : activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "home") {
                  navigate("/student/rewards");
                  return;
                }

                if (tab.id === "wallet") {
                  navigate("/student/rewards/wallet");
                  return;
                }

                if (tab.id === "game") {
                  navigate("/student/rewards/game");
                  return;
                }

                if (tab.id === "leaderboard") {
                  navigate("/student/rewards/leaderboard");
                  return;
                }

                if (tab.id === "companion") {
                  navigate("/student/companion");
                  return;
                }

                setActiveTab(tab.id);
              }}
              className={`group relative flex items-center justify-center rounded-2xl p-3 transition-all duration-300 ${
                active
                  ? "bg-purple-600/20 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]"
                  : "hover:scale-110 hover:bg-white/5"
              }`}
              title={tab.label}
            >
              <Icon
                size={26}
                className={`transition-colors ${
                  active
                    ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                    : "text-gray-500 group-hover:text-purple-300"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
