/**
 * In-memory store for pending registrations.
 * Flow: register (no DB) → verify (confirm email only, mark verified) → set-password (create user with permanent password; verification code discarded).
 * User is persisted only at set-password; verification code is never stored as password.
 */

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/** @type {Map<string, { nickname: string, email: string, code: string, expiresAt: Date, verified?: boolean }>} */
const pending = new Map();

/**
 * Remove expired entries for a given email (or all expired if no email).
 */
function pruneExpired(email = null) {
  const now = new Date();
  if (email) {
    const entry = pending.get(email);
    if (entry && entry.expiresAt < now) {
      pending.delete(email);
    }
    return;
  }
  for (const [e, entry] of pending.entries()) {
    if (entry.expiresAt < now) pending.delete(e);
  }
}

/**
 * Store a pending registration (no DB write).
 * @param {string} nickname
 * @param {string} email
 * @param {string} code
 * @returns {void}
 */
export function add(nickname, email, code) {
  pruneExpired(email);
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);
  pending.set(email, { nickname, email, code, expiresAt });
}

/**
 * Verify code for a pending registration. Marks as verified if valid.
 * @param {string} email
 * @param {string} code
 * @returns {{ nickname: string, email: string } | null}
 */
export function verifyAndMark(email, code) {
  pruneExpired(email);
  const entry = pending.get(email);
  if (!entry) return null;
  if (entry.expiresAt < new Date()) return null;
  const trimmed = String(code).trim();
  if (entry.code !== trimmed) return null;
  entry.verified = true;
  return { nickname: entry.nickname, email: entry.email };
}

/**
 * Get verified pending registration and remove it (consumed on set-password).
 * @param {string} email
 * @returns {{ nickname: string, email: string } | null}
 */
export function takeVerified(email) {
  pruneExpired(email);
  const entry = pending.get(email);
  if (!entry || !entry.verified) return null;
  pending.delete(email);
  return { nickname: entry.nickname, email: entry.email };
}

/**
 * Check if email has a pending (optionally verified) registration.
 * @param {string} email
 * @param {boolean} [verifiedOnly]
 * @returns {boolean}
 */
export function has(email, verifiedOnly = false) {
  pruneExpired(email);
  const entry = pending.get(email);
  if (!entry) return false;
  return verifiedOnly ? !!entry.verified : true;
}

/**
 * Remove pending registration for email (e.g. on send failure).
 * @param {string} email
 */
export function remove(email) {
  pending.delete(email);
}
