import Navbar from '../components/Navbar'

function CategoryQuestions({ categoryId }) {
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
              Questions
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Category ID: {categoryId}
            </p>
          </div>

          <button
            type="button"
            className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Create New Question
          </button>
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Questions for this category will appear here.
          </p>
        </div>
      </section>
    </main>
  )
}

export default CategoryQuestions
