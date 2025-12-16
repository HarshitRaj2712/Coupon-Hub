// src/components/SecondaryNav.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoginRequiredModal from "./LoginRequiredModal";

const NAVBAR_HEIGHT = 53; // must match Navbar height

export default function SecondaryNav() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // static for now
  const stores = ["Amazon", "Flipkart", "Myntra", "Swiggy", "Zomato"];
  const categories = ["Electronics", "Fashion", "Food", "Travel"];

  const [openStore, setOpenStore] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const storeRef = useRef(null);
  const categoryRef = useRef(null);

  // close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        storeRef.current &&
        !storeRef.current.contains(e.target) &&
        categoryRef.current &&
        !categoryRef.current.contains(e.target)
      ) {
        setOpenStore(false);
        setOpenCategory(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const applyFilter = (type, value) => {
    window.dispatchEvent(
      new CustomEvent("filters", { detail: { [type]: value } })
    );
    setOpenStore(false);
    setOpenCategory(false);
    navigate("/");
  };

  const handleAddCoupon = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      navigate("/add-coupon");
    }
  };

  return (
    <>
      {/* SECONDARY NAV */}
      <div
        id="secondary-nav"
        className="fixed left-0 w-full"
        style={{
          top: `${NAVBAR_HEIGHT}px`,
          background: "var(--bg-panel)",
          borderBottom: "2px solid var(--border-color)", // 🔥 thicker border
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          color: "var(--text-main)",
          zIndex: 900,
        }}
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between text-sm">
          {/* LEFT */}
          <div className="flex items-center gap-10">
            {/* STORES */}
            <div className="relative" ref={storeRef}>
              <button
                onClick={() => {
                  setOpenStore((s) => !s);
                  setOpenCategory(false);
                }}
                className="flex items-center gap-1 font-semibold hover:opacity-80"
              >
                Stores <ChevronDown size={16} />
              </button>

              {openStore && (
                <div
                  className="absolute left-0 mt-3 w-48 rounded-xl shadow-lg overflow-hidden"
                  style={{
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {stores.map((s) => (
                    <div
                      key={s}
                      onClick={() => applyFilter("store", s)}
                      className="px-4 py-2 cursor-pointer hover:bg-[var(--bg-muted)]"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CATEGORIES */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => {
                  setOpenCategory((c) => !c);
                  setOpenStore(false);
                }}
                className="flex items-center gap-1 font-semibold hover:opacity-80"
              >
                Categories <ChevronDown size={16} />
              </button>

              {openCategory && (
                <div
                  className="absolute left-0 mt-3 w-48 rounded-xl shadow-lg overflow-hidden"
                  style={{
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {categories.map((c) => (
                    <div
                      key={c}
                      onClick={() => applyFilter("category", c)}
                      className="px-4 py-2 cursor-pointer hover:bg-[var(--bg-muted)]"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={handleAddCoupon}
            className="btn-gradient px-6 py-2 rounded-full font-semibold"
          >
            + Add Coupon
          </button>
        </div>
      </div>

      {/* LOGIN REQUIRED MODAL */}
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
