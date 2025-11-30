// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import DealsOfDay from "../components/DealsOfDay";
import TopStores from "../components/TopStores";
import CouponList from "../components/CouponList";
import dummyCoupons from "../data/dummyCoupons";

/**
 * Home page
 * - Shows HeroSlider, DealsOfDay, TopStores, and the CouponList
 * - Listens for globalSearch, filters and showDeal custom events
 * - Uses dummyCoupons (frontend-only) as the data source
 */

export default function Home() {
  const [coupons, setCoupons] = useState([]);
  const [q, setQ] = useState("");
  const [activeFilters, setActiveFilters] = useState({ store: "", category: "" });

  // utility: apply current search + filters to dummyCoupons
  const applyAll = ({ search = q, store = activeFilters.store, category = activeFilters.category } = {}) => {
    let list = dummyCoupons.slice();

    // apply store filter
    if (store) list = list.filter((c) => (c.store || "").toLowerCase() === store.toLowerCase());

    // apply category filter
    if (category) {
      list = list.filter((c) => (c.category || "").toLowerCase() === category.toLowerCase());
    }

    // apply search query
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c.title || "").toLowerCase().includes(s) ||
          (c.store || "").toLowerCase().includes(s) ||
          (c.code || "").toLowerCase().includes(s)
      );
    }

    setCoupons(list);
  };

  useEffect(() => {
    // initial load
    setCoupons(dummyCoupons);

    // handlers
    const onSearch = (e) => {
      const query = e?.detail?.q ?? "";
      setQ(query);
      applyAll({ search: query, store: activeFilters.store, category: activeFilters.category });
    };

    const onFilters = (e) => {
      const { store = "", category = "" } = e?.detail || {};
      const newFilters = { store, category };
      setActiveFilters(newFilters);
      applyAll({ search: q, store, category });
    };

    const onShowDeal = (e) => {
      const { couponId } = e?.detail || {};
      if (!couponId) return;
      const found = dummyCoupons.find((c) => c._id === couponId);
      if (found) {
        setCoupons([found]);
      }
    };

    window.addEventListener("globalSearch", onSearch);
    window.addEventListener("filters", onFilters);
    window.addEventListener("showDeal", onShowDeal);

    return () => {
      window.removeEventListener("globalSearch", onSearch);
      window.removeEventListener("filters", onFilters);
      window.removeEventListener("showDeal", onShowDeal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // When activeFilters change via other means, reapply (keeps state consistent)
  useEffect(() => {
    applyAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  return (
    <div>
      <HeroSlider />

      <div className="container mx-auto px-4">
        <DealsOfDay />
        <TopStores />

        <div id="coupons-section" className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{coupons.length}</span> coupon{coupons.length !== 1 ? "s" : ""}
              </div>
              {(activeFilters.store || activeFilters.category || q) && (
                <div className="mt-1 text-xs text-gray-500">
                  {activeFilters.store && <span className="mr-2">Store: <strong>{activeFilters.store}</strong></span>}
                  {activeFilters.category && <span className="mr-2">Category: <strong>{activeFilters.category}</strong></span>}
                  {q && <span>Search: <strong>{q}</strong></span>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // reset filters & search
                  setQ("");
                  setActiveFilters({ store: "", category: "" });
                  setCoupons(dummyCoupons);
                }}
                className="px-3 py-1 border rounded text-sm"
              >
                Clear all
              </button>
            </div>
          </div>

          <CouponList coupons={Array.isArray(coupons) ? coupons : []} />
        </div>
      </div>
    </div>
  );
}
