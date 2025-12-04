import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import client from '../lib/axios';
import { Link } from 'react-router-dom';

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
      // Log the full error for debugging
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 422) {
          // Validation errors
          const validationError = data.errors?.email?.[0] || data.errors?.password?.[0] || data.message;
          setError(validationError || 'Validation failed. Please check your input.');
        } else if (status === 401) {
          // Unauthorized - wrong credentials
          setError(data.message || 'Invalid email or password. Please try again.');
        } else if (status === 404) {
          // Route not found
          setError('Login endpoint not found. Please check your configuration.');
        } else if (status === 500) {
          // Server error
          setError(data.message || 'Server error. Please try again later.');
        } else {
          // Other errors
          setError(data.message || data.error || `Login failed (${status}). Please try again.`);
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Check that the API server is running and CORS is configured correctly.');
      } else {
        // Other errors
        setError(err.message || 'Login failed. Check credentials.');
      }
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
          <Heart className="mx-auto text-rose-500 fill-rose-100" size={36} />
          <h1 className="text-3xl font-serif font-bold text-gray-800 mt-3">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to OurSpace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-start font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
            <input
              type="email"
              name='email'
              id="email"
              placeholder='yourname@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 outline-none transition-all"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm text-start font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              name='password'
              id="password"
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 outline-none transition-all"
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
          Don't have an account? <Link to="/register" className="text-rose-400 font-medium hover:underline">Register Here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;