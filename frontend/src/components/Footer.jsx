// src/components/Footer.jsx
import React, { useState } from "react";
import { Instagram, Twitter, Facebook, Linkedin, Mail } from "lucide-react";

/**
 * Footer.jsx
 * Responsive footer with:
 * - logo + short description
 * - quick links (stores, categories)
 * - newsletter signup (frontend only)
 * - social icons
 * - legal links + copyright
 *
 * Usage: place <Footer /> at bottom of App (under Router/containers)
 *
 * Note: requires `lucide-react` for icons (npm i lucide-react)
 */

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | 'ok' | 'error' | 'sending'

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setTimeout(() => setStatus(null), 2000);
      return;
    }

    setStatus("sending");
    // Frontend-only: store in localStorage for demo. Replace with API call later.
    try {
      const key = "newsletter_subscribers";
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ email, ts: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(arr.slice(-500)));
      setStatus("ok");
      setEmail("");
      setTimeout(() => setStatus(null), 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const stores = ["Amazon", "Flipkart", "Myntra", "Zomato", "Swiggy"];
  const categories = ["Electronics", "Fashion", "Food", "Travel", "Beauty"];

  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div>
            <div className="text-2xl font-bold text-indigo-600">CouponHub</div>
            <p className="mt-3 text-sm text-gray-600">
              Find verified coupons and the best discounts across top stores. Save time and money — all deals in one place.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a aria-label="Follow on Facebook" href="#" className="hover:text-indigo-600">
                <Facebook size={18} />
              </a>
              <a aria-label="Follow on Twitter" href="#" className="hover:text-indigo-600">
                <Twitter size={18} />
              </a>
              <a aria-label="Follow on Instagram" href="#" className="hover:text-indigo-600">
                <Instagram size={18} />
              </a>
              <a aria-label="Follow on LinkedIn" href="#" className="hover:text-indigo-600">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick links - Stores */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Top Stores</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {stores.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("filters", { detail: { store: s } }))}
                    className="hover:underline"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick links - Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("filters", { detail: { category: c } }))}
                    className="hover:underline"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-3">Get weekly deals, hand-picked coupons and alerts.</p>

            <form onSubmit={handleNewsletter} className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="flex-1">
                <div className="relative">
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full p-2 pl-10 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </div>
                </div>
                <div className="mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
                {status === "ok" && <div className="mt-2 text-sm text-green-600">Subscribed — thank you!</div>}
                {status === "error" && <div className="mt-2 text-sm text-red-600">Please enter a valid email.</div>}
              </div>
            </form>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} CouponHub. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-gray-600 hover:underline">About</a>
            <a href="#" className="text-gray-600 hover:underline">Contact</a>
            <a href="#" className="text-gray-600 hover:underline">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:underline">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
