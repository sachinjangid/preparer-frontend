function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="text-xl font-bold tracking-tight text-slate-950">
          Preparer
        </a>

        <div className="flex items-center gap-3">
          <a
            href="#features"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 sm:inline"
          >
            Features
          </a>
          <a
            href="#start"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Get started
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
