// src/components/FooterPro.jsx
import React, { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
} from "lucide-react";

/*
  Footer styled to match Roomzy reference
  - Solid burgundy background
  - White text
  - Same look in light & dark mode
*/

export default function FooterPro() {
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBack(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      style={{
        background: "var(--footer-bg)",
        color: "var(--footer-text)",
      }}
      className="mt-20"
    >
      <div className="container mx-auto px-6 py-10">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div>
            <h3 className="text-xl font-extrabold">Coupon-Hub</h3>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--footer-muted)" }}
            >
              Connecting shoppers with the best deals.
              Save more, shop smarter — all in one place.
            </p>

            <div className="mt-4 flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social"
                    className="p-2 rounded-md hover:bg-white/10 transition"
                  >
                    <Icon size={16} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Help Center</a></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">How to Find Deals</a></li>
              <li><a href="#" className="hover:underline">How Listing Works</a></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 border-t border-white/20 pt-4 text-center text-sm">
          © {new Date().getFullYear()} Coupon-Hub · All Rights Reserved
        </div>
      </div>

      {/* BACK TO TOP */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`fixed right-6 bottom-6 p-3 rounded-full shadow-lg transition ${
          showBack ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "#ffffff",
          color: "#6F1D2C",
        }}
      >
        <ArrowUp size={16} />
      </button>
    </footer>
  );
}
