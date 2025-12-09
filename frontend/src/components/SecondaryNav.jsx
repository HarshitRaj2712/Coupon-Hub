// src/components/SecondaryNav.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import dummyCoupons from "../data/dummyCoupons";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * SecondaryNav.jsx
 * - Beige + Dark Gray themed secondary navigation
 * - Stores & Categories dropdowns (accessible)
 * - Deal of the Day button and Add Coupon CTA
 * - Dropdowns close on outside click & Escape key
 */

const BEIGE = "#F5EDE0";
const ACCENT = "#E8DCC7";
const DARK_BG = "#151515";
const PANEL_BG = "rgba(21,21,21,0.7)";

export default function SecondaryNav() {
  const navigate = useNavigate();

  const stores = useMemo(
    () => Array.from(new Set(dummyCoupons.map((c) => c.store))).sort(),
    []
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Set(dummyCoupons.map((c) => c.category || "General"))
      ).sort(),
    []
  );

  const [openStore, setOpenStore] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const [dealOfDay, setDealOfDay] = useState(null);

  const storeRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    const activeDeals = dummyCoupons.filter(
      (c) => c.verified && new Date(c.expiryDate) > new Date()
    );
    setDealOfDay(activeDeals[0] || dummyCoupons[0] || null);
  }, []);

  // close dropdowns on outside click or Escape key
  useEffect(() => {
    function onDoc(e) {
      if (openStore && storeRef.current && !storeRef.current.contains(e.target)) {
        setOpenStore(false);
      }
      if (openCategory && catRef.current && !catRef.current.contains(e.target)) {
        setOpenCategory(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setOpenStore(false);
        setOpenCategory(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [openStore, openCategory]);

  const applyFilter = (type, value) => {
    window.dispatchEvent(
      new CustomEvent("filters", {
        detail: { [type]: value }
      })
    );
    navigate("/");
  };

  return (
    <div id="secondary-nav"
  className="fixed left-0 w-full h-14 z-[9998] border-b backdrop-blur-md"
  style={{
    top: "64px", // navbar height
    background: "rgba(21,21,21,0.75)",
    borderColor: "rgba(255,255,255,0.05)"
  }}
>

      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left section: Stores & Categories */}
        <div className="flex items-center gap-6">
          {/* Stores dropdown */}
          <div className="relative" ref={storeRef}>
            <button
              aria-haspopup="menu"
              aria-expanded={openStore}
              onClick={() => {
                setOpenStore((s) => !s);
                setOpenCategory(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-[#E8DCC7]"
              style={{ color: BEIGE }}
            >
              <span className="font-medium">Stores</span>
              <ChevronDown size={16} color={BEIGE} />
            </button>

            {openStore && (
              <div
                role="menu"
                aria-label="Stores"
                className="absolute mt-2 w-44 max-h-72 overflow-auto rounded-md shadow-lg"
                style={{ background: DARK_BG, border: "1px solid rgba(255,255,255,0.04)" }}
              >
                {stores.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-[#E8DCC7]">No stores</div>
                ) : (
                  stores.map((store) => (
                    <button
                      key={store}
                      role="menuitem"
                      onClick={() => {
                        setOpenStore(false);
                        applyFilter("store", store);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#222] text-[#E8DCC7]"
                    >
                      {store}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Categories dropdown */}
          <div className="relative" ref={catRef}>
            <button
              aria-haspopup="menu"
              aria-expanded={openCategory}
              onClick={() => {
                setOpenCategory((s) => !s);
                setOpenStore(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-[#E8DCC7]"
              style={{ color: BEIGE }}
            >
              <span className="font-medium">Categories</span>
              <ChevronDown size={16} color={BEIGE} />
            </button>

            {openCategory && (
              <div
                role="menu"
                aria-label="Categories"
                className="absolute mt-2 w-44 max-h-72 overflow-auto rounded-md shadow-lg"
                style={{ background: DARK_BG, border: "1px solid rgba(255,255,255,0.04)" }}
              >
                {categories.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-[#E8DCC7]">No categories</div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat}
                      role="menuitem"
                      onClick={() => {
                        setOpenCategory(false);
                        applyFilter("category", cat);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#222] text-[#E8DCC7]"
                    >
                      {cat}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right section: Deal of the Day + Add coupon */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (!dealOfDay) return;
              window.dispatchEvent(
                new CustomEvent("showDeal", {
                  detail: { couponId: dealOfDay?._id }
                })
              );
              navigate("/");
            }}
            className="px-3 py-2 rounded-md font-semibold hover:bg-[#1b1b1b] transition"
            style={{ color: ACCENT, border: "1px solid rgba(255,255,255,0.04)" }}
          >
            Deal of the Day
          </button>

          <button
            onClick={() => navigate("/add-coupon")}
            className="px-4 py-2 rounded-full font-semibold transition"
            style={{
              background: BEIGE,
              color: DARK_BG,
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)"
            }}
          >
            + Add Coupon
          </button>

        </div>
      </div>
    </div>
  );
}
