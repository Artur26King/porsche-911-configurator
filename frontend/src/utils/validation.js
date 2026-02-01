/**
 * Validation utilities matching backend rules
 */

/**
 * Validate email format (must contain @)
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return email.trim().includes('@');
}

/**
 * Validate nickname: must be at least 3 characters
 */
export function isValidNickname(nickname) {
  if (!nickname || typeof nickname !== 'string') return false;
  return nickname.trim().length >= 3;
}

/**
 * Validate PIN: must be exactly 4 digits
 */
export function isValidPIN(pin) {
  if (!pin) return false;
  return /^\d{4}$/.test(String(pin).trim());
}
