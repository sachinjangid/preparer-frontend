import { useEffect, useState } from 'react'
import { createQuestion, getQuestionsByCategory } from '../api/question'
import Navbar from '../components/Navbar'

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

function CategoryQuestions({ categoryId }) {
  const categoryName = new URLSearchParams(window.location.search).get('name')
  const [questions, setQuestions] = useState([])
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  async function loadQuestions() {
    setIsLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const questionList = await getQuestionsByCategory(categoryId)
      setQuestions(questionList)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let shouldUpdate = true

    getQuestionsByCategory(categoryId)
      .then((questionList) => {
        if (shouldUpdate) {
          setQuestions(questionList)
        }
      })
      .catch((error) => {
        if (shouldUpdate) {
          setStatus({ type: 'error', message: error.message })
        }
      })
      .finally(() => {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      })

    return () => {
      shouldUpdate = false
    }
  }, [categoryId])

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setStatus({ type: '', message: '' })

    try {
      await createQuestion(categoryId, {
        question,
      })
      setQuestion('')
      setIsFormOpen(false)
      await loadQuestions()
      setStatus({ type: 'success', message: 'Question created successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="/categories"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Back to categories
            </a>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              {categoryName ?? 'Questions'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Category ID: {categoryId}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setStatus({ type: '', message: '' })
              setIsFormOpen(true)
            }}
            className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Create New Question
          </button>
        </div>

        {isFormOpen ? (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              Create Question
            </h2>

            <div className="mt-5">
              <label
                htmlFor="question"
                className="block text-sm font-medium text-slate-700"
              >
                Question
              </label>
              <textarea
                id="question"
                name="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                required
                rows="4"
                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSaving ? 'Saving...' : 'Create Question'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuestion('')
                  setIsFormOpen(false)
                }}
                disabled={isSaving}
                className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {status.message ? (
          <p
            className={
              status.type === 'success'
                ? 'mt-8 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700'
                : 'mt-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
            }
          >
            {status.message}
          </p>
        ) : null}

        {isLoading ? (
          <p className="mt-8 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            Loading questions...
          </p>
        ) : null}

        {!isLoading && status.type !== 'error' ? (
          questions.length > 0 ? (
            <div className="mt-8 space-y-4">
              {questions.map((questionItem, index) => (
                <article
                  key={questionItem.questionId}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-500">
                    Question {index + 1}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-950">
                    {questionItem.question}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span>Created: {formatDate(questionItem.createdAt)}</span>
                    <span>Updated: {formatDate(questionItem.updatedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              No questions found.
            </p>
          )
        ) : null}
      </section>
    </main>
  )
}

export default CategoryQuestions
