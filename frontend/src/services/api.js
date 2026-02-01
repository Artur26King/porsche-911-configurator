/**
 * API base. Set VITE_API_URL for production (e.g. https://api.example.com).
 * Defaults to http://localhost:5000 for development.
 */
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
function api(path) {
  return `${BASE}${path}`;
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function register(nickname, email) {
  const res = await fetch(api('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function verify(email, code) {
  const res = await fetch(api('/auth/verify'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Verification failed');
  return data;
}

export async function setPassword(email, password) {
  const res = await fetch(api('/auth/set-password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to set password');
  return data;
}

export async function createPIN(email, pin) {
  const res = await fetch(api('/auth/create-pin'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pin }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'PIN creation failed');
  return data;
}

export async function login(nicknameOrEmail, password) {
  const res = await fetch(api('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nicknameOrEmail, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function saveConfig(config) {
  const res = await fetch(api('/config/save'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(config),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to save');
  return data;
}

export async function updateConfig(id, config) {
  const res = await fetch(api(`/config/${id}`), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(config),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update');
  return data;
}

export async function deleteConfig(id) {
  const res = await fetch(api(`/config/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete');
  return data;
}

export async function getUserConfigs() {
  const res = await fetch(api('/config/user'), {
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load');
  return data;
}
