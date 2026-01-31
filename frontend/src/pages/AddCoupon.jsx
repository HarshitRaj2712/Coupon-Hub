// src/pages/AddCoupon.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";

const API_BASE = "https://coupon-hub-1.onrender.com/api";

/* CATEGORY OPTIONS */
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

export default function AddCoupon() {
  const { user, token } = useContext(AuthContext) || {};

  const [form, setForm] = useState({
    title: "",
    store: "",
    category: "",
    code: "",
    description: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Expiry date validation
    if (!isExpiryValid(form.expiryDate)) {
      toast.error("Expiry date must be at least 2 days after today");
      return;
    }

    if (!user) {
      toast.error("Please login to add a coupon");
      return;
    }

    const accessToken = token || localStorage.getItem("token");
    if (!accessToken) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE}/coupons`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Coupon added!");

      setForm({
        title: "",
        store: "",
        category: "",
        code: "",
        description: "",
        expiryDate: "",
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add coupon";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Expiry validation helper
  function isExpiryValid(expiryDate) {
    if (!expiryDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minExpiry = new Date(today);
    minExpiry.setDate(minExpiry.getDate() + 2);

    const selectedDate = new Date(expiryDate);
    return selectedDate > minExpiry;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* HEADER */}
      <h1 className="text-2xl font-heading font-bold mb-2">
        Add a Coupon
      </h1>

      <p className="text-sm mb-6 text-muted">
        Share a coupon you discovered. Help others save money.
      </p>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="card-default p-5 space-y-4"
      >
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Flat 20% off on shoes"
              className="w-full p-2 rounded input-default"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Store *</label>
            <input
              name="store"
              value={form.store}
              onChange={handleChange}
              required
              placeholder="Amazon, Flipkart..."
              className="w-full p-2 rounded input-default"
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full p-2 rounded input-default"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
              min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]}
              className="w-full p-2 rounded input-default"
            />
          </div>
        </div>

        {/* COUPON CODE */}
        <div>
          <label className="text-sm block mb-1">Coupon Code *</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="SAVE20"
            className="w-full p-2 rounded input-default font-mono"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm block mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Min order value, conditions, etc."
            className="w-full p-2 rounded input-default"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="btn-gradient px-5 py-2 rounded-md text-sm"
        >
          {loading ? "Saving..." : "Add Coupon"}
        </button>
      </form>
    </div>
  );
}
