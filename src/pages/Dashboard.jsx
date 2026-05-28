import Navbar from '../components/Navbar'

function Dashboard() {
  return (
    <main className="apple-page">
      <Navbar />

      <section className="apple-section">
        <h1 className="apple-page-title">Dashboard</h1>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/categories"
            className="apple-card text-left disabled:cursor-not-allowed disabled:opacity-70"
          >
            <p className="text-sm font-medium text-slate-500">Manage</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Categories
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Click to view and manage your saved categories.
            </p>
          </a>

          <a
            href="/practice"
            className="apple-card text-left"
          >
            <p className="text-sm font-medium text-slate-500">Start</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
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
