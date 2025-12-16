// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signup({ name, email, password });
      navigate("/"); // redirect after signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card-default p-6 shadow-xl">
        <h2 className="text-2xl font-heading font-bold mb-2 text-center">
          Create Account
        </h2>

        <p className="text-sm text-muted text-center mb-5">
          Join CouponHub and start saving today
        </p>

        {error && (
          <div className="mb-3 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handle} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full p-3 rounded-md input-default"
          />

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
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
