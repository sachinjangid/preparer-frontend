import apiRequest from './api'

export async function getRandomQuestion() {
  return apiRequest('/practice/question/random')
}
