import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import StudentSidebar from "@/pages/student/components/StudentSidebar";
import RewardNavbar from "./RewardNavbar";
import { LayoutDashboard, Users, ShoppingBag, TrendingUp, Award } from "lucide-react";
import "../rewardsTheme.css";

const variantFromPath = (pathname = "") => {
  if (pathname.includes("/student/rewards/wallet")) return "wallet";
  if (pathname.includes("/student/rewards/game")) return "game";
  if (pathname.includes("/student/rewards/leaderboard")) return "leaderboard";
  if (pathname.includes("/student/rewards/companion")) return "companion";
  return "dashboard";
};

export default function RewardsLayout({ children, variant = "dashboard" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const activeVariant = children ? variant : variantFromPath(pathname);

  const options = [
    {
      id: "Dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "PeerLearning",
      title: "Peer Learning & Kuppi",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "Market",
      title: "Market Place",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      id: "Progress",
      title: "Progress Tracking",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "Rewards",
      title: "Rewards & Game",
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <div className={`rewards-themed rewards-variant-${activeVariant} flex min-h-screen flex-row`}>
      {/* Global Navigation: Main EduSphere Sidebar */}
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        activeTab="Rewards"
        setActiveTab={() => {}} // Tab switching is handled via routing
        options={options}
      />

      {/* Module Content Area */}
      <div className="main-content flex-1 flex flex-col min-w-0">
        
        {/* Module Navigation: Reward Rush Navbar */}
        <RewardNavbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 rewards-theme-shell">
          <div className="rewards-theme-content p-6">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
