import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

function isDbConnectivityError(err) {
  return (
    err &&
    (err.code === 'ENOTFOUND' ||
      err.code === 'ETIMEDOUT' ||
      err.code === 'ECONNREFUSED' ||
      err.code === 'PROTOCOL_CONNECTION_LOST')
  );
}

// Get User Balance (Protected Route)
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const username = req.user.username; // Extracted from JWT token

    const connection = await pool.getConnection();

    try {
      // Fetch balance from kodusers table using username
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

      res.status(200).json({
        success: true,
        balance: balance
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Balance fetch error:', error);
    if (isDbConnectivityError(error)) {
      return res.status(503).json({
        success: false,
        message:
          'Database is unreachable (DNS/connection failure). Check your AIVEN host/port in backend/.env and ensure the AIVEN service is running.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
