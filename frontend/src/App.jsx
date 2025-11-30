// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import SecondaryNav from './components/SecondaryNav';
import ProtectedRoute from './components/ProtectedRoute';
import AdminReports from './pages/AdminReports';
import Footer from './components/Footer';
import FooterPro from './components/FooterPro';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <SecondaryNav />
        
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/reports" element={<AdminReports/>} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* add coupon detail, admin routes etc */}
          </Routes>
        </div>
        {/* <Footer /> */}
        <FooterPro />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
