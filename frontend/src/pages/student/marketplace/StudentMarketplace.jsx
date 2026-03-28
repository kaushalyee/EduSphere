import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  ShoppingBag, 
  ChevronDown, 
  Loader2,
  AlertCircle
} from "lucide-react";
import api from "../../../api/api";

import ListingCard from "./components/ListingCard";
import PostItemModal from "./components/PostItemModal";
import ListingDetailModal from "./components/ListingDetailModal";

export default function StudentMarketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const categories = [
    "All Categories",
    "Boarding Places",
    "Devices",
    "Student Services",
    "Books & Notes",
    "Clothing",
    "Furniture",
  ];

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = "/marketplace";
      const params = new URLSearchParams();
      
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory && selectedCategory !== "All Categories") {
        params.append("category", selectedCategory);
      }
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      const response = await api.get(url);
      if (response.data.success) {
        setListings(response.data.data);
      } else {
        setError(response.data.message || "Failed to load listings");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchListings();
    }, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [fetchListings]);

  const handleViewDetails = (listing) => {
    setSelectedListingId(listing._id);
    setIsDetailModalOpen(true);
  };

  const handlePostSuccess = () => {
    fetchListings();
  };


  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200">
               <ShoppingBag className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-gray-900">Student Marketplace</h1>
             </div>
          </div>
        </div>
      </div>

      {/* Hero & Filters */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Search Bar */}
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="text"
              placeholder="Search items, books, services..."
              className="w-full pl-16 pr-6 py-5 bg-white border border-gray-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 focus:shadow-xl transition-all font-medium text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
            <select
              className="pl-16 pr-12 py-5 bg-white border border-gray-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 focus:shadow-xl appearance-none font-bold text-gray-700 cursor-pointer min-w-[240px] transition-all"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
          </div>

          {/* Post Item Button */}
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-8 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-[2rem] font-bold shadow-lg shadow-purple-100 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-6 h-6" />
            Post Item
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center gap-3 p-6 bg-rose-50 border border-rose-100 rounded-3xl mb-8 text-rose-600">
            <AlertCircle className="w-6 h-6" />
            <p className="font-bold">{error}</p>
            <button 
              onClick={fetchListings}
              className="ml-auto underline font-bold text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative min-h-[400px]">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Campus Market...</p>
            </div>
          ) : listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onViewDetails={handleViewDetails}
                onContact={(listing) => {
                  setSelectedListingId(listing._id);
                  setIsDetailModalOpen(true);
                }}
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No items found</h3>
              <p className="text-gray-500 mt-2 font-medium">Try searching for something else or change the category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostSuccess={handlePostSuccess}
      />

      <ListingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedListingId(null);
        }}
        listingId={selectedListingId}
      />
    </div>
  );
}
