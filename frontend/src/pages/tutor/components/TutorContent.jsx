import React from "react";
import CreateSession from "../modules/CreateSession";

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
    case "create-session":
      return <CreateSession />;
    case "dashboard":
      return <EmptyView title="Dashboard Overview" />;
    case "trending":
      return <EmptyView title="Trending Topics" />;
    case "my-sessions":
      return <EmptyView title="My Sessions" />;
    default:
      return <CreateSession />;
  }
}