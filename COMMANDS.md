# KodBank - Setup Commands

## Step-by-Step Commands to Run

### 1. Navigate to Project Directory
```powershell
cd C:\Users\VEERANAGOUDA\OneDrive\Desktop\KodBank
```

### 2. Install Backend Dependencies
```powershell
cd backend
npm install
```

### 3. Install Frontend Dependencies
```powershell
cd ..\frontend
npm install
```

### 4. Start Backend Server (Terminal 1)
```powershell
cd C:\Users\VEERANAGOUDA\OneDrive\Desktop\KodBank\backend
npm start
```

**Expected Output:**
```
✅ Connected to AIVEN MySQL database
📦 Creating tables...
✅ Table kodusers created
✅ Table CJWT created
✅ Database initialization complete!
🚀 Server running on http://localhost:5000
```

### 5. Start Frontend Server (Terminal 2 - New Terminal)
```powershell
cd C:\Users\VEERANAGOUDA\OneDrive\Desktop\KodBank\frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6. Open Browser
Open: `http://localhost:5173`

---

## Quick Start (All Commands Together)

### PowerShell Script:
```powershell
# Navigate to project
cd C:\Users\VEERANAGOUDA\OneDrive\Desktop\KodBank

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install

# Start backend (run in separate terminal)
cd ..\backend
npm start

# Start frontend (run in separate terminal)
cd ..\frontend
npm run dev
```

---

## Troubleshooting Commands

### Check if ports are in use:
```powershell
# Check port 5000 (backend)
netstat -ano | findstr :5000

# Check port 5173 (frontend)
netstat -ano | findstr :5173
```

### Kill process on port (if needed):
```powershell
# Find PID first, then kill it
taskkill /PID <PID_NUMBER> /F
```

### Check Node.js version:
```powershell
node --version
# Should be v16 or higher
```

### Check npm version:
```powershell
npm --version
```

---

## Testing the Application

1. **Register a new user:**
   - Go to `http://localhost:5173/register`
   - Fill in: Username, Email, Phone, Password
   - UID is optional (auto-generated)
   - Click "Register"

2. **Login:**
   - After registration, you'll be redirected to login
   - Enter username and password
   - Click "Login"

3. **Check Balance:**
   - You'll be redirected to dashboard
   - Click "Check Balance" button
   - See your balance with celebration animation! 🎉

---

## If You See Errors

### Backend Error: "Cannot find module"
```powershell
cd backend
npm install
```

### Frontend Error: "Cannot find module"
```powershell
cd frontend
npm install
```

### Database Connection Error
- Check `backend/.env` file exists
- Verify AIVEN credentials are correct
- Ensure backend server is running

### CORS Error
- Make sure backend is running on port 5000
- Make sure frontend is running on port 5173
- Check `backend/.env` has `FRONTEND_URL=http://localhost:5173`
