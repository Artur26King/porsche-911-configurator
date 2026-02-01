# Porsche 911 — Dream & Motivation

A motivational "almost e-commerce" site about the Porsche 911. The goal is not real selling, but motivating young men to work hard for their dream car.

## Architecture

- **Frontend**: 
  - React (Vite) SPA in `/frontend/src` - Main app
  - Vanilla HTML/CSS/JS Auth pages in `/frontend/auth` - Authentication flow
- **Backend**: Node.js + Express, MongoDB
- **Auth**: Email verification → PIN password → PIN login (no JWT, no sessions)
- **Configurator**: Model, color, wheels, interior, live price. "Pay" shows a motivational modal, no real payment.

## Project Structure

```
/frontend          — Frontend application
  /auth            — Vanilla HTML/CSS/JS auth pages
    register.html  — Registration page
    verify.html    — Email verification page
    pin.html       — PIN creation page
    login.html     — Login page
    dashboard.html — Protected dashboard
    auth.js        — API client functions
    style.css      — Dark aggressive styling
  /src             — Vite + React SPA (main app)
    /components    — Reusable UI
    /pages         — Route-level pages
    /styles        — CSS files
    /services      — API calls
    /hooks         — Custom hooks
    /context       — Auth etc.
    /data          — Porsche models, options (in code)
  /public/images   — Porsche images (placeholders)

/backend           — Express API
  /src
    /config        — DB, env
    /controllers   — Request handlers
    /routes        — API routes
    /models        — Mongoose models
    /services      — Email, business logic
    /utils         — Helpers
    /middlewares   — Auth, validation
  server.js        — Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) Ethereal / SMTP for verification emails

### Backend Setup

```bash
cd backend
cp ../.env.example .env
# Edit .env: Set MONGODB_URI (e.g., mongodb://localhost:27017/porsche911)
npm install
npm run dev
```

Backend runs on `http://localhost:5000` by default.

**Note**: In DEV MODE, verification codes are printed to the backend terminal instead of being sent via email.

### Frontend Setup

#### Option 1: Vanilla HTML Auth Pages (Authentication Flow)

Open `/frontend/auth/register.html` in your browser using:
- **VS Code Live Server extension** (right-click → "Open with Live Server")
- **Python simple server**: `python -m http.server 8000` (in `/frontend/auth` directory)
- **Node.js http-server**: `npx http-server -p 8000` (in `/frontend/auth` directory)

The auth pages connect to `http://localhost:5000` (backend API).

#### Option 2: React SPA (Main Application)

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` by default. In dev, API calls are proxied from `/api` to the backend; no `VITE_API_URL` needed. For production builds, set `VITE_API_URL` in frontend `.env` to your API base URL.

## Authentication Flow

### Complete Flow

1. **Registration** (`/frontend/auth/register.html`)
   - User provides nickname (min 3 chars) and email (must contain @)
   - Backend generates a 4-digit verification code
   - Code is stored in MongoDB with expiration (5 minutes)
   - **DEV MODE**: Code is printed to backend terminal (no real emails sent)
   - User is redirected to verification page

2. **Email Verification** (`/frontend/auth/verify.html`)
   - User enters the 4-digit code from terminal
   - Backend checks code matches and is not expired
   - If correct, user is marked as verified (`isVerified: true`)
   - User is redirected to PIN creation page

3. **PIN Creation** (`/frontend/auth/pin.html`)
   - User sets a 4-digit numeric PIN
   - PIN is hashed with bcrypt and stored in MongoDB (`pinHash`)
   - User is redirected to login page

4. **Login** (`/frontend/auth/login.html`)
   - User enters nickname and 4-digit PIN
   - Backend verifies credentials
   - If valid, user is redirected to dashboard

5. **Dashboard** (`/frontend/auth/dashboard.html`)
   - Protected page showing user info
   - Logout functionality

### Database Schema

User model fields:
- `nickname` (unique, min 3 chars)
- `email` (unique, lowercase)
- `verificationCode` (4-digit code, stored during registration)
- `codeExpiresAt` (expiration timestamp, 5 minutes from creation)
- `isVerified` (boolean, true after code verification)
- `pinHash` (bcrypt hash, set after PIN creation)

## API Endpoints

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Register with nickname + email → sends verification code |
| POST | /auth/verify | Verify email with code → marks email as verified |
| POST | /auth/create-pin | Create 4-digit PIN password (after email verification) |
| POST | /auth/login | Login with nickname + 4-digit PIN |

### Configuration (protected routes - auth middleware needs implementation)

| Method | Path | Description |
|--------|------|-------------|
| POST | /config/save | Save configuration (auth required) |
| GET | /config/user | List saved configurations (auth required) |

## API Examples

### 1. Register

```bash
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "nickname": "dreamer",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification code generated. Check terminal for code.",
  "email": "user@example.com"
}
```

**Backend Terminal Output (DEV MODE):**
```
========================================
🔐 VERIFICATION CODE (DEV MODE)
========================================
Email: user@example.com
Code: 1234
Expires at: 1/28/2026, 3:45:00 PM
========================================
```

### 2. Verify Email

```bash
POST http://localhost:5000/auth/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "1234"
}
```

**Response:**
```json
{
  "message": "Email verified successfully. Please create your PIN password.",
  "emailVerified": true
}
```

### 3. Create PIN

```bash
POST http://localhost:5000/auth/create-pin
Content-Type: application/json

{
  "email": "user@example.com",
  "pin": "5678"
}
```

**Response:**
```json
{
  "message": "PIN created successfully. You can now login."
}
```

### 4. Login

```bash
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "nickname": "dreamer",
  "pin": "5678"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "nickname": "dreamer",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

### Error Responses

- `400` - Bad request (validation errors, missing fields)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (email not verified, PIN not set)
- `404` - Not found (user not found)
- `409` - Conflict (nickname or email already exists)
- `500` - Server error

## Environment Variables

See `.env.example`. Key ones:

- `PORT` - Backend port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (e.g., `mongodb://localhost:27017/porsche911`)
- `NODE_ENV` - Environment (development/production)

**Note**: No email configuration needed in DEV MODE. Verification codes are printed to terminal.

## Deployment

- Frontend: build with `npm run build`, serve `dist/` (e.g. Vercel, Netlify, S3+CloudFront).
- Backend: run `node server.js` or use a process manager; set `NODE_ENV=production` and real `MONGODB_URI`, SMTP, CORS origin.

## License

For educational / motivational use.
