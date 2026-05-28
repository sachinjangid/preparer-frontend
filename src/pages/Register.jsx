import { useState } from 'react'
import { registerUser } from '../api/auth'
import Navbar from '../components/Navbar'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
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
      await registerUser(formData)
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

      <section className="apple-hero-section lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="apple-eyebrow">
            Build your recall system
          </p>
          <h1 className="apple-title mt-4">
            Start preparing with structure from day one.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Create a private question bank, group questions by topic, and use
            practice sessions to turn stored notes into active recall.
          </p>

          <div className="apple-panel mt-8">
            <p className="text-sm font-semibold text-slate-950">
              What you get after signup
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                'Category management',
                'Question CRUD',
                'Random practice',
                'Answer verification',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/70 bg-white/60 p-3">
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="apple-panel sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Register</h2>
            <p className="mt-2 text-sm text-slate-600">
              Create your account and open your dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="apple-label"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="apple-input"
                />
              </div>

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
                  autoComplete="new-password"
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
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-semibold text-slate-950 transition hover:text-slate-600"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register
