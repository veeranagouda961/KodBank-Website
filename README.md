# 🏦 KodBank Application 

A secure full-stack banking application with JWT authentication, user registration, balance checking, and an integrated AI support chatbot (**KodSupport AI**) that assists users in real time.

---

## 🚀 Live Overview

KodBank is a modern banking demo platform designed to demonstrate secure authentication, protected APIs, database integration, and AI-powered customer support inside a single production-style project.

It showcases real-world full-stack architecture suitable for portfolios, internships, and interviews.

---

## ✨ Core Features

* Secure user registration with default balance (₹100,000)
* JWT authentication with protected routes
* Balance checking with celebration animation
* Persistent MySQL database (AIVEN cloud)
* Role-ready schema design
* Integrated AI chatbot for user assistance
* Production-style project structure

---

## 🤖 KodSupport AI (Integrated Chatbot)

KodSupport AI is an intelligent in-app assistant embedded in the frontend.

### Capabilities

* User guidance inside KodBank
* Banking feature explanation
* Troubleshooting help
* FAQ handling
* Navigation support
* Developer support simulation (customer support use case)

The chatbot runs independently without modifying existing business logic.

---

## 🧱 Tech Stack

### Frontend

* React
* Vite
* Modern UI animations

### Backend

* Node.js
* Express.js
* REST API architecture

### Database

* MySQL (AIVEN Cloud)

### Authentication

* JWT (HTTP-only cookies)

### AI Layer

* KodSupport AI chatbot
* LLM-based assistant integration

---

## 📁 Project Structure

```
KodBank/
 ├─ backend/
 │   ├─ routes/
 │   ├─ controllers/
 │   ├─ middleware/
 │   ├─ db/
 │   └─ server.js
 │
 ├─ frontend/
 │   ├─ components/
 │   ├─ pages/
 │   ├─ chatbot/   ← KodSupport AI
 │   └─ main.jsx
 │
 └─ README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd KodBank
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

`.env` already configured with AIVEN credentials.

Run backend:

```bash
npm start
# or
npm run dev
```

Backend:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

## 🗄️ Database Tables

### kodusers

Stores user information

* uid
* username
* email
* password (hashed)
* balance
* phone
* role

### CJWT

Stores JWT session tokens

* tid
* token
* uid
* expiry

---

## 🔌 API Endpoints

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | /api/health   | Health check       |
| POST   | /api/register | Register user      |
| POST   | /api/login    | Login (JWT cookie) |
| GET    | /api/balance  | Protected balance  |

---

## 🔐 Security Notes (Important for Interviews)

* Password hashing (bcrypt)
* JWT stored in HTTP-only cookies
* Protected middleware routes
* Environment variable isolation
* Cloud DB SSL connection
* Token expiry handling

---

## 🧠 Architecture (Interview-Level)

Client → React UI
Client → KodSupport Chatbot
Frontend → REST API (Express)
Backend → Auth Middleware → Controllers
Backend → MySQL (AIVEN)

Chatbot runs parallel to the core banking flow.

---

## 📦 Deployment Guide

### Backend

* Render / Railway / VPS

### Frontend

* Vercel (recommended)

### Environment Variables (Production)

Backend:

```
DB_URL=
JWT_SECRET=
NODE_ENV=production
```

Frontend:

```
VITE_API_URL=
```

---

## 📊 Resume Description (You can copy)

Built a full-stack banking application with secure JWT authentication, MySQL cloud database, protected APIs, and an integrated AI chatbot for real-time user support using React, Node.js, and Express.

---

## 📷 Screenshot Section (Add Later)

```
/screenshots/login.png
/screenshots/register.png
/screenshots/balance.png
/screenshots/chatbot.png
```

---

## 🛣️ Future Improvements

* Transactions module
* Chat history persistence
* Admin dashboard
* WebSockets
* Notifications
* AI personalization
* RBAC (role-based access)
* Payment gateway simulation

---

## 👨‍💻 Credits

Developed by **Veeranagouda**
KodNest ID: **KODYVB03M**

---

## ⭐ Why This Project Matters

This project demonstrates:

* Real production architecture
* Authentication design
* Cloud DB usage
* AI integration inside product
* Portfolio-ready full-stack skills

---

## 📄 License

For educational and portfolio use.
