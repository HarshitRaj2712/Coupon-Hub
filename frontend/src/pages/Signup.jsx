import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Signup() {
  const { signup, loading } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signup({ name, email, password });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4"
      style={{ background: "linear-gradient(to bottom right, #1A1A1A, #2A2A2A)" }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-xl backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)"
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: "#F5EDE0" }}>
          Create Account
        </h2>

        {error && (
          <div className="mb-3 text-red-400 bg-red-900/30 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handle} className="space-y-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-[#2A2A2A] text-[#F5EDE0] placeholder-gray-400 border border-[#3A3A3A] focus:ring-2 focus:ring-[#E8DCC7]"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-[#2A2A2A] text-[#F5EDE0] placeholder-gray-400 border border-[#3A3A3A] focus:ring-2 focus:ring-[#E8DCC7]"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#2A2A2A] text-[#F5EDE0] placeholder-gray-400 border border-[#3A3A3A] focus:ring-2 focus:ring-[#E8DCC7]"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold transition"
            style={{
              background: loading ? "#C7BBA6" : "#F5EDE0",
              color: "#1A1A1A"
            }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4" style={{ color: "#E8DCC7" }}>
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-white">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
