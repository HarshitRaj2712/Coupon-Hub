import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { isAdmin } from "../utils/auth";
import CouponCard from "../components/CouponCard";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const admin = isAdmin(user);

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin) return;

    async function fetchAllCoupons() {
      try {
        setLoading(true);
        const res = await api.get("/coupons/admin/all");
        setCoupons(res.data.coupons || []);
      } catch (err) {
        toast.error("Failed to load coupons");
      } finally {
        setLoading(false);
      }
    }

    fetchAllCoupons();
  }, [admin]);

  if (!admin) {
    return (
      <div className="pt-24 text-center text-muted">
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage all coupons in the system
        </p>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-muted">Loading coupons…</p>
      ) : coupons.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <CouponCard key={c._id} coupon={c} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No coupons found.</p>
      )}
    </div>
  );
}
