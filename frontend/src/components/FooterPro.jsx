// src/components/FooterPro.jsx
import React, { useEffect, useState } from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  ArrowUp,
  Globe,
  CreditCard,
  Smartphone,
  Sun,
  Moon
} from "lucide-react";
import toast from "react-hot-toast";
import { trackEvent } from "../utils/analytics";

/**
 * FooterPro.jsx
 * Enhanced footer with:
 * - theme toggle (dark/light) persisted in localStorage
 * - back-to-top button
 * - language & currency selectors (UI-only)
 * - newsletter with validation + simulated submit
 * - store logos row + sitemap + legal links
 * - accessible (aria labels), keyboard friendly
 *
 * Requirements:
 * - Tailwind configured with dark mode = 'class' (see notes below)
 * - lucide-react and react-hot-toast installed
 * - Optional: place store logos under /public/stores/<slug>.png
 */

const STORES = ["Amazon", "Flipkart", "Myntra", "Zomato", "Swiggy", "Redbus"];
const CATEGORIES = ["Electronics", "Fashion", "Food", "Travel", "Beauty"];
const LANGUAGES = ["EN", "HI", "ES"];
const CURRENCIES = ["INR", "USD", "EUR"];

const logoFor = (s) => `/stores/${s.toLowerCase().replace(/\s+/g, "-")}.png`;

export default function FooterPro() {
  // theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || LANGUAGES[0]);
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || CURRENCIES[0]);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    // apply theme class to html root
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    const onScroll = () => setShowBack(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // newsletter handler (simulated async)
  const subscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    trackEvent("newsletter_subscribe_attempt", null, { email });
    try {
      // simulate network delay / async request
      await new Promise((res) => setTimeout(res, 900));
      // store locally for demo
      const key = "newsletter_subscribers";
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ email, ts: new Date().toISOString(), lang, currency });
      localStorage.setItem(key, JSON.stringify(arr.slice(-500)));
      toast.success("Subscribed! Check your inbox.");
      trackEvent("newsletter_subscribe_success", null, { email, lang, currency });
      setEmail("");
    } catch (err) {
      toast.error("Subscription failed. Try again.");
      trackEvent("newsletter_subscribe_fail", null, { email, err: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const onPickStore = (s) => {
    window.dispatchEvent(new CustomEvent("filters", { detail: { store: s } }));
    trackEvent("footer_store_click", null, { store: s });
    // scroll to coupons section if present
    const el = document.querySelector("#coupons-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-t dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Brand & Promo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">CouponHub</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Find verified coupons & deals</div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              Save money with verified coupons, curated deals and personalized alerts.
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => { setTheme(t => t === "dark" ? "light" : "dark"); trackEvent("theme_toggle", null, { to: theme === "dark" ? "light" : "dark" }); }}
                aria-label="Toggle theme"
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                title="Toggle dark / light"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <div className="flex items-center gap-2 text-sm">
                <Globe size={14} />
                <select
                  value={lang}
                  onChange={(e) => { setLang(e.target.value); trackEvent("language_change", null, { lang: e.target.value }); }}
                  className="bg-transparent text-sm focus:outline-none"
                  aria-label="Select language"
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CreditCard size={14} />
                <select
                  value={currency}
                  onChange={(e) => { setCurrency(e.target.value); trackEvent("currency_change", null, { currency: e.target.value }); }}
                  className="bg-transparent text-sm focus:outline-none"
                  aria-label="Select currency"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <Smartphone size={18} />
              <div>
                <div className="text-sm font-semibold">Get the app</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Coming soon — mobile app for auto-apply</div>
              </div>
            </div>
          </div>

          {/* Top stores */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Top Stores</h4>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
              {STORES.map((s) => (
                <button
                  key={s}
                  onClick={() => onPickStore(s)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
                  aria-label={`Filter by ${s}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={logoFor(s)}
                      alt={`${s} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentNode.textContent = s[0] || "?"; }}
                    />
                  </div>
                  <div className="text-sm">{s}</div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { window.dispatchEvent(new CustomEvent("filters", { detail: { category: cat } })); trackEvent("footer_category_click", null, { category: cat }); }}
                    className="text-xs px-3 py-1 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter & social */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Subscribe for deals</h4>

            <form onSubmit={subscribe} className="flex gap-2">
              <label htmlFor="fp-email" className="sr-only">Email address</label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="flex-1 p-2 rounded-md border bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
                disabled={submitting}
              >
                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">We send only the best offers. Unsubscribe anytime.</div>

            <div className="mt-4 flex items-center gap-3">
              <a aria-label="Facebook" href="#" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Facebook size={18} />
              </a>
              <a aria-label="Twitter" href="#" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Twitter size={18} />
              </a>
              <a aria-label="Instagram" href="#" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Instagram size={18} />
              </a>
              <a aria-label="LinkedIn" href="#" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Sitemap / legal quick links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:underline">About us</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Help / FAQ</a></li>
            </ul>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Legal</h4>
              <div className="text-sm space-y-2">
                <a href="#" className="block hover:underline">Privacy Policy</a>
                <a href="#" className="block hover:underline">Terms of Use</a>
                <a href="#" className="block hover:underline">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 border-t dark:border-gray-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} CouponHub. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm hover:underline">Advertise</a>
            <a href="#" className="text-sm hover:underline">Sitemap</a>
            <a href="#" className="text-sm hover:underline">Press</a>
          </div>
        </div>
      </div>

      {/* Back to top floating */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`fixed right-5 bottom-5 z-50 p-3 rounded-full shadow-lg bg-indigo-600 text-white transform transition-opacity ${
          showBack ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
