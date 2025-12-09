// src/components/TopStores.jsx
import React, { useMemo } from "react";
import dummyCoupons from "../data/dummyCoupons";
import { ShoppingBag } from "lucide-react";

export default function TopStores({ limit = 24 }) {
  const { stores, counts } = useMemo(() => {
    const map = new Map();
    dummyCoupons.forEach((c) => {
      const name = c.store || "Unknown";
      map.set(name, (map.get(name) || 0) + 1);
    });
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return {
      stores: sorted.map(([name]) => name).slice(0, limit),
      counts: Object.fromEntries(sorted.slice(0, limit)),
    };
  }, [limit]);

  const logoFor = (store) =>
    `/stores/${store.toLowerCase().replace(/\s+/g, "-")}.png`;

  const onPick = (store) => {
    window.dispatchEvent(new CustomEvent("filters", { detail: { store } }));
    const el = document.querySelector("#coupons-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!stores?.length) return null;

  return (
    <section className="my-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-[#F5EDE0]">Top Stores</h1>
          <div className="text-sm text-[#E8DCC7]">Browse by store</div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {stores.map((store) => {
            const count = counts[store] || 0;

            return (
              <button
                key={store}
                onClick={() => onPick(store)}
                className="relative group bg-[#0f0f10] hover:shadow-lg border border-[#2a2a2a] rounded-lg p-3 flex flex-col items-center gap-2 text-center transition transform hover:-translate-y-1"
                aria-label={`View ${count} coupons from ${store}`}
                title={`${store} – ${count} coupon${count !== 1 ? "s" : ""}`}
              >
                {/* Store Logo */}
                <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center overflow-hidden relative">
                  <img
                    src={logoFor(store)}
                    alt={`${store} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentNode;
                      if (!parent.querySelector(".fallback-init")) {
                        const div = document.createElement("div");
                        div.className = "fallback-init text-[#E8DCC7] text-lg font-semibold";
                        div.textContent = store[0]?.toUpperCase() || "?";
                        parent.appendChild(div);
                      }
                    }}
                  />
                </div>

                <div className="text-sm font-medium text-[#F5EDE0] truncate max-w-[90px]">
                  {store}
                </div>

                {/* Hover overlay with coupon count */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded">
                    <ShoppingBag size={16} />
                    <span className="text-sm font-semibold">
                      {count} coupon{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

             
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
