import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

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
      setMyRequests(res.data.requests || []);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setFetchingRequests(false);
    }
  };

  // ── CHANGED: now calls /feed instead of /sessions ──
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
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/session-requests",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Request submitted successfully");
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
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "No preferred date";
    return new Date(value).toLocaleDateString("en-GB");
  };

  const formatSessionDate = (value) => {
    if (!value) return "No date";
    return new Date(value).toLocaleDateString("en-GB");
  };

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  // ── split feed into two groups ──
  const recommended = sessions.filter((s) => s.isRecommended);
  const others = sessions.filter((s) => !s.isRecommended);

  return (
    <div className="space-y-6">
      {/* Sliding Tab Bar */}
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
              className={`relative z-10 flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-colors duration-300 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Available Sessions
            </h3>
            {recommended.length > 0 && (
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                {recommended.length} recommended for you
              </span>
            )}
          </div>

          {fetchingSessions ? (
            <p className="text-slate-500">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-slate-500">No sessions available right now.</p>
          ) : (
            <div className="space-y-8">

              {/* Recommended Section */}
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
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Sessions */}
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
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Request a Session Tab */}
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
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
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

      {/* My Requests Tab */}
      {activeTab === "requests" && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">My Requests</h3>

          {fetchingRequests ? (
            <p className="text-slate-500">Loading your requests...</p>
          ) : myRequests.length === 0 ? (
            <p className="text-slate-500">You have not submitted any requests yet.</p>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div
                  key={request._id}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <p className="text-sm font-medium text-blue-600">{request.category}</p>
                  <h4 className="text-lg font-bold text-slate-900">{request.topic}</h4>
                  <p className="text-slate-600 mt-1">
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
      )}
    </div>
  );
}

// ── Session Card Component ──
function SessionCard({ session, formatSessionDate }) {
  return (
    <div
      className={`border rounded-xl p-5 transition-all ${
        session.isRecommended
          ? "border-blue-300 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Recommended badge */}
      {session.isRecommended && (
        <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full mb-2">
          Matches your weak topic
        </span>
      )}

      <p className="text-sm font-medium text-blue-600">{session.category}</p>
      <h4 className="text-lg font-bold text-slate-900">{session.topic}</h4>

      <div className="mt-2 space-y-1 text-sm text-slate-600">
        <p><span className="font-semibold">Tutor:</span> {session.tutorId?.name || "N/A"}</p>
        <p><span className="font-semibold">Date:</span> {formatSessionDate(session.date)}</p>
        <p><span className="font-semibold">Time:</span> {session.time}</p>
        <p><span className="font-semibold">Duration:</span> {session.duration} mins</p>
        <p><span className="font-semibold">Mode:</span> {session.mode}</p>

        {session.mode === "offline" && session.location && (
          <p><span className="font-semibold">Location:</span> {session.location}</p>
        )}

        {session.mode === "online" && session.meetingLink && (
          <p>
            <span className="font-semibold">Meeting:</span>{" "}
            <a href={session.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Join Session
            </a>
          </p>
        )}

        {session.quizLink && (
          <p>
            <span className="font-semibold">Quiz:</span>{" "}
            <a href={session.quizLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Open Quiz
            </a>
          </p>
        )}

        {session.description && (
          <p className="pt-1"><span className="font-semibold">Description:</span> {session.description}</p>
        )}
      </div>
    </div>
  );
}
