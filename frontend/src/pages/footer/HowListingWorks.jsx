import React from "react";
import { PlusCircle, Edit, ShieldCheck, Globe } from "lucide-react";

export default function HowListingWorks() {
  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)]">

      {/* HERO */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#F1E7E4] to-[var(--bg-main)]">
        <div className="flex justify-center mb-4">
          <PlusCircle size={36} style={{ color: "var(--accent)" }} />
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
          How Listing Works
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-[var(--text-muted)]">
          Learn how users can add, manage, and share coupons on CouponHub.
        </p>
      </section>

      {/* STEPS */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">

          <StepCard
            icon={<PlusCircle />}
            title="Add a Coupon"
            text="Logged-in users can submit coupons by filling out a simple form with details."
          />

          <StepCard
            icon={<Edit />}
            title="Edit or Update"
            text="You can update your coupon anytime if details change or a deal expires."
          />

          <StepCard
            icon={<ShieldCheck />}
            title="Verification"
            text="Coupons may be reviewed to ensure accuracy and reliability."
          />

          <StepCard
            icon={<Globe />}
            title="Visible to Everyone"
            text="Once listed, coupons become available for all users to discover and save."
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
