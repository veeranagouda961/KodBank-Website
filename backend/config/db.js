import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Ensure .env is loaded from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Debug: Log DB connection details (without password)
console.log('\n📊 Database Configuration:');
console.log('   DB_HOST:', process.env.DB_HOST || '❌ NOT SET');
console.log('   DB_PORT:', process.env.DB_PORT || '❌ NOT SET');
console.log('   DB_NAME:', process.env.DB_NAME || '❌ NOT SET');
console.log('   DB_USER:', process.env.DB_USER || '❌ NOT SET');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ SET' : '❌ NOT SET');

// Validate required environment variables
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error('\n❌ ERROR: Missing required database environment variables!');
  console.error('   Please check your backend/.env file');
  throw new Error('Missing required database environment variables');
}

// MySQL connection configuration using ONLY environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  // AIVEN REQUIRES SSL - rejectUnauthorized: false accepts AIVEN's self-signed cert
  // Connection is still encrypted; we just don't verify the certificate chain
  ssl: {
    rejectUnauthorized: false // Required for AIVEN self-signed certificate
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

console.log('\n🔗 Attempting to connect to MySQL...');
console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   SSL: Enabled (rejectUnauthorized: false)`);

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
    
    // If DNS resolution fails, provide troubleshooting
    if (err.code === 'ENOTFOUND' && process.env.DB_HOST) {
      console.log('\n🔍 DNS Resolution Failed for:', process.env.DB_HOST);
      console.log('\n💡 Troubleshooting Steps:');
      console.log('1. Check your internet connection');
      console.log('2. Try flushing DNS cache: ipconfig /flushdns');
      console.log('3. Try using Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)');
      console.log('4. Verify AIVEN service is ACTIVE (not paused) in AIVEN console');
      console.log('5. Check if firewall/antivirus is blocking the connection');
      console.log('6. Try connecting from a different network/VPN');
      console.log('\n📋 Current Connection Details:');
      console.log(`   Host: ${process.env.DB_HOST}`);
      console.log(`   Port: ${process.env.DB_PORT}`);
      console.log(`   Database: ${process.env.DB_NAME}`);
      console.log(`   User: ${process.env.DB_USER}`);
    }
  }
}

testConnection();

export default pool;
