# KodBank Application - Staged Build Plan

## Overview

This document outlines a **6-stage plan** for building the KodBank application with AIVEN MySQL database, JWT authentication, and a complete user flow from registration to balance checking.

---

## Stage 1: Project Setup & Database Schema

### What This Stage Does
- Initializes the project structure (Node.js/Express backend + React frontend)
- Configures AIVEN MySQL connection
- Creates the database tables: `kodusers` and `CJWT`

### Deliverables
| Item | Description |
|------|-------------|
| **Project Structure** | Backend (Express) + Frontend (React) folders |
| **Database Connection** | MySQL connection pool using `mysql2` package |
| **Table: kodusers** | `uid`, `username`, `email`, `password`, `balance`, `phone`, `role` |
| **Table: CJWT** | `tid`, `token`, `uid`, `expiry` |
| **Environment Config** | `.env` for DB URL (never commit credentials) |

### SQL Schema (to be run on AIVEN)
```sql
CREATE TABLE kodusers (
  uid VARCHAR(36) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 100000.00,
  phone VARCHAR(20),
  role ENUM('Customer', 'manager', 'admin') DEFAULT 'Customer'
);

CREATE TABLE CJWT (
  tid INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(500) NOT NULL,
  uid VARCHAR(36) NOT NULL,
  expiry DATETIME NOT NULL,
  FOREIGN KEY (uid) REFERENCES kodusers(uid)
);
```

### Success Criteria
- App connects to AIVEN MySQL successfully
- Tables exist and are queryable

---

## Stage 2: User Registration API & Frontend

### What This Stage Does
- Implements the registration endpoint
- Validates input (uid, username, password, email, phone)
- Enforces `role = 'Customer'` only
- Hashes password (bcrypt) before storing
- Sets default balance to 100,000
- Creates React registration form
- Redirects to login page on success

### Deliverables
| Item | Description |
|------|-------------|
| **POST /api/register** | Accepts uid, uname, password, email, phone, role |
| **Password Hashing** | bcrypt for secure storage |
| **Validation** | Required fields, email format, unique username/email |
| **Registration Page** | React form with all fields |
| **Redirect Logic** | On success → navigate to `/login` |

### API Request Body
```json
{
  "uid": "uuid-string",
  "uname": "johndoe",
  "password": "securePass123",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "Customer"
}
```

### Success Criteria
- User can register and see data in `kodusers`
- Balance is 100000 by default
- Redirect to login works

---

## Stage 3: Login API & JWT Generation

### What This Stage Does
- Implements login endpoint with username + password validation
- Generates JWT with username as subject, role as claim
- Uses standard algorithm (HS256) with a secret key
- Stores token in `CJWT` table with expiry
- Returns token as HTTP-only cookie + success response

### Deliverables
| Item | Description |
|------|-------------|
| **POST /api/login** | Validates username & password |
| **JWT Generation** | `jsonwebtoken` library, HS256, username=sub, role=claim |
| **Token Storage** | Insert into CJWT with uid, token, expiry |
| **Cookie** | Set `token` cookie (HTTP-only, Secure in prod) |
| **Login Page** | React form, redirect to dashboard on success |

### JWT Payload Structure
```json
{
  "sub": "username",
  "role": "Customer",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Success Criteria
- Valid credentials return 200 + cookie
- Invalid credentials return 401
- Token appears in CJWT table
- User redirected to dashboard

---

## Stage 4: JWT Middleware & Protected Routes

### What This Stage Does
- Creates Express middleware to verify JWT from cookie
- Validates signature and expiry
- Attaches user info (username, role) to `req` for downstream use
- Protects `/api/balance` and future protected endpoints

### Deliverables
| Item | Description |
|------|-------------|
| **authMiddleware.js** | Reads cookie, verifies JWT, rejects if invalid |
| **Protected Route Pattern** | Apply middleware to sensitive endpoints |
| **Error Handling** | 401 for missing/invalid/expired token |

### Success Criteria
- Unauthenticated requests to protected routes get 401
- Valid token allows request to proceed

---

## Stage 5: Check Balance API & Dashboard

### What This Stage Does
- Implements GET `/api/balance` (protected)
- Extracts username from verified JWT
- Fetches balance from `kodusers` by username
- Returns balance to client
- Builds user dashboard with "Check Balance" button
- Sends JWT cookie automatically with fetch (credentials: 'include')

### Deliverables
| Item | Description |
|------|-------------|
| **GET /api/balance** | Returns `{ balance: number }` |
| **User Dashboard** | Page with "Check Balance" button |
| **Balance Display** | Shows "Your balance is: ₹X" (or currency) |
| **Fetch with Credentials** | Ensures cookie is sent |

### Success Criteria
- Clicking "Check Balance" returns correct balance
- Invalid/missing token returns 401

---

## Stage 6: UI Polish & Celebration Animation

### What This Stage Does
- Adds a "party popper" / celebration animation when balance is displayed
- Uses CSS animations or a library (e.g., canvas-confetti)
- Improves overall UI/UX (loading states, error messages, styling)

### Deliverables
| Item | Description |
|------|-------------|
| **Celebration Animation** | Party popper effect when balance loads |
| **Loading State** | Spinner/skeleton while fetching |
| **Error Handling** | User-friendly messages for 401, 500 |
| **Responsive Design** | Works on mobile and desktop |

### Success Criteria
- Balance reveal triggers a satisfying visual celebration
- App feels polished and professional

---

## Technology Stack Recommendation

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js + Express |
| **Database** | MySQL (AIVEN) via `mysql2` |
| **JWT** | `jsonwebtoken` |
| **Password** | `bcrypt` |
| **Frontend** | React (Vite or CRA) |
| **HTTP Client** | fetch with credentials |
| **Animation** | canvas-confetti or CSS keyframes |

---

## File Structure (Target)

```
KodBank/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── balance.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .env.example
└── KODBANK_BUILD_PLAN.md
```

---

## Security Notes

1. **Never commit** `.env` or real DB credentials to git
2. Use **bcrypt** for passwords (never store plain text)
3. Use **HTTP-only cookies** for JWT (not localStorage) to reduce XSS risk
4. Set **Secure** and **SameSite** on cookies in production
5. Use **HTTPS** in production for AIVEN connection (ssl-mode=REQUIRED is already in URL)

---

## Execution Order

| Stage | Depends On | Estimated Effort |
|-------|------------|------------------|
| 1 | None | 30 min |
| 2 | 1 | 45 min |
| 3 | 1, 2 | 45 min |
| 4 | 3 | 20 min |
| 5 | 4 | 30 min |
| 6 | 5 | 30 min |

**Total estimated time:** ~3.5 hours

---

## Next Step

When you're ready to start, say **"Begin Stage 1"** and we'll implement the project setup and database schema.
