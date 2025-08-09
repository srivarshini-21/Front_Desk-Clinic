'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token & role
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', 'admin');

        router.push('/dashboard');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white/90 p-4 sm:p-6 rounded-lg shadow max-w-xs sm:max-w-md w-full mx-2">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-text-dark">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-accent text-white w-full py-2 rounded text-sm sm:text-base"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
