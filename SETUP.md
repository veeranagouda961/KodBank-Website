# KodBank Setup Guide

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Start Backend Server

From the `backend` directory:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will:
- Connect to AIVEN MySQL database
- Create tables automatically (`kodusers` and `CJWT`)
- Run on `http://localhost:5000`

### 4. Start Frontend Development Server

From the `frontend` directory:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 5. Open Your Browser

Navigate to: `http://localhost:5173`

## Testing the Application

1. **Register a new user:**
   - Go to `/register`
   - Fill in all fields (UID is optional - auto-generated if empty)
   - Role is fixed to "Customer"
   - Default balance: ₹100,000

2. **Login:**
   - After registration, you'll be redirected to `/login`
   - Enter username and password
   - JWT token will be stored as HTTP-only cookie

3. **Check Balance:**
   - After login, you'll be redirected to `/dashboard`
   - Click "Check Balance" button
   - See your balance with celebration animation! 🎉

## Database Tables

### kodusers
- `uid` - Primary key
- `username` - Unique
- `email` - Unique
- `password` - Hashed with bcrypt
- `balance` - Default 100000.00
- `phone` - User phone number
- `role` - Customer/manager/admin (default: Customer)

### CJWT
- `tid` - Auto-increment primary key
- `token` - JWT token string
- `uid` - Foreign key to kodusers
- `expiry` - Token expiration datetime

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/register` - User registration
- `POST /api/login` - User login (sets JWT cookie)
- `GET /api/balance` - Get balance (requires authentication)

## Troubleshooting

### Database Connection Issues
- Verify AIVEN credentials in `backend/.env`
- Check if SSL mode is set correctly
- Ensure AIVEN database is accessible

### CORS Issues
- Make sure frontend URL matches `FRONTEND_URL` in `.env`
- Check that `credentials: 'include'` is set in fetch calls

### Token Issues
- Clear browser cookies if experiencing auth errors
- Check JWT_SECRET in `.env` matches between restarts

## Security Notes

- Never commit `.env` files to git
- JWT tokens are stored in HTTP-only cookies (more secure than localStorage)
- Passwords are hashed with bcrypt before storage
- SSL is required for AIVEN database connection
