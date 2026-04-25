import React from "react";
import { GraduationCap, Users, ShoppingBag } from "lucide-react";

export default function StatsOverview({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Students */}
      <div className="p-6 rounded-xl border-2 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Total Students</span>
          <GraduationCap className="text-blue-600 w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats?.totalStudents ?? 0}</p>
        <p className="text-gray-500 text-sm mt-1">Registered students on platform</p>
      </div>

      {/* Total Tutors */}
      <div className="p-6 rounded-xl border-2 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Total Tutors</span>
          <Users className="text-purple-600 w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats?.totalTutors ?? 0}</p>
        <p className="text-gray-500 text-sm mt-1">Active educators and mentors</p>
      </div>

      {/* Total Listings */}
      <div className="p-6 rounded-xl border-2 bg-green-50 border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Total Listings</span>
          <ShoppingBag className="text-green-600 w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats?.totalListings ?? 0}</p>
        <p className="text-gray-500 text-sm mt-1">Active items in marketplace</p>
      </div>
    </div>
  );
}
