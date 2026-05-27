import { useEffect, useState } from 'react'
import {
  createQuestion,
  deleteQuestion,
  generateQuestions,
  getQuestionsByCategory,
  updateQuestion,
} from '../api/question'
import Navbar from '../components/Navbar'

const emptyGenerateForm = {
  topic: '',
  difficulty: 'easy',
}

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
  const [editQuestion, setEditQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isGenerateFormOpen, setIsGenerateFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savingGeneratedIndex, setSavingGeneratedIndex] = useState(null)
  const [editingQuestionId, setEditingQuestionId] = useState('')
  const [deletingQuestionId, setDeletingQuestionId] = useState('')
  const [generateForm, setGenerateForm] = useState({
    ...emptyGenerateForm,
    topic: categoryName ?? '',
  })
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [generatedQuestionIndex, setGeneratedQuestionIndex] = useState(0)
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
      setStatus({
        type: 'success',
        message: 'Question created successfully.',
      })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  function handleGenerateClick() {
    setGenerateForm({
      ...emptyGenerateForm,
      topic: categoryName ?? '',
    })
    setGeneratedQuestions([])
    setGeneratedQuestionIndex(0)
    setEditingQuestionId('')
    setEditQuestion('')
    setIsFormOpen(false)
    setIsGenerateFormOpen(true)
    setStatus({ type: '', message: '' })
  }

  function handleGenerateFormChange(event) {
    const { name, value } = event.target
    setGenerateForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function handleGenerateSubmit(event) {
    event.preventDefault()
    setIsGenerating(true)
    setGeneratedQuestions([])
    setGeneratedQuestionIndex(0)
    setStatus({ type: '', message: '' })

    try {
      const questionList = await generateQuestions(categoryId, generateForm)
      setGeneratedQuestions(questionList)

      if (questionList.length === 0) {
        setStatus({
          type: 'error',
          message: 'No generated questions were returned.',
        })
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSaveGeneratedQuestion() {
    const generatedQuestion = generatedQuestions[generatedQuestionIndex]

    if (!generatedQuestion?.question) {
      return
    }

    setSavingGeneratedIndex(generatedQuestionIndex)
    setStatus({ type: '', message: '' })

    try {
      await createQuestion(categoryId, {
        question: generatedQuestion.question,
      })
      await loadQuestions()
      setStatus({
        type: 'success',
        message: 'Generated question saved successfully.',
      })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSavingGeneratedIndex(null)
    }
  }

  function handleEditClick(questionItem) {
    setEditQuestion(questionItem.question)
    setEditingQuestionId(questionItem.questionId)
    setStatus({ type: '', message: '' })
    setIsFormOpen(false)
    setIsGenerateFormOpen(false)
  }

  function handleCancelEdit() {
    setEditQuestion('')
    setEditingQuestionId('')
  }

  async function handleEditSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setStatus({ type: '', message: '' })

    try {
      await updateQuestion(categoryId, editingQuestionId, {
        question: editQuestion,
      })
      setEditQuestion('')
      setEditingQuestionId('')
      await loadQuestions()
      setStatus({
        type: 'success',
        message: 'Question updated successfully.',
      })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteClick(questionItem) {
    const shouldDelete = window.confirm(
      `Delete this question? This cannot be undone.`,
    )

    if (!shouldDelete) {
      return
    }

    setDeletingQuestionId(questionItem.questionId)
    setStatus({ type: '', message: '' })

    try {
      await deleteQuestion(categoryId, questionItem.questionId)
      setQuestions((currentQuestions) =>
        currentQuestions.filter(
          (currentQuestion) =>
            currentQuestion.questionId !== questionItem.questionId,
        ),
      )
      setStatus({ type: 'success', message: 'Question deleted successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setDeletingQuestionId('')
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setStatus({ type: '', message: '' })
                setQuestion('')
                setEditingQuestionId('')
                setEditQuestion('')
                setIsGenerateFormOpen(false)
                setIsFormOpen(true)
              }}
              className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + Create New Question
            </button>
            <button
              type="button"
              onClick={handleGenerateClick}
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Generate Questions
            </button>
          </div>
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

        {isGenerateFormOpen ? (
          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <form onSubmit={handleGenerateSubmit}>
              <h2 className="text-lg font-semibold text-slate-950">
                Generate Questions
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="generate-topic"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Topic
                  </label>
                  <input
                    id="generate-topic"
                    name="topic"
                    type="text"
                    value={generateForm.topic}
                    onChange={handleGenerateFormChange}
                    required
                    className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="generate-difficulty"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Difficulty
                  </label>
                  <select
                    id="generate-difficulty"
                    name="difficulty"
                    value={generateForm.difficulty}
                    onChange={handleGenerateFormChange}
                    className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isGenerating ? 'Generating...' : 'Generate Questions'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsGenerateFormOpen(false)
                    setGeneratedQuestions([])
                    setGeneratedQuestionIndex(0)
                  }}
                  disabled={isGenerating}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Cancel
                </button>
              </div>
            </form>

            {generatedQuestions.length > 0 ? (
              <article className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-500">
                    Generated Question {generatedQuestionIndex + 1} of{' '}
                    {generatedQuestions.length}
                  </p>
                  {generatedQuestions[generatedQuestionIndex]?.topic ? (
                    <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                      {generatedQuestions[generatedQuestionIndex].topic}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 whitespace-pre-wrap text-lg font-semibold text-slate-950">
                  {generatedQuestions[generatedQuestionIndex]?.question}
                </h3>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setGeneratedQuestionIndex((currentIndex) =>
                        Math.max(currentIndex - 1, 0),
                      )
                    }
                    disabled={generatedQuestionIndex === 0}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setGeneratedQuestionIndex((currentIndex) =>
                        Math.min(
                          currentIndex + 1,
                          generatedQuestions.length - 1,
                        ),
                      )
                    }
                    disabled={
                      generatedQuestionIndex === generatedQuestions.length - 1
                    }
                    className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveGeneratedQuestion}
                    disabled={savingGeneratedIndex === generatedQuestionIndex}
                    className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {savingGeneratedIndex === generatedQuestionIndex
                      ? 'Saving...'
                      : 'Save Question'}
                  </button>
                </div>
              </article>
            ) : null}
          </section>
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
                editingQuestionId === questionItem.questionId ? (
                  <form
                    key={questionItem.questionId}
                    onSubmit={handleEditSubmit}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-500">
                      Question {index + 1}
                    </p>
                    <label
                      htmlFor={`question-${questionItem.questionId}`}
                      className="mt-4 block text-sm font-medium text-slate-700"
                    >
                      Question
                    </label>
                    <textarea
                      id={`question-${questionItem.questionId}`}
                      value={editQuestion}
                      onChange={(event) => setEditQuestion(event.target.value)}
                      required
                      rows="4"
                      className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                    />
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {isSaving ? 'Saving...' : 'Update Question'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <article
                    key={questionItem.questionId}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-medium text-slate-500">
                        Question {index + 1}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(questionItem)}
                          aria-label={`Edit question ${index + 1}`}
                          className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(questionItem)}
                          disabled={
                            deletingQuestionId === questionItem.questionId
                          }
                          aria-label={`Delete question ${index + 1}`}
                          className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h2 className="mt-2 whitespace-pre-wrap text-lg font-semibold text-slate-950">
                      {questionItem.question}
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span>
                        Created: {formatDate(questionItem.createdAt)}
                      </span>
                      <span>
                        Updated: {formatDate(questionItem.updatedAt)}
                      </span>
                    </div>
                  </article>
                )
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
