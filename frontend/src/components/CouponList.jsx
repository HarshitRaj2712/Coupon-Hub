// src/components/CouponList.jsx
import React, { useState } from "react";
import CouponCard from "./CouponCard";
import CouponModal from "./CouponModal";

export default function CouponList({ coupons = [] }) {
  const [modalCoupon, setModalCoupon] = useState(null);

  if (!Array.isArray(coupons) || coupons.length === 0) {
    return (
      <div
        className="text-center py-16 text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        No coupons found.
      </div>
    );
  }

  return (
    <>
      {/* GRID — items-stretch enables equal-height cards */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
          items-stretch
        "
      >
        {coupons.map((c) => (
          <CouponCard
            key={c._id || c.code}
            coupon={c}
            onShow={() => setModalCoupon(c)}
          />
        ))}
      </div>

      {/* MODAL */}
      {modalCoupon && (
        <CouponModal
          coupon={modalCoupon}
          onClose={() => setModalCoupon(null)}
        />
      )}
    </>
  );
}
