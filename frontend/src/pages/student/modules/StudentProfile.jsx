import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Hash,
  BookOpen,
  GraduationCap,
  Save,
  Loader2,
  X,
  Plus,
  CheckCircle2,
} from "lucide-react";

import { TOPICS_BY_CATEGORY, CATEGORIES as ALL_CATEGORIES } from "../../../constants/constants";
export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [weakCategories, setWeakCategories] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);

  // Topic picker state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data;
        setUser(u);
        setYear(u.year || "");
        setSemester(u.semester || "");
        setWeakCategories(u.weakCategories || []);
        setWeakTopics(u.weakTopics || []);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccessMessage("");
    try {
      await axios.put(
        "http://localhost:5000/api/users/profile",
        { year: Number(year), semester: Number(semester), weakCategories, weakTopics },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (cat) => {
    setWeakCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const addTopic = () => {
    if (!selectedTopic || weakTopics.includes(selectedTopic)) return;
    setWeakTopics((prev) => [...prev, selectedTopic]);
    setSelectedTopic("");
  };

  const removeTopic = (topic) => {
    setWeakTopics((prev) => prev.filter((t) => t !== topic));
  };

  const availableTopics = selectedCategory
    ? TOPICS_BY_CATEGORY[selectedCategory]?.filter((t) => !weakTopics.includes(t)) || []
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2F66E0]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Success toast ── */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-500 px-8 py-5 text-lg font-semibold text-white shadow-2xl">
          {successMessage}
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#2F66E0] flex items-center justify-center text-white text-2xl font-black">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* ── Read only info ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Account Info
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-700">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Hash className="w-4 h-4 text-slate-400" />
            <span className="text-sm">{user?.studentID || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* ── Editable info ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Academic Info
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">Select year</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">Select semester</option>
              {[1, 2].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Weak categories ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
          Weak Categories
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Select categories you want to improve in
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition border ${
                weakCategories.includes(cat)
                  ? "bg-[#2F66E0] text-white border-[#2F66E0]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#2F66E0] hover:text-[#2F66E0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Weak topics ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
          Weak Topics
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          These drive your session recommendations — keep them updated
        </p>

        {/* Topic picker */}
        <div className="flex gap-2 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setSelectedTopic(""); }}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm"
          >
            <option value="">Select category</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={!selectedCategory}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm disabled:bg-slate-50"
          >
            <option value="">Select topic</option>
            {availableTopics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button
            onClick={addTopic}
            disabled={!selectedTopic}
            className="px-4 py-2 rounded-xl bg-[#2F66E0] text-white font-medium text-sm hover:bg-[#2457c7] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Current weak topics */}
        {weakTopics.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-400 text-center">
            No weak topics added yet — add topics to get personalized session recommendations
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
              >
                {topic}
                <button
                  onClick={() => removeTopic(topic)}
                  className="hover:text-red-500 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* ── Save button ── */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#2F66E0] hover:bg-[#2457c7] text-white font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
        ) : (
          <><Save className="w-4 h-4" /> Save Changes</>
        )}
      </button>
    </div>
  );
}
