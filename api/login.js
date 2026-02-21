/**
 * Vercel serverless: POST /api/login
 * Reuses same logic as backend/routes/auth.js (login) — no business logic changes.
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../backend/config/db.js';

function isDbConnectivityError(err) {
  return (
    err &&
    (err.code === 'ENOTFOUND' ||
      err.code === 'ETIMEDOUT' ||
      err.code === 'ECONNREFUSED' ||
      err.code === 'PROTOCOL_CONNECTION_LOST')
  );
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${value}`];
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.maxAge != null) parts.push(`Max-Age=${options.maxAge}`);
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const connection = await pool.getConnection();
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { username, uname, email, password } = body;
    const loginIdentifier = username || uname || email;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/email and password are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(loginIdentifier);
    const query = isEmail
      ? 'SELECT uid, username, email, password, role FROM kodusers WHERE email = ?'
      : 'SELECT uid, username, email, password, role FROM kodusers WHERE username = ?';

    const [users] = await connection.query(query, [loginIdentifier]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password'
      });
    }

    const user = users[0];
    if (!user.password) {
      return res.status(500).json({
        success: false,
        message: 'Database error: Password hash missing'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password'
      });
    }

    const token = jwt.sign(
      { sub: user.username, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY || '24h' }
    );

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    await connection.query(
      'INSERT INTO CJWT (token, uid, expiry) VALUES (?, ?, ?)',
      [token, user.uid, expiryDate]
    );

    setCookie(res, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (isDbConnectivityError(error)) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
}
