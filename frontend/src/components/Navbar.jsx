import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleRedirectPath = (role) => {
  if (role === "student") return "/student/dashboard";
  if (role === "tutor") return "/tutor/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/";
};

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .nav-wrap {
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: rgba(236, 246, 255, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(99, 179, 237, 0.2);
        }

        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #3B82F6, #60A5FA);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: #fff;
          transition: transform 0.2s;
          box-shadow: 0 2px 10px rgba(59,130,246,0.3);
        }

        .nav-logo:hover .logo-icon {
          transform: rotate(-6deg) scale(1.05);
        }

        .logo-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1E3A5F;
          letter-spacing: -0.02em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2.25rem;
        }

        .nav-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4A7FA5;
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #1E3A5F;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-btn-ghost {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4A7FA5;
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .nav-btn-ghost:hover {
          background: rgba(59,130,246,0.08);
          color: #1E3A5F;
        }

        .nav-btn-solid {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          text-decoration: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 2px 8px rgba(59,130,246,0.25);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .nav-btn-solid:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(59,130,246,0.35);
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-inner { padding: 0 1.25rem; }
        }
      `}</style>

      <nav className="nav-wrap">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">E</div>
            <span className="logo-name">EduSphere</span>
          </Link>

          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#cta" className="nav-link">Join Us</a>
          </div>

          <div className="nav-actions">
            {!isAuth ? (
              <>
                <Link to="/login" className="nav-btn-ghost">Login</Link>
                <Link to="/register" className="nav-btn-solid">Get Started</Link>
              </>
            ) : (
              <>
                <Link to={roleRedirectPath(user?.role)} className="nav-btn-ghost">Dashboard</Link>
                <button onClick={handleLogout} className="nav-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
