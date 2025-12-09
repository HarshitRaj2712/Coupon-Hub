// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddCoupon from './pages/AddCoupon';
import AdminReports from './pages/AdminReports';

import Navbar from './components/Navbar';
import SecondaryNav from './components/SecondaryNav';
import ProtectedRoute from './components/ProtectedRoute';
import FooterPro from './components/FooterPro';
import './App.css';

function LayoutWrapper({ children }) {
  const location = useLocation();

  const hideFooter = ["/login", "/signup"].includes(location.pathname);
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  // padding state (px)
  const [topOffset, setTopOffset] = useState(64); // default fallback

  useEffect(() => {
    function measure() {
      const nav = document.getElementById("main-navbar");
      const sec = document.getElementById("secondary-nav");

      const navRect = nav?.getBoundingClientRect();
      const secRect = sec?.getBoundingClientRect();

      const navH = navRect?.height || 0;
      let secH = 0;

      if (sec && navRect && secRect) {
        const navBottom = navRect.bottom;
        const secVisible = secRect.bottom > navBottom + 1;
        secH = secVisible ? secRect.height : 0;
      }

      const total = Math.ceil(navH + secH);
      setTopOffset(total);
    }

    measure();

    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });

    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      clearTimeout(t);
    };
  }, []);

  const wrapperStyle = {
    paddingTop: `${topOffset}px`,
    minHeight: isAuthPage ? "100vh" : undefined,
  };

  const wrapperClass = isAuthPage ? "" : "container mx-auto p-4";

  return (
    <>
      <Navbar />
      <SecondaryNav />

      <div className={wrapperClass} style={wrapperStyle}>
        {children}
      </div>

      {!hideFooter && <FooterPro />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/admin/reports" element={<AdminReports />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* NEW: Add Coupon (login required) */}
            <Route
              path="/add-coupon"
              element={
                <ProtectedRoute>
                  <AddCoupon />
                </ProtectedRoute>
              }
            />
          </Routes>
        </LayoutWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}
