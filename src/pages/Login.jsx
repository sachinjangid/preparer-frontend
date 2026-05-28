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
    <main className="apple-page">
      <Navbar />

      <section className="apple-hero-section lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="apple-eyebrow">
            Welcome back
          </p>
          <h1 className="apple-title mt-4">
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
                  className="rounded-[1.5rem] border border-white/70 bg-white/60 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl"
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
          <div className="apple-panel sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Login</h2>
            <p className="mt-2 text-sm text-slate-600">
              Access your dashboard and resume practicing.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="apple-label"
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
                  className="apple-input"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="apple-label"
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
                  className="apple-input"
                />
              </div>

              {status.message ? (
                <p
                  className={
                    status.type === 'success'
                      ? 'apple-status-success'
                      : 'apple-status-error'
                  }
                >
                  {status.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="apple-button-primary w-full"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              New to Preparer?{' '}
              <a
                href="/register"
                className="font-semibold text-slate-950 transition hover:text-slate-600"
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
