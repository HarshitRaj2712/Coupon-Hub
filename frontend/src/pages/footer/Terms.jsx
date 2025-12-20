import React from "react";
import {
  FileText,
  CheckCircle,
  Layers,
  UserCheck,
  Lock,
  AlertTriangle,
  Copyright,
  Shield,
  Slash,
  Power,
  Scale,
  RefreshCcw,
  Mail,
  Phone,
} from "lucide-react";

export default function Terms() {
  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)]">

      {/* ================= HERO ================= */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#F1E7E4] to-[var(--bg-main)]">
        <div className="flex justify-center mb-4">
          <FileText size={36} style={{ color: "var(--accent)" }} />
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-5">
          Terms of Service
        </h1>

        <p className="max-w-3xl mx-auto text-sm md:text-base text-[var(--text-muted)]">
          Welcome to CouponHub. These Terms of Service govern your use of our
          platform. By accessing or using CouponHub, you agree to be bound by
          these terms. Please read them carefully.
        </p>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-6">

          <TermCard
            icon={<CheckCircle />}
            title="1. Acceptance of Terms"
            content={
              <>
                By registering or using CouponHub, you confirm that you have
                read, understood, and agree to these Terms of Service and our
                Privacy Policy. If you do not agree, please do not use the
                platform.
              </>
            }
          />

          <TermCard
            icon={<Layers />}
            title="2. Description of Service"
            content={
              <>
                CouponHub is an online platform that allows users to discover,
                share, and save discount coupons and deals. Our services
                include:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Browsing and searching coupons</li>
                  <li>Posting and managing coupons</li>
                  <li>Saving favorite deals</li>
                  <li>User authentication and profiles</li>
                </ul>
              </>
            }
          />

          <TermCard
            icon={<UserCheck />}
            title="3. User Eligibility"
            content={
              <>
                You must be at least 18 years old to use CouponHub. By using the
                platform, you represent that you are legally capable of
                entering into binding agreements.
              </>
            }
          />

          <TermCard
            icon={<Lock />}
            title="4. Account Registration and Security"
            content={
              <>
                You are responsible for maintaining the confidentiality of
                your account credentials. You agree to:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Provide accurate account information</li>
                  <li>Keep your login credentials secure</li>
                  <li>Notify us of unauthorized account use</li>
                </ul>
                CouponHub reserves the right to suspend accounts that violate
                these terms.
              </>
            }
          />

          <TermCard
            icon={<AlertTriangle />}
            title="5. User Conduct"
            content={
              <>
                You agree not to misuse the platform. Prohibited actions
                include:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Posting false, misleading, or harmful content</li>
                  <li>Harassment or abusive behavior</li>
                  <li>Unauthorized data collection</li>
                  <li>Using the platform for illegal activities</li>
                </ul>
              </>
            }
          />

          <TermCard
            icon={<Copyright />}
            title="6. Content and Intellectual Property"
            content={
              <>
                You retain ownership of content you post, but grant CouponHub
                a non-exclusive license to display and distribute it. All
                platform branding, logos, and software are protected
                intellectual property.
              </>
            }
          />

          <TermCard
            icon={<Shield />}
            title="7. Privacy"
            content={
              <>
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect, use, and protect your
                information.
              </>
            }
          />

          <TermCard
            icon={<Slash />}
            title="8. Disclaimers and Limitation of Liability"
            content={
              <>
                CouponHub is provided “as is.” We do not guarantee the accuracy
                of coupons or availability of deals. We are not liable for
                losses arising from use of the platform.
              </>
            }
          />

          <TermCard
            icon={<Power />}
            title="9. Termination"
            content={
              <>
                You may terminate your account at any time. CouponHub reserves
                the right to suspend or terminate accounts that violate these
                terms.
              </>
            }
          />

          <TermCard
            icon={<Scale />}
            title="10. Governing Law"
            content={
              <>
                These Terms are governed by the laws of India. Any disputes
                shall be subject to the jurisdiction of Indian courts.
              </>
            }
          />

          <TermCard
            icon={<RefreshCcw />}
            title="11. Changes to Terms"
            content={
              <>
                We may update these Terms from time to time. Continued use of
                CouponHub after changes constitutes acceptance of the updated
                terms.
              </>
            }
          />

          <TermCard
            icon={<Mail />}
            title="12. Contact Information"
            content={
              <>
                If you have questions about these Terms:
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

/* ================= TERM CARD ================= */
function TermCard({ icon, title, content }) {
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
