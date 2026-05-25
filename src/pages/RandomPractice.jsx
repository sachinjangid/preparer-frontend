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

        <div className="grid flex-1 place-items-center">
          <div className="grid w-full max-w-2xl grid-rows-[minmax(18rem,24rem)_auto_auto] gap-6 text-center">
            {questionData ? (
              <div className="flex min-h-0 rounded-lg border border-slate-200 bg-white p-8 text-left shadow-sm">
                <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                  <p className="text-sm font-medium text-slate-500">
                    Random Question
                  </p>
                  <h1 className="mt-3 whitespace-pre-wrap text-2xl font-bold leading-9 text-slate-950">
                    {questionText || 'Question loaded.'}
                  </h1>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleGetQuestion}
                  disabled={isLoading}
                  className="rounded-lg bg-slate-950 px-10 py-5 text-lg font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isLoading ? 'Loading...' : 'Start Practice'}
                </button>
              </div>
            )}

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            ) : (
              <div aria-hidden="true" />
            )}

            {questionData ? (
              <button
                type="button"
                onClick={handleGetQuestion}
                disabled={isLoading}
                className="justify-self-center rounded-lg bg-slate-950 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading ? 'Loading...' : 'Next Question'}
              </button>
            ) : (
              <div aria-hidden="true" />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default RandomPractice
