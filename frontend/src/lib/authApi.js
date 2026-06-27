const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

function getAuthHeaders() {
  const token = window.localStorage.getItem('token');

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.error || `API-Fehler (${response.status})`);
  }

  return body;
}

export function loginUser({ email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function fetchCurrentUser() {
  return request('/api/auth/me', {
    method: 'GET',
  });
}
