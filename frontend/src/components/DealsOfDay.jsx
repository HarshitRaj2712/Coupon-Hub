// src/components/DealsOfDay.jsx
import React from "react";

/**
 * DealsOfDay
 * - shows a horizontal row of "deal cards"
 * - scrolls horizontally on small screens (swipe)
 * - clicking "View" will broadcast showDeal event (Home listens)
 *
 * Props:
 * - coupons: array of coupons from backend
 * - limit: number of deals to show
 */
export default function DealsOfDay({ coupons = [], limit = 8 }) {
  if (!Array.isArray(coupons) || coupons.length === 0) return null;

  // choose top deals: active + highest discount first
  const deals = coupons
    .filter(c => new Date(c.expiryDate) > new Date()) // active only
    .sort((a, b) => {
      const va =
        a.discountType === "percent"
          ? a.discountValue
          : a.discountValue
          ? a.discountValue / 100
          : 0;

      const vb =
        b.discountType === "percent"
          ? b.discountValue
          : b.discountValue
          ? b.discountValue / 100
          : 0;

      return vb - va;
    })
    .slice(0, limit);

  if (deals.length === 0) return null;

  return (
    <section className="my-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Deals of the Day</h2>
          <div className="text-sm text-gray-500">
            Hand-picked offers just for you
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-4 py-2 w-max">
            {deals.map((deal) => (
              <div
                key={deal._id}
                className="min-w-[220px] bg-white rounded-lg shadow-sm border p-4 flex-shrink-0"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-sm font-semibold">
                    {deal.store?.[0] || "?"}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {deal.title || deal.store}
                    </div>
                    <div className="text-xs text-gray-500">
                      {deal.store}
                    </div>

                    <div className="mt-2 text-indigo-600 font-bold">
                      {deal.discountType === "percent"
                        ? `${deal.discountValue}% OFF`
                        : deal.discountType === "free-shipping"
                        ? "Free Delivery"
                        : deal.discountValue
                        ? `₹${deal.discountValue} OFF`
                        : "Deal"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("showDeal", {
                          detail: { couponId: deal._id },
                        })
                      )
                    }
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
                  >
                    View
                  </button>

                  <div className="text-xs text-gray-400">
                    Expires:{" "}
                    {deal.expiryDate
                      ? new Date(deal.expiryDate).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
