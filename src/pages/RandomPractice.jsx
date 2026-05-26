import { useState } from 'react'
import { getRandomQuestion, verifyAnswer } from '../api/practice'
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

function RandomPractice() {
  const [questionData, setQuestionData] = useState(null)
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [verificationResponse, setVerificationResponse] = useState('')

  async function handleGetQuestion() {
    setIsLoading(true)
    setError('')
    setVerificationResponse('')

    try {
      const data = await getRandomQuestion()
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
          <div className="grid w-full max-w-3xl grid-rows-[minmax(24rem,32rem)_auto_auto] gap-6 text-center">
            {questionData ? (
              <div className="grid min-h-0 gap-5 rounded-lg border border-slate-200 bg-white p-8 text-left shadow-sm">
                <div className="min-h-0 overflow-y-auto pr-2">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Random Question
                    </p>
                    <h1 className="mt-3 whitespace-pre-wrap text-2xl font-bold leading-9 text-slate-950">
                      {questionText || 'Question loaded.'}
                    </h1>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Your answer
                  </label>
                  <textarea
                    id="answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    rows="5"
                    className="mt-2 block w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  />
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
            ) : verificationResponse ? (
              <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-left text-sm leading-6 text-slate-700 shadow-sm">
                {renderFormattedText(verificationResponse)}
              </p>
            ) : (
              <div aria-hidden="true" />
            )}

            {questionData ? (
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!answer.trim() || isLoading || isVerifying}
                  className="rounded-lg bg-slate-950 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  type="button"
                  onClick={handleGetQuestion}
                  disabled={isLoading}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-800 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Loading...' : 'Skip Question'}
                </button>
              </div>
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
