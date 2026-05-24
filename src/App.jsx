import { getAuthToken } from './api/token'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
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

  if (hasToken) {
    window.history.replaceState(null, '', '/dashboard')
    return <Dashboard />
  }

  return <Home />
}

export default App
