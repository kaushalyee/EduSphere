import React from "react";
import { Flame } from "lucide-react";
import targetGif from "@/assets/target.gif";

const RewardsHero = ({ studentName, gameAttempts }) => {
  const safeAttempts = gameAttempts ?? 0;
  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "Student";

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      borderRadius: '16px',
      padding: '40px 44px',
      minHeight: '240px',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glowing orb */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,197,24,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hook label */}
        <div style={{
          fontSize: '12px', fontWeight: 700,
          color: 'rgba(245,197,24,0.7)',
          letterSpacing: '4px', textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          ⚡ Build Momentum
        </div>

        {/* Username */}
        <div style={{
          fontSize: '62px', fontWeight: 900,
          lineHeight: 1, textTransform: 'uppercase',
          letterSpacing: '2px', marginBottom: '18px',
          background: 'linear-gradient(90deg, #f5c518, #ff6b35)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {studentName || 'Player'}!
        </div>

        {/* Motivational quote */}
        <div style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.75,
          maxWidth: '400px',
          fontStyle: 'italic',
        }}>
          Every step you take today builds your future success. Stay consistent and keep progressing.
        </div>
      </div>

      {/* Right — existing bullseye graphic */}
      <div style={{
        flexShrink: 0, position: 'relative', zIndex: 1,
        filter: 'drop-shadow(0 0 28px rgba(245,197,24,0.3)) brightness(0.85) sepia(0.4) saturate(1.8)',
        width: '240px',
        height: '240px',
        animation: 'spin-slow 25s linear infinite',
      }}>
        <img
          src={targetGif}
          alt="target"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(RewardsHero);

