import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={handle} className="space-y-3">
        <input
          type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email" required
          className="w-full p-2 border rounded"
        />
        <input
          type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
          placeholder="Password" required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-3 text-sm">Don't have an account? <Link to="/signup" className="text-indigo-600">Sign up</Link></p>
    </div>
  );
}
