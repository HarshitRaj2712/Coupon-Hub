import React from "react";
import { Search, Filter, Bookmark, Bell } from "lucide-react";

export default function HowToFindDeals() {
  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)]">

      {/* HERO */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#F1E7E4] to-[var(--bg-main)]">
        <div className="flex justify-center mb-4">
          <Search size={36} style={{ color: "var(--accent)" }} />
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
          How to Find Deals
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-[var(--text-muted)]">
          Discover the best coupons and deals quickly using CouponHub’s smart
          search and filtering features.
        </p>
      </section>

      {/* STEPS */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">

          <StepCard
            icon={<Search />}
            title="Search for Coupons"
            text="Use the search bar to find coupons by store name, product, or coupon code."
          />

          <StepCard
            icon={<Filter />}
            title="Apply Filters"
            text="Narrow down results by store, category, or discount type to find the best deal."
          />

          <StepCard
            icon={<Bookmark />}
            title="Save Your Favorites"
            text="Save coupons you like so you can quickly access them later."
          />

          <StepCard
            icon={<Bell />}
            title="Stay Updated"
            text="Check back often for newly added coupons and limited-time deals."
          />

        </div>
      </section>
    </div>
  );
}

/* STEP CARD */
function StepCard({ icon, title, text }) {
  return (
    <div className="card-default p-6 flex gap-4 items-start">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
        }}
      >
        {icon}
      </div>

      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-[var(--text-muted)]">{text}</p>
      </div>
    </div>
  );
}
