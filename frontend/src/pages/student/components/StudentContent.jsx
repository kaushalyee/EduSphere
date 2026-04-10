import { Users } from "lucide-react";
import { Navigate } from "react-router-dom";

import DashboardOverview from "../modules/DashboardOverview";
import PeerLearning from "../modules/PeerLearning";
import StudentMarketplace from "../marketplace/StudentMarketplace";
import Progress from "../modules/Progress";
import RewardsDashboard from "../modules/engagement-rewards/RewardsDashboard";

function EmptyView({ title, icon }) {
  return (
    <div className="bg-white p-10 text-center rounded-2xl shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 mt-2">Content coming soon...</p>
    </div>
  );
}

export default function StudentContent({ activeTab, options, setActiveTab }) {
  const current = options.find((o) => o.id === activeTab);

  switch (activeTab) {
    case "Dashboard":
      return <DashboardOverview setActiveTab={setActiveTab} />;
    case "PeerLearning":
      return <PeerLearning />;
    case "Market":
      return <StudentMarketplace />;
    case "Progress":
      return <Progress />;
    case "Rewards":
      return <Navigate to="/student/rewards" replace />;
    default:
      return (
        <EmptyView
          title={current?.title}
          icon={current?.icon || <Users />}
        />
      );
  }
}
