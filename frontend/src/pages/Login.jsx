import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',  // Can be username or email
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prepare login payload
    // Backend accepts: username, uname, or email
    const loginData = {
      username: formData.username.trim(),  // Backend searches by username OR email
      password: formData.password           // Plain password - backend compares with hash
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important: include cookies for JWT
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Login successful - redirecting to dashboard');
        // Store user data available in the response (username, email, role)
        if (data.user) {
          localStorage.setItem('kodbank_user', JSON.stringify(data.user));
          localStorage.setItem('kodbank_last_login', new Date().toISOString());
        }
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
        console.error('❌ Login failed:', data.message);
      }
    } catch (err) {
      setError('Network or Server error. Please verify the API is running and accessible.');
      console.error('❌ Login network error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="login-container">
        <motion.div
          className="login-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bank-icon-container"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            🏦
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            KodBank
          </motion.h1>
          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h2>
          <p className="subtitle">Sign in to your account</p>

          <AnimatePresence>
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username or email"
                autoComplete="username"
              />
              <small>Use the username or email you registered with</small>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </motion.button>
          </form>

          <p className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}

// Helper to use AnimatePresence locally without importing whole library again if prefer not to
import { AnimatePresence } from 'framer-motion';
export default Login;
