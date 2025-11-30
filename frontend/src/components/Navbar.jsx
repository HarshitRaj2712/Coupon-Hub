import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("globalSearch", { detail: { q } }));
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          CouponHub
        </Link>

        {/* Search bar */}
        <form onSubmit={submitSearch} className="flex-1 max-w-xl mx-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for stores, coupons, deals..."
            className="w-full p-2 border rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-700 hover:text-indigo-600">
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1 bg-indigo-600 text-white rounded-full"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}
