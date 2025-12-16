// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // redirect after login
  const redirectTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card-default p-6 shadow-xl">
        <h2 className="text-2xl font-heading font-bold mb-2">
          Login
        </h2>

        <p className="text-sm text-muted mb-4">
          Welcome back. Please login to continue.
        </p>

        {error && (
          <div className="mb-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full p-3 rounded-md input-default"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 rounded-md input-default"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted text-center">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
