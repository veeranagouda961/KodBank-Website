import pool from './db.js';

// Initialize database tables
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    console.log('📦 Creating tables...');

    // Create kodusers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kodusers (
        uid VARCHAR(36) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 100000.00,
        phone VARCHAR(20),
        role ENUM('Customer', 'manager', 'admin') DEFAULT 'Customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table kodusers created');

    // Create CJWT table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS CJWT (
        tid INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(500) NOT NULL,
        uid VARCHAR(36) NOT NULL,
        expiry DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_uid (uid)
      )
    `);
    console.log('✅ Table CJWT created');

    connection.release();
    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

export default initDatabase;
