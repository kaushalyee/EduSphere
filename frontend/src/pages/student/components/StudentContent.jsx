import React from "react";
import { Users } from "lucide-react";

import DashboardOverview from "../modules/DashboardOverview";
import PeerLearning from "../modules/PeerLearning";
import Market from "../modules/Market";
import Progress from "../modules/Progress";
import Rewards from "../modules/Rewards";

function EmptyView({ title, icon }) {
  return (
    <div className="bg-white p-10 text-center rounded-2xl shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 mt-2">Content coming soon...</p>
    </div>
  );
}

export default function StudentContent({ activeTab, options }) {
  const current = options.find((o) => o.id === activeTab);

  switch (activeTab) {
    case "Dashboard":
      return <DashboardOverview />;
    case "PeerLearning":
      return <PeerLearning />;
case "Market":
  return <Market />;
    case "Progress":
      return <Progress />;
    case "Rewards":
      return <Rewards />;
    default:
      return (
        <EmptyView
          title={current?.title}
          icon={current?.icon || <Users />}
        />
      );
  }
}