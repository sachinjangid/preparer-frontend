function Navbar() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
  ]

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
        </div>
      </nav>
    </header>
  )
}

export default Navbar
