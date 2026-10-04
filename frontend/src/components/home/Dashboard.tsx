'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProjectComponents, getImplementationProgress } from '@/lib/api'

interface ComponentData {
  number: number
  title: string
  allocation_share: number
}

interface ProgressData {
  fiscal_year: string
  planned: number
  actual: number | null
}

// Default fallback data
const defaultComponents = [
  { number: 1, title: 'Governance & Policy', allocation_share: 14 },
  { number: 2, title: 'Fisheries Management', allocation_share: 46 },
  { number: 3, title: 'Aquaculture & Value Chains', allocation_share: 28 },
  { number: 4, title: 'Project Management & M&E', allocation_share: 12 },
]

const defaultProgress: ProgressData[] = [
  { fiscal_year: 'FY25', planned: 0, actual: 0 },
  { fiscal_year: 'FY26', planned: 9, actual: 6 },
  { fiscal_year: 'FY27', planned: 27, actual: 19 },
  { fiscal_year: 'FY28', planned: 52, actual: 39 },
  { fiscal_year: 'FY29', planned: 75, actual: null },
  { fiscal_year: 'FY30', planned: 91, actual: null },
]

export function Dashboard() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [components, setComponents] = useState<ComponentData[]>(defaultComponents)
  const [progress, setProgress] = useState<ProgressData[]>(defaultProgress)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [componentsData, progressData] = await Promise.all([
          getProjectComponents(locale),
          getImplementationProgress(locale),
        ])

        if (componentsData && componentsData.length > 0) {
          setComponents(componentsData.map(c => ({
            number: c.number,
            title: c.title,
            allocation_share: parseFloat(c.allocation_share),
          })))
        }

        if (progressData && progressData.length > 0) {
          setProgress(progressData)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale])

  // Calculate SVG points for the S-curve chart
  const chartWidth = 520
  const chartHeight = 250
  const padding = { left: 46, right: 12, top: 30, bottom: 52 }
  const graphWidth = chartWidth - padding.left - padding.right
  const graphHeight = chartHeight - padding.top - padding.bottom

  const getX = (index: number) => padding.left + (index / (progress.length - 1)) * graphWidth
  const getY = (value: number) => padding.top + graphHeight - (value / 100) * graphHeight

  const plannedPoints = progress.map((p, i) => `${getX(i)},${getY(p.planned)}`).join(' ')
  const actualPoints = progress
    .filter(p => p.actual !== null)
    .map((p, i) => `${getX(i)},${getY(p.actual!)}`)
    .join(' ')

  const lastActual = progress.filter(p => p.actual !== null).pop()
  const lastActualIndex = progress.findIndex(p => p === lastActual)

  return (
    <section aria-label="Project dashboard" className="bg-[#FBF8F2] border-b border-hairline">
      <div className="container-max py-16">
        {/* Header */}
        <div className="flex flex-wrap gap-4 md:gap-8 items-end justify-between mb-7">
          <div className="flex flex-col gap-2.5 max-w-[58ch]">
            <span className="text-[13px] tracking-[0.14em] uppercase text-accent font-bold">
              {t('liveSnapshot')}
            </span>
            <h2 className="font-bitter text-[clamp(24px,3vw,34px)] font-semibold leading-tight">
              {t('projectDashboard')}
            </h2>
            <p className="text-[16.5px] leading-relaxed text-[#4A5C63]">
              {t('dashboardDescription')}
            </p>
          </div>
          <Link
            href={`/${locale}/results`}
            className="min-h-12 inline-flex items-center font-bold text-base no-underline text-accent hover:text-ink"
          >
            {t('viewDetailedResults')} &rarr;
          </Link>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* S-Curve chart */}
          <div className="bg-white border border-hairline rounded-xl p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-bitter text-[19px] font-semibold">
                {t('implementationSCurve')}
              </h3>
              <span className="text-sm text-muted">
                {t('projectCompleteFY')}
              </span>
            </div>

            {/* SVG Chart */}
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label="Planned versus actual implementation progress"
              className="w-full h-auto block"
            >
              {/* Grid lines */}
              <g stroke="#E8E1D2" strokeWidth="1">
                {[0, 25, 50, 75, 100].map((val) => (
                  <line key={val} x1={padding.left} y1={getY(val)} x2={chartWidth - padding.right} y2={getY(val)} />
                ))}
              </g>
              {/* Y-axis labels */}
              <g fill="#5C6B72" fontFamily="Karla, sans-serif" fontSize="12" textAnchor="end">
                <text x={padding.left - 8} y={getY(100) + 4}>100</text>
                <text x={padding.left - 8} y={getY(50) + 4}>50</text>
                <text x={padding.left - 8} y={getY(0) + 4}>0</text>
              </g>
              {/* Planned line (dashed) */}
              <polyline
                points={plannedPoints}
                fill="none"
                stroke="#B9A97C"
                strokeWidth="2.5"
                strokeDasharray="6 5"
              />
              {/* Actual line */}
              {actualPoints && (
                <>
                  <polyline
                    points={actualPoints}
                    fill="none"
                    stroke="#0F766E"
                    strokeWidth="3"
                  />
                  {lastActual && (
                    <circle cx={getX(lastActualIndex)} cy={getY(lastActual.actual!)} r="5" fill="#0F766E" />
                  )}
                </>
              )}
              {/* X-axis labels */}
              <g fill="#5C6B72" fontFamily="Karla, sans-serif" fontSize="12" textAnchor="middle">
                {progress.map((p, i) => (
                  <text key={p.fiscal_year} x={getX(i)} y={chartHeight - 30}>{p.fiscal_year}</text>
                ))}
              </g>
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-[#4A5C63]">
              <span className="flex items-center gap-2">
                <span className="w-[18px] h-[3px] bg-accent flex-none" />
                {t('actual')}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-[18px] h-[3px] bg-[#B9A97C] flex-none" />
                {t('planned')}
              </span>
            </div>
          </div>

          {/* Allocation by component */}
          <div className="bg-white border border-hairline rounded-xl p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-bitter text-[19px] font-semibold">
                {t('allocationByComponent')}
              </h3>
              <span className="text-sm text-muted">
                {t('percentOfEnvelope')}
              </span>
            </div>

            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              {components.map((comp) => (
                <li key={comp.number} className="flex flex-col gap-1.5">
                  <span className="flex justify-between gap-3 text-[15px] font-semibold">
                    <span>{comp.number} &mdash; {comp.title}</span>
                    <span className="tabular-nums text-accent">{comp.allocation_share}%</span>
                  </span>
                  <span
                    role="img"
                    aria-label={`${comp.allocation_share} percent`}
                    className="block h-2.5 bg-[#EFE9DC] rounded-full overflow-hidden"
                  >
                    <span
                      className="block h-full bg-accent"
                      style={{ width: `${comp.allocation_share}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
