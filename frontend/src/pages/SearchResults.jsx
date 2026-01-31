import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CouponCard from "../components/CouponCard";
import CouponSkeleton from "../components/CouponSkeleton";

const API_BASE = "https://coupon-hub-1.onrender.com/api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;

    async function fetchResults() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/coupons?search=${encodeURIComponent(q)}`
        );
        setCoupons(res.data.coupons);
      } catch {
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [q]);

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
            <CouponCard key={c._id} coupon={c} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No results found.</p>
      )}
    </div>
  );
}
