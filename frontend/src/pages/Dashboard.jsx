import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkBalance = async () => {
    setError('');
    setLoading(true);
    setBalance(null);

    try {
      const response = await fetch('http://localhost:5000/api/balance', {
        method: 'GET',
        credentials: 'include', // Important: include cookies (JWT token)
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setBalance(data.balance);
        // Trigger celebration animation
        triggerCelebration();
      } else {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          navigate('/login');
        } else {
          setError(data.message || 'Failed to fetch balance');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Balance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerCelebration = () => {
    // Party popper celebration animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Additional burst effect
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 100);
  };

  const handleLogout = () => {
    // Clear cookie by setting it to expire
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>🏦 KodBank Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        <div className="dashboard-content">
          <h2>Welcome to Your Banking Portal</h2>
          <p className="dashboard-subtitle">Manage your account and check your balance</p>

          {error && <div className="error-message">{error}</div>}

          <div className="balance-section">
            <button 
              onClick={checkBalance} 
              className="check-balance-btn" 
              disabled={loading}
            >
              {loading ? 'Checking Balance...' : '💰 Check Balance'}
            </button>

            {balance !== null && (
              <div className="balance-display">
                <div className="balance-text">
                  Your balance is: <span className="balance-amount">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
