import apiRequest from './api'
import { saveAuthToken } from './token'

export async function loginUser(credentials) {
  const data = await apiRequest('/user/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  if (data?.token) {
    saveAuthToken(data.token)
  }

  return data
}

export async function registerUser(userDetails) {
  const data = await apiRequest('/user/register', {
    method: 'POST',
    body: JSON.stringify(userDetails),
  })

  if (data?.token) {
    saveAuthToken(data.token)
  }

  return data
}
