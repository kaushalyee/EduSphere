import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .cta-root {
          background: #EBF5FF;
          padding: 6rem 2rem 7rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .cta-circle {
          position: absolute;
          bottom: -120px;
          right: -80px;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(147,197,253,0.3) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .cta-inner {
          max-width: 780px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .cta-box {
          background: #fff;
          border-radius: 22px;
          padding: 3.5rem 3rem;
          text-align: center;
          border: 1px solid rgba(186,224,255,0.6);
          box-shadow: 0 6px 32px rgba(59,130,246,0.08);
        }

        .cta-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #EBF5FF, #DBEAFE);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin: 0 auto 1.5rem;
          border: 1px solid rgba(59,130,246,0.12);
        }

        .cta-eyebrow {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #3B82F6;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          background: rgba(59,130,246,0.07);
          border: 1px solid rgba(59,130,246,0.15);
          border-radius: 100px;
          padding: 4px 14px;
          margin-bottom: 1.25rem;
        }

        .cta-heading {
          font-weight: 800;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          color: #1E3A5F;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin: 0 0 1rem;
        }

        .cta-heading span {
          color: #3B82F6;
        }

        .cta-sub {
          font-size: 0.95rem;
          color: #6A9BBF;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto 2rem;
          font-weight: 400;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(59,130,246,0.28);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59,130,246,0.38);
        }

        .cta-btn svg { transition: transform 0.2s; }
        .cta-btn:hover svg { transform: translateX(3px); }

        .cta-note {
          margin-top: 1rem;
          font-size: 0.75rem;
          color: #9DBDD8;
          font-weight: 400;
        }

        /* Perks row */
        .cta-perks {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem 1.75rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(186,224,255,0.5);
        }

        .perk {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #6A9BBF;
          font-weight: 500;
        }

        .perk-check {
          width: 16px;
          height: 16px;
          background: rgba(59,130,246,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .cta-box { padding: 2.5rem 1.5rem; }
          .cta-root { padding: 4rem 1.25rem 5rem; }
        }
      `}</style>

      <section id="cta" className="cta-root">
        <div className="cta-circle" />
        <div className="cta-inner">
          <div className="cta-box">
            <div className="cta-icon">🚀</div>

            <span className="cta-eyebrow">Join the Community</span>

            <h2 className="cta-heading">
              Start your journey<br />
              with <span>EduSphere</span>
            </h2>

            <p className="cta-sub">
              Connect with peers, access AI-powered support, and unlock your
              full potential in a collaborative learning environment built for you.
            </p>

            <Link to="/register" className="cta-btn">
              Join EduSphere Free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>

            <p className="cta-note">No credit card required · Free to join</p>

            <div className="cta-perks">
              {["AI-Powered Guidance", "Peer Learning Sessions", "Progress Tracking", "Rewards & Badges", "Student Marketplace"].map(p => (
                <div className="perk" key={p}>
                  <div className="perk-check">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;
