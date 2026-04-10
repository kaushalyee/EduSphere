import React from "react";
import { Flame } from "lucide-react";
import targetGif from "@/assets/target.gif";

const RewardsHero = ({ studentName, gameAttempts }) => {
  const safeAttempts = gameAttempts ?? 0;
  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "Student";

  return (
    <div className="relative flex flex-col justify-center rounded-2xl bg-white p-6 shadow-md border border-gray-100 overflow-hidden min-h-[250px] h-full transition-all duration-200">
      {/* Subtle Gradient Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 pointer-events-none" />

      <div className="relative z-10 welcome-card">
        <div className="welcome-left">
          <div className={`welcome-badge inline-flex w-fit items-center gap-2 ${
            safeAttempts === 0 
              ? "bg-amber-50 border border-amber-200 text-amber-700" 
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            <Flame size={14} className={safeAttempts === 0 ? "text-amber-500" : "text-green-500"} />
            <span>YOU HAVE {safeAttempts} GAME ATTEMPTS</span>
          </div>
          
          <p className="welcome-subtitle">Welcome back,</p>
          <h1 className="welcome-title">
            {formatName(studentName)}!
          </h1>

          <p className="welcome-desc">
            Every step you take today builds your future success. Stay consistent and keep progressing.
          </p>
        </div>

        <img
          src={targetGif}
          alt="target"
          loading="lazy"
          decoding="async"
          style={{
            width: '320px',
            height: '320px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(RewardsHero);

