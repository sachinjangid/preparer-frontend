import Navbar from '../components/Navbar'

function Practice() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <a
            href="/dashboard"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            Back to dashboard
          </a>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Practice</h1>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <a
            href="/practice/random"
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <h2 className="text-2xl font-bold text-slate-950">
              Random Question
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Get a question from your full question bank.
            </p>
          </a>

          <a
            href="/practice/category"
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <h2 className="text-2xl font-bold text-slate-950">
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
