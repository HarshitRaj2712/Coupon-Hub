// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [savedCoupons, setSavedCoupons] = useState([]);
  const [myCoupons, setMyCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH DASHBOARD DATA ---------------- */
  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const authHeader = {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        };

        const [savedRes, myRes] = await Promise.all([
          axios.get(`${API_BASE}/coupons/saved`, authHeader),
          axios.get(`${API_BASE}/coupons/my`, authHeader),
        ]);

        setSavedCoupons(savedRes.data.coupons || []);
        setMyCoupons(myRes.data.coupons || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token]);

  /* ---------------- EDIT HANDLER ---------------- */
  const handleEdit = (id) => {
    navigate(`/edit-coupon/${id}`);
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className="py-20 text-center text-muted">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-heading font-bold">
          Dashboard
        </h2>
        <p className="mt-1 text-muted">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Saved Coupons" value={savedCoupons.length} />
        <StatCard title="My Coupons" value={myCoupons.length} />
        <StatCard title="Account Status" value="Active" accent />
      </div>

      {/* COUPONS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT — SAVED */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Saved Coupons
          </h3>

          {savedCoupons.length === 0 ? (
            <p className="text-muted">No saved coupons yet.</p>
          ) : (
            <div className="space-y-3">
              {savedCoupons.map((c) => (
                <CouponRow key={c._id} coupon={c} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — MY COUPONS */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            My Coupons
          </h3>

          {myCoupons.length === 0 ? (
            <p className="text-muted">
              You haven’t added any coupons.
            </p>
          ) : (
            <div className="space-y-3">
              {myCoupons.map((c) => (
                <CouponRow
                  key={c._id}
                  coupon={c}
                  editable
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL REUSABLE COMPONENTS ---------------- */

function StatCard({ title, value, accent }) {
  return (
    <div className="card-default p-4">
      <p className="text-sm text-muted">{title}</p>
      <p
        className={`text-2xl font-bold ${
          accent ? "text-[var(--accent)]" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CouponRow({ coupon, editable = false, onEdit }) {
  return (
    <div className="card-default p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">
          {coupon.title || coupon.store}
        </p>
        <p className="text-sm text-muted">
          Code: {coupon.code}
        </p>
      </div>

      {editable && (
        <button
          onClick={() => onEdit(coupon._id)}
          className="px-3 py-1.5 text-sm rounded-lg btn-gradient"
        >
          Edit
        </button>
      )}
    </div>
  );
}
