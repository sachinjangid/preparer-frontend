import { useEffect, useState } from 'react'
import { getAllCategories } from '../api/category'
import Navbar from '../components/Navbar'

function CategoryPractice() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let shouldUpdate = true

    getAllCategories()
      .then((categoryList) => {
        if (shouldUpdate) {
          setCategories(categoryList)
        }
      })
      .catch((loadError) => {
        if (shouldUpdate) {
          setError(loadError.message)
        }
      })
      .finally(() => {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      })

    return () => {
      shouldUpdate = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <a
          href="/practice"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          Back to practice
        </a>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Practice with category
        </h1>

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
                <a
                  key={category.categoryId}
                  href={`/practice/category/${category.categoryId}?name=${encodeURIComponent(category.name)}`}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <h2 className="text-lg font-semibold text-slate-950">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>
                </a>
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

export default CategoryPractice
