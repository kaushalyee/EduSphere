import React from "react";
import { NavLink } from "react-router-dom";
import { Bell, LayoutDashboard, Wallet, Gamepad2, Trophy, Bot } from "lucide-react";

const TABS = [
  { to: "/student/rewards", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "wallet", label: "Wallet", icon: Wallet },
  { to: "game", label: "Game", icon: Gamepad2 },
  { to: "leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "companion", label: "Companion", icon: Bot },
];

export default function RewardNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="h-[2px] bg-gradient-to-r from-blue-500 to-purple-500" />
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Left Section: Title */}
        <div className="flex items-center gap-0">
          <h1 className="nav-brand text-gray-900 tracking-tight">
            Reward Rush
          </h1>
        </div>

        {/* Center Section: Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `nav-tab ${isActive ? "active" : ""}`
                }
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section: Notifications */}
        <div className="flex items-center">
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors relative text-gray-500 group">
            <Bell size={20} className="group-hover:text-blue-600" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
