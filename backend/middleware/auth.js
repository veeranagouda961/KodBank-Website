import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// JWT Authentication Middleware
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.'
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token. Please login again.'
        });
      }

      // Attach user info to request object
      req.user = {
        username: decoded.sub, // Subject = username
        role: decoded.role      // Claim = role
      };

      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export default authenticateToken;
