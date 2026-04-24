import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function CreateSession({
  selectedTrendingTopic,
  setSelectedTrendingTopic,
}) {
  const [formData, setFormData] = useState({
    category: "",
    topic: "",
    date: "",
    time: "",
    duration: 60,
    mode: "",
    location: "",
    meetingLink: "",
    quizLink: "",
    capacity: "",
    description: "",
  });

  const [topicsByCategory, setTopicsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const token = localStorage.getItem("token");
  const today = new Date().toISOString().split("T")[0];

  const availableTopics = useMemo(() => {
    return topicsByCategory[formData.category] || [];
  }, [formData.category, topicsByCategory]);

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });
  };

  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/constants/topics");
        setTopicsByCategory(res.data);
      } catch (error) {
        console.error("Failed to fetch topics", error);
        showToast("error", "Failed to load topics");
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTrendingTopic) {
      setFormData((prev) => ({
        ...prev,
        category: selectedTrendingTopic.category || "",
        topic: selectedTrendingTopic.topic || "",
      }));
      setErrors((prev) => ({ ...prev, category: "", topic: "" }));
    }
  }, [selectedTrendingTopic]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.topic) newErrors.topic = "Topic is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.mode) newErrors.mode = "Mode is required";

    if (formData.date && formData.date < today) {
      newErrors.date = "Past dates cannot be selected";
    }

    if (formData.date === today && formData.time) {
      const now = new Date();
      const [hours, mins] = formData.time.split(":").map(Number);
      const selected = new Date();
      selected.setHours(hours, mins, 0, 0);

      if (selected <= now) {
        newErrors.time = "Time must be in the future for today's sessions";
      }
    }

    if (!formData.duration || Number(formData.duration) < 30) {
      newErrors.duration = "Duration must be at least 30 minutes";
    }

    if (Number(formData.duration) > 480) {
      newErrors.duration = "Duration cannot exceed 480 minutes (8 hours)";
    }

    if (formData.mode === "online") {
      if (!formData.meetingLink.trim()) {
        newErrors.meetingLink = "Meeting link is required for online sessions";
      } else {
        const allowed = ["zoom.us", "meet.google.com", "teams.microsoft.com"];
        try {
          const hostname = new URL(formData.meetingLink).hostname;
          if (!allowed.some((d) => hostname.includes(d))) {
            newErrors.meetingLink =
              "Please enter a valid Zoom, Google Meet, or Teams link";
          }
        } catch {
          newErrors.meetingLink = "Please enter a valid meeting link";
        }
      }
    }

    if (formData.mode === "offline") {
      if (!formData.location.trim()) {
        newErrors.location = "Location is required for offline sessions";
      } else if (formData.location.trim().length < 5) {
        newErrors.location =
          "Please enter a more specific location (min 5 characters)";
      }
    }

    if (formData.quizLink) {
      try {
        const hostname = new URL(formData.quizLink).hostname;
        if (!hostname.includes("forms.office.com")) {
          newErrors.quizLink =
            "Please enter a valid Microsoft Forms link (forms.office.com)";
        }
      } catch {
        newErrors.quizLink = "Please enter a valid quiz link";
      }
    }

    if (formData.capacity && Number(formData.capacity) < 1) {
      newErrors.capacity = "Capacity must be at least 1";
    }

    if (formData.capacity && Number(formData.capacity) > 500) {
      newErrors.capacity = "Capacity cannot exceed 500";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description should be at least 10 characters";
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData((prev) => ({ ...prev, category: value, topic: "" }));
      setErrors((prev) => ({ ...prev, category: "", topic: "" }));
      return;
    }

    if (name === "mode") {
      setFormData((prev) => ({
        ...prev,
        mode: value,
        location: value === "online" ? "" : prev.location,
        meetingLink: value === "offline" ? "" : prev.meetingLink,
      }));
      setErrors((prev) => ({ ...prev, mode: "", location: "", meetingLink: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", api: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        capacity: formData.capacity ? Number(formData.capacity) : null,
      };

      const response = await axios.post(
        "http://localhost:5000/api/sessions",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast(
        "success",
        response.data.message || "Session created successfully"
      );

      setFormData({
        category: "",
        topic: "",
        date: "",
        time: "",
        duration: 60,
        mode: "",
        location: "",
        meetingLink: "",
        quizLink: "",
        capacity: "",
        description: "",
      });

      if (setSelectedTrendingTopic) setSelectedTrendingTopic(null);
      setErrors({});
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create session";
      setErrors({ api: message });
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm p-8 max-w-5xl">
{toast.show && (
  <div
    className={`fixed top-6 right-6 z-[100] rounded-2xl px-10 py-6 text-lg font-semibold text-white shadow-2xl flex items-center gap-3 ${
      toast.type === "success"
        ? "bg-emerald-500"
        : "bg-red-500"
    }`}
  >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-white shrink-0" />
          )}

          <div className="flex-1">{toast.message}</div>

          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Session</h2>
      <p className="text-slate-500 mb-8">
        Add a new peer learning session for students.
      </p>

      {errors.api && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {errors.api}
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
            className={`w-full border rounded-xl px-4 py-3 ${
              errors.category ? "border-red-400" : "border-slate-300"
            }`}
          >
            <option value="">Select category</option>
            {Object.keys(topicsByCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
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
            className={`w-full border rounded-xl px-4 py-3 ${
              errors.topic ? "border-red-400" : "border-slate-300"
            }`}
          >
            <option value="">Select topic</option>
            {availableTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {errors.topic && (
            <p className="text-red-500 text-sm mt-1">{errors.topic}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            min={today}
            value={formData.date}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 ${
              errors.date ? "border-red-400" : "border-slate-300"
            }`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Time *
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 ${
              errors.time ? "border-red-400" : "border-slate-300"
            }`}
          />
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            min="30"
            max="480"
            value={formData.duration}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 ${
              errors.duration ? "border-red-400" : "border-slate-300"
            }`}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Mode *
          </label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 ${
              errors.mode ? "border-red-400" : "border-slate-300"
            }`}
          >
            <option value="">Select mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          {errors.mode && (
            <p className="text-red-500 text-sm mt-1">{errors.mode}</p>
          )}
        </div>

        {formData.mode === "offline" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter hall / classroom / venue"
              className={`w-full border rounded-xl px-4 py-3 ${
                errors.location ? "border-red-400" : "border-slate-300"
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
        )}

        {formData.mode === "online" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Meeting Link *
            </label>
            <input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="Enter Zoom / Google Meet / Teams link"
              className={`w-full border rounded-xl px-4 py-3 ${
                errors.meetingLink ? "border-red-400" : "border-slate-300"
              }`}
            />
            {errors.meetingLink && (
              <p className="text-red-500 text-sm mt-1">{errors.meetingLink}</p>
            )}
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Quiz Link <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            name="quizLink"
            value={formData.quizLink}
            onChange={handleChange}
            placeholder="Optional quiz form link"
            className={`w-full border rounded-xl px-4 py-3 ${
              errors.quizLink ? "border-red-400" : "border-slate-300"
            }`}
          />
          {errors.quizLink && (
            <p className="text-red-500 text-sm mt-1">{errors.quizLink}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Capacity <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="number"
            name="capacity"
            min="1"
            max="500"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Optional seat limit"
            className={`w-full border rounded-xl px-4 py-3 ${
              errors.capacity ? "border-red-400" : "border-slate-300"
            }`}
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write session details (min 10 characters if provided)"
            className={`w-full border rounded-xl px-4 py-3 resize-none ${
              errors.description ? "border-red-400" : "border-slate-300"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-red-500 text-sm">{errors.description}</p>
            ) : (
              <span />
            )}
            <p
              className={`text-xs ml-auto ${
                formData.description.length > 1000
                  ? "text-red-500"
                  : "text-slate-400"
              }`}
            >
              {formData.description.length} / 1000
            </p>
          </div>
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2F66E0] hover:bg-[#2457c7] text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Session"}
          </button>
        </div>
      </form>
      {/* ── Instructions Card ── */}
<div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 space-y-5">
  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
    📋 Session Creation Guidelines
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Quiz */}
    <div className="bg-white rounded-xl p-4 border border-blue-100">
      <p className="text-sm font-bold text-blue-700 mb-2">📝 Quiz Setup</p>
      <ul className="text-sm text-slate-600 space-y-1.5">
        <li>✅ Use <span className="font-semibold">Microsoft Forms</span> only — other platforms may not work</li>
        <li>✅ Questions must be <span className="font-semibold">MCQ (multiple choice)</span> format</li>
        <li>✅ Total marks must add up to <span className="font-semibold">100</span></li>
        <li>✅ Make sure the form is set to <span className="font-semibold">public / anyone with link</span></li>
      </ul>
    </div>

    {/* Meeting Link */}
    <div className="bg-white rounded-xl p-4 border border-blue-100">
      <p className="text-sm font-bold text-blue-700 mb-2">🔗 Meeting Link</p>
      <ul className="text-sm text-slate-600 space-y-1.5">
        <li>✅ Use <span className="font-semibold">Zoom</span> or <span className="font-semibold">Microsoft Teams</span> links only</li>
        <li>✅ Google Meet links are also accepted</li>
        <li>⚠️ Other platforms may not be accessible to all students</li>
        <li>✅ Test your link before the session starts</li>
      </ul>
    </div>

    {/* Timing */}
    <div className="bg-white rounded-xl p-4 border border-blue-100">
      <p className="text-sm font-bold text-blue-700 mb-2">🕐 Choosing a Time</p>
      <ul className="text-sm text-slate-600 space-y-1.5">
        <li>✅ Prefer <span className="font-semibold">evenings (6PM–9PM)</span> on weekdays</li>
        <li>✅ <span className="font-semibold">Weekend mornings & afternoons</span> have the highest attendance</li>
        <li>⚠️ Avoid scheduling during common lecture hours</li>
        <li>✅ Minimum duration is <span className="font-semibold">30 minutes</span></li>
      </ul>
    </div>

    {/* Description */}
    <div className="bg-white rounded-xl p-4 border border-blue-100">
      <p className="text-sm font-bold text-blue-700 mb-2">📄 Writing a Good Description</p>
      <ul className="text-sm text-slate-600 space-y-1.5">
        <li>✅ Mention <span className="font-semibold">what topics will be covered</span></li>
        <li>✅ List any <span className="font-semibold">prerequisites</span> students should know beforehand</li>
        <li>✅ Suggest <span className="font-semibold">resources to read</span> before the session</li>
        <li>✅ Keep it clear and concise — students rely on this to prepare</li>
      </ul>
    </div>

  </div>

  <p className="text-xs text-slate-400 pt-1">
    Following these guidelines ensures a smooth experience for both tutors and students.
  </p>
</div>
    </div>
  );
}