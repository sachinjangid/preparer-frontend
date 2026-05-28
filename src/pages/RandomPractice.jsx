import { useState } from 'react'
import {
  getQuestionAnswer,
  getRandomQuestion,
  getRandomQuestionByCategory,
  verifyAnswer,
} from '../api/practice'
import Navbar from '../components/Navbar'

function getQuestionRecord(questionData) {
  return questionData?.question &&
    typeof questionData.question === 'object' &&
    !Array.isArray(questionData.question)
    ? questionData.question
    : questionData
}

function getQuestionText(questionData) {
  const questionRecord = getQuestionRecord(questionData)

  return questionRecord?.question ?? questionRecord?.text ?? ''
}

function renderFormattedText(text) {
  return text.split('\n').map((line, lineIndex) => (
    <span key={`${line}-${lineIndex}`}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={`${part}-${partIndex}`}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={`${part}-${partIndex}`}>{part}</span>
        ),
      )}
      {lineIndex < text.split('\n').length - 1 ? <br /> : null}
    </span>
  ))
}

function RandomPractice({ categoryId = '', categoryName = '' }) {
  const [questionData, setQuestionData] = useState(null)
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isGettingAnswer, setIsGettingAnswer] = useState(false)
  const [error, setError] = useState('')
  const [verificationResponse, setVerificationResponse] = useState('')
  const [suggestedAnswer, setSuggestedAnswer] = useState('')

  async function handleGetQuestion() {
    setIsLoading(true)
    setError('')
    setVerificationResponse('')
    setSuggestedAnswer('')

    try {
      const data = categoryId
        ? await getRandomQuestionByCategory(categoryId)
        : await getRandomQuestion()
      setQuestionData(data)
      setAnswer('')
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerify() {
    const questionRecord = getQuestionRecord(questionData)

    setIsVerifying(true)
    setError('')
    setVerificationResponse('')
    setSuggestedAnswer('')

    try {
      const data = await verifyAnswer({
        ...questionRecord,
        answer,
      })
      setVerificationResponse(data?.response ?? 'Answer verified.')
    } catch (verifyError) {
      setError(verifyError.message)
    } finally {
      setIsVerifying(false)
    }
  }

  async function handleGetAnswer() {
    const questionRecord = getQuestionRecord(questionData)

    setIsGettingAnswer(true)
    setError('')
    setVerificationResponse('')
    setSuggestedAnswer('')

    try {
      const data = await getQuestionAnswer({
        ...questionRecord,
        ...(categoryId ? { categoryId } : {}),
      })
      setSuggestedAnswer(data?.response ?? 'Answer received.')
    } catch (answerError) {
      setError(answerError.message)
    } finally {
      setIsGettingAnswer(false)
    }
  }

  const questionText = getQuestionText(questionData)

  return (
    <main className="apple-page">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <a
          href={categoryId ? '/practice/category' : '/practice'}
          className="apple-link"
        >
          {categoryId ? 'Back to categories' : 'Back to practice'}
        </a>

        <div className="grid flex-1 place-items-center">
          <div className="grid w-full max-w-3xl grid-rows-[minmax(24rem,32rem)_auto_auto] gap-6 text-center">
            {questionData ? (
              <div className="apple-panel grid min-h-0 gap-5 p-8 text-left">
                <div className="min-h-0 overflow-y-auto pr-2">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {categoryName ? `${categoryName} Question` : 'Random Question'}
                    </p>
                    <h1 className="mt-3 whitespace-pre-wrap text-2xl font-bold leading-9 text-slate-950">
                      {questionText || 'Question loaded.'}
                    </h1>
                  </div>
                </div>

                {!suggestedAnswer ? (
                  <div>
                    <label
                      htmlFor="answer"
                      className="apple-label"
                    >
                      Your answer
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      disabled={
                        Boolean(verificationResponse) ||
                        isVerifying ||
                        isGettingAnswer
                      }
                      rows="5"
                      className="apple-input resize-none"
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleGetQuestion}
                  disabled={isLoading}
                  className="apple-button-primary px-10 py-5 text-lg"
                >
                  {isLoading ? 'Loading...' : 'Start Practice'}
                </button>
              </div>
            )}

            {error ? (
              <p className="apple-status-error">
                {error}
              </p>
            ) : verificationResponse ? (
              <p className="apple-panel text-left text-sm leading-6 text-slate-700">
                {renderFormattedText(verificationResponse)}
              </p>
            ) : suggestedAnswer ? (
              <div className="apple-panel text-left text-sm leading-6 text-slate-700">
                <p className="mb-3 text-sm font-semibold text-slate-950">
                  Answer
                </p>
                <p>{renderFormattedText(suggestedAnswer)}</p>
              </div>
            ) : (
              <div aria-hidden="true" />
            )}

            {questionData ? (
              isVerifying || isGettingAnswer ? (
                <div className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-600">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />
                  {isVerifying ? 'Verifying answer...' : 'Getting answer...'}
                </div>
              ) : verificationResponse || suggestedAnswer ? (
                <button
                  type="button"
                  onClick={handleGetQuestion}
                  disabled={isLoading}
                  className="apple-button-primary justify-self-center text-base"
                >
                  {isLoading ? 'Loading...' : 'Next Question'}
                </button>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={!answer.trim() || isLoading}
                    className="apple-button-primary text-base"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={handleGetAnswer}
                    disabled={isLoading}
                    className="apple-button-secondary text-base"
                  >
                    Get Answer
                  </button>
                  <button
                    type="button"
                    onClick={handleGetQuestion}
                    disabled={isLoading}
                    className="apple-button-secondary text-base"
                  >
                    {isLoading ? 'Loading...' : 'Skip Question'}
                  </button>
                </div>
              )
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
