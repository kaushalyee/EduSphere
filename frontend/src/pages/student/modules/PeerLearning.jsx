import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Toast from "../../../components/ui/Toast";

const TABS = [
  { id: "sessions", label: "Available Sessions" },
  { id: "new", label: "Request a Session" },
  { id: "requests", label: "My Requests" },
];

export default function PeerLearning() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [topicsByCategory, setTopicsByCategory] = useState({});
  const [myRequests, setMyRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRequests, setFetchingRequests] = useState(true);
  const [fetchingSessions, setFetchingSessions] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionModeFilter, setSessionModeFilter] = useState("all");
  const [sessionCategoryFilter, setSessionCategoryFilter] = useState("all");
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [highlightedSessionId, setHighlightedSessionId] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    topic: "",
    preferredMode: "any",
    preferredTime: "",
    preferredDate: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/constants/topics");
        setTopicsByCategory(res.data);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      }
    };
    fetchTopics();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setFetchingRequests(true);
      const res = await axios.get(
        "http://localhost:5000/api/session-requests/my-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyRequests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setFetchingRequests(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setFetchingSessions(true);
      const res = await axios.get("http://localhost:5000/api/sessions/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data.feed || []);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setFetchingSessions(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
    fetchSessions();
  }, []);

  const availableTopics = useMemo(() => {
    return topicsByCategory[formData.category] || [];
  }, [formData.category, topicsByCategory]);

  const sessionCategories = useMemo(() => {
    return [...new Set(sessions.map((session) => session.category).filter(Boolean))];
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        !sessionSearch.trim() ||
        session.topic?.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        session.category?.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        session.tutorId?.name?.toLowerCase().includes(sessionSearch.toLowerCase());

      const matchesMode =
        sessionModeFilter === "all" || session.mode === sessionModeFilter;

      const matchesCategory =
        sessionCategoryFilter === "all" ||
        session.category === sessionCategoryFilter;

      const matchesRecommended =
        !showRecommendedOnly || session.isRecommended;

      return (
        matchesSearch &&
        matchesMode &&
        matchesCategory &&
        matchesRecommended
      );
    });
  }, [
    sessions,
    sessionSearch,
    sessionModeFilter,
    sessionCategoryFilter,
    showRecommendedOnly,
  ]);

  const recommended = filteredSessions.filter((s) => s.isRecommended);
  const others = filteredSessions.filter((s) => !s.isRecommended);

  const clearSessionFilters = () => {
    setSessionSearch("");
    setSessionModeFilter("all");
    setSessionCategoryFilter("all");
    setShowRecommendedOnly(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage("");
    setError("");
    if (name === "category") {
      setFormData((prev) => ({ ...prev, category: value, topic: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.category || !formData.topic || !formData.preferredTime) {
      setErrorMessage("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/session-requests",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(res.data.message || "Request submitted successfully");

      setFormData({
        category: "",
        topic: "",
        preferredMode: "any",
        preferredTime: "",
        preferredDate: "",
      });

      fetchMyRequests();
      fetchSessions();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const formatDate = (value) => {
    if (!value) return "No preferred date";
    return new Date(value).toLocaleDateString("en-GB");
  };

  const formatSessionDate = (value) => {
    if (!value) return "No date";
    return new Date(value).toLocaleDateString("en-GB");
  };

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const pendingRequests = myRequests.filter(
    (request) => request.status === "pending" || !request.status
  );

const fulfilledRequests = myRequests.filter(
  (request) =>
    request.status === "fulfilled" &&
    request.matchedSessionId?.status !== "completed" &&
    request.matchedSessionId?.status !== "cancelled"
);
const handleViewMatchedSession = (matchedSessionId) => {
  const id = matchedSessionId?._id || matchedSessionId;
  setHighlightedSessionId(id);
  setActiveTab("sessions");
};

  return (
    <div className="space-y-6">
      {/* SUCCESS TOAST */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-500 px-8 py-5 text-lg font-semibold text-white shadow-2xl animate-slide-in">
          {successMessage}
        </div>
      )}

      {/* ERROR TOAST */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-red-500 px-8 py-5 text-lg font-semibold text-white shadow-2xl animate-slide-in">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-2">
        <div className="relative flex items-center gap-1">
          <div
            className="absolute top-0 bottom-0 rounded-xl bg-[#2F66E0] transition-all duration-300 ease-in-out"
            style={{
              width: `calc(${100 / TABS.length}% - 4px)`,
              left: `calc(${(activeIndex * 100) / TABS.length}% + 2px)`,
            }}
          />
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-colors duration-300 ${activeTab === tab.id
                ? "text-white"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "sessions" && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Available Sessions
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Search and filter sessions to find the best match for your learning needs.
              </p>
            </div>

            {recommended.length > 0 && (
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full w-fit">
                {recommended.length} recommended for you
              </span>
            )}
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by topic, category, or tutor"
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
            />

            <select
              value={sessionModeFilter}
              onChange={(e) => setSessionModeFilter(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            <select
              value={sessionCategoryFilter}
              onChange={(e) => setSessionCategoryFilter(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
            >
              <option value="all">All Categories</option>
              {sessionCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={clearSessionFilters}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Clear Filters
            </button>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <input
              id="recommendedOnly"
              type="checkbox"
              checked={showRecommendedOnly}
              onChange={(e) => setShowRecommendedOnly(e.target.checked)}
              className="h-4 w-4"
            />
            <label
              htmlFor="recommendedOnly"
              className="text-sm font-medium text-slate-700"
            >
              Show recommended sessions only
            </label>
          </div>

          {fetchingSessions ? (
            <p className="text-slate-500">Loading sessions...</p>
          ) : filteredSessions.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6">
              <p className="text-slate-500">
                No sessions match your current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {recommended.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">
                    Recommended for you
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {recommended.map((session) => (
                      <SessionCard
                        key={session._id}
                        session={session}
                        formatSessionDate={formatSessionDate}
                        isHighlighted={highlightedSessionId === session._id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {others.length > 0 && (
                <div>
                  {recommended.length > 0 && (
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Other sessions
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {others.map((session) => (
                      <SessionCard
                        key={session._id}
                        session={session}
                        formatSessionDate={formatSessionDate}
                        isHighlighted={highlightedSessionId === session._id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "new" && (
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Request a Kuppi Session
          </h2>
          <p className="text-slate-500 mb-8">
            Request a topic you need help with and tutors can create sessions based on student demand.
          </p>

          {message && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
                <option value="">Select category</option>
                {Object.keys(topicsByCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Topic *
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                disabled={!formData.category}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 disabled:bg-slate-100"
              >
                <option value="">Select topic</option>
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Preferred Mode
              </label>
              <select
                name="preferredMode"
                value={formData.preferredMode}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
                <option value="any">Any</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Preferred Time *
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              >
                <option value="">Select time slot</option>
                <option value="Weekday Morning">Weekday Morning</option>
                <option value="Weekday Afternoon">Weekday Afternoon</option>
                <option value="Weekday Evening">Weekday Evening</option>
                <option value="Weekend Morning">Weekend Morning</option>
                <option value="Weekend Afternoon">Weekend Afternoon</option>
                <option value="Weekend Evening">Weekend Evening</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Preferred Date (Optional)
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2F66E0] hover:bg-[#2457c7] text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">My Requests</h3>

          {fetchingRequests ? (
            <p className="text-slate-500">Loading your requests...</p>
          ) : myRequests.length === 0 ? (
            <p className="text-slate-500">You have not submitted any requests yet.</p>
          ) : (
            <div className="space-y-8">
              {/* Pending Requests */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-900">Pending Requests</h4>
                  <span className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    {pendingRequests.length}
                  </span>
                </div>

                {pendingRequests.length === 0 ? (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <p className="text-slate-500">No pending requests.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-amber-200 bg-amber-50 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-600">
                              {request.category}
                            </p>
                            <h4 className="text-lg font-bold text-slate-900">
                              {request.topic}
                            </h4>
                          </div>

                          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                            Pending
                          </span>
                        </div>

                        <p className="text-slate-600 mt-2">
                          Mode: {request.preferredMode} | Time: {request.preferredTime}
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                          {formatDate(request.preferredDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fulfilled Requests */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-900">Fulfilled Requests</h4>
                  <span className="text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    {fulfilledRequests.length}
                  </span>
                </div>

                {fulfilledRequests.length === 0 ? (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <p className="text-slate-500">No fulfilled requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fulfilledRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-emerald-200 bg-emerald-50 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-600">
                              {request.category}
                            </p>
                            <h4 className="text-lg font-bold text-slate-900">
                              {request.topic}
                            </h4>
                          </div>

                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            Fulfilled
                          </span>
                        </div>

                        <p className="text-slate-600 mt-2">
                          Mode: {request.preferredMode} | Time: {request.preferredTime}
                        </p>

                        <p className="text-slate-500 text-sm mt-1">
                          {formatDate(request.preferredDate)}
                        </p>
                        <p className="mt-3 text-sm font-medium text-emerald-700">
                          A tutor has created a session for this request.
                        </p>

                        {request.matchedSessionId && (
                          <button
                            onClick={() => handleViewMatchedSession(request.matchedSessionId)}
                            className="mt-3 inline-flex items-center rounded-lg bg-[#2F66E0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2457c7] transition"
                          >
                            View Session
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session, formatSessionDate, isHighlighted }) {
  const isRecommended = session.isRecommended;

  return (
    <div
      className={`rounded-2xl p-5 transition-all flex gap-4 border ${
        isHighlighted
          ? "bg-blue-100 border-2 border-[#2F66E0] shadow-md"
          : isRecommended
          ? "bg-blue-50 border-blue-200 shadow-[0_0_0_1px_rgba(47,102,224,0.08),0_8px_24px_rgba(47,102,224,0.12)]"
          : "bg-white border-slate-200"
      }`}
    >
      {/* DATE BOX */}
      <div
        className={`flex flex-col items-center justify-center text-white rounded-xl px-4 py-3 min-w-[80px] ${
          isRecommended ? "bg-[#2F66E0]" : "bg-[#2F66E0]"
        }`}
      >
        <p className="text-xs uppercase">Date</p>
        <p className="text-lg font-bold">
          {new Date(session.date).getDate()}
        </p>
        <p className="text-xs">
          {new Date(session.date).toLocaleString("default", { month: "short" })}
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {isHighlighted && (
            <span className="text-xs bg-[#2F66E0] text-white px-2 py-1 rounded-full">
              Matched Session
            </span>
          )}

          {isRecommended && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-semibold">
              Recommended
            </span>
          )}

          {session.isRecommended && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
              {Math.round(session.recommendationScore * 100)}% match
            </span>
          )}
        </div>

        {/* Recommendation reason */}
        {session.recommendationReason && (
          <p className="mt-2 text-xs text-blue-700 bg-white/70 border border-blue-100 px-3 py-2 rounded-lg">
            {session.recommendationReason}
          </p>
        )}

        {/* Prerequisite advice */}
        {session.prerequisiteAdvice && (
          <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
            <span className="text-base mt-0.5">💡</span>
            <div>
              <p className="text-xs font-semibold text-amber-700">
                Study{" "}
                <span className="font-bold">
                  {session.prerequisiteAdvice.topic}
                </span>{" "}
                first
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Students who studied this first scored{" "}
                <span className="font-bold">
                  {Math.round(session.prerequisiteAdvice.improvementRate)}% higher
                </span>{" "}
                in this topic
                <span className="text-amber-400 ml-1">
                  ({session.prerequisiteAdvice.sampleSize} students)
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mt-3">
          {session.topic}
        </h3>

        <p className="text-sm text-blue-600 font-medium">{session.category}</p>

        {/* Time */}
        <div className="flex items-center gap-4 mt-3">
          <p className="text-xl font-bold text-[#2F66E0]">{session.time}</p>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded-lg">
            {session.duration} mins
          </span>
        </div>

        {/* Details */}
        <div className="mt-3 text-sm text-slate-600 space-y-1">
          <p>🧑🏿‍🏫 {session.tutorId?.name || "N/A"}</p>
          <p>📍 {session.mode}</p>
          {session.mode === "offline" && session.location && (
            <p>📌 {session.location}</p>
          )}
           {session.capacity && (
    <p>👥 Capacity: {session.capacity}</p>
  )}
        </div>

        {/* Links */}
        <div className="mt-4 flex gap-3 flex-wrap">
          {session.meetingLink && (
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="bg-[#2F66E0] text-white px-3 py-1 rounded-lg text-sm"
            >
              Join
            </a>
          )}
          {session.quizLink && (
            <a
              href={session.quizLink}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm"
            >
              Quiz
            </a>
          )}
        </div>
      </div>
    </div>
  );
}