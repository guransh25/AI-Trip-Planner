// src/components/Navbar.jsx
// Reusable navigation component
// Shows different links based on whether user is logged in

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate(); // programmatic navigation (not a link click)

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to home after logout
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          ✈️ WanderAI
        </Link>

        {/* Nav links — change based on auth state */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            // Logged in: show username, dashboard link, logout
            <>
              <span className="text-slate-500 text-sm hidden sm:block">
                Hi, {user?.name} 👋
              </span>
              <Link
                to="/dashboard"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                My Trips
              </Link>
              <button
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // Not logged in: show login and register
            <>
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
