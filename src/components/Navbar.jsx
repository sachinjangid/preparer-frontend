import { clearAuthToken, getAuthToken } from '../api/token'

function Navbar() {
  const isLoggedIn = Boolean(getAuthToken())
  const navItems = isLoggedIn
    ? [{ label: 'Dashboard', href: '/dashboard' }]
    : [
        { label: 'Home', href: '/' },
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' },
      ]

  function handleLogout() {
    clearAuthToken()
    window.location.href = '/login'
  }

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="Preparer" className="flex items-center">
          <img
            src="/preparer-logo.png"
            alt="Preparer"
            className="h-32 w-auto"
          />
        </a>

        <div className="flex items-center gap-5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </a>
          ))}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Logout
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
