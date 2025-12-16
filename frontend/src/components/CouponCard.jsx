// src/components/CouponCard.jsx
import React from "react";

export default function CouponCard({ coupon = {}, onShow = () => {} }) {
  const {
    code = "—",
    title = "",
    store = "Store",
    discountType,
    discountValue,
    expiryDate,
    verified,
  } = coupon;

  const discountText =
    discountType === "percent"
      ? `${discountValue}% OFF`
      : discountType === "free-shipping"
      ? "Free Delivery"
      : discountValue
      ? `₹${discountValue} OFF`
      : "Deal";

  return (
    /* RESPONSIVE HEIGHT CARD */
    <div
      className="
        h-full
        min-h-[220px] sm:min-h-[200px] md:min-h-[220px]
        rounded-2xl p-4
        flex flex-col
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
      "
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        color: "var(--text-main)",
      }}
    >
      {/* TOP CONTENT */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold leading-snug">
              {title || store}
            </h3>
            <div className="text-xs text-muted">
              {store}
            </div>
          </div>

          {/* VERIFIED BADGE WITH ANIMATION */}
          {verified && (
            <span
              className="
                text-xs px-2 py-0.5 rounded-full font-medium
                animate-[verifiedIn_0.5s_ease-out]
              "
              style={{
                background: "rgba(16,185,129,0.15)",
                color: "#10B981",
              }}
            >
              ✓ Verified
            </span>
          )}
        </div>

        {/* DISCOUNT */}
        <div className="mt-4">
          <div
            className="text-xl font-bold"
            style={{ color: "var(--accent)" }}
          >
            {discountText}
          </div>

          <div className="mt-2 text-xs text-muted">
            Code:{" "}
            <span className="font-mono font-medium">
              {code}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTENT — PUSHED DOWN */}
      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
        <button
          onClick={onShow}
          className="btn-gradient px-4 py-2 rounded-lg text-sm"
        >
          Show Coupon
        </button>

        <div className="text-xs text-muted">
          Expires:{" "}
          {expiryDate
            ? new Date(expiryDate).toLocaleDateString()
            : "—"}
        </div>
      </div>
    </div>
  );
}
