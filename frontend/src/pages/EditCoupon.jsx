import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const API_BASE = "http://localhost:5000/api";

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

  /* FETCH COUPON */
  useEffect(() => {
    async function fetchCoupon() {
      try {
        const res = await axios.get(
          `${API_BASE}/coupons/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  /* UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.put(
        `${API_BASE}/coupons/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    return <div className="py-20 text-center">Loading coupon…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Coupon</h1>

      <form onSubmit={handleSubmit} className="space-y-4 card-default p-5">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="input-default w-full"
        />

        <input
          name="store"
          value={form.store}
          onChange={handleChange}
          placeholder="Store"
          required
          className="input-default w-full"
        />

        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Code"
          required
          className="input-default w-full font-mono"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="input-default w-full"
        />

        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
          className="input-default w-full"
        />

        <button
          disabled={saving}
          className="btn-gradient px-6 py-2"
        >
          {saving ? "Saving..." : "Update Coupon"}
        </button>
      </form>
    </div>
  );
}
