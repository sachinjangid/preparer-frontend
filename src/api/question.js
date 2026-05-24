import apiRequest from './api'

export async function getQuestionsByCategory(categoryId) {
  const data = await apiRequest(`/category/${categoryId}/questions`)

  if (Array.isArray(data)) {
    return data
  }

  return data?.questions ?? []
}

export async function createQuestion(categoryId, questionDetails) {
  return apiRequest(`/category/${categoryId}/question`, {
    method: 'POST',
    body: JSON.stringify(questionDetails),
  })
}
