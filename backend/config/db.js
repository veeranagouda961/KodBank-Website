import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Ensure .env is loaded from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Aiven SSL configuration for serverless (Vercel) compatibility
const sslConfig = {
  rejectUnauthorized: false
};

let dbConfig;

if (process.env.DB_URL) {
  // Use DB_URL: parse and merge with SSL for Aiven
  try {
    const url = new URL(process.env.DB_URL);
    const database = url.pathname ? url.pathname.replace(/^\//, '').split('?')[0] : process.env.DB_NAME || 'defaultdb';
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: database || process.env.DB_NAME,
      ssl: sslConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    };
    console.log('\n📊 Database Configuration (from DB_URL):');
    console.log('   Host:', dbConfig.host);
    console.log('   Port:', dbConfig.port);
    console.log('   Database:', dbConfig.database);
    console.log('   User:', dbConfig.user);
    console.log('   SSL: Enabled (rejectUnauthorized: false)');
  } catch (e) {
    console.error('❌ Invalid DB_URL:', e.message);
    throw new Error('Invalid DB_URL. Check backend/.env');
  }
} else {
  // Fallback: individual env vars
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error('\n❌ ERROR: Set DB_URL or all of DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    throw new Error('Missing required database environment variables');
  }
  dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  };
  console.log('\n📊 Database Configuration (from env):');
  console.log('   Host:', dbConfig.host);
  console.log('   Port:', dbConfig.port);
  console.log('   Database:', dbConfig.database);
  console.log('   User:', dbConfig.user);
  console.log('   SSL: Enabled (rejectUnauthorized: false)');
}

console.log('\n🔗 Attempting to connect to MySQL...');

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection with DNS troubleshooting
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to AIVEN MySQL database');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    console.error('Error code:', err.code);
    const host = dbConfig.host || process.env.DB_HOST;
    if (err.code === 'ENOTFOUND' && host) {
      console.log('\n🔍 DNS Resolution Failed for:', host);
      console.log('\n💡 Check AIVEN service is running and DB_URL or DB_* env vars are correct.');
    }
  }
}

testConnection();

export default pool;
