import Navbar from '../components/Navbar'

function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/categories"
            className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            <p className="text-sm font-medium text-slate-500">Manage</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Categories
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Click to view and manage your saved categories.
            </p>
          </a>

          <a
            href="/practice"
            className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">Start</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Practice
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Click to practice questions from your preparation set.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
