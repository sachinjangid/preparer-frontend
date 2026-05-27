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

export async function generateQuestions(categoryId, questionDetails) {
  const data = await apiRequest(`/category/${categoryId}/question/generate`, {
    method: 'POST',
    body: JSON.stringify(questionDetails),
  })

  return data?.questions ?? []
}

export async function updateQuestion(categoryId, questionId, questionDetails) {
  return apiRequest(`/category/${categoryId}/question/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify(questionDetails),
  })
}

export async function deleteQuestion(categoryId, questionId) {
  return apiRequest(`/category/${categoryId}/question/${questionId}`, {
    method: 'DELETE',
  })
}
