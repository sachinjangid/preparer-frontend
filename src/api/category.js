import apiRequest from './api'

export async function getAllCategories() {
  const data = await apiRequest('/category/all')

  return data?.categories ?? []
}
