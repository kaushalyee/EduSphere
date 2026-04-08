import { Coins, TimerReset, Wallet } from "lucide-react";
export default function GameStats({
  walletBalance = 0,
  attemptCost = 0,
  availableAttempts = 0,
}) {
  const progressPct = Math.max(0, Math.min(100, Math.round((walletBalance / 2000) * 100)));

  const stats = [
    {
      id: "balance",
      title: "Your Balance",
      value: `${walletBalance.toLocaleString()} R-Points`,
      icon: Wallet,
      progress: `${progressPct}%`,
    },
    {
      id: "cost",
      title: "Attempt Cost",
      value: `${attemptCost} R-Points`,
      icon: Coins,
      progress: `${Math.max(10, Math.min(100, availableAttempts * 5))}%`,
    },
    {
      id: "attempts",
      title: "Available Attempts",
      value: `${availableAttempts} Attempts`,
      icon: TimerReset,
      progress: `${Math.max(8, Math.min(100, availableAttempts * 10))}%`,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isAttempts = stat.id === "attempts";

        return (
          <article
            key={stat.id}
            className={`rounded-xl border bg-white p-4 shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md ${
              isAttempts ? "border-orange-200" : "border-gray-100"
            }`}
          >
            <div
              className={`mb-3 inline-flex rounded-lg p-2.5 ${
                isAttempts
                  ? "bg-orange-50 text-orange-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <Icon size={18} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase">{stat.title}</p>
            <p className={`mt-1 text-xl font-bold ${isAttempts ? "text-orange-600" : "text-gray-900"}`}>{stat.value}</p>
            <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  isAttempts ? "bg-orange-500" : "bg-blue-600"
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
