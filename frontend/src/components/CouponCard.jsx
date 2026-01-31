import React, { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { isAdmin } from "../utils/auth";
import toast from "react-hot-toast";

export default function CouponCard({ coupon = {}, onShow = () => {} }) {
  const {
    _id,
    code = "—",
    title = "",
    store = "Store",
    discountType,
    discountValue,
    expiryDate,
    verified,
  } = coupon;

  const { user } = useContext(AuthContext);
  const admin = isAdmin(user);
  const [deleting, setDeleting] = useState(false);

  const discountText =
    discountType === "percent"
      ? `${discountValue}% OFF`
      : discountType === "free-shipping"
      ? "Free Delivery"
      : discountValue
      ? `₹${discountValue} OFF`
      : "Deal";

  /* ================= ADMIN DELETE ================= */
  const handleAdminDelete = async () => {
    if (!window.confirm("Delete this coupon permanently?")) return;

    try {
      setDeleting(true);
      await api.delete(`/coupons/admin/${_id}`);
      toast.success("Coupon deleted");
      window.location.reload(); // simple & safe for now
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

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

          {/* VERIFIED BADGE */}
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

      {/* BOTTOM CONTENT */}
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

      {/* ADMIN ACTION */}

      {admin && (
        <div className="mt-2 flex gap-4 text-xs text-muted">
          <span>👁 {coupon.views || 0} views</span>
          <span>⭐ {coupon.savesCount || 0} saves</span>
        </div>
      )}



      {admin && (
        <button
          onClick={handleAdminDelete}
          disabled={deleting}
          className="
            mt-3 text-xs text-red-600 hover:underline
            disabled:opacity-50
          "
        >
          {deleting ? "Deleting..." : "Delete (Admin)"}
        </button>
      )}
    </div>
  );
}
