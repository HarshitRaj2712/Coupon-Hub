import React from "react";
import {
  Shield,
  Info,
  User,
  Eye,
  Lock,
  Sliders,
  Cookie,
  AlertTriangle,
  RefreshCcw,
  Mail,
  Phone,
} from "lucide-react";

export default function Privacy() {
  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)]">

      {/* ================= HERO ================= */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#F1E7E4] to-[var(--bg-main)]">
        <div className="flex justify-center mb-4">
          <Shield size={36} style={{ color: "var(--accent)" }} />
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-5">
          Privacy Policy
        </h1>

        <p className="max-w-3xl mx-auto text-sm md:text-base text-[var(--text-muted)]">
          At CouponHub, your privacy is our priority. This Privacy Policy
          explains how we collect, use, protect, and share your information
          when you use our platform.
        </p>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-6">

          <PolicyCard
            icon={<Info />}
            title="1. Introduction"
            content={
              <>
                This Privacy Policy applies to all users of CouponHub,
                including our website and related services. We are committed
                to protecting your personal information and being transparent
                about how we use it.
              </>
            }
          />

          <PolicyCard
            icon={<User />}
            title="2. Information We Collect"
            content={
              <>
                <ul className="list-disc ml-5 space-y-1">
                  <li>
                    <strong>Personal Information:</strong> Name, email,
                    password, profile details provided during registration.
                  </li>
                  <li>
                    <strong>Coupon & Activity Data:</strong> Coupons posted,
                    saved coupons, searches, and interactions.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Device information, IP address,
                    browser type, and pages visited.
                  </li>
                  <li>
                    <strong>Communications:</strong> Messages sent via forms or
                    email support.
                  </li>
                </ul>
              </>
            }
          />

          <PolicyCard
            icon={<Eye />}
            title="3. How We Use Your Information"
            content={
              <>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Create and manage user accounts.</li>
                  <li>Display and personalize coupon content.</li>
                  <li>Improve platform performance and usability.</li>
                  <li>Send important updates and security alerts.</li>
                </ul>
              </>
            }
          />

          <PolicyCard
            icon={<UsersIcon />}
            title="4. Sharing Your Information"
            content={
              <>
                We do not sell your personal data. Information may be shared:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>With other users (public profile & coupons).</li>
                  <li>With trusted service providers.</li>
                  <li>If required by law or legal process.</li>
                  <li>During business transfers or mergers.</li>
                </ul>
              </>
            }
          />

          <PolicyCard
            icon={<Lock />}
            title="5. Data Security"
            content={
              <>
                We use industry-standard security practices including
                encryption, secure servers, and access controls. However, no
                online system is 100% secure.
              </>
            }
          />

          <PolicyCard
            icon={<Sliders />}
            title="6. Your Rights and Choices"
            content={
              <>
                You may:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Access and update your account details.</li>
                  <li>Request account or data deletion.</li>
                  <li>Opt out of marketing communications.</li>
                  <li>Request a copy of your data.</li>
                </ul>
              </>
            }
          />

          <PolicyCard
            icon={<Cookie />}
            title="7. Cookies and Tracking"
            content={
              <>
                CouponHub uses cookies to improve user experience and analyze
                traffic. You can manage cookies through your browser settings.
              </>
            }
          />

          <PolicyCard
            icon={<AlertTriangle />}
            title="8. Children’s Privacy"
            content={
              <>
                CouponHub is not intended for users under 18. We do not
                knowingly collect data from minors.
              </>
            }
          />

          <PolicyCard
            icon={<RefreshCcw />}
            title="9. Changes to This Policy"
            content={
              <>
                We may update this Privacy Policy periodically. Continued use
                of CouponHub after updates means you accept the changes.
              </>
            }
          />

          <PolicyCard
            icon={<Mail />}
            title="10. Contact Us"
            content={
              <>
                If you have questions about this Privacy Policy:
                <div className="mt-2 space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail size={14} /> support@couponhub.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> +91 12345 67890
                  </p>
                </div>
                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  Last updated: November 2025
                </p>
              </>
            }
          />

        </div>
      </section>
    </div>
  );
}

/* ================= POLICY CARD ================= */
function PolicyCard({ icon, title, content }) {
  return (
    <div className="card-default p-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="text-sm text-[var(--text-muted)] leading-relaxed">
        {content}
      </div>
    </div>
  );
}

/* Icon fix */
function UsersIcon() {
  return <span className="text-lg">👥</span>;
}
