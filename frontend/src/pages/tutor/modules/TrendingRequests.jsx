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

                // backend returns a plain array with field "count"
                const raw = res.data;
                const list = Array.isArray(raw)
                    ? raw
                    : raw.trendingRequests || raw.trending || [];

                setTrending(list);
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

            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {!loading && !error && trending.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                    <span className="text-4xl">📭</span>
                    <p className="font-medium">No requests available yet.</p>
                </div>
            )}

            {!loading && !error && trending.length > 0 && (
                <div className="space-y-3">
                    {trending.map((item, index) => (
                        <div
                            key={`${item.category}-${item.topic}-${index}`}
                            className="flex items-center justify-between border border-slate-200 hover:border-blue-200 hover:shadow-sm rounded-xl p-4 transition-all"
                        >
                            {/* Left — rank + info */}
                            <div className="flex items-center gap-4">
                                {/* Rank badge */}
                                <div
                                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                                    style={
                                        index === 0
                                            ? { background: "#FFF7ED", color: "#C2410C", border: "1px solid #FED7AA" }
                                            : index === 1
                                            ? { background: "#F8FAFC", color: "#475569", border: "1px solid #CBD5E1" }
                                            : index === 2
                                            ? { background: "#FEFCE8", color: "#92400E", border: "1px solid #FDE68A" }
                                            : { background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }
                                    }
                                >
                                    #{index + 1}
                                </div>

                                <div>
                                    {/* Topic pill */}
                                    <p className="font-semibold text-slate-900 mb-1">
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

                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Category pill */}
                                        <span style={{
                                            display: "inline-block",
                                            background: "#F0FDF4",
                                            color: "#15803D",
                                            border: "1px solid #BBF7D0",
                                            borderRadius: 6,
                                            padding: "2px 8px",
                                            fontSize: "0.75em",
                                            fontWeight: 600,
                                        }}>
                                            {item.category}
                                        </span>

                                        {/* Preferred time */}
                                        {(item.preferredTime) && (
                                            <span style={{
                                                display: "inline-block",
                                                background: "#FAF5FF",
                                                color: "#7E22CE",
                                                border: "1px solid #E9D5FF",
                                                borderRadius: 6,
                                                padding: "2px 8px",
                                                fontSize: "0.75em",
                                                fontWeight: 600,
                                            }}>
                                                ⏰ {item.preferredTime}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right — count + button */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                <div className="text-right">
                                    {/* ✅ handles both "count" and "requestCount" field names */}
                                    <p className="text-2xl font-bold text-blue-600 leading-none">
                                        {item.requestCount ?? item.count ?? 0}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5 font-medium">requests</p>
                                </div>

                                <button
                                    onClick={() => handleCreateSession(item)}
                                    className="bg-[#2F66E0] hover:bg-[#2457c7] text-white text-sm font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap"
                                >
                                    + Create Session
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
