// src/components/TopStores.jsx
import React from "react";
import dummyCoupons from "../data/dummyCoupons";

/**
 * TopStores
 * - shows a grid of store tiles (logo circle + name)
 * - clicking a tile fires a 'filters' event with { store: <storeName> }
 * - you can place this below DealsOfDay in Home.jsx
 */
export default function TopStores({ limit = 12 }) {
  // derive unique stores and optionally map to logo paths
  const stores = Array.from(new Set(dummyCoupons.map(c => c.store))).slice(0, limit);

  // optional mapping for logos placed in public/stores/<key>.png
  const logoFor = (store) => {
    const key = store.toLowerCase().replace(/\s+/g, "-");
    return `/stores/${key}.png`; // put images in public/stores/
  };

  const onPick = (store) => {
    window.dispatchEvent(new CustomEvent("filters", { detail: { store } }));
    // optionally scroll to coupons section
    const el = document.querySelector("#coupons-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!stores || stores.length === 0) return null;

  return (
    <section className="my-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Stores</h2>
          <div className="text-sm text-gray-500">Browse by store</div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {stores.map(store => (
            <button
              key={store}
              onClick={() => onPick(store)}
              className="bg-white hover:shadow-md border rounded-lg p-3 flex flex-col items-center gap-2 text-center transition"
              aria-label={`View coupons from ${store}`}
            >
              {/* logo: try image; fallback to initial */}
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={logoFor(store)}
                  alt={`${store} logo`}
                  onError={(e) => {
                    // fallback to showing initial when image missing
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentNode;
                    if (parent) parent.textContent = store[0] || "?";
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-sm font-medium text-gray-700">{store}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
