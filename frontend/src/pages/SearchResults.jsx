import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CouponCard from "../components/CouponCard";
import CouponSkeleton from "../components/CouponSkeleton";
import CouponModal from "../components/CouponModal";
import LoginRequiredModal from "../components/LoginRequiredModal";
import { AuthContext } from "../contexts/AuthContext";

const API_BASE = "https://coupon-hub-1.onrender.com/api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const { user, token } = useContext(AuthContext);
  const accessToken = token || localStorage.getItem("token");

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  /* ================= FETCH SEARCH RESULTS ================= */
  useEffect(() => {
    if (!q) return;

    async function fetchResults() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/coupons?search=${encodeURIComponent(q)}`
        );
        setCoupons(res.data.coupons || []);
      } catch (err) {
        console.error("Search fetch failed", err);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [q]);

  /* ================= SHOW COUPON ================= */
  const handleShowCoupon = (coupon) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setActiveCoupon(coupon);
  };

  /* ================= SAVE COUPON ================= */
  const handleSave = async (id) => {
    if (!accessToken) {
      setShowLogin(true);
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/coupons/${id}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setCoupons((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                savedBy: [...(c.savedBy || []), user._id],
              }
            : c
        )
      );
    } catch (err) {
      console.error("Save coupon failed", err);
    }
  };

  /* ================= UNSAVE COUPON ================= */
  const handleUnsave = async (id) => {
    if (!accessToken) {
      setShowLogin(true);
      return;
    }

    try {
      await axios.delete(
        `${API_BASE}/coupons/${id}/save`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setCoupons((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                savedBy: (c.savedBy || []).filter(
                  (uid) => uid !== user._id
                ),
              }
            : c
        )
      );
    } catch (err) {
      console.error("Unsave coupon failed", err);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <h1 className="text-xl font-semibold mb-4">
        Search results for “{q}”
      </h1>

      {loading ? (
        <CouponSkeleton />
      ) : coupons.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <CouponCard
              key={c._id}
              coupon={c}
              onShow={() => handleShowCoupon(c)}
              onSave={() => handleSave(c._id)}
              onUnsave={() => handleUnsave(c._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted">No results found.</p>
      )}

      {/* LOGIN REQUIRED MODAL */}
      <LoginRequiredModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
      />

      {/* COUPON MODAL */}
      {activeCoupon && (
        <CouponModal
          coupon={activeCoupon}
          onClose={() => setActiveCoupon(null)}
        />
      )}
    </div>
  );
}
