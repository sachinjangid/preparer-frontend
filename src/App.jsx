import { getAuthToken } from './api/token'
import Categories from './pages/Categories'
import CategoryQuestions from './pages/CategoryQuestions'
import CategoryPractice from './pages/CategoryPractice'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Practice from './pages/Practice'
import RandomPractice from './pages/RandomPractice'
import Register from './pages/Register'

function App() {
  const path = window.location.pathname
  const hasToken = Boolean(getAuthToken())

  if (path === '/login') {
    if (hasToken) {
      window.history.replaceState(null, '', '/dashboard')
      return <Dashboard />
    }

    return <Login />
  }

  if (path === '/register') {
    if (hasToken) {
      window.history.replaceState(null, '', '/dashboard')
      return <Dashboard />
    }

    return <Register />
  }

  if (path === '/dashboard') {
    if (!hasToken) {
      window.history.replaceState(null, '', '/login')
      return <Login />
    }

    return <Dashboard />
  }

  if (path === '/practice') {
    if (!hasToken) {
      window.history.replaceState(null, '', '/login')
      return <Login />
    }

    return <Practice />
  }

  if (path === '/practice/random') {
    if (!hasToken) {
      window.history.replaceState(null, '', '/login')
      return <Login />
    }

    return <RandomPractice />
  }

  if (path === '/practice/category') {
    if (!hasToken) {
      window.history.replaceState(null, '', '/login')
      return <Login />
    }

    return <CategoryPractice />
  }

  if (path.startsWith('/practice/category/')) {
    if (!hasToken) {
      window.history.replaceState(null, '', '/login')
      return <Login />
    }

    const categoryId = decodeURIComponent(
      path.replace('/practice/category/', ''),
    )
    const categoryName = new URLSearchParams(window.location.search).get('name')

    return (
      <RandomPractice
        categoryId={categoryId}
        categoryName={categoryName ?? ''}
      />
    )
  }

  if (path === '/categories') {
    if (!hasToken) {
      window.history.replaceState(null, '', '/login')
      return <Login />
    }

    return <Categories />
  }

  if (path.startsWith('/categories/')) {
    if (!hasToken) {
      window.history.replaceState(null, '', '/login')
      return <Login />
    }

    const categoryId = decodeURIComponent(path.replace('/categories/', ''))
    return <CategoryQuestions categoryId={categoryId} />
  }

  if (hasToken) {
    window.history.replaceState(null, '', '/dashboard')
    return <Dashboard />
  }

  return <Home />
}

export default App
