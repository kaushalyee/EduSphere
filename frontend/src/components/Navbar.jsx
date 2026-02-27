import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
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
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <GraduationCap className="h-8 w-8 text-primary-600 group-hover:text-accent-600 transition-colors" />
            <span className="text-2xl font-bold gradient-text">EduSphere</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Home
            </a>
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Features
            </a>
            <a href="#cta" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Join Us
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuth ? (
              <>
                <Link to="/login" className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={roleRedirectPath(user?.role)}
                  className="px-4 py-2 text-primary-700 font-semibold hover:text-accent-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-5 py-2 border border-primary-200 rounded-full bg-white/70 hover:bg-white hover:shadow-md transition-all font-semibold text-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;