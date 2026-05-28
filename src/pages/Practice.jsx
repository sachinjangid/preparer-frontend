import Navbar from '../components/Navbar'

function Practice() {
  return (
    <main className="apple-page">
      <Navbar />

      <section className="apple-section">
        <div>
          <a
            href="/dashboard"
            className="apple-link"
          >
            Back to dashboard
          </a>
          <h1 className="apple-page-title">Practice</h1>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <a
            href="/practice/random"
            className="apple-card"
          >
            <h2 className="text-2xl font-semibold text-slate-950">
              Random Question
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Get a question from your full question bank.
            </p>
          </a>

          <a
            href="/practice/category"
            className="apple-card"
          >
            <h2 className="text-2xl font-semibold text-slate-950">
              Practice with category
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Choose a category before starting practice.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}

export default Practice
