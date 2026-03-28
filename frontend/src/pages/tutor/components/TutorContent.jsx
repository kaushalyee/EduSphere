import React from "react";
import DashboardOverview from "../modules/DashboardOverview";
import CreateSession from "../modules/CreateSession";
import MySessions from "../modules/MySessions";
import TrendingRequests from "../modules/TrendingRequests";

export default function TutorContent({
  activeTab,
  setActiveTab,
  selectedTrendingTopic,
  setSelectedTrendingTopic,
}) {
  switch (activeTab) {
    case "dashboard":
      return <DashboardOverview />;

    case "create-session":
      return (
        <CreateSession
          selectedTrendingTopic={selectedTrendingTopic}
          setSelectedTrendingTopic={setSelectedTrendingTopic}
        />
      );

    case "my-sessions":
      return <MySessions />;

    case "trending":
      return (
        <TrendingRequests
          setActiveTab={setActiveTab}
          setSelectedTrendingTopic={setSelectedTrendingTopic}
        />
      );

    default:
      return <DashboardOverview />;
  }
}