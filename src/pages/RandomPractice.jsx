import Navbar from '../components/Navbar'

function RandomPractice() {
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

        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            className="rounded-lg bg-slate-950 px-10 py-5 text-lg font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            Get a random question
          </button>
        </div>
      </section>
    </main>
  )
}

export default RandomPractice
