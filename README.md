# KodBank Application

A secure banking application with JWT authentication, user registration, and balance checking features.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: MySQL (AIVEN)
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with AIVEN credentials.

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Tables

- **kodusers**: Stores user information (uid, username, email, password, balance, phone, role)
- **CJWT**: Stores JWT tokens (tid, token, uid, expiry)

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/register` - User registration
- `POST /api/login` - User login (returns JWT cookie)
- `GET /api/balance` - Get user balance (protected)

## Features

- ✅ User registration with default balance of ₹100,000
- ✅ Secure login with JWT authentication
- ✅ Protected balance checking
- ✅ Celebration animation on balance reveal
