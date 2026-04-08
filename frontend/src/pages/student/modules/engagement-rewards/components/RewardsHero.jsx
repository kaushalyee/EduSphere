import { Flame } from "lucide-react";
import targetGif from "@/assets/target.gif";

export default function RewardsHero({ studentName, gameAttempts }) {
  const safeAttempts = gameAttempts ?? 0;
  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "Student";

  return (
    <div className="relative flex flex-col justify-center rounded-2xl bg-white p-6 shadow-md border border-gray-100 overflow-hidden min-h-[250px] h-full transition-all duration-200">
      {/* Subtle Gradient Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 pointer-events-none" />

      <div className="relative z-10 welcome-card">
        <div className="welcome-left">
          <div className={`mb-4 inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full tracking-wide uppercase font-bold text-xs border shadow-sm ${
            safeAttempts === 0 
              ? "bg-amber-50 border-amber-200 text-amber-700" 
              : "bg-green-50 border-green-200 text-green-700"
          }`}>
            <Flame size={14} className={safeAttempts === 0 ? "text-amber-500" : "text-green-500"} />
            <span>You have {safeAttempts} game attempts</span>
          </div>
          
          <div>
            <p className="text-gray-500 font-semibold tracking-wide text-lg leading-none">Welcome back,</p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mt-1 leading-tight uppercase">
              {formatName(studentName)}!
            </h1>
          </div>

          <p className="max-w-md text-sm font-medium text-gray-400 mt-4 leading-relaxed tracking-wide">
            Every step you take today builds your future success. Stay consistent and keep progressing.
          </p>
        </div>

        <div className="welcome-right">
          <img
            src={targetGif}
            alt="target"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
