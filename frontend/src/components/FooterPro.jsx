// src/components/FooterPro.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ArrowUp,
} from "lucide-react";

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
      className="mt-auto text-white"
      style={{ background: "var(--footer-bg)" }}
    >
      <div className="container mx-auto px-6 py-10">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* BRAND */}
          <div>
            <h3 className="text-xl font-extrabold text-white">
              Coupon-Hub
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white">
              Connecting shoppers with the best deals.
              Save more, shop smarter — all in one place.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-4 flex gap-3">
              {[
                { Icon: Facebook, link: "https://facebook.com" },
                { Icon: Twitter, link: "https://twitter.com" },
                { Icon: Instagram, link: "https://instagram.com" },
                { Icon: Linkedin, link: "https://linkedin.com" },
                { Icon: Github, link: "https://github.com" },
              ].map(({ Icon, link }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover:bg-white/10 transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="font-semibold mb-3 text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-white hover:underline" to="/">Home</Link></li>
              <li><Link className="text-white hover:underline" to="/about">About</Link></li>
              <li><Link className="text-white hover:underline" to="/contact">Help Center</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="font-semibold mb-3 text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-white hover:underline" to="/how-to-find-deals">How to Find Deals</Link></li>
              <li><Link className="text-white hover:underline" to="/how-listing-works">How Listing Works</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-semibold mb-3 text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-white hover:underline" to="/privacy">Privacy</Link></li>
              <li><Link className="text-white hover:underline" to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 border-t border-white/20 pt-4 text-center text-sm text-white">
          © {new Date().getFullYear()} Coupon-Hub · All Rights Reserved
        </div>
      </div>

      {/* BACK TO TOP */}
      <button
        onClick={scrollTop}
        className={`fixed right-6 bottom-6 p-3 rounded-full shadow-lg transition ${
          showBack ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "#ffffff", color: "#6F1D2C" }}
      >
        <ArrowUp size={16} />
      </button>
    </footer>
  );
}
