import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { Navigate, Link } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  if (user) return <Navigate to="/chats" />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-glass backdrop-blur-xs">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-accent">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          required
        />
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-accent hover:bg-blue-400 text-white p-2 rounded font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-3 text-sm text-gray-400">
          No account? <Link to="/register" className="text-accent underline">Register</Link>
        </div>
      </form>
    </div>
  );
}
