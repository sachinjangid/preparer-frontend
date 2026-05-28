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
  const [editFormData, setEditFormData] = useState(emptyForm)
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
    setEditFormData(emptyForm)
    setError('')
    setIsFormOpen(true)
  }

  function handleEditClick(category) {
    setEditFormData({
      name: category.name,
      description: category.description,
    })
    setEditingCategoryId(category.categoryId)
    setError('')
    setIsFormOpen(false)
  }

  function handleCancelForm() {
    setFormData(emptyForm)
    setIsFormOpen(false)
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function handleEditFormChange(event) {
    const { name, value } = event.target
    setEditFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function handleCancelEdit() {
    setEditFormData(emptyForm)
    setEditingCategoryId('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      await createCategory(formData)

      await loadCategories()
      handleCancelForm()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      await updateCategory(editingCategoryId, editFormData)
      await loadCategories()
      handleCancelEdit()
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
    <main className="apple-page">
      <Navbar />

      <section className="apple-section">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="/dashboard"
              className="apple-link"
            >
              Back to dashboard
            </a>
            <h1 className="apple-page-title">
              Categories
            </h1>
          </div>

          <button
            type="button"
            onClick={handleCreateClick}
            className="apple-button-primary"
          >
            + Create New Category
          </button>
        </div>

        {isFormOpen ? (
          <form
            onSubmit={handleSubmit}
            className="apple-panel mt-8"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              Create Category
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                  onChange={handleFormChange}
                  required
                  className="apple-input"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="apple-label"
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
                  className="apple-input"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="apple-button-primary"
              >
                {isSaving ? 'Saving...' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={isSaving}
                className="apple-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

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
                editingCategoryId === category.categoryId ? (
                  <form
                    key={category.categoryId}
                    onSubmit={handleEditSubmit}
                    className="apple-panel"
                  >
                    <h2 className="text-lg font-semibold text-slate-950">
                      Edit Category
                    </h2>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor={`category-name-${category.categoryId}`}
                          className="apple-label"
                        >
                          Name
                        </label>
                        <input
                          id={`category-name-${category.categoryId}`}
                          name="name"
                          type="text"
                          value={editFormData.name}
                          onChange={handleEditFormChange}
                          required
                          className="apple-input"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`category-description-${category.categoryId}`}
                          className="apple-label"
                        >
                          Description
                        </label>
                        <input
                          id={`category-description-${category.categoryId}`}
                          name="description"
                          type="text"
                          value={editFormData.description}
                          onChange={handleEditFormChange}
                          required
                          className="apple-input"
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="apple-button-primary"
                      >
                        {isSaving ? 'Saving...' : 'Update Category'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="apple-button-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <a
                    key={category.categoryId}
                    href={`/categories/${category.categoryId}?name=${encodeURIComponent(category.name)}`}
                    className="apple-card"
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
                          className="apple-icon-button"
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
                          className="apple-icon-button hover:bg-red-50 hover:text-red-600"
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
                )
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

export default Categories
