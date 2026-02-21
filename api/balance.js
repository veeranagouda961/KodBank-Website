/**
 * Vercel serverless: GET /api/balance
 * Reuses same logic as backend/routes/balance.js — no business logic changes.
 * Auth: read JWT from Cookie header and verify before returning balance.
 */
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

function getTokenFromRequest(req) {
  const cookie = req.headers.cookie || req.headers.Cookie || '';
  const match = cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? match[1].trim() : null;
}

function authenticateToken(req, res) {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.'
    });
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username: decoded.sub, role: decoded.role };
    return decoded;
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    });
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (authenticateToken(req, res) === null) return;

  try {
    const username = req.user.username;
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT balance FROM kodusers WHERE username = ?',
        [username]
      );
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      const balance = parseFloat(users[0].balance);
      return res.status(200).json({
        success: true,
        balance
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    if (isDbConnectivityError(error)) {
      return res.status(503).json({
        success: false,
        message:
          'Database is unreachable (DNS/connection failure). Check your AIVEN host/port in backend/.env and ensure the AIVEN service is running.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
