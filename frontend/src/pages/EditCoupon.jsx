// src/pages/EditCoupon.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const API_BASE = "http://localhost:5000/api";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Food",
  "Travel",
  "Groceries",
  "Beauty",
  "Education",
  "Entertainment",
  "Other",
];

export default function EditCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    store: "",
    category: "",
    code: "",
    description: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- FETCH COUPON ---------------- */
  useEffect(() => {
    async function fetchCoupon() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/coupons/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            },
          }
        );

        const c = res.data.coupon;
        setForm({
          title: c.title || "",
          store: c.store || "",
          category: c.category || "",
          code: c.code || "",
          description: c.description || "",
          expiryDate: c.expiryDate
            ? c.expiryDate.slice(0, 10)
            : "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load coupon");
      } finally {
        setLoading(false);
      }
    }

    fetchCoupon();
  }, [id, token]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  /* ---------------- UPDATE COUPON ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.put(
        `${API_BASE}/coupons/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Coupon updated successfully");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Update failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className="py-20 text-center text-muted">
        Loading coupon…
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-heading font-bold mb-2">
        Edit Coupon
      </h1>

      <p className="text-sm text-muted mb-6">
        Update your coupon details
      </p>

      <form
        onSubmit={handleSubmit}
        className="card-default p-5 space-y-4"
      >
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-2 rounded input-default"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">
              Store *
            </label>
            <input
              name="store"
              value={form.store}
              onChange={handleChange}
              required
              className="w-full p-2 rounded input-default"
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full p-2 rounded input-default"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
              className="w-full p-2 rounded input-default"
            />
          </div>
        </div>

        {/* CODE */}
        <div>
          <label className="text-sm block mb-1">
            Coupon Code *
          </label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full p-2 rounded input-default font-mono"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm block mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded input-default"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-gradient px-5 py-2 rounded-md text-sm"
          >
            {saving ? "Saving..." : "Update Coupon"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-md text-sm border"
            style={{ borderColor: "var(--border-color)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
