import React, { useState, useEffect } from "react";
import { 
  Trash2, 
  AlertTriangle, 
  ShoppingBag, 
  Loader2, 
  Search, 
  Calendar,
  MapPin,
  Clock,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import api from "../../../api/api";

export default function MarketplaceModeration() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/marketplace");
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
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const response = await api.delete(`/admin/marketplace/${deleteId}`);
      if (response.data.success) {
        setListings(listings.filter((l) => l._id !== deleteId));
        setDeleteId(null);
      } else {
        alert(response.data.message || "Failed to delete listing");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDaysRemaining = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = now - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 20 - diffDays);
  };

  const getBadgeColor = (days) => {
    if (days > 10) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (days >= 5) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-rose-100 text-rose-700 border-rose-200";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats */}
      <div className="flex justify-end">
        <div className="bg-white px-8 py-4 rounded-[2rem] border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-primary-100 rounded-2xl text-primary-600">
             <ShoppingBag className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Active</p>
             <h4 className="text-2xl font-black text-gray-900 leading-none">{listings.length}</h4>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching listings...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-rose-600 px-6 text-center">
            <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold text-lg">{error}</p>
            <button 
              onClick={fetchListings}
              className="mt-6 px-8 py-3 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-gray-400">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold text-xl">No listings found in the system</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-6 text-sm font-black text-gray-400 uppercase tracking-widest">Seller</th>
                  <th className="px-6 py-6 text-sm font-black text-gray-400 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-6 text-sm font-black text-gray-400 uppercase tracking-widest">Lifespan</th>
                  <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {listings.map((listing) => {
                  const daysLeft = getDaysRemaining(listing.createdAt);
                  return (
                    <tr key={listing._id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200">
                            {listing.images && listing.images.length > 0 ? (
                              <img 
                                src={`http://localhost:5000/uploads/marketplace/${listing.images[0].split('/').pop()}`}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900 truncate max-w-[200px]">{listing.title}</h4>
                            <p className="text-sm font-bold text-primary-600 uppercase tracking-tight">{listing.category}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-black text-xs">
                             {listing.sellerId?.name?.charAt(0)}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-gray-900 leading-none mb-1">{listing.sellerId?.name}</p>
                             <p className="text-xs font-medium text-gray-500 leading-none">{listing.sellerId?.email}</p>
                           </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                             <span className="text-emerald-600">Rs. {listing.price.toLocaleString()}</span>
                             <span className="text-gray-300">•</span>
                             <span className="text-gray-500">{listing.condition}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                             <MapPin className="w-3 h-3" />
                             <span className="truncate max-w-[120px]">{listing.location}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                             <Calendar className="w-3 h-3" />
                             <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                           </div>
                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border ${getBadgeColor(daysLeft)}`}>
                             {daysLeft} Days Remaining
                           </span>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setDeleteId(listing._id)}
                          className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteId(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 animate-in zoom-in duration-300 text-center">
             <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10" />
             </div>
             
             <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Listing?</h3>
             <p className="text-gray-500 font-medium mb-8">
               Are you sure you want to remove this listing? This action cannot be undone and the seller will be notified.
             </p>

             <div className="flex flex-col gap-3">
                <button 
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-[1.5rem] font-black shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  Confirm Delete
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={() => setDeleteId(null)}
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-[1.5rem] font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
