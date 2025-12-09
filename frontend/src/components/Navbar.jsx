// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Menu, X, Search, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function clickOutside(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [open]);

  useEffect(() => {
    function handleOutside(e) {
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileOpen]);

  // submitSearch: dispatch global search event, navigate to home, optionally close mobile menu
  const submitSearch = (e, closeMobile = false) => {
    e?.preventDefault();
    // dispatch event other parts of app listen to
    window.dispatchEvent(new CustomEvent("globalSearch", { detail: { q } }));
    if (closeMobile) setOpen(false);
    // navigate to home (where search results render)
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const avatarInitial = (str) =>
    str ? String(str).trim().charAt(0).toUpperCase() : "?";

  return (
    <header
      id="main-navbar"
      className="fixed top-0 left-0 w-full z-[9999] backdrop-blur-md"
      style={{
        background: "rgba(26,26,26,0.85)",
        color: "#F5EDE0",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between text-beige">
        {/* LEFT: Logo + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden p-2 rounded hover:bg-[#2A2A2A]"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} color="#F5EDE0" /> : <Menu size={22} color="#F5EDE0" />}
          </button>

          <Link
            to="/"
            className="text-2xl font-heading font-bold tracking-wide"
            style={{ color: "#F5EDE0" }}
          >
            Coupon-Wala
          </Link>
        </div>

        {/* CENTER: Search Bar (Desktop-only) */}
        <form
          onSubmit={(e) => submitSearch(e, false)}
          className="hidden md:flex flex-1 max-w-xl mx-6 items-center"
        >
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search coupons, stores or codes..."
              className="w-full p-2 pl-10 rounded-full bg-[#2A2A2A] text-[#F5EDE0] border border-[#3A3A3A] placeholder-gray-400 focus:ring-2 focus:ring-[#E8DCC7]"
              aria-label="Search coupons"
            />
          </div>

          <button
            type="submit"
            className="ml-3 px-4 py-2 rounded-full text-[#1A1A1A] font-semibold"
            style={{ backgroundColor: "#F5EDE0" }}
          >
            Search
          </button>
        </form>

        {/* RIGHT: Profile or Login/Signup */}
        <div className="hidden md:flex items-center gap-5 text-[#F5EDE0]">
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-[#2A2A2A]"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: "#F5EDE0", color: "#1A1A1A" }}
                >
                  {avatarInitial(user.name || user.email)}
                </div>

                <span>
                  Hi,{" "}
                  <span className="font-semibold" style={{ color: "#E8DCC7" }}>
                    {(user.name || user.email).split(" ")[0]}
                  </span>
                </span>

                <ChevronDown size={16} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-md shadow-xl py-2"
                  style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A" }}
                  role="menu"
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-[#F5EDE0] hover:bg-[#2A2A2A]"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-[#F5EDE0] hover:bg-[#2A2A2A]"
                    role="menuitem"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-[#F5EDE0] hover:bg-[#2A2A2A]"
                    role="menuitem"
                  >
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-[#F5EDE0] hover:bg-[#2A2A2A]"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="hover:text-[#E8DCC7]" to="/login">Login</Link>
              <Link
                to="/signup"
                className="px-4 py-1 rounded-full text-[#1A1A1A] font-semibold"
                style={{ backgroundColor: "#F5EDE0" }}
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* MOBILE SEARCH ICON */}
        <div className="md:hidden">
          <button
            onClick={() => {
              const qEl = document.getElementById("mobile-search-input");
              if (qEl) qEl.focus();
            }}
            aria-label="Open mobile search"
            className="p-2 rounded hover:bg-[#2A2A2A]"
          >
            <Search size={20} color="#F5EDE0" />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
      )}

      {/* MOBILE MENU */}
      <nav
        ref={menuRef}
        className={`md:hidden fixed top-0 left-0 w-full p-5 z-50 transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          backgroundColor: "rgba(26,26,26,0.90)",
          backdropFilter: "blur(8px)",
          color: "#F5EDE0",
        }}
        aria-hidden={!open}
      >
        {/* Mobile Search */}
        <form onSubmit={(e) => submitSearch(e, true)}>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
            <input
              id="mobile-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-full p-3 pl-10 rounded-full bg-[#2A2A2A] text-[#F5EDE0] border border-[#3A3A3A]"
              aria-label="Mobile search"
            />
          </div>
        </form>

        {/* MENU ITEMS */}
        <ul className="space-y-4">
          <li><button onClick={() => { setOpen(false); navigate("/"); }} className="hover:text-[#E8DCC7]">Home</button></li>
          <li><button onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('filters', { detail: { category: 'Electronics' } })); }} className="hover:text-[#E8DCC7]">Electronics</button></li>
          <li><button onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('filters', { detail: { category: 'Fashion' } })); }} className="hover:text-[#E8DCC7]">Fashion</button></li>
          <li><button onClick={() => { setOpen(false); navigate('/dashboard'); }} className="hover:text-[#E8DCC7]">Dashboard</button></li>
        </ul>

        {/* FOOTER ACTIONS */}
        <div className="mt-6 border-t border-[#2A2A2A] pt-4 flex justify-between">
          {user ? (
            <>
              <span>Hi, {user.name || user.email}</span>
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="px-4 py-1 border border-[#3A3A3A] rounded hover:bg-[#2A2A2A]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="px-4 py-1 rounded-full text-[#1A1A1A]"
                style={{ backgroundColor: "#F5EDE0" }}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
