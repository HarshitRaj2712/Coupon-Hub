import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Signup() {
  const { signup, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup({ name, email, password });
      // signup now navigates to /login itself
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded bg-white shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={handle} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required className="w-full p-2 border rounded" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full p-2 bg-green-600 text-white rounded" disabled={loading}>
          {loading ? 'Creating...' : 'Sign up'}
        </button>
      </form>
      <p className="mt-3 text-sm">Already registered? <Link to="/login" className="text-indigo-600">Login</Link></p>
    </div>
  );
}
