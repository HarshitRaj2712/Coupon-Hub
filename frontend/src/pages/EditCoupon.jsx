import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const API_BASE = "https://coupon-hub-1.onrender.com/api";

export default function EditCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const accessToken = token || localStorage.getItem("token");

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

  /* ================= FETCH COUPON ================= */
  useEffect(() => {
    async function fetchCoupon() {
      try {
        const res = await axios.get(
          `${API_BASE}/coupons/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const c = res.data.coupon;
        setForm({
          title: c.title,
          store: c.store,
          category: c.category || "",
          code: c.code,
          description: c.description || "",
          expiryDate: c.expiryDate.slice(0, 10),
        });
      } catch {
        toast.error("Failed to load coupon");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchCoupon();
  }, [id, accessToken, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.put(
        `${API_BASE}/coupons/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Coupon updated");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-muted">
        Loading coupon…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold">
          Edit Coupon
        </h1>
        <p className="text-sm text-muted mt-1">
          Update coupon details carefully
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="card-default p-6 space-y-4"
      >
        {/* TITLE */}
        <div>
          <label className="text-sm block mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Flat 20% off on shoes"
            className="input-default w-full px-4 py-2 rounded-md"
          />
        </div>

        {/* STORE */}
        <div>
          <label className="text-sm block mb-1">Store *</label>
          <input
            name="store"
            value={form.store}
            onChange={handleChange}
            required
            placeholder="Amazon, Flipkart…"
            className="input-default w-full px-4 py-2 rounded-md"
          />
        </div>

        {/* CODE */}
        <div>
          <label className="text-sm block mb-1">Coupon Code *</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="SAVE20"
            className="input-default w-full px-4 py-2 rounded-md font-mono"
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
            placeholder="Terms, min order value, etc."
            className="input-default w-full px-4 py-2.5 rounded-md"
          />
        </div>

        {/* EXPIRY */}
        <div>
          <label className="text-sm block mb-1">Expiry Date *</label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            required
            className="input-default w-full px-4 py-2 rounded-md"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-gradient px-6 py-2 rounded-md"
          >
            {saving ? "Saving..." : "Update Coupon"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="
              px-6 py-2 rounded-md border transition
              border-gray-400 dark:border-gray-600
              text-[#6F1D2C] dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800
            "
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
