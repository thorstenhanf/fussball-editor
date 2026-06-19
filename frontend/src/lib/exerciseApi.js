const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

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

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.error || `API-Fehler (${response.status})`);
  }

  return body;
}

export function createExercise(payload) {
  return request('/api/exercises', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateExercise(id, payload) {
  return request(`/api/exercises/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function listExercises() {
  return request('/api/exercises', {
    method: 'GET',
  });
}
