// src/components/DealsOfTheDay.jsx
import React, { useMemo } from "react";

export default function DealsOfTheDay({ coupons = [] }) {
  const deal = useMemo(() => {
    if (!coupons.length) return null;
    return coupons[Math.floor(Math.random() * coupons.length)];
  }, [coupons]);

  if (!deal) return null;

  return (
    <section className="mb-8">
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
          color: "#fff",
        }}
      >
        <div>
          <span className="text-xs uppercase tracking-wide opacity-80">
            Deal of the Day
          </span>
          <h3 className="text-xl font-bold mt-1">
            {deal.title || deal.store}
          </h3>
          <p className="text-sm opacity-90 mt-1">
            Save more today with this exclusive deal
          </p>
        </div>

        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("showDeal", {
                detail: { couponId: deal._id },
              })
            )
          }
          className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
        >
          View Deal
        </button>
      </div>
    </section>
  );
}
