import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uid: '',
    uname: '',
    password: '',
    email: '',
    phone: '',
    role: 'Customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateUID = () => {
    return 'uid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

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

    // Generate UID if not provided
    const finalUID = formData.uid || generateUID();

    // Prepare request payload - ensure correct field names
    const requestPayload = {
      uid: finalUID,
      uname: formData.uname.trim(),      // Backend expects 'uname', stores as 'username'
      email: formData.email.trim(),
      password: formData.password,       // Plain password - backend will hash it
      phone: formData.phone.trim(),
      role: 'Customer'                    // Always Customer
    };

    console.log('📤 [FRONTEND] Registration Request');
    console.log('   Payload:', {
      ...requestPayload,
      password: '[REDACTED]'
    });
    console.log('   Field mapping:');
    console.log('     uname → backend stores as "username" column');
    console.log('     password → backend hashes with bcrypt');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestPayload)
      });

      const data = await response.json();

      console.log('📥 [FRONTEND] Registration Response');
      console.log('   Success:', data.success);
      console.log('   Message:', data.message);

      if (data.success) {
        console.log('✅ Registration successful');
        console.log('   You can login with:');
        console.log('     Username:', requestPayload.uname);
        console.log('     Email:', requestPayload.email);
        // Redirect to login page
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
        console.error('❌ Registration failed:', data.message);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('❌ Registration network error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="register-container">
        <motion.div
          className="register-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            🏦 KodBank
          </motion.h1>
          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create Your Account
          </motion.h2>
          <p className="subtitle">Start your banking journey with ₹100,000 welcome balance!</p>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="uid">User ID (Optional - Auto-generated if empty)</label>
              <input
                type="text"
                id="uid"
                name="uid"
                value={formData.uid}
                onChange={handleChange}
                placeholder="uid-1234567890-abc123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="uname">Username *</label>
              <input
                type="text"
                id="uname"
                name="uname"
                value={formData.uname}
                onChange={handleChange}
                required
                placeholder="johndoe"
                autoComplete="username"
              />
              <small>This will be your login username</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                autoComplete="email"
              />
              <small>You can also login with this email</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength="6"
                autoComplete="new-password"
              />
              <small>Minimum 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled
              >
                <option value="Customer">Customer</option>
              </select>
              <small>Only Customer role is available for registration</small>
            </div>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </motion.button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Register;
