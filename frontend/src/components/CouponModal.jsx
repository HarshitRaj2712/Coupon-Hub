import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Copy, ExternalLink, Bookmark } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { trackEvent } from "../utils/analytics";

const API_BASE = "https://coupon-hub-1.onrender.com/api";

export default function CouponModal({ coupon, onClose }) {
  const { user, token } = useContext(AuthContext);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!coupon) return null;

  const {
    _id = "",
    code = "—",
    title = "",
    store = "",
    discountType,
    discountValue,
    expiryDate = null,
    description = "",
    sourceUrl = "#",
    savedBy = [],
  } = coupon;

  useEffect(() => {
    if (user && savedBy.includes(user.id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [user, savedBy]);

  /* ================= RECENTLY VIEWED (FRONTEND ONLY) ================= */
useEffect(() => {
  if (!coupon || !_id) return;

  const existing =
    JSON.parse(localStorage.getItem("recentCoupons")) || [];

  const updated = [
    {
      _id,
      title,
      store,
    },
    ...existing.filter((c) => c._id !== _id),
  ].slice(0, 6); // keep last 6 viewed

  localStorage.setItem(
    "recentCoupons",
    JSON.stringify(updated)
  );
}, [_id, title, store]);


  const discountText =
    discountType === "percent"
      ? `${discountValue}% OFF`
      : discountType === "free-shipping"
      ? "Free Delivery"
      : discountValue
      ? `₹${discountValue} OFF`
      : "Deal";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Coupon copied!");
    trackEvent("copy_code", _id);
    setTimeout(() => setCopied(false), 1500);
  };

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
        setSaved(true);
        toast.success("Coupon saved");
      } else {
        await axios.delete(
          `${API_BASE}/coupons/${_id}/save`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSaved(false);
        toast.success("Removed from saved");
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-lg font-semibold text-[#2B1E1E]">
              {title || store || "Coupon"}
            </h3>
            <p className="text-sm text-[#7A5C5C]">
              {store} • {discountText}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#7A5C5C] hover:text-[#2B1E1E]"
          >
            <X size={18} />
          </button>
        </div>

        {/* COUPON BOX */}
        <div className="flex justify-between items-center rounded-xl bg-[#F1E7E4] px-5 py-4 mb-4">
          <div>
            <div className="text-xs text-[#7A5C5C] mb-1">
              Coupon Code
            </div>
            <div className="text-2xl font-mono font-semibold text-[#2B1E1E]">
              {code}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-white font-semibold shadow"
            style={{
              background:
                "linear-gradient(135deg, #6F1D2C, #8A2D3C)",
            }}
          >
            <Copy size={14} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* DESCRIPTION */}
        {description && (
          <p className="text-sm text-[#7A5C5C] mb-6">
            {description}
          </p>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#7A5C5C]">
            Expires:{" "}
            {expiryDate
              ? new Date(expiryDate).toLocaleDateString()
              : "—"}
          </span>

          <div className="flex gap-3">
            <button
              onClick={toggleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E3D5D8] text-sm font-medium text-[#2B1E1E] hover:bg-[#F7F3F2]"
            >
              <Bookmark
                size={14}
                className={saved ? "fill-current" : ""}
              />
              {saved ? "Saved" : "Save"}
            </button>

            <button
              onClick={() => window.open(sourceUrl, "_blank")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E3D5D8] text-sm font-medium text-[#2B1E1E] hover:bg-[#F7F3F2]"
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
