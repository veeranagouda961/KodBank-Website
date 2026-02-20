import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Retrieve user data from local storage (set during login)
  const userData = JSON.parse(localStorage.getItem('kodbank_user')) || {
    username: 'Valued Member',
    email: 'member@kodbank.com',
    role: 'Standard User'
  };

  const lastLoginStr = localStorage.getItem('kodbank_last_login');
  const lastLoginFormatted = lastLoginStr
    ? new Date(lastLoginStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
    : 'Today, 09:41 AM';

  const checkBalance = async () => {
    setError('');
    setLoading(true);
    setBalance(null);

    try {
      const response = await api.get('/balance');

      if (response.data.success) {
        setBalance(response.data.balance);
        triggerCelebration();
      }
    } catch (err) {
      // Axios specific error handling for 401 UNAUTHORIZED
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch balance');
        console.error('Balance fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('kodbank_user');
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <PageTransition>
      <div className="dashboard-page-container">

        {/* Top Navigation */}
        <nav className="dashboard-nav">
          <div className="nav-logo">
            <span className="logo-icon">🏦</span>
            <h2>KodBank</h2>
          </div>
          <motion.button
            onClick={handleLogout}
            className="logout-action-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </nav>

        {/* Main Dashboard Layout */}
        <div className="dashboard-main-layout">

          {/* Left Column - Content */}
          <motion.div
            className="dashboard-left-column"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Welcome Banner */}
            <motion.div className="welcome-banner" variants={itemVariants}>
              <h1>Welcome back 👋</h1>
              <p>Manage your account, check balances, and track your activity.</p>
            </motion.div>

            <div className="dashboard-grid">

              {/* User Profile Card */}
              <motion.div className="dashboard-card profile-card" variants={itemVariants}>
                <div className="profile-header">
                  <div className="avatar-circle">👤</div>
                  <div className="profile-details">
                    <h3>{userData.username}</h3>
                    <p>{userData.email}</p>
                    <span className="role-tag">{userData.role || 'Customer'}</span>
                  </div>
                </div>
              </motion.div>

              {/* Security Section */}
              <motion.div className="dashboard-card security-card" variants={itemVariants}>
                <h3>Security Status</h3>
                <ul className="security-list">
                  <li><span className="icon">🛡️</span> Account Secured</li>
                  <li><span className="icon">🔐</span> JWT Session Active</li>
                </ul>
              </motion.div>

              {/* Main Balance Card */}
              <motion.div className="dashboard-card main-balance-card" variants={itemVariants}>
                <div className="card-top-row">
                  <span className="card-label">Current Balance</span>
                  <span className="status-badge-green">● Active Status</span>
                </div>
                <div className="balance-content">
                  {error && <div className="error-message">{error}</div>}
                  {balance !== null ? (
                    <motion.h2
                      className="balance-value"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </motion.h2>
                  ) : (
                    <h2 className="balance-value hidden-balance">****</h2>
                  )}
                  <p className="last-login-text">Last login: {lastLoginFormatted}</p>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div className="dashboard-card quick-actions-card" variants={itemVariants}>
                <h3>Quick Actions</h3>
                <div className="action-btn-grid">
                  <motion.button
                    className="quick-action-btn primary"
                    onClick={checkBalance}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Checking...' : '💰 Check Balance'}
                  </motion.button>
                  <motion.button className="quick-action-btn secondary" whileHover={{ scale: 1.02 }}>
                    👤 View Profile
                  </motion.button>
                  <motion.button className="quick-action-btn secondary" whileHover={{ scale: 1.02 }}>
                    📄 Transaction History
                  </motion.button>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <motion.footer
          className="dashboard-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div>Developed by <span className="highlight-text">Veeranagouda</span></div>
          <span className="footer-separator">•</span>
          <div>KodNest ID: <span className="highlight-text">KODYVB03M</span></div>
          <span className="footer-separator">•</span>
          <div>&copy; KodBank. Copyright received.</div>
        </motion.footer>

      </div>
    </PageTransition>
  );
}

export default Dashboard;
