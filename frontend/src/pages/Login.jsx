import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // We send 'username' field - backend will check if it's email or username
    const loginData = {
      username: formData.username.trim(),  // Backend searches by username OR email
      password: formData.password           // Plain password - backend compares with hash
    };

    console.log('📤 [FRONTEND] Login Request');
    console.log('   Payload:', {
      username: loginData.username,
      password: '[REDACTED]'
    });
    console.log('   Field mapping:');
    console.log('     username → backend searches "username" column OR "email" column');
    console.log('     password → backend compares with bcrypt.compare');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important: include cookies for JWT
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      console.log('📥 [FRONTEND] Login Response');
      console.log('   Success:', data.success);
      console.log('   Message:', data.message);
      if (data.user) {
        console.log('   User:', data.user.username);
      }

      if (data.success) {
        console.log('✅ Login successful - redirecting to dashboard');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
        console.error('❌ Login failed:', data.message);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('❌ Login network error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏦 KodBank</h1>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
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
            <input
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
