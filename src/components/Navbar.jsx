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
    <header className="apple-nav">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="PractSmart" className="flex items-center">
          <span className="italic font-black tracking-tight text-2xl text-slate-950">
            PractSmart
          </span>
        </a>

        <div className="flex items-center gap-5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-white/70 hover:text-slate-950"
            >
              {item.label}
            </a>
          ))}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-white/70 hover:text-slate-950"
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
