// Load environment variables FIRST - before any other imports
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file directory for proper .env path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend root directory
dotenv.config({ path: join(__dirname, '.env') });

// Debug: Log DB configuration (without password)
console.log('🔍 Environment Variables Loaded:');
console.log('   DB_HOST:', process.env.DB_HOST || '❌ NOT SET');
console.log('   DB_PORT:', process.env.DB_PORT || '❌ NOT SET');
console.log('   DB_NAME:', process.env.DB_NAME || '❌ NOT SET');
console.log('   DB_USER:', process.env.DB_USER || '❌ NOT SET');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ SET' : '❌ NOT SET');

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import initDatabase from './config/initDB.js';
import authRoutes from './routes/auth.js';
import balanceRoutes from './routes/balance.js';

const app = express();
const PORT = process.env.PORT || 5000;
let dbReady = false;
let lastDbError = null;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);
app.use('/api', balanceRoutes);

// Health check route (also shows DB status)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'KodBank API is running',
    dbReady,
    dbError: lastDbError ? { code: lastDbError.code, message: lastDbError.message } : null
  });
});

// Initialize database tables (do not crash server on failure)
initDatabase()
  .then(() => {
    dbReady = true;
    console.log('✅ DB ready');
  })
  .catch((err) => {
    dbReady = false;
    lastDbError = err;
    console.error('❌ DB init failed (server still running):', err?.code || '', err?.message || err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
