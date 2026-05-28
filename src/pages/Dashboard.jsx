import { useEffect, useMemo, useState } from 'react'
import { getAllCategories } from '../api/category'
import { clearAuthToken } from '../api/token'

const lineColors = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#0f766e']
const fallbackCategories = [
  { categoryId: 'system-design', name: 'System Design' },
  { categoryId: 'data-structures', name: 'Data Structures' },
  { categoryId: 'golang', name: 'Golang' },
]
const chartWidth = 960
const chartHeight = 260
const chartPadding = {
  top: 20,
  right: 28,
  bottom: 48,
  left: 44,
}

function buildLastThirtyDays() {
  const today = new Date()

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (29 - index))

    return {
      day: date.getDate(),
      label: new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
      }).format(date),
    }
  })
}

function buildProgressPoints(seed = 0) {
  return Array.from({ length: 30 }, (_, index) => {
    const baseline = 34 + seed * 6
    const trend = index * (1.45 + seed * 0.08)
    const wave = Math.sin((index + seed) / 2.5) * 9
    const pulse = ((index + 1) * (seed + 5)) % 11

    return Math.max(12, Math.min(98, Math.round(baseline + trend + wave + pulse)))
  })
}

function buildChartPath(points) {
  const innerWidth = chartWidth - chartPadding.left - chartPadding.right
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom
  const xStep = innerWidth / (points.length - 1)

  return points
    .map((point, index) => {
      const x = chartPadding.left + index * xStep
      const y = chartPadding.top + innerHeight - (point / 100) * innerHeight

      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

function getPointPosition(point, index, pointsLength) {
  const innerWidth = chartWidth - chartPadding.left - chartPadding.right
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom
  const xStep = innerWidth / (pointsLength - 1)

  return {
    x: chartPadding.left + index * xStep,
    y: chartPadding.top + innerHeight - (point / 100) * innerHeight,
  }
}

function DashboardLineChart({
  ariaLabel,
  color,
  days,
  points,
  compact = false,
}) {
  const path = buildChartPath(points)
  const gradientId = `${ariaLabel
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')}-fill`
  const latestValue = points[points.length - 1]
  const firstValue = points[0]
  const delta = latestValue - firstValue

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-slate-500">
          {latestValue}% current
        </p>
        <p className={delta >= 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-red-500'}>
          {delta >= 0 ? '+' : ''}
          {delta}% in 30 days
        </p>
      </div>

      <div className="pb-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={ariaLabel}
          className={compact ? 'h-44 w-full sm:h-56' : 'h-52 w-full sm:h-72'}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.24" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[25, 50, 75, 100].map((value) => {
            const y =
              chartPadding.top +
              (chartHeight - chartPadding.top - chartPadding.bottom) -
              (value / 100) *
                (chartHeight - chartPadding.top - chartPadding.bottom)

            return (
              <g key={value}>
                <line
                  x1={chartPadding.left}
                  x2={chartWidth - chartPadding.right}
                  y1={y}
                  y2={y}
                  stroke="#cbd5e1"
                  strokeDasharray="5 10"
                  strokeWidth="1"
                />
                <text x="12" y={y + 4} fill="#64748b" fontSize="12">
                  {value}
                </text>
              </g>
            )
          })}

          <path
            d={`${path} L ${chartWidth - chartPadding.right} ${chartHeight - chartPadding.bottom} L ${chartPadding.left} ${chartHeight - chartPadding.bottom} Z`}
            fill={`url(#${gradientId})`}
          />
          <path
            d={path}
            fill="none"
            pathLength="1"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={compact ? '3' : '4'}
            className="animate-[draw-line_1.2s_ease-out_both]"
          />

          {points.map((point, index) => {
            const { x, y } = getPointPosition(point, index, points.length)

            return (
              <g key={`${point}-${index}`}>
                <circle
                  cx={x}
                  cy={y}
                  fill="white"
                  r={compact ? '3.5' : '4.5'}
                  stroke={color}
                  strokeWidth="3"
                  className="opacity-0 animate-[fade-pop_0.35s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 24}ms` }}
                />
                {index % 5 === 0 || index === points.length - 1 ? (
                  <text
                    x={x}
                    y={chartHeight - 18}
                    fill="#64748b"
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {days[index].day}
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-1 hidden grid-cols-[repeat(30,minmax(0,1fr))] text-center text-[10px] font-medium text-slate-400 sm:grid">
        {days.map((day) => (
          <span key={day.label}>{day.day}</span>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const days = useMemo(() => buildLastThirtyDays(), [])
  const chartCategories = categories.length > 0 ? categories : fallbackCategories
  const overallPoints = useMemo(() => buildProgressPoints(1), [])
  const categorySeries = useMemo(
    () =>
      chartCategories.slice(0, 6).map((category, categoryIndex) => ({
        id: category.categoryId ?? category.name,
        name: category.name,
        color: lineColors[categoryIndex % lineColors.length],
        points: buildProgressPoints(categoryIndex + 2),
      })),
    [chartCategories],
  )

  useEffect(() => {
    let shouldUpdate = true

    getAllCategories()
      .then((categoryList) => {
        if (shouldUpdate) {
          setCategories(categoryList)
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setCategories([])
        }
      })
      .finally(() => {
        if (shouldUpdate) {
          setIsLoadingCategories(false)
        }
      })

    return () => {
      shouldUpdate = false
    }
  }, [])

  function handleLogout() {
    clearAuthToken()
    window.location.href = '/login'
  }

  return (
    <main className="apple-page">
      <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="border-b border-white/70 bg-white/55 px-4 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-2xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <a href="/dashboard" aria-label="PractSmart" className="block">
              <span className="italic font-black tracking-tight text-2xl text-slate-950 lg:text-3xl">
                PractSmart
              </span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="apple-button-secondary px-4 py-2 text-xs lg:hidden"
            >
              Logout
            </button>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
            {[
              { label: 'Dashboard', href: '/dashboard', active: true },
              { label: 'Categories', href: '/categories' },
              { label: 'Practice', href: '/practice' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={
                  item.active
                    ? 'rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(15,23,42,0.16)] lg:w-full'
                    : 'rounded-full px-4 py-3 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-white/75 hover:text-slate-950 lg:w-full'
                }
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="apple-button-secondary mt-8 hidden w-full lg:inline-flex"
          >
            Logout
          </button>
        </aside>

        <section className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="apple-eyebrow">Preparation analytics</p>
              <h1 className="apple-page-title">Dashboard</h1>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Track daily progress and category-wise learning momentum across
              the last 30 days.
            </p>
          </div>

          <section className="apple-panel mt-8 p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Overall Practice Progress
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 sm:text-2xl">
                  Last 30 days
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                Daily progress score
              </p>
            </div>

            <div className="mt-5 sm:mt-7">
              <DashboardLineChart
                ariaLabel="overall-practice-progress"
                color="#16a34a"
                days={days}
                points={overallPoints}
              />
            </div>
          </section>

          <div className="mt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Category Wise Improvement
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 sm:text-2xl">
                  Separate 30-day trends
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {isLoadingCategories ? 'Loading categories...' : 'One chart per category'}
              </p>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {categorySeries.map((series) => (
                <section key={series.id} className="apple-panel p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Category
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950 sm:text-xl">
                        {series.name}
                      </h3>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: series.color }}
                    >
                      {series.points[series.points.length - 1]}%
                    </span>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <DashboardLineChart
                      ariaLabel={`${series.name}-category-progress`}
                      color={series.color}
                      compact
                      days={days}
                      points={series.points}
                    />
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
