// src/components/TopStores.jsx
import React from "react";

/* ================= STORE LOGO MAP =================
   Place logos in: public/logos/
   Example:
   public/logos/amazon.png
   public/logos/flipkart.png
=================================================== */
const STORE_LOGOS = {
  Amazon: "/public/amazon.png",
  Flipkart: "/public/flipkart.png",
  Myntra: "/public/myntra.png",
  Swiggy: "/public/swiggy.png",
  Zomato: "/public/zomato.png",
};

export default function TopStores({ coupons = [] }) {
  /* BUILD STORE → COUNT MAP */
  const storeMap = coupons.reduce((acc, c) => {
    if (!c.store) return acc;
    acc[c.store] = (acc[c.store] || 0) + 1;
    return acc;
  }, {});

  const stores = Object.keys(storeMap);

  const onPick = (store) => {
    window.dispatchEvent(
      new CustomEvent("filters", { detail: { store } })
    );
  };

  if (!stores.length) return null;

  return (
    <section className="my-12">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            Top Stores
          </h2>
          
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {stores.map((store) => (
            <div key={store} className="relative group">
              <button
                onClick={() => onPick(store)}
                className="w-full rounded-2xl p-4 text-sm font-medium transition-all
                           hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "var(--bg-panel)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-main)",
                }}
              >
                {/* LOGO CONTAINER */}
                <div
                  className="w-12 h-12 mx-auto mb-2 rounded-full
                             flex items-center justify-center"
                  style={{
                    background: "var(--accent-soft)",
                  }}
                >
                  {STORE_LOGOS[store] ? (
                    <img
                      src={STORE_LOGOS[store]}
                      alt={`${store} logo`}
                      loading="lazy"             // ✅ LAZY LOADING
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    /* FALLBACK LETTER */
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "var(--accent)" }}
                    >
                      {store[0]}
                    </span>
                  )}
                </div>

                {/* STORE NAME */}
                <div className="text-center truncate">
                  {store}
                </div>
              </button>

              {/* COUPON COUNT BADGE */}
              <div
                className="pointer-events-none absolute -top-2 right-2 px-2 py-1
                           rounded-md text-xs font-semibold opacity-0 scale-95
                           transition-all group-hover:opacity-100 group-hover:scale-100"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                }}
              >
                {storeMap[store]} coupons
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
