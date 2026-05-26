import { useState } from 'react'
import { loginUser } from '../api/auth'
import Navbar from '../components/Navbar'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await loginUser(formData)
      window.location.href = '/dashboard'
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Welcome back
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Continue your preparation loop.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Jump back into your categories, practice random questions, speak
            your answers, and keep sharpening with verification feedback.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Question bank', 'Voice answers', 'Practice modes'].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {item}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">Login</h2>
            <p className="mt-2 text-sm text-slate-600">
              Access your dashboard and resume practicing.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {status.message ? (
                <p
                  className={
                    status.type === 'success'
                      ? 'rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700'
                      : 'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700'
                  }
                >
                  {status.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              New to Preparer?{' '}
              <a
                href="/register"
                className="font-semibold text-slate-950 transition hover:text-emerald-700"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
