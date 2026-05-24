import { useEffect, useState } from 'react'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '../api/category'
import Navbar from '../components/Navbar'

const emptyForm = {
  name: '',
  description: '',
}

function Categories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

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

  function handleCreateClick() {
    setFormData(emptyForm)
    setEditingCategoryId('')
    setError('')
    setIsFormOpen(true)
  }

  function handleEditClick(category) {
    setFormData({
      name: category.name,
      description: category.description,
    })
    setEditingCategoryId(category.categoryId)
    setError('')
    setIsFormOpen(true)
  }

  function handleCancelForm() {
    setFormData(emptyForm)
    setEditingCategoryId('')
    setIsFormOpen(false)
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, formData)
      } else {
        await createCategory(formData)
      }

      await loadCategories()
      handleCancelForm()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteClick(category) {
    const shouldDelete = window.confirm(
      `Delete "${category.name}" category? This cannot be undone.`,
    )

    if (!shouldDelete) {
      return
    }

    setDeletingCategoryId(category.categoryId)
    setError('')

    try {
      await deleteCategory(category.categoryId)
      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) =>
            currentCategory.categoryId !== category.categoryId,
        ),
      )
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setDeletingCategoryId('')
    }
  }

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
            onClick={handleCreateClick}
            className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Create New Category
          </button>
        </div>

        {isFormOpen ? (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              {editingCategoryId ? 'Edit Category' : 'Create Category'}
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSaving
                  ? 'Saving...'
                  : editingCategoryId
                    ? 'Update Category'
                    : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={isSaving}
                className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

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
                  href={`/categories/${category.categoryId}?name=${encodeURIComponent(category.name)}`}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold text-slate-950">
                      {category.name}
                    </h2>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault()
                          handleEditClick(category)
                        }}
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
                        onClick={(event) => {
                          event.preventDefault()
                          handleDeleteClick(category)
                        }}
                        disabled={deletingCategoryId === category.categoryId}
                        aria-label={`Delete ${category.name}`}
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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

export default Categories
