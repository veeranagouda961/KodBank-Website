import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './index.css'

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const Landing = () => (
  <div className="glass-card" style={{ margin: '0 auto' }}>
    <h1>KodBank</h1>
    <p>Simple, secure, and reliable banking for everyone.</p>
    <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
      Get Started
    </Link>
    <div className="link-text">
      Already have an account? <Link to="/login">Login</Link>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Animated Background Orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
