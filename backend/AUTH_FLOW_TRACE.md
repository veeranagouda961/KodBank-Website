# Complete Authentication Flow Trace

## 🔍 How to Use This Document

When testing registration and login, check the backend console logs. Each step is clearly marked with:
- `STEP 1`, `STEP 2`, etc.
- ✅ for success
- ❌ for failure

## 📝 Registration Flow

### STEP 1: Receive Request
**Backend logs:**
```
📝 REGISTRATION REQUEST - STEP 1: Receive Request
   Complete request body: {
     "uid": "...",
     "uname": "johndoe",
     "email": "john@example.com",
     "password": "[8 chars]",
     "phone": "+1234567890",
     "role": "Customer"
   }
```

**Frontend sends:**
- Field: `uname` (not `username`)
- Field: `password` (plain text)
- Field: `email`
- Field: `phone`

**Check:** Verify `uname` field is present and has a value.

---

### STEP 2: Hash Password with bcrypt
**Backend logs:**
```
🔐 STEP 2: Hash Password with bcrypt
   Plain password received: mypassword123
   Plain password length: 13
   Plain password bytes: 13
   Salt rounds: 10
✅ Password hashed successfully
   Hash length: 60 chars
   Hash prefix: $2b$10$abcdefghijklmnop...
   Full hash: $2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz
```

**What happens:**
- Plain password is hashed using `bcrypt.hash(password, 10)`
- Result is a 60-character hash starting with `$2b$10$`

**Check:** Hash should be 60 characters and start with `$2b$10$`

---

### STEP 3: Insert into Database
**Backend logs:**
```
💾 STEP 3: Insert into Database
   SQL Query: INSERT INTO kodusers (uid, username, email, password, balance, phone, role)
   Parameters:
     uid: uid-1234567890-abc123
     username: johndoe
     email: john@example.com
     password: $2b$10$abcdefghijklmnop... [HASHED]
     balance: 100000.00
     phone: +1234567890
     role: Customer
```

**What happens:**
- `uname` from request → stored as `username` column in DB
- `password` (hashed) → stored as `password` column in DB

**Check:** Username stored correctly, password hash stored correctly

---

### STEP 4: Registration Complete
**Backend logs:**
```
✅ STEP 4: Registration Complete
   User registered successfully: johndoe
   Username stored in DB column "username": johndoe
   Password hash stored in DB column "password": $2b$10$abcdefghijklmnop...
```

**Key Point:** Registration stores `uname` as `username` column in database.

---

## 🔑 Login Flow

### STEP 1: Receive Request
**Backend logs:**
```
🔑 LOGIN REQUEST - STEP 1: Receive Request
   Complete request body: {
     "username": "johndoe",
     "password": "[13 chars]"
   }
```

**Frontend sends:**
- Field: `username` (matches DB column name)
- Field: `password` (plain text)

**Check:** Verify `username` field matches what was registered.

---

### STEP 2: Query Database
**Backend logs:**
```
🔍 STEP 2: Query Database
   Searching by: USERNAME
   SQL Query: SELECT uid, username, email, password, role FROM kodusers WHERE username = ?
   Query parameter: johndoe
   Executing query...
   Query result: Found 1 user(s)

✅ STEP 2 SUCCESS: User Found
   Database record:
     uid: uid-1234567890-abc123
     username: johndoe
     email: john@example.com
     role: Customer
     password hash length: 60
     password hash prefix: $2b$10$abcdefghijklmnop...
     FULL password hash from DB: $2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz
```

**What happens:**
- Searches `username` column (same column registration stored to)
- Returns user record with stored password hash

**Check:** 
- User found ✅
- Password hash exists ✅
- Hash length is 60 characters ✅

---

### STEP 3: Verify Password with bcrypt.compare
**Backend logs:**
```
🔐 STEP 3: Verify Password with bcrypt.compare
   Input password (from request): mypassword123
   Input password length: 13
   Input password bytes: 13
   Stored hash (from database): $2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz
   Stored hash length: 60
   Stored hash prefix: $2b$10$abcdefghijklmnop...

   Calling bcrypt.compare(plainPassword, storedHash)...
   Plain password: mypassword123
   Stored hash: $2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz

   bcrypt.compare RESULT: true
   Comparison details:
     Plain password: mypassword123
     Stored hash: $2b$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz
     Match: ✅ YES

✅ STEP 3 SUCCESS: Password Verified
   bcrypt.compare returned: true
```

**What happens:**
- `bcrypt.compare(plainPassword, storedHash)` is called
- Returns `true` if password matches, `false` otherwise

**If password fails:**
```
   bcrypt.compare RESULT: false
   Comparison details:
     Plain password: wrongpassword
     Stored hash: $2b$10$abcdefghijklmnop...
     Match: ❌ NO

❌ STEP 3 FAILED: Password Verification Failed
   The provided password does NOT match the stored hash
```

**Check:**
- Plain password matches what user entered
- Stored hash matches what was saved during registration
- bcrypt.compare result is `true`

---

### STEP 4: Login Complete
**Backend logs:**
```
✅ STEP 4: Login Complete
   Login successful for user: johndoe
```

---

## 🔍 Troubleshooting Guide

### Issue: Registration succeeds but login fails

#### Check 1: Field Name Mismatch
**Registration:** Sends `uname` → stored as `username` column
**Login:** Sends `username` → searches `username` column
**Status:** ✅ Should match

**If login fails with "User not found":**
- Check STEP 2 logs: What username is being searched?
- Verify it matches the `username` column value from registration
- Check for typos or case sensitivity

#### Check 2: Password Hash Mismatch
**Registration:** Hashes password → stores hash
**Login:** Compares plain password with stored hash

**If login fails with "Invalid password":**
- Check STEP 3 logs:
  - What password is being compared?
  - What hash is stored in database?
  - What is bcrypt.compare result?

**Common causes:**
1. **Wrong password entered** - User typed wrong password
2. **Password modified** - Password was changed in DB manually
3. **Encoding issue** - Special characters encoded differently
4. **Hash corruption** - Hash was truncated or modified

#### Check 3: Database Query Result
**Look for:**
```
Query result: Found 0 user(s)
```
**Solution:** Username doesn't exist in database

**Look for:**
```
password hash length: MISSING
```
**Solution:** Password hash was not saved during registration

---

## 📊 Field Mapping Summary

| Stage | Frontend Field | Backend Variable | Database Column |
|-------|----------------|------------------|-----------------|
| **Registration** | `uname` | `uname` | `username` |
| **Registration** | `password` | `password` | `password` (hashed) |
| **Login** | `username` | `username` | `username` |
| **Login** | `password` | `password` | `password` (compare) |

**Key Point:** Registration uses `uname` but stores as `username`. Login uses `username` to search, which matches the stored column.

---

## 🧪 Test Scenario

### Test Registration
1. Fill form:
   - Username: `testuser`
   - Password: `testpass123`
   - Email: `test@example.com`
   - Phone: `+1234567890`

2. Check backend logs:
   - ✅ STEP 1: `uname: testuser`
   - ✅ STEP 2: Hash created (60 chars)
   - ✅ STEP 3: Inserted with `username: testuser`
   - ✅ STEP 4: Registration complete

### Test Login
1. Fill form:
   - Username: `testuser`
   - Password: `testpass123`

2. Check backend logs:
   - ✅ STEP 1: `username: testuser`
   - ✅ STEP 2: User found (`username: testuser`)
   - ✅ STEP 3: Password verified (`bcrypt.compare: true`)
   - ✅ STEP 4: Login successful

---

## 🐛 Common Issues & Solutions

### Issue: "User not found"
**Check:** STEP 2 logs - username being searched
**Solution:** Ensure login uses same username as registration

### Issue: "Invalid password" but password is correct
**Check:** STEP 3 logs - compare the stored hash with registration hash
**Solution:** 
- Verify password hash was saved correctly during registration
- Check for encoding issues
- Verify bcrypt.compare is being called correctly

### Issue: Password hash missing
**Check:** STEP 2 logs - `password hash length: MISSING`
**Solution:** Registration didn't save hash properly - check registration logs

---

## ✅ Verification Checklist

After registration:
- [ ] Username stored in `username` column
- [ ] Password hash stored (60 characters)
- [ ] Hash starts with `$2b$10$`

After login:
- [ ] Username matches database `username` column
- [ ] User found in database
- [ ] Password hash exists (60 characters)
- [ ] bcrypt.compare returns `true`
- [ ] Login succeeds
