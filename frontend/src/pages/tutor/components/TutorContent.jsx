import React from "react";
import DashboardOverview from "../modules/DashboardOverview";
import CreateSession from "../modules/CreateSession";
import MySessions from "../modules/MySessions";

function EmptyView({ title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      <p className="text-slate-500 mt-2">Content coming soon...</p>
    </div>
  );
}

export default function TutorContent({ activeTab }) {
  switch (activeTab) {
    case "dashboard":
      return <DashboardOverview />;
    case "create-session":
      return <CreateSession />;
    case "my-sessions":
      return <MySessions />;
    case "trending":
      return <EmptyView title="Trending Topics" />;
    case "profile":
      return <EmptyView title="Profile" />;
    default:
      return <DashboardOverview />;
  }
}