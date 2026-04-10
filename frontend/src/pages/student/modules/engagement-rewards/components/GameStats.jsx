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
            className={`rounded-xl border p-5 shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md ${
              stat.id === "balance" ? "card-balance" :
              stat.id === "cost" ? "card-cost" :
              "card-attempts"
            }`}
          >
            <div className={`mb-4 inline-flex rounded-lg p-2.5 bg-white/50 shadow-sm`}>
              <Icon size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">{stat.title}</p>
            <h2 className="text-3xl font-black">{stat.value}</h2>
            
            <div className="mt-4 h-1.5 rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  width: stat.progress,
                  backgroundColor: 'currentColor'
                }}
              ></div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
