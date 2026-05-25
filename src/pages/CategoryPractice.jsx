import Navbar from '../components/Navbar'

function CategoryPractice() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <a
          href="/practice"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          Back to practice
        </a>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Practice with category
        </h1>
      </section>
    </main>
  )
}

export default CategoryPractice
