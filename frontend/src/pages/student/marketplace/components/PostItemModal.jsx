import React, { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2, AlertCircle, Loader2 } from "lucide-react";
import api from "../../../../api/api";

export default function PostItemModal({ isOpen, onClose, onPostSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    phone: "",
    whatsapp: "",
    category: "Boarding Places",
    condition: "New",
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSummaryError, setShowSummaryError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const categories = [
    "Boarding Places",
    "Devices",
    "Student Services",
    "Books & Notes",
    "Clothing",
    "Furniture",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value) error = "Required";
        else if (value.length < 5) error = "Min 5 characters";
        else if (value.length > 100) error = "Max 100 characters";
        else if (/[^a-zA-Z0-9\s\-\,\"\']/.test(value)) error = "Invalid characters";
        break;
      case "description":
        if (!value) error = "Required";
        else if (value.length < 20) error = "Min 20 characters";
        else if (value.length > 1000) error = "Max 1000 characters";
        break;
      case "price":
        if (!value) error = "Required";
        else {
          const num = parseFloat(value);
          if (isNaN(num)) error = "Must be a number";
          else if (num < 1) error = "Min Rs 1";
          else if (num > 1000000) error = "Max Rs 1,000,000";
          else if (!/^\d+(\.\d{0,2})?$/.test(value)) error = "Max 2 decimal places";
        }
        break;
      case "location":
        if (!value) error = "Required";
        else if (value.length < 3) error = "Min 3 characters";
        else if (value.length > 100) error = "Max 100 characters";
        break;
      case "phone":
      case "whatsapp":
        if (!value) error = "Required";
        else if (!/^\d+$/.test(value)) error = "Numbers only";
        else if (value.length !== 10) error = "Must be exactly 10 digits";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "phone" || name === "whatsapp") && value !== "" && !/^\d+$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newErrors = { ...errors };
    
    if (images.length + files.length > 5) {
      setErrors({ ...errors, images: "Maximum 5 images allowed" });
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length < files.length) {
      setErrors({ ...errors, images: "Some files are too large or invalid format" });
    } else {
      delete newErrors.images;
      setErrors(newErrors);
    }

    const newImageObjects = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
    }));

    setImages([...images, ...newImageObjects]);
  };

  const removeImage = (id) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    if (updatedImages.length === 0) {
      setErrors({ ...errors, images: "Minimum 1 image required" });
    } else {
      const newErrors = { ...errors };
      delete newErrors.images;
      setErrors(newErrors);
    }
  };

  const isFormValid = () => {
    const fieldErrors = Object.keys(formData).map(key => validateField(key, formData[key]));
    const hasFieldErrors = fieldErrors.some(err => err !== "");
    const hasImageError = images.length === 0 || images.length > 5;
    return !hasFieldErrors && !hasImageError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    // Final validation
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    if (images.length === 0) newErrors.images = "Minimum 1 image required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      setShowSummaryError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("location", formData.location);
      submitData.append("category", formData.category);
      submitData.append("condition", formData.condition);
      submitData.append("phoneNumber", formData.phone);
      submitData.append("whatsappNumber", formData.whatsapp);
      
      images.forEach((img) => {
        submitData.append("images", img.file);
      });

      const response = await api.post("/marketplace", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        onPostSuccess();
        onClose();
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          location: "",
          phone: "",
          whatsapp: "",
          category: "Boarding Places",
          condition: "New",
        });
        setImages([]);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to post item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Post New Item</h2>
            <p className="text-gray-500 text-sm mt-0.5">Fill in the details to list your item</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-md rounded-full text-gray-400 hover:text-gray-600 transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          {(showSummaryError || apiError) && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-bold text-sm">{apiError || "Please fix the errors below before submitting"}</p>
            </div>
          )}

          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                placeholder="What are you selling?"
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.title ? "border-rose-300 ring-4 ring-rose-50" : "border-gray-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-400"} rounded-2xl focus:outline-none transition-all font-medium`}
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.title && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Give some details about the item..."
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.description ? "border-rose-300 ring-4 ring-rose-50" : "border-gray-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-400"} rounded-2xl focus:outline-none transition-all font-medium resize-none`}
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              ></textarea>
              {errors.description && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (Rs)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                <input
                  type="number"
                  name="price"
                  placeholder="0"
                  step="0.01"
                  className={`w-full pl-11 pr-5 py-3.5 bg-gray-50 border ${errors.price ? "border-rose-300 ring-4 ring-rose-50" : "border-gray-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-400"} rounded-2xl focus:outline-none transition-all font-bold text-emerald-600`}
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
              </div>
              {errors.price && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Hostle Block A"
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.location ? "border-rose-300 ring-4 ring-rose-50" : "border-gray-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-400"} rounded-2xl focus:outline-none transition-all font-medium`}
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.location && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                maxLength="10"
                placeholder="e.g. 0771234567"
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.phone ? "border-rose-300 ring-4 ring-rose-50" : "border-gray-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-400"} rounded-2xl focus:outline-none transition-all font-medium`}
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                maxLength="10"
                placeholder="e.g. 0771234567"
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.whatsapp ? "border-rose-300 ring-4 ring-rose-50" : "border-gray-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-400"} rounded-2xl focus:outline-none transition-all font-medium`}
                value={formData.whatsapp}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.whatsapp && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1">{errors.whatsapp}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium appearance-none"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Condition</label>
              <select
                name="condition"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium appearance-none"
                value={formData.condition}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Upload Images <span className="text-gray-400 font-normal">(Min 1, Max 5)</span>
            </label>
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, index) => (
                <div key={img.id} className="relative aspect-square group">
                  <img
                    src={img.url}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl border-2 border-primary-100 shadow-sm"
                  />
                  {index === 0 && (
                    <span className="absolute -top-2 -left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase">
                      Primary
                    </span>
                  )}
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-white text-rose-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {images.length < 5 && !isSubmitting && (
                <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed ${errors.images ? "border-rose-300 bg-rose-50" : "border-gray-200 hover:border-purple-400 hover:bg-purple-50"} rounded-xl transition-all cursor-pointer group active:scale-95`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Plus className={`w-6 h-6 ${errors.images ? "text-rose-400" : "text-gray-300 group-hover:text-purple-400"} transition-colors`} />
                  <span className={`text-[10px] font-bold ${errors.images ? "text-rose-400" : "text-gray-400 group-hover:text-purple-400"} mt-1 uppercase`}>Add</span>
                </label>
              )}
            </div>
            {errors.images && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.images}</p>}
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 bg-white hover:bg-gray-100 text-gray-700 rounded-2xl font-bold border border-gray-200 transition-all active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!isFormValid() && Object.keys(touched).length > 0)}
            className={`flex-[2] px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isSubmitting || (!isFormValid() && Object.keys(touched).length > 0) ? "opacity-50 cursor-not-allowed grayscale" : "shadow-purple-200"}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Item Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
