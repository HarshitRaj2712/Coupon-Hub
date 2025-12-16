// src/components/LoginRequiredModal.jsx
import React from "react";
import { X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginRequiredModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login", { state: { from: "/add-coupon" } });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-xl"
        style={{
          background: "var(--bg-panel)",
          color: "var(--text-main)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-[var(--bg-muted)]"
        >
          <X size={18} />
        </button>

        {/* ICON */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          <Lock size={20} />
        </div>

        {/* CONTENT */}
        <h2 className="text-lg font-semibold mb-2">
          Login Required
        </h2>

        <p
          className="text-sm mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          You must be logged in to add a coupon.
          Please log in to continue.
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-sm hover:bg-[var(--bg-muted)]"
            style={{ borderColor: "var(--border-color)" }}
          >
            Cancel
          </button>

          <button
            onClick={handleLogin}
            className="btn-gradient px-4 py-2 rounded-md text-sm"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
