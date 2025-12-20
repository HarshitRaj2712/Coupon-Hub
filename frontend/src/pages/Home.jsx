// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CouponList from "../components/CouponList";
import HeroSlider from "../components/HeroSlider";
import TopStores from "../components/TopStores";

const API_BASE = "https://coupon-hub-1.onrender.com/api";

export default function Home() {
  const [coupons, setCoupons] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    store: null,
    category: null,
    q: "",
  });

  /* ---------------- FETCH COUPONS ---------------- */
  useEffect(() => {
    async function fetchCoupons() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/coupons`);
        setCoupons(res.data.coupons || []);
        setFiltered(res.data.coupons || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load coupons");
      } finally {
        setLoading(false);
      }
    }
    fetchCoupons();
  }, []);

  /* ---------------- APPLY FILTERS ---------------- */
  useEffect(() => {
    let list = [...coupons];

    if (filters.store) {
      list = list.filter((c) => c.store === filters.store);
    }

    if (filters.category) {
      list = list.filter((c) => c.category === filters.category);
    }

    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.store?.toLowerCase().includes(q) ||
          c.code?.toLowerCase().includes(q)
      );
    }

    setFiltered(list);
  }, [filters, coupons]);

  /* ---------------- GLOBAL EVENTS ---------------- */
  useEffect(() => {
    const onFilter = (e) =>
      setFilters((prev) => ({ ...prev, ...e.detail }));

    const onSearch = (e) =>
      setFilters((prev) => ({ ...prev, q: e.detail.q || "" }));

    window.addEventListener("filters", onFilter);
    window.addEventListener("globalSearch", onSearch);

    return () => {
      window.removeEventListener("filters", onFilter);
      window.removeEventListener("globalSearch", onSearch);
    };
  }, []);

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className="text-center py-20 text-muted">
        Loading coupons…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HERO */}
      <HeroSlider />

      {/* TOP STORES */}
      <TopStores coupons={coupons} />

      {/* Coupons */}
          <section id="coupons-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Deals of the Day
              </h2>

              {(filters.store || filters.category || filters.q) && (
                <button
                  onClick={() =>
                    setFilters({ store: null, category: null, q: "" })
                  }
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* SHOW ONLY 10 COUPONS */}
            <CouponList coupons={filtered.slice(0, 10)} />
          </section>

    </div>
  );
}
