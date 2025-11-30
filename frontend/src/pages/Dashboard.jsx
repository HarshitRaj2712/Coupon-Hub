// src/pages/Dashboard.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="mt-2">Welcome back, {user?.name || user?.email}.</p>
      {/* show saved coupons, user-submitted coupons, analytics */}
    </div>
  );
}
