# Authentication Flow Documentation

## Overview

Simple authentication system: **Email verification → PIN password → PIN login**
- No JWT tokens
- No sessions
- PIN-based authentication

## Flow Steps

### 1. Registration (`POST /auth/register`)

**Input:**
- `nickname` (string, min 3 characters)
- `email` (string, valid email format)

**Process:**
- Validate nickname length (≥3 chars)
- Validate email format
- Check if nickname or email already exists
- Create user record (not verified, no password)
- Generate 4-digit code
- Store code in `VerificationCode` collection (TTL: 5 minutes)
- Send code via email using Nodemailer

**Response:**
```json
{
  "message": "Verification code sent to your email",
  "email": "user@example.com"
}
```

### 2. Email Verification (`POST /auth/verify`)

**Input:**
- `email` (string)
- `code` (string, 4 digits)

**Process:**
- Find user by email
- Check if email already verified
- Find verification code (not expired)
- Mark user as `emailVerified = true`
- Delete used code

**Response:**
```json
{
  "message": "Email verified successfully. Please create your PIN password.",
  "emailVerified": true
}
```

### 3. Create PIN (`POST /auth/create-pin`)

**Input:**
- `email` (string)
- `pin` (string, exactly 4 digits)

**Process:**
- Find user by email
- Check if email is verified
- Check if PIN already set
- Validate PIN format (4 digits)
- Hash PIN using bcrypt (10 salt rounds)
- Store `passwordHash` in user record

**Response:**
```json
{
  "message": "PIN created successfully. You can now login."
}
```

### 4. Login (`POST /auth/login`)

**Input:**
- `nickname` (string)
- `pin` (string, exactly 4 digits)

**Process:**
- Find user by nickname
- Check if email is verified
- Check if PIN is set
- Validate PIN format
- Compare PIN with stored hash using bcrypt
- Return user info on success

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

## Database Models

### User
```javascript
{
  nickname: String (unique, min 3 chars),
  email: String (unique, lowercase),
  passwordHash: String (bcrypt hash, nullable),
  emailVerified: Boolean (default: false),
  timestamps: true
}
```

### VerificationCode
```javascript
{
  email: String (lowercase),
  code: String (4 digits),
  expiresAt: Date (TTL: 5 minutes),
  timestamps: true
}
```

## Validation Rules

- **Nickname**: Minimum 3 characters, trimmed
- **Email**: Valid email format, lowercase, trimmed
- **PIN**: Exactly 4 numeric digits
- **Verification Code**: 4 digits, expires after 5 minutes

## Security Notes

- PINs are hashed with bcrypt (10 salt rounds)
- Verification codes expire after 5 minutes
- Email must be verified before PIN can be set
- PIN must be set before login
- No JWT or sessions — stateless authentication

## Error Codes

- `400` - Bad request (validation errors, missing fields)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (email not verified, PIN not set)
- `404` - Not found (user not found)
- `409` - Conflict (nickname or email already exists)
- `500` - Server error
