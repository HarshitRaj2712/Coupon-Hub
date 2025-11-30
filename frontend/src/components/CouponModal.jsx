// src/components/CouponModal.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { trackEvent } from "../utils/analytics";

/**
 * CouponModal: shows coupon code, copy button, go-to-store, report and mark-as-working.
 * - uses react-hot-toast for feedback
 * - uses trackEvent(...) to record actions in localStorage/console
 */

export default function CouponModal({ coupon, onClose }) {
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);
  const [workingCount, setWorkingCount] = useState(0);

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
    sourceUrl = "#"
  } = coupon;

  useEffect(() => {
    // load report state + workingCount from localStorage
    try {
      const repKey = `coupon_reported_${_id}`;
      const workKey = `coupon_works_${_id}`;
      setReported(localStorage.getItem(repKey) === "1");
      setWorkingCount(parseInt(localStorage.getItem(workKey) || "0", 10));
    } catch {}
  }, [_id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code || "");
      setCopied(true);
      trackEvent("copy_code", _id, { code });
      toast.success("Coupon code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Unable to copy. Try manually.");
    }
  };

  const openStore = () => {
    trackEvent("go_to_store", _id, { url: sourceUrl });
    window.open(sourceUrl || "#", "_blank", "noopener,noreferrer");
  };

  const handleReport = () => {
    // toggle (simple UX)
    const repKey = `coupon_reported_${_id}`;
    const nowReported = !reported;
    setReported(nowReported);
    try { localStorage.setItem(repKey, nowReported ? "1" : "0"); } catch {}
    trackEvent("report", _id, { reported: nowReported });
    toast.success(nowReported ? "Thanks — reported." : "Report cleared.");
  };

  const markWorking = () => {
    const workKey = `coupon_works_${_id}`;
    const newCount = workingCount + 1;
    setWorkingCount(newCount);
    try { localStorage.setItem(workKey, String(newCount)); } catch {}
    trackEvent("mark_working", _id, { newCount });
    toast.success("Thanks — marked as working!");
  };

  const discountText = discountType === "percent"
    ? `${discountValue}% OFF`
    : discountType === "free-shipping"
      ? "Free Delivery"
      : discountValue ? `₹${discountValue} OFF` : "Deal";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-5 z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{title || store}</h3>
            <div className="text-xs text-gray-500">{store} • {discountText}</div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <div className="mt-4">
          <div className="bg-gray-50 border rounded p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Coupon Code</div>
              <div className="text-xl font-mono">{code || "—"}</div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button onClick={handleCopy} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">
                {copied ? "Copied" : "Copy"}
              </button>

              <button onClick={openStore} className="px-3 py-1 border rounded text-sm">
                Go to store
              </button>
            </div>
          </div>

          {description && <p className="mt-3 text-sm text-gray-600">{description}</p>}

          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="text-xs text-gray-500">Expires: {expiryDate ? new Date(expiryDate).toLocaleDateString() : "—"}</div>

            <div className="flex items-center gap-2">
              <button
                onClick={markWorking}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Mark as working ({workingCount})
              </button>

              <button
                onClick={handleReport}
                className={`px-3 py-1 rounded text-sm ${reported ? "bg-red-500 text-white" : "border"}`}
              >
                {reported ? "Reported" : "Report"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-1 border rounded text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
