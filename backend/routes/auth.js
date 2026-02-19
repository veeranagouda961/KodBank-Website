import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

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

// ============================================================================
// REGISTRATION ENDPOINT
// ============================================================================
router.post('/register', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    console.log('\n' + '='.repeat(80));
    console.log('📝 REGISTRATION - START');
    console.log('='.repeat(80));
    
    // STEP 1: Parse and validate request body
    console.log('\n[STEP 1] Parse Request Body');
    const { uid, uname, password, email, phone, role } = req.body;
    
    console.log('   Raw request body:', JSON.stringify({
      uid: uid || 'AUTO-GENERATE',
      uname: uname || 'MISSING',
      email: email || 'MISSING',
      password: password ? `[${password.length} chars]` : 'MISSING',
      phone: phone || 'MISSING',
      role: role || 'Customer'
    }, null, 2));
    
    // Validation
    if (!uname || !password || !email || !phone) {
      console.log('❌ [STEP 1] FAILED: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, email, and phone are required' 
      });
    }
    
    // Enforce role = 'Customer' only
    if (role && role !== 'Customer') {
      console.log('❌ [STEP 1] FAILED: Invalid role');
      return res.status(400).json({ 
        success: false, 
        message: 'Only Customer role is allowed during registration' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ [STEP 1] FAILED: Invalid email format');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }
    
    console.log('✅ [STEP 1] SUCCESS: All fields validated');
    console.log('   Username (uname):', uname);
    console.log('   Email:', email);
    console.log('   Password length:', password.length);
    console.log('   Phone:', phone);
    
    // STEP 2: Hash password with bcrypt
    console.log('\n[STEP 2] Hash Password with bcrypt');
    console.log('   Plain password:', password);
    console.log('   Salt rounds: 10');
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ [STEP 2] SUCCESS: Password hashed');
    console.log('   Hash length:', hashedPassword.length, 'chars');
    console.log('   Hash prefix:', hashedPassword.substring(0, 30) + '...');
    console.log('   Full hash:', hashedPassword);
    
    // STEP 3: Prepare database insert
    console.log('\n[STEP 3] Prepare Database Insert');
    const finalUID = uid || `uid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('   UID:', finalUID);
    console.log('   Username (will be stored in "username" column):', uname);
    console.log('   Email:', email);
    console.log('   Password hash:', hashedPassword.substring(0, 30) + '...');
    console.log('   Balance: 100000.00');
    console.log('   Phone:', phone);
    console.log('   Role: Customer');
    
    // STEP 4: Insert into database
    console.log('\n[STEP 4] Insert into Database');
    console.log('   SQL: INSERT INTO kodusers (uid, username, email, password, balance, phone, role)');
    console.log('   Note: "uname" from request → stored as "username" column');
    
    await connection.query(
      `INSERT INTO kodusers (uid, username, email, password, balance, phone, role) 
       VALUES (?, ?, ?, ?, 100000.00, ?, ?)`,
      [finalUID, uname, email, hashedPassword, phone, 'Customer']
    );
    
    console.log('✅ [STEP 4] SUCCESS: User inserted into database');
    console.log('   Username stored in DB column "username":', uname);
    console.log('   Password hash stored in DB column "password":', hashedPassword.substring(0, 30) + '...');
    
    // STEP 5: Registration complete
    console.log('\n✅ REGISTRATION COMPLETE');
    console.log('   User can now login with:');
    console.log('     - Username:', uname);
    console.log('     - Email:', email);
    console.log('     - Password:', '[same password used in registration]');
    console.log('='.repeat(80));
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      loginHint: {
        username: uname,
        email: email
      }
    });
    
  } catch (dbError) {
    console.error('\n❌ REGISTRATION ERROR');
    console.error('   Error:', dbError.message);
    
    // Handle duplicate username or email
    if (dbError.code === 'ER_DUP_ENTRY') {
      const field = dbError.message.includes('username') ? 'username' : 'email';
      console.log('   Duplicate entry:', field);
      return res.status(409).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    
    console.error('   Database error details:', {
      code: dbError.code,
      errno: dbError.errno,
      sqlMessage: dbError.sqlMessage
    });
    
    if (isDbConnectivityError(dbError)) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
    });
  } finally {
    connection.release();
  }
});

// ============================================================================
// LOGIN ENDPOINT
// ============================================================================
router.post('/login', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    console.log('\n' + '='.repeat(80));
    console.log('🔑 LOGIN - START');
    console.log('='.repeat(80));
    
    // STEP 1: Parse and validate request body
    console.log('\n[STEP 1] Parse Request Body');
    const { username, uname, email, password } = req.body;
    
    console.log('   Raw request body:', JSON.stringify({
      username: username || 'NOT PROVIDED',
      uname: uname || 'NOT PROVIDED',
      email: email || 'NOT PROVIDED',
      password: password ? `[${password.length} chars]` : 'MISSING'
    }, null, 2));
    
    // Determine login identifier (username, uname, or email)
    // Priority: username > uname > email
    const loginIdentifier = username || uname || email;
    
    if (!loginIdentifier || !password) {
      console.log('❌ [STEP 1] FAILED: Missing login identifier or password');
      return res.status(400).json({
        success: false,
        message: 'Username/email and password are required'
      });
    }
    
    console.log('✅ [STEP 1] SUCCESS: Request validated');
    console.log('   Login identifier:', loginIdentifier);
    console.log('   Password length:', password.length);
    
    // STEP 2: Determine search field (username or email)
    console.log('\n[STEP 2] Determine Search Field');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(loginIdentifier);
    
    let query, queryField;
    if (isEmail) {
      query = 'SELECT uid, username, email, password, role FROM kodusers WHERE email = ?';
      queryField = 'email';
      console.log('   Search by: EMAIL');
    } else {
      query = 'SELECT uid, username, email, password, role FROM kodusers WHERE username = ?';
      queryField = 'username';
      console.log('   Search by: USERNAME');
      console.log('   Note: Registration stored "uname" as "username" column');
    }
    
    console.log('   SQL Query:', query);
    console.log('   Search value:', loginIdentifier);
    
    // STEP 3: Query database
    console.log('\n[STEP 3] Query Database');
    const [users] = await connection.query(query, [loginIdentifier]);
    
    console.log('   Query result: Found', users.length, 'user(s)');
    
    if (users.length === 0) {
      console.log('❌ [STEP 3] FAILED: User not found');
      console.log('   Searched by:', queryField);
      console.log('   Search value:', loginIdentifier);
      console.log('   Tip: Use the exact username or email from registration');
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password'
      });
    }
    
    const user = users[0];
    console.log('✅ [STEP 3] SUCCESS: User found');
    console.log('   Database record:');
    console.log('     uid:', user.uid);
    console.log('     username:', user.username);
    console.log('     email:', user.email);
    console.log('     role:', user.role);
    console.log('     password hash exists:', user.password ? 'YES' : 'NO');
    console.log('     password hash length:', user.password ? user.password.length : 'MISSING');
    
    if (!user.password) {
      console.log('❌ [STEP 3] ERROR: Password hash missing from database');
      return res.status(500).json({
        success: false,
        message: 'Database error: Password hash missing'
      });
    }
    
    // STEP 4: Verify password with bcrypt.compare
    console.log('\n[STEP 4] Verify Password with bcrypt.compare');
    console.log('   Plain password from request:', password);
    console.log('   Plain password length:', password.length);
    console.log('   Stored hash from database:', user.password);
    console.log('   Stored hash length:', user.password.length);
    console.log('   Hash prefix:', user.password.substring(0, 30) + '...');
    
    console.log('\n   Calling: bcrypt.compare(plainPassword, storedHash)');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('   bcrypt.compare result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ [STEP 4] FAILED: Password does not match');
      console.log('   Possible causes:');
      console.log('     1. Wrong password entered');
      console.log('     2. Password was changed after registration');
      console.log('     3. Encoding/character issue');
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password'
      });
    }
    
    console.log('✅ [STEP 4] SUCCESS: Password verified');
    
    // STEP 5: Generate JWT token
    console.log('\n[STEP 5] Generate JWT Token');
    const tokenPayload = {
      sub: user.username, // Subject = username (from database)
      role: user.role     // Claim = role
    };
    
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_EXPIRY || '24h'
      }
    );
    
    console.log('✅ [STEP 5] SUCCESS: JWT token generated');
    console.log('   Token length:', token.length, 'chars');
    
    // STEP 6: Store token in database
    console.log('\n[STEP 6] Store Token in Database');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    
    await connection.query(
      'INSERT INTO CJWT (token, uid, expiry) VALUES (?, ?, ?)',
      [token, user.uid, expiryDate]
    );
    
    console.log('✅ [STEP 6] SUCCESS: Token stored in CJWT table');
    
    // STEP 7: Set HTTP-only cookie
    console.log('\n[STEP 7] Set HTTP-only Cookie');
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    console.log('✅ [STEP 7] SUCCESS: Cookie set');
    
    // STEP 8: Login complete
    console.log('\n✅ LOGIN COMPLETE');
    console.log('   User logged in:', user.username);
    console.log('   Role:', user.role);
    console.log('='.repeat(80));
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('\n❌ LOGIN ERROR');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    
    if (isDbConnectivityError(error)) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
});

export default router;
