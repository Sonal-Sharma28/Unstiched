export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let data;
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Attempt to parse JSON response
    try {
      data = await response.json();
    } catch (e) {
      // Return empty if response is not JSON
      if (response.ok) return null;
    }

    if (!response.ok) {
      throw new ApiError(response.status, data?.error || 'An unexpected error occurred');
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') throw err;
    throw new ApiError(0, err.message || 'Network error');
  }
}
