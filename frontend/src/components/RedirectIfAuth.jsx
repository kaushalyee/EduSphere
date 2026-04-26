import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleRedirectPath = (role) => {
  if (role === "student") return "/student/dashboard";
  if (role === "tutor") return "/tutor/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/";
};

export default function RedirectIfAuth({ children }) {
  const { isAuth, user } = useAuth();

  if (isAuth) {
    return <Navigate to={roleRedirectPath(user?.role)} replace />;
  }

  return children;
}