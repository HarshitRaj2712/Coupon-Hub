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

import About from "./pages/footer/About";
import Contact from "./pages/footer/Contact";
import Privacy from "./pages/footer/Privacy";
import HowToFindDeals from "./pages/footer/HowToFindDeals";
import HowListingWorks from "./pages/footer/HowListingWorks";
import Terms from "./pages/footer/Terms";
import FAQ from "./pages/footer/FAQ";

import Navbar from './components/Navbar';
import SecondaryNav from './components/SecondaryNav';
import ProtectedRoute from './components/ProtectedRoute';
import FooterPro from './components/FooterPro';
import './App.css';

function LayoutWrapper({ children }) {
  const location = useLocation();

  const hideFooter = ["/login", "/signup"].includes(location.pathname);
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  const [topOffset, setTopOffset] = useState(64);

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

      setTopOffset(Math.ceil(navH + secH));
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  const wrapperStyle = {
    paddingTop: `${topOffset}px`,
  };

  const wrapperClass = isAuthPage ? "" : "container mx-auto p-4";

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP */}
      <Navbar />
      <SecondaryNav />

      {/* CONTENT */}
      <main className="flex-1">
        <div className={wrapperClass} style={wrapperStyle}>
          {children}
        </div>
      </main>

      {/* FOOTER */}
      {!hideFooter && <FooterPro />}
    </div>
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

            <Route
              path="/add-coupon"
              element={
                <ProtectedRoute>
                  <AddCoupon />
                </ProtectedRoute>
              }
            />

            {/* Footer routes */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/how-to-find-deals" element={<HowToFindDeals />} />
            <Route path="/how-listing-works" element={<HowListingWorks />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </LayoutWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}
