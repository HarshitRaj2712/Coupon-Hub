import React from "react";
import {
  Search,
  Plus,
  Home,
  Mail,
  MessageCircle,
  Phone,
  HelpCircle,
} from "lucide-react";

export default function Contact() {
  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)]">

      {/* ================= HERO ================= */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#F1E7E4] to-[var(--bg-main)]">
        <div className="flex justify-center mb-4">
          <HelpCircle size={36} style={{ color: "var(--accent)" }} />
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-5">
          Help Center
        </h1>

        <p className="max-w-3xl mx-auto text-sm md:text-base text-[var(--text-muted)]">
          Your go-to resource for navigating CouponHub. Find quick answers,
          learn tips, and get support for a smooth saving experience.
        </p>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="py-16 px-4">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-center mb-10">
          Quick Actions
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            icon={<Plus />}
            title="How to Add a Coupon"
            text="Learn how to submit a coupon so others can save money easily."
          />
          <ActionCard
            icon={<Home />}
            title="How to Find Coupons"
            text="Discover how to browse, search, and filter the best deals."
          />
        </div>
      </section>

      {/* ================= SEARCH + CATEGORIES ================= */}
      

      {/* ================= STILL NEED HELP ================= */}
      <section className="py-20 px-4">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-4">
          Still Need Help?
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-12">
          Reach out to us for personalized support.
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <SupportCard
            icon={<Mail />}
            title="Email Support"
            text="support@couponhub.com"
            sub="Response within 24 hours"
          />
          <SupportCard
            icon={<MessageCircle />}
            title="Community Forum"
            text="Join the CouponHub community"
            sub="Ask questions & share tips"
          />
          <SupportCard
            icon={<Phone />}
            title="Phone Support"
            text="+91 80000 00000"
            sub="Mon–Fri, 9 AM – 6 PM"
          />
        </div>
      </section>

      {/* ================= SUPPORT INFO ================= */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto card-default p-6 text-sm text-[var(--text-muted)]">
          <strong className="text-[var(--text-main)]">
            Support Hours & Tips
          </strong>
          <p className="mt-2">
            Our support team is available Monday–Friday, 9 AM – 6 PM (IST).
            For faster resolution, include your registered email and coupon
            details when contacting us.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function ActionCard({ icon, title, text }) {
  return (
    <div className="card-default p-6 flex gap-4 items-start hover:shadow-xl transition">
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

function SupportCard({ icon, title, text, sub }) {
  return (
    <div className="card-default p-6 text-center hover:shadow-xl transition">
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
        }}
      >
        {icon}
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm">{text}</p>
      <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>
    </div>
  );
}
