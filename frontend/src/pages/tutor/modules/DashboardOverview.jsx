import React from "react";

export default function DashboardOverview() {
  const cards = [
    { title: "Total Sessions", value: "0" },
    { title: "Upcoming Sessions", value: "0" },
    { title: "Online Sessions", value: "0" },
    { title: "Offline Sessions", value: "0" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-gray-500 text-sm">{card.title}</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Tutor Overview</h2>
        <p className="text-gray-600">
          Manage your learning sessions and track what you have created.
        </p>
      </div>
    </div>
  );
}