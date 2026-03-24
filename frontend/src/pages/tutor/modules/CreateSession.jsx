import React, { useMemo, useState } from "react";
import axios from "axios";

const TOPICS_BY_CATEGORY = {
  Programming: ["C", "Java", "Python", "JavaScript", "Debugging"],
  Mathematics: ["Algebra", "Calculus", "Statistics", "Discrete Mathematics"],
  Networking: ["OSI Model", "TCP/IP", "Routing", "Subnetting"],
  DSA: ["Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Sorting"],
  DBMS: ["ER Diagrams", "Normalization", "SQL", "Joins"],
  OOP: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation"],
  "Web Development": ["HTML", "CSS", "React", "Node.js", "Express"],
  "Cyber Basics": ["CIA Triad", "Threats", "Authentication", "Encryption"],
};

export default function CreateSession() {
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

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const today = new Date().toISOString().split("T")[0];

  const availableTopics = useMemo(() => {
    return TOPICS_BY_CATEGORY[formData.category] || [];
  }, [formData.category]);

  const isValidUrl = (value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

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

    if (!formData.duration || Number(formData.duration) < 30) {
      newErrors.duration = "Duration must be at least 30 minutes";
    }

    if (formData.mode === "online" && !formData.meetingLink.trim()) {
      newErrors.meetingLink = "Meeting link is required for online sessions";
    }

    if (formData.mode === "offline" && !formData.location.trim()) {
      newErrors.location = "Location is required for offline sessions";
    }

    if (formData.meetingLink && !isValidUrl(formData.meetingLink)) {
      newErrors.meetingLink = "Please enter a valid meeting link";
    }

    if (formData.quizLink && !isValidUrl(formData.quizLink)) {
      newErrors.quizLink = "Please enter a valid quiz link";
    }

    if (formData.capacity && Number(formData.capacity) < 1) {
      newErrors.capacity = "Capacity must be at least 1";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSuccessMessage("");

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        topic: "",
      }));
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
      setErrors((prev) => ({
        ...prev,
        mode: "",
        location: "",
        meetingLink: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message || "Session created successfully");

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

      setErrors({});
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Failed to create session",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Session</h2>
      <p className="text-slate-500 mb-8">
        Add a new peer learning session for students.
      </p>

      {successMessage && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {successMessage}
        </div>
      )}

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
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
          >
            <option value="">Select category</option>
            {Object.keys(TOPICS_BY_CATEGORY).map((category) => (
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
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
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
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
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
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
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
            value={formData.duration}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
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
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
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
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
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
              placeholder="Enter Zoom / Google Meet link"
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
            />
            {errors.meetingLink && (
              <p className="text-red-500 text-sm mt-1">{errors.meetingLink}</p>
            )}
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Quiz Link
          </label>
          <input
            type="url"
            name="quizLink"
            value={formData.quizLink}
            onChange={handleChange}
            placeholder="Optional quiz form link"
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
          />
          {errors.quizLink && (
            <p className="text-red-500 text-sm mt-1">{errors.quizLink}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Optional seat limit"
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
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
            placeholder="Write session details"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 resize-none"
          />
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
    </div>
  );
}