import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { isAdmin } from "../utils/auth";
import CouponCard from "../components/CouponCard";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  /* ================= SUMMARY DATA ================= */
  const totalCoupons = coupons.length;

  const totalSaves = coupons.reduce(
    (sum, c) => sum + (c.savesCount || 0),
    0
  );

  const totalViews = coupons.reduce(
    (sum, c) => sum + (c.views || 0),
    0
  );

  /* ================= BAR CHART DATA ================= */
  const topSavedCoupons = coupons
    .filter((c) => (c.savesCount || 0) > 0)
    .sort((a, b) => b.savesCount - a.savesCount)
    .slice(0, 5)
    .map((c) => ({
      name: c.title || c.store,
      saves: c.savesCount,
    }));

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

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card-default p-5">
          <div className="text-xs text-muted">Total Coupons</div>
          <div
            className="text-2xl font-bold mt-1"
            style={{ color: "var(--accent)" }}
          >
            {totalCoupons}
          </div>
        </div>

        <div className="card-default p-5">
          <div className="text-xs text-muted">Total Saves</div>
          <div
            className="text-2xl font-bold mt-1"
            style={{ color: "var(--accent)" }}
          >
            {totalSaves}
          </div>
        </div>

        <div className="card-default p-5">
          <div className="text-xs text-muted">Total Views</div>
          <div
            className="text-2xl font-bold mt-1"
            style={{ color: "var(--accent)" }}
          >
            {totalViews}
          </div>
        </div>
      </div>

      {/* ================= BAR CHART ================= */}
      {topSavedCoupons.length > 0 && (
        <div className="card-default p-5 mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Top Saved Coupons
          </h2>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSavedCoupons}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="saves"
                  fill="var(--accent)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ================= COUPON LIST ================= */}
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
