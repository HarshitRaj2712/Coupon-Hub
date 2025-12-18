// src/components/CouponModal.jsx
import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Copy, ExternalLink, Bookmark } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { trackEvent } from "../utils/analytics";

const API_BASE = "http://localhost:5000/api";

export default function CouponModal({ coupon, onClose }) {
  const { user, token } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!coupon) return null;

  const {
    _id,
    code = "",
    title = "",
    store = "",
    discountType,
    discountValue,
    expiryDate,
    description = "",
    sourceUrl = "#",
  } = coupon;

  const discountText =
    discountType === "percent"
      ? `${discountValue}% OFF`
      : discountType === "free-shipping"
      ? "Free Delivery"
      : discountValue
      ? `₹${discountValue} OFF`
      : "Deal";

  /* =========================
     COPY COUPON
  ========================= */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Coupon copied!");
    trackEvent("copy_code", _id);
    setTimeout(() => setCopied(false), 1500);
  };

  /* =========================
     SAVE / UNSAVE COUPON
  ========================= */
  const toggleSave = async () => {
    if (!user) {
      toast.error("Login required to save coupons");
      return;
    }

    try {
      setSaving(true);

      if (!saved) {
        await axios.post(
          `${API_BASE}/coupons/${_id}/save`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Coupon saved");
        setSaved(true);
        trackEvent("save_coupon", _id);
      } else {
        await axios.delete(
          `${API_BASE}/coupons/${_id}/save`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Removed from saved");
        setSaved(false);
      }
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-xl"
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border-color)",
          color: "var(--text-main)",
        }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {title || store}
            </h3>
            <div className="text-sm text-muted">
              {store} • {discountText}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--bg-muted)]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* COUPON CODE */}
        <div
          className="rounded-xl p-4 flex justify-between items-center"
          style={{
            background: "var(--bg-muted)",
            border: "1px dashed var(--border-color)",
          }}
        >
          <div>
            <div className="text-xs text-muted">
              Coupon Code
            </div>
            <div className="text-2xl font-mono font-semibold">
              {code || "—"}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="btn-gradient px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Copy size={14} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* DESCRIPTION */}
        {description && (
          <p className="mt-4 text-sm text-muted">
            {description}
          </p>
        )}

        {/* FOOTER */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-xs text-muted">
            Expires:{" "}
            {expiryDate
              ? new Date(expiryDate).toLocaleDateString()
              : "—"}
          </div>

          <div className="flex gap-2">
            {/* SAVE BUTTON */}
            <button
              onClick={toggleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 border
                         hover:bg-[var(--bg-muted)] transition"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Bookmark
                size={14}
                className={saved ? "fill-current" : ""}
              />
              {saved ? "Saved" : "Save"}
            </button>

            {/* STORE LINK */}
            <button
              onClick={() => window.open(sourceUrl, "_blank")}
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2
                         hover:bg-[var(--bg-muted)] border"
              style={{ borderColor: "var(--border-color)" }}
            >
              Go to Store
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
