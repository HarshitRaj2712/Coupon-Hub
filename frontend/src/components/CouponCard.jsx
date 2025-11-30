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
    verified
  } = coupon;

  const discountText = discountType === "percent"
    ? `${discountValue}% OFF`
    : discountType === "free-shipping"
      ? "Free Delivery"
      : discountValue ? `₹${discountValue} OFF` : "Deal";

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{title || store}</h3>
            <div className="text-xs text-gray-500">{store}</div>
          </div>
          {verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>}
        </div>

        <div className="mt-3">
          <div className="text-lg font-bold text-indigo-600">{discountText}</div>
          <div className="mt-2 text-xs text-gray-500">Code: <span className="font-mono">{code}</span></div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          onClick={onShow}
          className="px-3 py-2 bg-orange-500 text-white rounded-md text-sm"
        >
          Show Coupon
        </button>

        <div className="text-xs text-gray-400">
          Expires: {expiryDate ? new Date(expiryDate).toLocaleDateString() : "—"}
        </div>
      </div>
    </div>
  );
}
