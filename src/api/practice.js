import apiRequest from './api'

export async function getRandomQuestion() {
  return apiRequest('/practice/question/random')
}

export async function getRandomQuestionByCategory(categoryId) {
  return apiRequest(`/practice/question/category/${categoryId}/random`)
}

export async function verifyAnswer(answerDetails) {
  return apiRequest('/practice/answer/verify', {
    method: 'POST',
    body: JSON.stringify(answerDetails),
  })
}

export async function getQuestionAnswer(questionDetails) {
  return apiRequest('/practice/question/get-answer', {
    method: 'POST',
    body: JSON.stringify(questionDetails),
  })
}
