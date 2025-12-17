// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [savedCoupons, setSavedCoupons] = useState([]);
  const [myCoupons, setMyCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH DASHBOARD DATA ---------------- */
  useEffect(() => {
    // guard: wait until auth is ready
    if (!user || !token) return;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const authHeader = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const [savedRes, myRes] = await Promise.all([
          axios.get(`${API_BASE}/coupons/saved`, authHeader),
          axios.get(`${API_BASE}/coupons/my`, authHeader),
        ]);

        setSavedCoupons(savedRes.data?.coupons || []);
        setMyCoupons(myRes.data?.coupons || []);
      } catch (err) {
        console.error("Dashboard error:", err);

        // 🔐 token invalid or expired
        if (err.response?.status === 401) {
          logout(); // clear auth context
          navigate("/login", { replace: true });
          return;
        }

        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [user, token, logout, navigate]);

  /* ---------------- EDIT HANDLER ---------------- */
  const handleEdit = (id) => {
    navigate(`/edit-coupon/${id}`);
  };


  const handleDelete = async (id) => {
  if (!window.confirm("Delete this coupon?")) return;

  try {
    await axios.delete(`${API_BASE}/coupons/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // remove from UI instantly
    setMyCoupons((prev) => prev.filter((c) => c._id !== id));
  } catch (err) {
    console.error(err);
    alert("Failed to delete coupon");
  }
};


  /* ---------------- UI STATES ---------------- */
  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-muted">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-400">
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
          Welcome back, {user.name || user.email}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Saved Coupons" value={savedCoupons.length} />
        <StatCard title="My Coupons" value={myCoupons.length} />
        <StatCard title="Account Status" value="Active" accent />
      </div>

      {/* COUPONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SAVED */}
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

        {/* MY COUPONS */}
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
    onDelete={handleDelete}
  />
))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

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

function CouponRow({ coupon, editable = false, onEdit, onDelete }) {
  return (
    <div className="card-default p-4 flex justify-between items-center gap-4">
      <div>
        <p className="font-medium">
          {coupon.title || coupon.store}
        </p>
        <p className="text-sm text-muted">
          Code: {coupon.code}
        </p>
      </div>

      {editable && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(coupon._id)}
            className="px-3 py-1.5 text-sm rounded-lg btn-gradient"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(coupon._id)}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
