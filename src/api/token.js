const TOKEN_KEY = 'preparer_auth_token'

export function getAuthToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function saveAuthToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}
