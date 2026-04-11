import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TrendingRequests({
    setActiveTab,
    setSelectedTrendingTopic,
}) {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTrendingRequests = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/session-requests/trending",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTrending(res.data || []);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to load trending requests"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingRequests();
    }, [token]);

    const handleCreateSession = (item) => {
        setSelectedTrendingTopic({
            category: item.category,
            topic: item.topic,
        });
        setActiveTab("create-session");
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Trending Requests
            </h2>
            <p className="text-slate-500 mb-6">
                Topics most requested by students.
            </p>

            {loading && <p className="text-slate-500">Loading...</p>}

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && trending.length === 0 && (
                <p className="text-slate-500">No requests available yet.</p>
            )}

            {!loading && !error && trending.length > 0 && (
                <div className="space-y-4">
                    {trending.map((item, index) => (
                        <div
                            key={`${item.category}-${item.topic}-${index}`}
                            className="flex items-center justify-between border border-slate-200 rounded-xl p-4"
                        >
                            <div>
                                {/* Topic — blue highlight pill */}
                                <p className="font-semibold text-slate-900 mb-1">
                                    {index + 1}.{" "}
                                    <span style={{
                                        background: "#EFF6FF",
                                        color: "#1D4ED8",
                                        border: "1px solid #BFDBFE",
                                        borderRadius: 6,
                                        padding: "2px 8px",
                                        fontWeight: 700,
                                        fontSize: "0.95em",
                                    }}>
                                        {item.topic}
                                    </span>
                                </p>

                                {/* Category — green highlight pill */}
                                <span style={{
                                    display: "inline-block",
                                    background: "#F0FDF4",
                                    color: "#15803D",
                                    border: "1px solid #BBF7D0",
                                    borderRadius: 6,
                                    padding: "2px 8px",
                                    fontSize: "0.78em",
                                    fontWeight: 600,
                                }}>
                                    {item.category}
                                </span>

                                <p className="text-sm text-slate-600 mt-2">
                                    Preferred Time: {item.preferredTime || "Not specified"}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {item.requestCount}
                                    </p>
                                    <p className="text-sm text-slate-500">Requests</p>
                                </div>

                                <button
                                    onClick={() => handleCreateSession(item)}
                                    className="bg-[#2F66E0] hover:bg-[#2457c7] text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                >
                                    Create Session
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}