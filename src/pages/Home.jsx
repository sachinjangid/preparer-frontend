import Navbar from '../components/Navbar'

function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            React + Vite + Tailwind
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Build your preparation workflow faster.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A clean starter structure with pages, components, and API utilities
            ready for your next feature.
          </p>

          <div id="start" className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-md bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Start preparing
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              View dashboard
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Today&apos;s plan
              </h2>
              <p className="text-sm text-slate-500">3 tasks ready</p>
            </div>
            <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              Active
            </span>
          </div>

          <div id="features" className="space-y-4">
            {['Review syllabus', 'Practice questions', 'Track progress'].map(
              (item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-md border border-slate-200 p-4"
                >
                  <span className="font-medium text-slate-800">{item}</span>
                  <span className="text-sm text-slate-500">
                    Step {index + 1}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
