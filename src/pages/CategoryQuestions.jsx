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

const emptyQuestionForm = {
  question: '',
  topic: '',
  difficulty: 'easy',
  check_related_questions: false,
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

function buildQuestionPayload(questionDetails) {
  return {
    question: questionDetails.question,
    difficulty: questionDetails.difficulty,
    ...(questionDetails.topic?.trim()
      ? { topic: questionDetails.topic.trim() }
      : {}),
    ...(questionDetails.check_related_questions
      ? { check_related_questions: true }
      : {}),
  }
}

function CategoryQuestions({ categoryId }) {
  const categoryName = new URLSearchParams(window.location.search).get('name')
  const [questions, setQuestions] = useState([])
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm)
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
  const [skippedGeneratedQuestionIndexes, setSkippedGeneratedQuestionIndexes] =
    useState([])
  const [isGeneratedBatchComplete, setIsGeneratedBatchComplete] =
    useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const currentGeneratedQuestion = generatedQuestions[generatedQuestionIndex]
  const canGoBackToSkippedQuestion =
    skippedGeneratedQuestionIndexes.length > 0 &&
    !isGenerating &&
    savingGeneratedIndex === null

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
      await createQuestion(categoryId, buildQuestionPayload(questionForm))

      setQuestionForm(emptyQuestionForm)
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
    setSkippedGeneratedQuestionIndexes([])
    setIsGeneratedBatchComplete(false)
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

  async function generateQuestionBatch(questionDetails = generateForm) {
    setIsGenerating(true)
    setGeneratedQuestions([])
    setGeneratedQuestionIndex(0)
    setSkippedGeneratedQuestionIndexes([])
    setIsGeneratedBatchComplete(false)
    setStatus({ type: '', message: '' })

    try {
      const questionList = await generateQuestions(categoryId, questionDetails)
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

  async function handleGenerateSubmit(event) {
    event.preventDefault()
    await generateQuestionBatch()
  }

  async function saveGeneratedQuestion({ checkRelatedQuestions = false } = {}) {
    const generatedQuestion = generatedQuestions[generatedQuestionIndex]

    if (!generatedQuestion?.question) {
      return false
    }

    setSavingGeneratedIndex(generatedQuestionIndex)
    setStatus({ type: '', message: '' })

    try {
      const data = await createQuestion(
        categoryId,
        buildQuestionPayload({
          question: generatedQuestion.question,
          topic: generatedQuestion.topic ?? generateForm.topic,
          difficulty: generatedQuestion.difficulty ?? generateForm.difficulty,
          check_related_questions: checkRelatedQuestions,
        }),
      )
      await loadQuestions()
      setStatus({
        type: 'success',
        message: 'Generated question saved successfully.',
      })
      return { data, savedIndex: generatedQuestionIndex }
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
      return null
    } finally {
      setSavingGeneratedIndex(null)
    }
  }

  function removeSavedGeneratedQuestion(savedIndex = generatedQuestionIndex) {
    const nextGeneratedQuestions = generatedQuestions.filter(
      (_, questionIndex) => questionIndex !== savedIndex,
    )

    setGeneratedQuestions(nextGeneratedQuestions)
    setSkippedGeneratedQuestionIndexes((currentIndexes) =>
      currentIndexes
        .filter((questionIndex) => questionIndex !== savedIndex)
        .map((questionIndex) =>
          questionIndex > savedIndex ? questionIndex - 1 : questionIndex,
        ),
    )

    if (
      nextGeneratedQuestions.length === 0 ||
      savedIndex >= generatedQuestions.length - 1
    ) {
      setGeneratedQuestionIndex(0)
      finishGeneratedBatch()
      return
    }

    setGeneratedQuestionIndex(
      Math.min(savedIndex, nextGeneratedQuestions.length - 1),
    )
    setIsGeneratedBatchComplete(false)
  }

  function finishGeneratedBatch() {
    setIsGeneratedBatchComplete(true)
  }

  function handleBackToSkippedQuestion() {
    setSkippedGeneratedQuestionIndexes((currentIndexes) => {
      if (currentIndexes.length === 0) {
        return currentIndexes
      }

      const previousIndex = currentIndexes[currentIndexes.length - 1]
      setGeneratedQuestionIndex(previousIndex)
      setIsGeneratedBatchComplete(false)
      setStatus({ type: '', message: '' })

      return currentIndexes.slice(0, -1)
    })
  }

  function handleCloseGeneratedQuestions() {
    setGeneratedQuestions([])
    setGeneratedQuestionIndex(0)
    setSkippedGeneratedQuestionIndexes([])
    setIsGeneratedBatchComplete(false)
    setStatus({ type: '', message: '' })
  }

  async function handleSaveGeneratedQuestion() {
    const result = await saveGeneratedQuestion()

    if (!result) {
      return
    }

    removeSavedGeneratedQuestion(result.savedIndex)
  }

  async function handleSkipGeneratedQuestion() {
    setSkippedGeneratedQuestionIndexes((currentIndexes) => [
      ...currentIndexes,
      generatedQuestionIndex,
    ])

    if (generatedQuestionIndex < generatedQuestions.length - 1) {
      setGeneratedQuestionIndex((currentIndex) => currentIndex + 1)
      setStatus({ type: '', message: '' })
      return
    }

    finishGeneratedBatch()
  }

  async function handleSaveAndFindRelevantQuestions() {
    const result = await saveGeneratedQuestion({ checkRelatedQuestions: true })

    if (!result) {
      return
    }

    removeSavedGeneratedQuestion(result.savedIndex)
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

  if (generatedQuestions.length > 0 || isGeneratedBatchComplete) {
    return (
      <main className="apple-page">
        <Navbar />

        {isGenerating ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 text-center text-white backdrop-blur-sm">
            <div>
              <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-white/40 border-t-white" />
              <p className="mt-5 text-lg font-bold">
                This process may take a few seconds. Please wait.
              </p>
            </div>
          </div>
        ) : null}

        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleCloseGeneratedQuestions}
            className="w-fit text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            Back to questions
          </button>

          {isGeneratedBatchComplete ? (
            <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-xl">
              <div className="apple-panel w-full max-w-lg text-center">
                <p className="apple-eyebrow">Generated set complete</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                  You have reviewed all generated questions.
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
                  Generate a fresh set, move into practice, or return to your
                  saved question list.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => generateQuestionBatch()}
                    className="apple-button-primary"
                  >
                    Generate More Questions
                  </button>
                  <a
                    href={`/practice/category/${categoryId}?name=${encodeURIComponent(categoryName ?? '')}`}
                    className="apple-button-secondary"
                  >
                    Start Practice
                  </a>
                  <button
                    type="button"
                    onClick={handleCloseGeneratedQuestions}
                    className="apple-button-secondary"
                  >
                    Go Back to Questions
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid flex-1 place-items-center">
            <div className="grid w-full max-w-3xl grid-rows-[minmax(20rem,32rem)_auto_auto] gap-5 text-center sm:gap-6">
              <div className="apple-panel grid min-h-0 gap-5 p-5 text-left sm:p-8">
                <div className="min-h-0 overflow-y-auto pr-2">
                  <div>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <div className="flex flex-wrap gap-2">
                        {currentGeneratedQuestion?.topic ? (
                          <span className="apple-chip">
                            {currentGeneratedQuestion.topic}
                          </span>
                        ) : null}
                        {currentGeneratedQuestion?.difficulty ? (
                          <span className="apple-chip capitalize">
                            {currentGeneratedQuestion.difficulty}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <h1 className="mt-3 whitespace-pre-wrap text-xl font-semibold leading-8 text-slate-950 sm:text-2xl sm:font-bold sm:leading-9">
                      {currentGeneratedQuestion?.question ??
                        'Question generated.'}
                    </h1>
                  </div>
                </div>
              </div>

              {status.message ? (
                <p
                  className={
                    status.type === 'success'
                      ? 'apple-status-success'
                      : 'apple-status-error'
                  }
                >
                  {status.message}
                </p>
              ) : (
                <div aria-hidden="true" />
              )}

              <div className="flex flex-wrap justify-center gap-3">
                {canGoBackToSkippedQuestion ? (
                  <button
                    type="button"
                    onClick={handleBackToSkippedQuestion}
                    className="apple-button-secondary text-sm sm:text-base"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleSkipGeneratedQuestion}
                  disabled={isGenerating || savingGeneratedIndex !== null}
                  className="apple-button-secondary text-sm sm:text-base"
                >
                  Skip Question
                </button>
                <button
                  type="button"
                  onClick={handleSaveGeneratedQuestion}
                  disabled={
                    isGenerating ||
                    savingGeneratedIndex === generatedQuestionIndex
                  }
                  className="apple-button-primary text-sm sm:text-base"
                >
                  {savingGeneratedIndex === generatedQuestionIndex
                    ? 'Saving...'
                    : 'Save Question'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndFindRelevantQuestions}
                  disabled={
                    isGenerating ||
                    savingGeneratedIndex === generatedQuestionIndex
                  }
                  className="apple-button-primary text-sm sm:text-base"
                >
                  Save and Find Other relevant questions
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="apple-page">
      <Navbar />

      {isGenerating ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 text-center text-white backdrop-blur-sm">
          <div>
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-white/40 border-t-white" />
            <p className="mt-5 text-lg font-bold">
              This process may take a few seconds. Please wait.
            </p>
          </div>
        </div>
      ) : null}

      <section className="apple-section">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="/categories"
              className="apple-link"
            >
              Back to categories
            </a>
            <h1 className="apple-page-title">
              {categoryName ?? 'Questions'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Category ID: {categoryId}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/practice/category/${categoryId}?name=${encodeURIComponent(categoryName ?? '')}`}
              className="apple-button-secondary"
            >
              Start Practicing
            </a>
            <button
              type="button"
              onClick={() => {
                setStatus({ type: '', message: '' })
                setQuestionForm(emptyQuestionForm)
                setEditingQuestionId('')
                setEditQuestion('')
                setIsGenerateFormOpen(false)
                setIsFormOpen(true)
              }}
              className="apple-button-primary"
            >
              + Create New Question
            </button>
            <button
              type="button"
              onClick={handleGenerateClick}
              className="apple-button-secondary"
            >
              Generate Questions
            </button>
          </div>
        </div>

        {isFormOpen ? (
          <form
            onSubmit={handleSubmit}
            className="apple-panel mt-8"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              Create Question
            </h2>

            <div className="mt-5">
              <label
                htmlFor="question"
                className="apple-label"
              >
                Question
              </label>
              <textarea
                id="question"
                name="question"
                value={questionForm.question}
                onChange={(event) =>
                  setQuestionForm((currentForm) => ({
                    ...currentForm,
                    question: event.target.value,
                  }))
                }
                required
                rows="4"
                className="apple-input"
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="question-topic"
                  className="apple-label"
                >
                  Topic
                </label>
                <input
                  id="question-topic"
                  name="topic"
                  type="text"
                  value={questionForm.topic}
                  onChange={(event) =>
                    setQuestionForm((currentForm) => ({
                      ...currentForm,
                      topic: event.target.value,
                    }))
                  }
                  className="apple-input"
                />
              </div>

              <div>
                <label
                  htmlFor="question-difficulty"
                  className="apple-label"
                >
                  Difficulty
                </label>
                <select
                  id="question-difficulty"
                  name="difficulty"
                  value={questionForm.difficulty}
                  onChange={(event) =>
                    setQuestionForm((currentForm) => ({
                      ...currentForm,
                      difficulty: event.target.value,
                    }))
                  }
                  className="apple-input"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <label className="mt-5 flex items-start gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={questionForm.check_related_questions}
                onChange={(event) =>
                  setQuestionForm((currentForm) => ({
                    ...currentForm,
                    check_related_questions: event.target.checked,
                  }))
                }
                className="mt-0.5 h-5 w-5 rounded-md border-white/70 bg-white/70 text-slate-950 shadow-sm focus:ring-slate-200"
              />
              Check related questions
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="apple-button-primary"
              >
                {isSaving ? 'Saving...' : 'Create Question'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuestionForm(emptyQuestionForm)
                  setIsFormOpen(false)
                }}
                disabled={isSaving}
                className="apple-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {isGenerateFormOpen ? (
          <section className="apple-panel mt-8">
            <form onSubmit={handleGenerateSubmit}>
              <h2 className="text-lg font-semibold text-slate-950">
                Generate Questions
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="generate-topic"
                    className="apple-label"
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
                    className="apple-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="generate-difficulty"
                    className="apple-label"
                  >
                    Difficulty
                  </label>
                  <select
                    id="generate-difficulty"
                    name="difficulty"
                    value={generateForm.difficulty}
                    onChange={handleGenerateFormChange}
                    className="apple-input"
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
                  className="apple-button-primary"
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
                  className="apple-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {status.message ? (
          <p
            className={
              status.type === 'success'
                ? 'apple-status-success mt-8'
                : 'apple-status-error mt-8'
            }
          >
            {status.message}
          </p>
        ) : null}

        {isLoading ? (
          <p className="apple-panel mt-8 text-sm text-slate-600">
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
                    className="apple-panel"
                  >
                    <p className="text-sm font-medium text-slate-500">
                      Question {index + 1}
                    </p>
                    <label
                      htmlFor={`question-${questionItem.questionId}`}
                      className="apple-label mt-4"
                    >
                      Question
                    </label>
                    <textarea
                      id={`question-${questionItem.questionId}`}
                      value={editQuestion}
                      onChange={(event) => setEditQuestion(event.target.value)}
                      required
                      rows="4"
                      className="apple-input"
                    />
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="apple-button-primary"
                      >
                        {isSaving ? 'Saving...' : 'Update Question'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="apple-button-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <article
                    key={questionItem.questionId}
                    className="apple-panel"
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
                          className="apple-icon-button"
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
                          className="apple-icon-button hover:bg-red-50 hover:text-red-600"
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

                    <h2 className="mt-2 whitespace-pre-wrap text-base font-semibold leading-7 text-slate-950 sm:text-lg">
                      {questionItem.question}
                    </h2>
                    {questionItem.topic || questionItem.difficulty ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {questionItem.topic ? (
                          <span className="apple-chip">
                            {questionItem.topic}
                          </span>
                        ) : null}
                        {questionItem.difficulty ? (
                          <span className="apple-chip capitalize">
                            {questionItem.difficulty}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
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
            <p className="apple-panel mt-8 text-sm text-slate-600">
              No questions found.
            </p>
          )
        ) : null}
      </section>
    </main>
  )
}

export default CategoryQuestions
