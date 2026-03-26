import { Coins, TimerReset, Wallet } from "lucide-react";

const stats = [
  {
    id: "balance",
    title: "Your Balance",
    value: "1,240 R-Points",
    icon: Wallet,
    progress: "78%",
  },
  {
    id: "cost",
    title: "Attempt Cost",
    value: "10 R-Points",
    icon: Coins,
    progress: "42%",
  },
  {
    id: "attempts",
    title: "Available Attempts",
    value: "0 Attempts",
    icon: TimerReset,
    progress: "8%",
  },
];

export default function GameStats() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isAttempts = stat.id === "attempts";

        return (
          <article
            key={stat.id}
            className={`rounded-2xl bg-gradient-to-br from-white/5 to-transparent p-4 shadow-[0_0_22px_rgba(168,85,247,0.12)] ring-1 ring-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] ${
              isAttempts ? "border border-red-500/20 bg-red-500/10" : ""
            }`}
          >
            <div
              className={`mb-3 inline-flex rounded-xl p-2.5 text-white ${
                isAttempts
                  ? "bg-gradient-to-br from-red-500 to-pink-500"
                  : "bg-gradient-to-br from-purple-500 to-indigo-600"
              }`}
            >
              <Icon size={18} />
            </div>
            <p className="text-xs text-gray-300">{stat.title}</p>
            <p className={`mt-1 text-xl font-bold ${isAttempts ? "text-red-400" : "text-white"}`}>{stat.value}</p>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div
                className={`h-1.5 rounded-full ${
                  isAttempts
                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                    : "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500"
                }`}
                style={{ width: stat.progress }}
              ></div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
