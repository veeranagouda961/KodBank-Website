/**
 * Vercel serverless: POST /api/register
 * Reuses same logic as backend/routes/auth.js (register) — no business logic changes.
 */
import bcrypt from 'bcrypt';
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const connection = await pool.getConnection();
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { uid, uname, password, email, phone, role } = body;

    if (!uname || !password || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, email, and phone are required'
      });
    }
    if (role && role !== 'Customer') {
      return res.status(400).json({
        success: false,
        message: 'Only Customer role is allowed during registration'
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const finalUID = uid || `uid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await connection.query(
      `INSERT INTO kodusers (uid, username, email, password, balance, phone, role) 
       VALUES (?, ?, ?, ?, 100000.00, ?, ?)`,
      [finalUID, uname, email, hashedPassword, phone, 'Customer']
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      loginHint: { username: uname, email: email }
    });
  } catch (dbError) {
    if (dbError.code === 'ER_DUP_ENTRY') {
      const field = dbError.message.includes('username') ? 'username' : 'email';
      return res.status(409).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    if (isDbConnectivityError(dbError)) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
    });
  } finally {
    connection.release();
  }
}
