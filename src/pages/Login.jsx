import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import client from '../lib/axios';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1: Get the CSRF Cookie
      // Hitting this endpoint ensures the XSRF-TOKEN cookie is set in the browser
      await client.get('/sanctum/csrf-cookie'); 

      // 2: Submit Credentials
      await client.post('/login', { email, password });

      // 3: Fetch the authenticated user data
      const userResponse = await client.get('/user');
      setUser(userResponse.data); // Update App.jsx state, triggering redirect to Dashboard
      
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.email?.[0] || 'Login failed. Check credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-love-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <Heart className="mx-auto text-love-500 fill-love-100" size={36} />
          <h1 className="text-3xl font-serif font-bold text-gray-800 mt-3">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to OurSpace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-start font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder='yourname@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-love-500 outline-none transition-all"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm text-start font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-love-500 outline-none transition-all"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <button type="submit"
            disabled={loading}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <a href="/register" className="text-love-500 font-medium hover:underline">Register Here</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;