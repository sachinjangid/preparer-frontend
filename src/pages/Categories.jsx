import { useEffect, useState } from 'react'
import { getAllCategories } from '../api/category'
import Navbar from '../components/Navbar'

function Categories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true)
      setError('')

      try {
        const categoryList = await getAllCategories()
        setCategories(categoryList)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="/dashboard"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Back to dashboard
            </a>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              Categories
            </h1>
          </div>

          <button
            type="button"
            className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Create New Category
          </button>
        </div>

        {isLoading ? (
          <p className="mt-8 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            Loading categories...
          </p>
        ) : null}

        {error ? (
          <p className="mt-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {!isLoading && !error ? (
          categories.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <article
                  key={category.categoryId}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold text-slate-950">
                      {category.name}
                    </h2>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Edit ${category.name}`}
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${category.name}`}
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              No categories found.
            </p>
          )
        ) : null}
      </section>
    </main>
  )
}

export default Categories
