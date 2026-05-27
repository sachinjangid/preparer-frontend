import { getAuthToken } from './token'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

function formatApiError(error, status) {
  if (!error || typeof error !== 'object') {
    return `API request failed with status ${status}`
  }

  const baseMessage =
    typeof error.error === 'string' && error.error.trim()
      ? error.error
      : error.message

  if (
    error.errors &&
    typeof error.errors === 'object' &&
    !Array.isArray(error.errors)
  ) {
    const fieldMessages = Object.entries(error.errors)
      .map(([field, message]) =>
        typeof message === 'string' && message.trim()
          ? `${field}: ${message}`
          : '',
      )
      .filter(Boolean)

    if (fieldMessages.length > 0) {
      return `${baseMessage ?? 'Please check the submitted details.'} ${fieldMessages.join('; ')}`
    }
  }

  return baseMessage ?? `API request failed with status ${status}`
}

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
    throw new Error(formatApiError(error, response.status))
  }

  if (response.status === 204) {
    return null
  }

  return response.json().catch(() => null)
}

export default apiRequest
