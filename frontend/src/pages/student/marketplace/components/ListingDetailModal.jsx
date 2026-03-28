import React, { useState, useEffect } from "react";
import { X, MapPin, User, Calendar, ShieldAlert, Phone, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import api from "../../../../api/api";

export default function ListingDetailModal({ isOpen, onClose, listingId }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    if (isOpen && listingId) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          setShowContact(false);
          setCurrentImageIndex(0);
          
          const response = await api.get(`/marketplace/${listingId}`);
          if (response.data.success) {
            setListing(response.data.data);
          } else {
            setError(response.data.message || "Failed to load details");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Error fetching listing details");
        } finally {
          setLoading(false);
        }
      };
      
      fetchDetail();
    }
  }, [isOpen, listingId]);

  if (!isOpen) return null;

  const nextImage = () => {
    if (!listing?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    if (!listing?.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        
        {loading ? (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching Item Details...</p>
          </div>
        ) : error ? (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center p-10 text-center">
            <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-500 font-medium mb-8">{error}</p>
            <button onClick={onClose} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold">Close</button>
          </div>
        ) : (
          <>
            {/* Gallery Section */}
            <div className="md:w-3/5 bg-gray-100 relative group overflow-hidden">
              <img
                src={listing.images?.length > 0 ? `${backendUrl}/${listing.images[currentImageIndex].url}` : "https://picsum.photos/800/600?blur=5"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation */}
              {listing.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {listing.images?.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentImageIndex ? "w-8 bg-white shadow-md" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={onClose}
                className="absolute top-6 left-6 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg md:hidden"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            {/* Details Section */}
            <div className="md:w-2/5 p-10 overflow-y-auto flex flex-col relative">
              <button
                onClick={onClose}
                className="hidden md:flex p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all absolute top-6 right-6"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8 mt-4 md:mt-0">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {listing.category}
                  </span>
                   <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {listing.condition}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {listing.title}
                </h2>
                <p className="text-4xl font-bold text-emerald-600">
                  Rs {listing.price}
                </p>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                   <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Description
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {listing.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <MapPin className="w-5 h-5 text-rose-500 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                    <p className="font-bold text-gray-800 truncate text-sm">{listing.location}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Posted</p>
                    <p className="font-bold text-gray-800 text-sm">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Seller Card */}
                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm mt-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {listing.sellerId?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-none mb-1">{listing.sellerId?.name}</h4>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-tight">Verified Student</p>
                    </div>
                  </div>

                  {!showContact ? (
                     <button 
                      onClick={() => setShowContact(true)}
                      className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                      <Phone className="w-5 h-5" />
                      Contact Seller
                    </button>
                  ) : (
                    <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                      <div className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                             <Phone className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                            <p className="font-bold text-gray-800">{listing.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-lg">
                             <MessageSquare className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp</p>
                            <p className="font-bold text-gray-800">{listing.whatsappNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  Report Listing
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
