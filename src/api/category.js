import apiRequest from './api'

export async function getAllCategories() {
  const data = await apiRequest('/category/all')

  return data?.categories ?? []
}

export async function createCategory(category) {
  return apiRequest('/category', {
    method: 'POST',
    body: JSON.stringify(category),
  })
}

export async function updateCategory(categoryId, category) {
  return apiRequest(`/category/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  })
}

export async function deleteCategory(categoryId) {
  return apiRequest(`/category/${categoryId}`, {
    method: 'DELETE',
  })
}
