// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-semibold">CouponHub</Link>
        </div>

        {/* center search left out for brevity - keep your existing search here if needed */}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">Hi, <strong>{user.name || user.email}</strong></span>
              <button onClick={logout} className="px-3 py-1 border rounded text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 border rounded text-sm">Login</Link>
              <Link to="/signup" className="px-3 py-1 rounded bg-green-500 text-white text-sm">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
