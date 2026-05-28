import Navbar from '../components/Navbar'

const features = [
  {
    title: 'Organized question bank',
    description:
      'Create categories, add questions, and keep your preparation material grouped by topic.',
  },
  {
    title: 'Random practice',
    description:
      'Start a quick session and get questions from your full question bank without choosing a topic first.',
  },
  {
    title: 'Category practice',
    description:
      'Pick a category and practice only the questions that belong to that preparation area.',
  },
  {
    title: 'Answer verification',
    description:
      'Write or dictate your answer, then verify it and get structured feedback with clear formatting.',
  },
]

const steps = ['Create categories', 'Add questions', 'Practice', 'Verify answers']

function Home() {
  return (
    <main className="apple-page">
      <Navbar />

      <section>
        <div className="apple-hero-section lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="apple-eyebrow">
              Practice that remembers your weak spots
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-6xl">
              Prepare smarter with your own question bank.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Preparer helps you collect questions, organize them by category,
              practice randomly or by topic, and verify your answers after every
              attempt.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/register"
                className="apple-button-primary"
              >
                Start preparing
              </a>
              <a
                href="/login"
                className="apple-button-secondary"
              >
                Login
              </a>
            </div>
          </div>

          <div className="apple-panel">
            <div className="apple-inner">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Today&apos;s practice
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    Data Structures
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-50/90 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
                  Active
                </span>
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-white/70 bg-white/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Random Question
                </p>
                <p className="mt-3 whitespace-pre-wrap text-lg font-semibold leading-7 text-slate-950">
                  Explain how a stack differs from a queue, and give one real
                  use case for each.
                </p>
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-white/70 bg-white/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Answer
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A stack follows LIFO while a queue follows FIFO. A stack can
                  be used for undo history, and a queue can be used for task
                  scheduling.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[1.25rem] border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-2xl font-bold text-slate-950">2</p>
                <p className="text-sm text-slate-500">Practice modes</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-2xl font-bold text-slate-950">Voice</p>
                <p className="text-sm text-slate-500">Answer input</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="apple-section py-16">
        <div className="max-w-2xl">
          <p className="apple-eyebrow">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            Everything you need for active recall.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="apple-card"
            >
              <h3 className="text-lg font-semibold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/70 bg-white/35 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="apple-eyebrow">
                Workflow
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                A simple loop for better recall.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Instead of only reading notes, Preparer keeps you answering,
                checking, and moving to the next question.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[1.5rem] border border-white/70 bg-white/60 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl"
                >
                  <p className="text-sm font-bold text-slate-500">
                    0{index + 1}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-950">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="apple-section py-16">
        <div className="rounded-[2rem] bg-slate-950/95 px-6 py-10 text-center text-white shadow-[0_28px_90px_rgba(15,23,42,0.22)] sm:px-10">
          <h2 className="text-3xl font-semibold">Ready to practice with focus?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            Build your question bank once, then use random practice, category
            practice, voice answers, and verification feedback whenever you sit
            down to prepare.
          </p>
          <div className="mt-7 flex justify-center">
            <a
              href="/register"
              className="apple-button-secondary bg-white text-slate-950"
            >
              Create your account
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
