// src/components/CouponList.jsx
import React, { useState } from "react";
import CouponCard from "./CouponCard";
import CouponModal from "./CouponModal";

export default function CouponList({ coupons = [] }) {
  const [modalCoupon, setModalCoupon] = useState(null);

  const openModal = (coupon) => setModalCoupon(coupon);
  const closeModal = () => setModalCoupon(null);

  if (!Array.isArray(coupons) || coupons.length === 0) {
    return <div className="text-center py-12 text-gray-500">No coupons found.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <CouponCard key={c._id || c.code} coupon={c} onShow={() => openModal(c)} />
        ))}
      </div>

      {modalCoupon && <CouponModal coupon={modalCoupon} onClose={closeModal} />}
    </div>
  );
}
