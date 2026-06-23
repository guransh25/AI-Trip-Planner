// src/App.jsx
// The root component — sets up routing and wraps app in AuthProvider
// Interview answer: "React Router lets me build a Single Page App (SPA) —
//   navigation changes the URL without reloading the page"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TripDetail from "./pages/TripDetail";

// ProtectedRoute component — redirects to login if not authenticated
// Interview answer: "I created a ProtectedRoute wrapper so unauthenticated users
//   can't access private pages — they're redirected to login"
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  // Still checking localStorage — don't redirect yet
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Not logged in → redirect to login
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    // AuthProvider makes auth state available to the entire app
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          {/* Navbar shows on every page */}
          <Navbar />

          {/* Routes — only one renders at a time based on URL */}
          <Routes>
            {/* Public routes — anyone can visit */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes — must be logged in */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trip/:id"
              element={
                <ProtectedRoute>
                  <TripDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
