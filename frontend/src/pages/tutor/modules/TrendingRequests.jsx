import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function TrendingRequests({ setActiveTab, setSelectedTrendingTopic }) {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── filter state ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTime, setSelectedTime] = useState("All");
  const [sortBy, setSortBy] = useState("requests-desc");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTrendingRequests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/session-requests/trending",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTrending(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trending requests");
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingRequests();
  }, [token]);

  const handleCreateSession = (item) => {
    setSelectedTrendingTopic({ category: item.category, topic: item.topic });
    setActiveTab("create-session");
  };

  // ── derived filter options ────────────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = [...new Set(trending.map((t) => t.category).filter(Boolean))];
    return ["All", ...cats.sort()];
  }, [trending]);

  const times = useMemo(() => {
    const ts = [...new Set(trending.map((t) => t.preferredTime).filter(Boolean))];
    return ["All", ...ts.sort()];
  }, [trending]);

  // ── filtered + sorted list ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...trending];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.topic?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (selectedTime !== "All") {
      list = list.filter((t) => t.preferredTime === selectedTime);
    }

    list.sort((a, b) => {
      if (sortBy === "requests-desc") return b.requestCount - a.requestCount;
      if (sortBy === "requests-asc") return a.requestCount - b.requestCount;
      if (sortBy === "topic-asc") return a.topic?.localeCompare(b.topic);
      if (sortBy === "topic-desc") return b.topic?.localeCompare(a.topic);
      return 0;
    });

    return list;
  }, [trending, search, selectedCategory, selectedTime, sortBy]);

  const hasActiveFilter =
    search || selectedCategory !== "All" || selectedTime !== "All" || sortBy !== "requests-desc";

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedTime("All");
    setSortBy("requests-desc");
  };

  // ── badge color by rank ───────────────────────────────────────────────────
  const rankColor = (i) => {
    if (i === 0) return { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" };
    if (i === 1) return { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1" };
    if (i === 2) return { bg: "#FFF8F1", text: "#92400E", border: "#FDE68A" };
    return { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" };
  };

  return (
    <div style={styles.shell}>
      {/* ── header ── */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Trending Requests</h2>
          <p style={styles.subtitle}>Topics most requested by students</p>
        </div>
        <div style={styles.countBadge}>
          <span style={styles.countNum}>{filtered.length}</span>
          <span style={styles.countLabel}>
            {filtered.length === trending.length
              ? "topics"
              : `of ${trending.length}`}
          </span>
        </div>
      </div>

      {/* ── filter bar ── */}
      <div style={styles.filterBar}>
        {/* search */}
        <div style={styles.searchWrap}>
          <svg style={styles.searchIcon} viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M13 13l3.5 3.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search topic or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} style={styles.clearX}>✕</button>
          )}
        </div>

        {/* category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
          ))}
        </select>

        {/* preferred time */}
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          style={styles.select}
        >
          {times.map((t) => (
            <option key={t} value={t}>{t === "All" ? "All Times" : t}</option>
          ))}
        </select>

        {/* sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.select}
        >
          <option value="requests-desc">Most Requested</option>
          <option value="requests-asc">Least Requested</option>
          <option value="topic-asc">Topic A → Z</option>
          <option value="topic-desc">Topic Z → A</option>
        </select>

        {/* clear */}
        {hasActiveFilter && (
          <button onClick={clearFilters} style={styles.clearBtn}>
            Clear filters
          </button>
        )}
      </div>

      {/* ── active filter pills ── */}
      {hasActiveFilter && (
        <div style={styles.pillRow}>
          {search && (
            <span style={styles.pill}>
              "{search}" <button onClick={() => setSearch("")} style={styles.pillX}>✕</button>
            </span>
          )}
          {selectedCategory !== "All" && (
            <span style={styles.pill}>
              {selectedCategory} <button onClick={() => setSelectedCategory("All")} style={styles.pillX}>✕</button>
            </span>
          )}
          {selectedTime !== "All" && (
            <span style={styles.pill}>
              {selectedTime} <button onClick={() => setSelectedTime("All")} style={styles.pillX}>✕</button>
            </span>
          )}
          {sortBy !== "requests-desc" && (
            <span style={{ ...styles.pill, background: "#EEF2FF", color: "#4338CA", borderColor: "#C7D2FE" }}>
              Sorted: {sortBy.replace("-", " ")}
            </span>
          )}
        </div>
      )}

      {/* ── states ── */}
      {loading && (
        <div style={styles.stateBox}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={styles.skeleton} />
          ))}
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <span style={{ fontSize: 20 }}>⚠️</span> {error}
        </div>
      )}

      {!loading && !error && trending.length === 0 && (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: 32, margin: 0 }}>📭</p>
          <p style={{ color: "#64748b", margin: 0 }}>No requests available yet.</p>
        </div>
      )}

      {!loading && !error && trending.length > 0 && filtered.length === 0 && (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: 32, margin: 0 }}>🔍</p>
          <p style={{ color: "#64748b", margin: "4px 0 0" }}>No topics match your filters.</p>
          <button onClick={clearFilters} style={styles.clearBtnLg}>Clear filters</button>
        </div>
      )}

      {/* ── list ── */}
      {!loading && !error && filtered.length > 0 && (
        <div style={styles.list}>
          {filtered.map((item, index) => {
            const rank = rankColor(index);
            return (
              <div key={`${item.category}-${item.topic}-${index}`} style={styles.card}>
                {/* rank badge */}
                <div
                  style={{
                    ...styles.rankBadge,
                    background: rank.bg,
                    color: rank.text,
                    border: `1px solid ${rank.border}`,
                  }}
                >
                  #{index + 1}
                </div>

                {/* info */}
                <div style={styles.cardInfo}>
                  <p style={styles.topicText}>{item.topic}</p>
                  <div style={styles.tagRow}>
                    <span style={styles.catTag}>{item.category}</span>
                    {item.preferredTime && (
                      <span style={styles.timeTag}>⏰ {item.preferredTime}</span>
                    )}
                  </div>
                </div>

                {/* right side */}
                <div style={styles.cardRight}>
                  <div style={styles.countBox}>
                    <p style={styles.bigCount}>{item.requestCount}</p>
                    <p style={styles.countSub}>requests</p>
                  </div>
                  <button
                    onClick={() => handleCreateSession(item)}
                    style={styles.createBtn}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2457c7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#2F66E0")}
                  >
                    + Create Session
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const styles = {
  shell: {
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,.06)",
    padding: "32px 28px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 },
  subtitle: { fontSize: 14, color: "#64748b", margin: "4px 0 0" },
  countBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  countNum: { fontSize: 28, fontWeight: 800, color: "#2F66E0", lineHeight: 1 },
  countLabel: { fontSize: 12, color: "#94a3b8", fontWeight: 500 },

  // filter bar
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  searchWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 200px",
    minWidth: 180,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    width: 16,
    height: 16,
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "9px 32px 9px 34px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "inherit",
    color: "#0f172a",
    outline: "none",
    background: "#f8fafc",
    boxSizing: "border-box",
  },
  clearX: {
    position: "absolute",
    right: 8,
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 12,
    padding: 2,
    lineHeight: 1,
  },
  select: {
    padding: "9px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "inherit",
    color: "#0f172a",
    background: "#f8fafc",
    cursor: "pointer",
    outline: "none",
    flex: "0 1 auto",
  },
  clearBtn: {
    padding: "9px 14px",
    border: "1.5px solid #fca5a5",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "inherit",
    color: "#dc2626",
    background: "#fef2f2",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  // pills
  pillRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#EFF6FF",
    color: "#1D4ED8",
    border: "1px solid #BFDBFE",
    borderRadius: 100,
    padding: "3px 10px 3px 12px",
    fontSize: 12,
    fontWeight: 600,
  },
  pillX: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "inherit",
    fontSize: 10,
    padding: 0,
    lineHeight: 1,
    opacity: 0.7,
  },

  // states
  stateBox: { display: "flex", flexDirection: "column", gap: 12 },
  skeleton: {
    height: 76,
    borderRadius: 14,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200%",
    animation: "shimmer 1.4s infinite",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: 12,
    padding: "16px 20px",
    color: "#dc2626",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  emptyBox: {
    textAlign: "center",
    padding: "48px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  clearBtnLg: {
    marginTop: 8,
    padding: "8px 20px",
    border: "1.5px solid #fca5a5",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "inherit",
    color: "#dc2626",
    background: "#fef2f2",
    cursor: "pointer",
    fontWeight: 600,
  },

  // list
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    border: "1.5px solid #e2e8f0",
    borderRadius: 14,
    padding: "16px 20px",
    transition: "box-shadow .2s, border-color .2s",
    background: "#fff",
  },
  rankBadge: {
    flexShrink: 0,
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
  },
  cardInfo: { flex: 1, minWidth: 0 },
  topicText: { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  catTag: {
    background: "#EFF6FF",
    color: "#1D4ED8",
    border: "1px solid #BFDBFE",
    borderRadius: 100,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 600,
  },
  timeTag: {
    background: "#F0FDF4",
    color: "#15803D",
    border: "1px solid #BBF7D0",
    borderRadius: 100,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 600,
  },
  cardRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
    flexShrink: 0,
  },
  countBox: { textAlign: "right" },
  bigCount: { fontSize: 26, fontWeight: 800, color: "#2F66E0", margin: 0, lineHeight: 1 },
  countSub: { fontSize: 11, color: "#94a3b8", margin: "2px 0 0", fontWeight: 500 },
  createBtn: {
    background: "#2F66E0",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background .15s",
    whiteSpace: "nowrap",
  },
};
