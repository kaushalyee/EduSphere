import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .hero-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: #EBF5FF;
          position: relative;
          overflow: hidden;
          padding: 6rem 2rem 4rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Soft circle decorations */
        .hero-circle-1 {
          position: absolute;
          top: -120px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-circle-2 {
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(196,221,255,0.4) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
        }

        /* Left */
        .hero-left {}

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(99,179,237,0.4);
          border-radius: 100px;
          padding: 6px 14px;
          margin-bottom: 1.75rem;
          animation: fadeUp 0.6s ease both;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3B82F6;
        }

        .badge-text {
          font-size: 0.72rem;
          font-weight: 600;
          color: #2563EB;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .hero-title {
          font-weight: 800;
          font-size: clamp(2.6rem, 5vw, 4rem);
          color: #1E3A5F;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 1.25rem;
          animation: fadeUp 0.6s 0.08s ease both;
        }

        .hero-title-accent {
          color: #3B82F6;
        }

        .hero-sub {
          font-size: 1rem;
          font-weight: 400;
          color: #5A87AA;
          line-height: 1.75;
          margin: 0 0 2.25rem;
          max-width: 460px;
          animation: fadeUp 0.6s 0.16s ease both;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.24s ease both;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(59,130,246,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59,130,246,0.38);
        }

        .btn-primary svg { transition: transform 0.2s; }
        .btn-primary:hover svg { transform: translateX(3px); }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px;
          background: #fff;
          color: #3B82F6;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: 10px;
          border: 1.5px solid rgba(59,130,246,0.3);
          text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .btn-outline:hover {
          border-color: #3B82F6;
          box-shadow: 0 2px 10px rgba(59,130,246,0.12);
        }

        /* Right — floating card panel */
        .hero-right {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 12px rgba(59,130,246,0.08);
          border: 1px solid rgba(186,224,255,0.6);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.12);
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.25rem;
        }

        .stat-info {}
        .stat-num {
          font-weight: 700;
          font-size: 1.3rem;
          color: #1E3A5F;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 2px;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #7AAAC8;
          font-weight: 500;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .hero-root { padding: 5rem 1.25rem 3rem; }
        }
      `}</style>

      <section id="home" className="hero-root">
        <div className="hero-circle-1" />
        <div className="hero-circle-2" />
        <div className="hero-dots" />

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="badge-dot" />
              <span className="badge-text">Now Open for University Students</span>
            </div>

            <h1 className="hero-title">
              Your Smart<br />
              <span className="hero-title-accent">Academic</span><br />
              Ecosystem
            </h1>

            <p className="hero-sub">
              EduSphere brings together peer learning, AI-powered guidance,
              and structured collaboration — all in one platform built
              for university life.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn-primary">
                Get Started
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/login" className="btn-outline">Sign In</Link>
            </div>
          </div>

          <div className="hero-right">
            {[
              { icon: "🎓", bg: "#EBF5FF", num: "1,400+", label: "Active Students", },
              { icon: "👨‍🏫", bg: "#F0FDF4", num: "80+",   label: "Verified Tutors", },
              { icon: "📚", bg: "#FFF7ED", num: "250+",   label: "Study Sessions Held", },
              { icon: "⭐", bg: "#FEFCE8", num: "94%",    label: "Student Satisfaction", },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div className="stat-info">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
