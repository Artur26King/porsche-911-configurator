// Porsche 911 Dream - Auth API Client

const API_BASE_URL = 'http://localhost:5000';

/**
 * Display error message
 */
function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
    setTimeout(() => {
      errorEl.classList.remove('show');
    }, 5000);
  }
}

/**
 * Display success message
 */
function showSuccess(elementId, message) {
  const successEl = document.getElementById(elementId);
  if (successEl) {
    successEl.textContent = message;
    successEl.classList.add('show');
    setTimeout(() => {
      successEl.classList.remove('show');
    }, 5000);
  }
}

/**
 * Register user
 */
async function register(nickname, email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Verify email with code
 */
async function verifyEmail(email, code) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Verification failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Create PIN
 */
async function createPIN(email, pin) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/create-pin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, pin }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'PIN creation failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Login
 */
async function login(nickname, pin) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname, pin }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Store email in sessionStorage for multi-step flow
 */
function storeEmail(email) {
  sessionStorage.setItem('auth_email', email);
}

/**
 * Get stored email from sessionStorage
 */
function getStoredEmail() {
  return sessionStorage.getItem('auth_email');
}

/**
 * Clear stored email
 */
function clearStoredEmail() {
  sessionStorage.removeItem('auth_email');
}

/**
 * Store user data after login
 */
function storeUser(user) {
  sessionStorage.setItem('auth_user', JSON.stringify(user));
}

/**
 * Get stored user data
 */
function getStoredUser() {
  const userStr = sessionStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Clear stored user data
 */
function clearUser() {
  sessionStorage.removeItem('auth_user');
  clearStoredEmail();
}
