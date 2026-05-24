import Navbar from '../components/Navbar'

function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
      </section>
    </main>
  )
}

export default Dashboard
