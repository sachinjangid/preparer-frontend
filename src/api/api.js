import { getAuthToken } from './token'

const API_BASE_URL = import.meta.env.API_BASE_URL ?? 'http://localhost:8080'

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(
      error?.message ?? `API request failed with status ${response.status}`,
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json().catch(() => null)
}

export default apiRequest
