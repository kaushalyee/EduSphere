import React from "react";
import { GraduationCap, Users, ShoppingBag } from "lucide-react";

export default function StatsOverview({ stats, loading }) {
  const statCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      description: "Registered students on platform",
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Tutors",
      value: stats?.totalTutors || 0,
      description: "Active educators and mentors",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: "Total Listings",
      value: stats?.totalListings || 0,
      description: "Active items in marketplace",
      icon: <ShoppingBag className="w-6 h-6 text-emerald-600" />,
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-200",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <div 
          key={index}
          className={`bg-white p-6 rounded-[2rem] border ${card.borderColor} shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-4 ${card.bgColor} rounded-2xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {card.title}
              </p>
              <h3 className="text-3xl font-black text-gray-900 leading-none mt-1">
                {card.value}
              </h3>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
