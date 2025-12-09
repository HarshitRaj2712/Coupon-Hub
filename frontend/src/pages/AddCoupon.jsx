// src/pages/AddCoupon.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";

const API_BASE = "http://localhost:5000/api";

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

      const res = await axios.post(
        `${API_BASE}/coupons`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true, // not required for this route, but fine
        }
      );

      toast.success("Coupon added!");
      console.log("Created coupon:", res.data.coupon);

      // reset form
      setForm({
        title: "",
        store: "",
        category: "",
        code: "",
        description: "",
        expiryDate: "",
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to add coupon";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1
        className="text-2xl font-heading font-bold mb-3"
        style={{ color: "#F5EDE0" }}
      >
        Add a Coupon
      </h1>
      <p className="text-sm mb-4" style={{ color: "#E8DCC7" }}>
        Share a coupon you discovered. We’ll help others save too.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 card-default p-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1" style={{ color: "#E8DCC7" }}>
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-[#191919] text-[#F5EDE0] border border-[#2a2a2a]"
              placeholder="Flat 20% off on shoes"
            />
          </div>

          <div>
            <label className="text-sm block mb-1" style={{ color: "#E8DCC7" }}>
              Store *
            </label>
            <input
              name="store"
              value={form.store}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-[#191919] text-[#F5EDE0] border border-[#2a2a2a]"
              placeholder="Amazon, Flipkart..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1" style={{ color: "#E8DCC7" }}>
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#191919] text-[#F5EDE0] border border-[#2a2a2a]"
              placeholder="Electronics, Fashion..."
            />
          </div>

          <div>
            <label className="text-sm block mb-1" style={{ color: "#E8DCC7" }}>
              Expiry Date *
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-[#191919] text-[#F5EDE0] border border-[#2a2a2a]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1" style={{ color: "#E8DCC7" }}>
            Coupon Code *
          </label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#191919] text-[#F5EDE0] border border-[#2a2a2a] font-mono"
            placeholder="SAVE20"
          />
        </div>

        <div>
          <label className="text-sm block mb-1" style={{ color: "#E8DCC7" }}>
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#191919] text-[#F5EDE0] border border-[#2a2a2a]"
            rows={3}
            placeholder="Min order, conditions, etc."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md font-semibold"
          style={{
            backgroundColor: loading ? "#C7BBA6" : "#F5EDE0",
            color: "#1A1A1A",
          }}
        >
          {loading ? "Saving..." : "Add Coupon"}
        </button>
      </form>
    </div>
  );
}
