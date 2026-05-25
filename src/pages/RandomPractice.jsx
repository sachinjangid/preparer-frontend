import { useState } from 'react'
import { getRandomQuestion } from '../api/practice'
import Navbar from '../components/Navbar'

function getQuestionText(questionData) {
  return (
    questionData?.question?.question ??
    questionData?.question ??
    questionData?.text ??
    ''
  )
}

function RandomPractice() {
  const [questionData, setQuestionData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGetQuestion() {
    setIsLoading(true)
    setError('')

    try {
      const data = await getRandomQuestion()
      setQuestionData(data)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const questionText = getQuestionText(questionData)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <a
          href="/practice"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          Back to practice
        </a>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl text-center">
            {questionData ? (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-left shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Random Question
                </p>
                <h1 className="mt-3 whitespace-pre-wrap text-2xl font-bold leading-9 text-slate-950">
                  {questionText || 'Question loaded.'}
                </h1>
              </div>
            ) : null}

            {error ? (
              <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleGetQuestion}
              disabled={isLoading}
              className={
                questionData
                  ? 'mt-6 rounded-lg bg-slate-950 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400'
                  : 'rounded-lg bg-slate-950 px-10 py-5 text-lg font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400'
              }
            >
              {isLoading
                ? 'Loading...'
                : questionData
                  ? 'Next Question'
                  : 'Start Practice'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RandomPractice
