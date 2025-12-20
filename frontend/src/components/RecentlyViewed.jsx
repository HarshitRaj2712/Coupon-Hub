// src/components/RecentlyViewed.jsx
import React, { useEffect, useState } from "react";

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recentCoupons")) || [];
    setItems(data);
  }, []);

  if (!items.length) return null;

  return (
    <section className="mt-12">
      <h3 className="text-lg font-semibold mb-4">
        Recently Viewed
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((c) => (
          <div
            key={c._id}
            className="min-w-[220px] rounded-xl p-4 cursor-pointer hover:-translate-y-1 transition"
            style={{
              background: "var(--bg-panel)",
              border: "1px solid var(--border-color)",
            }}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("showDeal", {
                  detail: { couponId: c._id },
                })
              )
            }
          >
            <div className="text-sm font-semibold truncate">
              {c.title || c.store}
            </div>
            <div className="text-xs text-muted mt-1">
              {c.store}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
