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
  const { pathname } = useLocation();
  const activeVariant = children ? variant : variantFromPath(pathname);

  const options = [
    {
      id: "Dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5 text-black" />,
    },
    {
      id: "PeerLearning",
      title: "Peer Learning & Kuppi",
      icon: <Users className="w-5 h-5 text-black" />,
    },
    {
      id: "Market",
      title: "Market Place",
      icon: <ShoppingBag className="w-5 h-5 text-black" />,
    },
    {
      id: "Progress",
      title: "Progress Tracking",
      icon: <TrendingUp className="w-5 h-5 text-black" />,
    },
    {
      id: "Rewards",
      title: "Rewards & Game",
      icon: <Award className="w-5 h-5 text-black" />,
    },
  ];

  return (
    <div className={`rewards-themed rewards-variant-${activeVariant} flex-1 flex flex-col h-auto`}>
      {/* Module Navigation: Reward Rush Navbar */}
      <RewardNavbar />

      {/* Dynamic Page Content */}
      <main className="rewards-theme-shell flex-1">
        <div className="rewards-theme-content p-6">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
