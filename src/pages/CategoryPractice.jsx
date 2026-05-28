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
    <main className="apple-page">
      <Navbar />

      <section className="apple-section">
        <a
          href="/practice"
          className="apple-link"
        >
          Back to practice
        </a>
        <h1 className="apple-page-title">
          Practice with category
        </h1>

        {isLoading ? (
          <p className="apple-panel mt-8 text-sm text-slate-600">
            Loading categories...
          </p>
        ) : null}

        {error ? (
          <p className="apple-status-error mt-8">
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
                  className="apple-card"
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
            <p className="apple-panel mt-8 text-sm text-slate-600">
              No categories found.
            </p>
          )
        ) : null}
      </section>
    </main>
  )
}

export default CategoryPractice
