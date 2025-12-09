// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

/**
 * ProtectedRoute
 * - Allows access if user is present OR we at least have a token (context or localStorage).
 * - Redirects to /login only if both user and token are missing.
 * - Preserves "from" location so login page can optionally redirect back.
 */
export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useContext(AuthContext) || {};
  const location = useLocation();

  // While auth is initializing (e.g., checking token), don't redirect yet
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-10 text-sm text-gray-300">
        Checking your session…
      </div>
    );
  }

  const storedToken = token || localStorage.getItem("token");

  // If no user AND no token anywhere -> not authenticated
  if (!user && !storedToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Authenticated (or at least we have a token) -> allow access
  return children;
}
