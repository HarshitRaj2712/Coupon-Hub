// src/components/FooterPro.jsx
import React, { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { trackEvent } from "../utils/analytics";

/**
 * Compact FooterPro (Beige + Dark Gray)
 * - smaller, compact layout
 * - newsletter + social icons + simple links
 * - back-to-top button
 */

const BEIGE = "#F5EDE0";
const ACCENT = "#E8DCC7";
const DARK_BG = "#1A1A1A";
const PANEL_BG = "rgba(26,26,26,0.92)";

export default function FooterPro() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBack(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setSubmitting(true);
    trackEvent("newsletter_subscribe_attempt", null, { email });
    try {
      await new Promise((res) => setTimeout(res, 700));
      const key = "newsletter_subscribers";
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ email, ts: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(arr.slice(-200)));
      toast.success("Subscribed — check your inbox!");
      trackEvent("newsletter_subscribe_success", null, { email });
      setEmail("");
    } catch (err) {
      toast.error("Subscription failed");
      trackEvent("newsletter_subscribe_fail", null, { email, err: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      style={{ background: PANEL_BG, color: BEIGE }}
      className="mt-12"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Brand + short */}
          <div>
            <div className="flex items-center gap-3">
              <div style={{ color: BEIGE }} className="text-xl font-heading font-bold">Coupon-Wala</div>
            </div>
            <p className="mt-2 text-sm" style={{ color: ACCENT }}>
              Curated coupons and verified deals. Save time — save money.
            </p>

            <div className="mt-4 flex gap-3">
              <a aria-label="Facebook" href="#" className="p-2 rounded hover:bg-[#222] transition" style={{ color: BEIGE }}>
                <Facebook size={16} />
              </a>
              <a aria-label="Twitter" href="#" className="p-2 rounded hover:bg-[#222] transition" style={{ color: BEIGE }}>
                <Twitter size={16} />
              </a>
              <a aria-label="Instagram" href="#" className="p-2 rounded hover:bg-[#222] transition" style={{ color: BEIGE }}>
                <Instagram size={16} />
              </a>
              <a aria-label="LinkedIn" href="#" className="p-2 rounded hover:bg-[#222] transition" style={{ color: BEIGE }}>
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold" style={{ color: BEIGE }}>Get top deals</h4>
            <p className="text-xs mt-1 mb-3" style={{ color: ACCENT }}>Weekly newsletter — curated coupons & exclusive offers.</p>
            <form onSubmit={subscribe} className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">Email</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 p-2 rounded-md text-sm bg-[#111] placeholder:opacity-60 border border-[#2a2a2a]"
                style={{ color: BEIGE }}
                aria-label="Subscribe email"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-2 rounded-md font-semibold transition"
                style={{ background: BEIGE, color: DARK_BG }}
              >
                {submitting ? "..." : "Subscribe"}
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold" style={{ color: BEIGE }}>Quick Links</h4>
            <ul className="mt-2 space-y-2 text-sm" style={{ color: ACCENT }}>
              <li><a href="#" className="hover:underline">Browse Coupons</a></li>
              <li><a href="#" className="hover:underline">Add a Coupon</a></li>
              <li><a href="#" className="hover:underline">Help / FAQ</a></li>
              <li><a href="#" className="hover:underline">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-8 border-t border-[#222] pt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm" style={{ color: ACCENT }}>
            © {new Date().getFullYear()} Coupon-Wala — All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-sm" style={{ color: ACCENT }}>
            <a href="#" className="hover:underline">Advertise</a>
            <a href="#" className="hover:underline">Sitemap</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`fixed right-5 bottom-5 z-50 p-3 rounded-full shadow-lg transform transition-opacity ${showBack ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: BEIGE, color: DARK_BG }}
      >
        <ArrowUp size={16} />
      </button>
    </footer>
  );
}
