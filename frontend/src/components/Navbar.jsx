// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { isAdmin } from "../utils/auth";

import {
  Search,
  ChevronDown,
  Sun,
  Moon,
  TicketPercent,
  User,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const admin = isAdmin(user);

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);           // mobile search
  const [profileOpen, setProfileOpen] = useState(false); // profile dropdown

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  /* ================= THEME ================= */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  /* ================= SEARCH ================= */
  const submitSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;

    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/");
  };

  const avatarInitial = (str) =>
    str ? str.trim().charAt(0).toUpperCase() : "?";

  /* ================= UI ================= */
  return (
    <header
      className="fixed top-0 left-0 w-full z-[9999]"
      style={{
        background: "var(--bg-panel)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* TOP BAR */}
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            }}
          >
            <TicketPercent size={16} color="#fff" />
          </div>

          <span
            className="text-xl font-extrabold tracking-wide"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            COUPON-HUB
          </span>
        </Link>

        {/* MOBILE RIGHT ICONS */}
        <div className="flex items-center gap-2 md:hidden">
          {/* SEARCH */}
          <button
            onClick={() => {
              setOpen(true);
              setProfileOpen(false);
            }}
            className="p-2 rounded-full hover:bg-[var(--bg-muted)]"
          >
            <Search size={20} />
          </button>

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--bg-muted)]"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* USER / LOGIN */}
          {user ? (
            <button
              ref={profileRef}
              onClick={() => setProfileOpen((p) => !p)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              {avatarInitial(user.name || user.email)}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="p-2 rounded-full hover:bg-[var(--bg-muted)]"
            >
              <User size={20} />
            </button>
          )}
        </div>

        {/* DESKTOP SEARCH */}
        <form
          onSubmit={submitSearch}
          className="hidden md:flex flex-1 max-w-lg mx-6"
        >
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 rounded-md input-default text-sm"
            />
          </div>
        </form>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border hover:bg-[var(--bg-muted)]"
            style={{ borderColor: "var(--border-color)" }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-[var(--bg-muted)]"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {avatarInitial(user.name || user.email)}
                </div>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-2"
                  style={{
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {admin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-[var(--bg-muted)]"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-[var(--bg-muted)]"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-muted)]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-full text-sm hover:bg-[var(--bg-muted)]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-gradient px-4 py-1.5 rounded-full text-sm"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH PANEL */}
      {open && (
        <div
          ref={menuRef}
          className="md:hidden border-t"
          style={{
            background: "var(--bg-panel)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="p-4">
            <form onSubmit={submitSearch}>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="w-full p-2 rounded-md input-default text-sm"
              />
            </form>
          </div>
        </div>
      )}

      {/* MOBILE PROFILE DROPDOWN */}
      {profileOpen && user && (
        <div
          className="md:hidden border-t"
          style={{
            background: "var(--bg-panel)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="p-4 space-y-3 text-sm">
            {admin && (
              <Link
                to="/admin"
                onClick={() => setProfileOpen(false)}
                className="block"
              >
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/dashboard"
              onClick={() => setProfileOpen(false)}
              className="block"
            >
              Dashboard
            </Link>

            <button onClick={handleLogout} className="block w-full text-left">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
