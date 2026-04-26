const Features = () => {
  const features = [
    {
      emoji: "🤖",
      tag: "Intelligence",
      title: "AI-Powered Student Support",
      description: "Personalized recommendations that identify your weak areas and adapt guidance to your academic journey.",
      bg: "#EBF5FF",
      color: "#2563EB",
    },
    {
      emoji: "👥",
      tag: "Collaboration",
      title: "Smart Peer Learning & Kuppi Management",
      description: "Organize study groups and structured kuppi sessions with tools built around real university workflows.",
      bg: "#F0FDF4",
      color: "#16A34A",
    },
    {
      emoji: "🛍️",
      tag: "Marketplace",
      title: "Student Marketplace",
      description: "Exchange resources, share notes, and build meaningful academic partnerships across faculties.",
      bg: "#FFF7ED",
      color: "#EA580C",
    },
    {
      emoji: "🏆",
      tag: "Gamification",
      title: "Rewards & Games",
      description: "Earn points, unlock badges, and compete on leaderboards as you hit academic milestones.",
      bg: "#FEFCE8",
      color: "#CA8A04",
    },
    {
      emoji: "📊",
      tag: "Analytics",
      title: "Progress Tracking",
      description: "Visual dashboards show quiz scores, session attendance, and AI-detected weak areas over time.",
      bg: "#FDF4FF",
      color: "#9333EA",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ft-root {
          background: #F0F8FF;
          padding: 6rem 2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ft-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .ft-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .ft-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 600;
          color: #3B82F6;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.18);
          border-radius: 100px;
          padding: 4px 14px;
          margin-bottom: 1rem;
        }

        .ft-heading {
          font-weight: 800;
          font-size: clamp(1.9rem, 3.5vw, 2.75rem);
          color: #1E3A5F;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin: 0 0 0.75rem;
        }

        .ft-heading span { color: #3B82F6; }

        .ft-subhead {
          font-size: 0.95rem;
          color: #6A9BBF;
          font-weight: 400;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.65;
        }

        .ft-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        /* Make last row center the remaining cards if less than 3 */
        .ft-grid-inner {
          display: contents;
        }

        .ft-card {
          background: #fff;
          border-radius: 16px;
          padding: 1.75rem;
          border: 1px solid rgba(186,224,255,0.5);
          box-shadow: 0 2px 10px rgba(59,130,246,0.05);
          transition: transform 0.22s, box-shadow 0.22s;
        }

        .ft-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(59,130,246,0.1);
        }

        /* Center the last two cards when grid has 5 items */
        .ft-card:nth-child(4) { grid-column: 1; }
        .ft-card:nth-child(5) { grid-column: 2; }

        .ft-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          margin-bottom: 1.1rem;
        }

        .ft-tag {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .ft-title {
          font-weight: 700;
          font-size: 1rem;
          color: #1E3A5F;
          line-height: 1.35;
          letter-spacing: -0.015em;
          margin: 0 0 0.65rem;
        }

        .ft-desc {
          font-size: 0.83rem;
          color: #6A9BBF;
          line-height: 1.65;
          font-weight: 400;
          margin: 0;
        }

        @media (max-width: 900px) {
          .ft-grid { grid-template-columns: repeat(2, 1fr); }
          .ft-card:nth-child(4),
          .ft-card:nth-child(5) { grid-column: auto; }
        }

        @media (max-width: 560px) {
          .ft-grid { grid-template-columns: 1fr; }
          .ft-root { padding: 4rem 1.25rem; }
          .ft-card:nth-child(4),
          .ft-card:nth-child(5) { grid-column: auto; }
        }
      `}</style>

      <section id="features" className="ft-root">
        <div className="ft-inner">
          <div className="ft-header">
            <span className="ft-eyebrow">Platform Capabilities</span>
            <h2 className="ft-heading">Why <span>EduSphere?</span></h2>
            <p className="ft-subhead">
              A comprehensive platform designed specifically for modern university students.
            </p>
          </div>

          <div className="ft-grid">
            {features.map((f) => (
              <div className="ft-card" key={f.title}>
                <div className="ft-icon-wrap" style={{ background: f.bg }}>
                  {f.emoji}
                </div>
                <p className="ft-tag" style={{ color: f.color }}>{f.tag}</p>
                <h3 className="ft-title">{f.title}</h3>
                <p className="ft-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
