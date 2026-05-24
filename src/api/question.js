import apiRequest from './api'

export async function createQuestion(questionDetails) {
  return apiRequest('/question', {
    method: 'POST',
    body: JSON.stringify(questionDetails),
  })
}
