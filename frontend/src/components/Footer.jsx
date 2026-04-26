import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .footer-root {
          background: #fff;
          border-top: 1px solid rgba(186, 224, 255, 0.6);
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 2.5rem 2rem;
        }

        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .footer-logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          color: #fff;
          box-shadow: 0 2px 8px rgba(59,130,246,0.25);
        }

        .footer-logo-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1E3A5F;
          letter-spacing: -0.02em;
        }

        .footer-tagline {
          font-size: 0.85rem;
          color: #7AAAC8;
          font-weight: 400;
          max-width: 420px;
          line-height: 1.6;
          margin: 0;
        }

        .footer-copy {
          font-size: 0.78rem;
          color: #9DBDD8;
          font-weight: 400;
          margin: 0;
        }

        .footer-copy span {
          color: #3B82F6;
          font-weight: 600;
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-inner">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">E</div>
            <span className="footer-logo-name">EduSphere</span>
          </Link>

          <p className="footer-tagline">
            Smart University Academic Ecosystem — empowering students through collaboration and innovation.
          </p>

          <p className="footer-copy">
            © 2026 <span>EduSphere</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
