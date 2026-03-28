import React from "react";
import { MapPin, User, Tag, ArrowRight } from "lucide-react";

export default function ListingCard({ listing, onViewDetails, onContact }) {
  const {
    title,
    price,
    location,
    sellerId,
    condition,
    category,
    images,
  } = listing;

  const backendUrl = "http://localhost:5000";
  
  // Find primary image or use first one
  const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
  const imageUrl = primaryImage ? `${backendUrl}/${primaryImage.url}` : "https://picsum.photos/400/300?blur=2";

  const conditionColors = {
    New: "bg-emerald-100 text-emerald-700",
    "Like New": "bg-blue-100 text-blue-700",
    Good: "bg-amber-100 text-amber-700",
    Fair: "bg-orange-100 text-orange-700",
    Poor: "bg-rose-100 text-rose-700",
  };

  const categoryColors = {
    "Boarding Places": "bg-indigo-50 text-indigo-600",
    Devices: "bg-purple-50 text-purple-600",
    "Student Services": "bg-cyan-50 text-cyan-600",
    "Books & Notes": "bg-amber-50 text-amber-600",
    Clothing: "bg-rose-50 text-rose-600",
    Furniture: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${conditionColors[condition] || "bg-gray-100"}`}>
            {condition}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${categoryColors[category] || "bg-gray-100 border border-gray-200"}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {title}
          </h3>
          <span className="text-xl font-black text-emerald-600">
            Rs {price}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-rose-400" />
            {location}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <User className="w-4 h-4 mr-2 text-blue-400" />
            {sellerId?.name || "Unknown Seller"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onContact(listing)}
            className="flex items-center justify-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
          >
            Contact
          </button>
          <button
            onClick={() => onViewDetails(listing)}
            className="flex items-center justify-center px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200 transition-all active:scale-95"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
