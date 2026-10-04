'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { getKeyFigures } from '@/lib/api'

interface KeyFigure {
  value: string
  label: string
  code?: string
}

// Default fallback figures when API is unavailable
const defaultFigures = {
  en: [
    { value: 'USD 130M', label: 'Total Financing', code: 'TOTAL_FINANCING' },
    { value: '4', label: 'Project Components', code: 'COMPONENTS' },
    { value: '18', label: 'Coastal Districts', code: 'DISTRICTS' },
    { value: '42,500', label: 'Direct Beneficiaries', code: 'BENEFICIARIES' },
  ],
  sw: [
    { value: 'USD 130M', label: 'Jumla ya Ufadhili', code: 'TOTAL_FINANCING' },
    { value: '4', label: 'Vipengele vya Mradi', code: 'COMPONENTS' },
    { value: '4', label: 'Wilaya za Pwani', code: 'DISTRICTS' },
    { value: '42,500', label: 'Wanufaika wa Moja kwa Moja', code: 'BENEFICIARIES' },
  ],
}

export function KeyFigures() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [figures, setFigures] = useState<KeyFigure[]>(defaultFigures[locale as 'en' | 'sw'] || defaultFigures.en)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchKeyFigures() {
      try {
        const data = await getKeyFigures(locale)

        if (data && data.length > 0) {
          // Map API data to display format
          const apiFigures: KeyFigure[] = data.map((indicator) => {
            let displayValue = indicator.current_value || indicator.target

            // Format based on display_format
            if (indicator.display_format === 'currency' && displayValue) {
              const num = parseFloat(displayValue)
              if (num >= 1000000) {
                displayValue = `USD ${(num / 1000000).toFixed(0)}M`
              } else if (num >= 1000) {
                displayValue = `USD ${(num / 1000).toFixed(0)}K`
              } else {
                displayValue = `USD ${num}`
              }
            } else if (indicator.display_format === 'percent' && displayValue) {
              displayValue = `${displayValue}%`
            } else if (displayValue) {
              // Format large numbers with commas
              const num = parseFloat(displayValue)
              if (!isNaN(num)) {
                displayValue = num.toLocaleString()
              }
            }

            return {
              value: displayValue || '—',
              label: indicator.name,
              code: indicator.code,
            }
          })

          setFigures(apiFigures)
          setUsingFallback(false)
        } else {
          // Use fallback if no data
          setFigures(defaultFigures[locale as 'en' | 'sw'] || defaultFigures.en)
          setUsingFallback(true)
        }
      } catch (error) {
        console.error('Failed to fetch key figures:', error)
        setFigures(defaultFigures[locale as 'en' | 'sw'] || defaultFigures.en)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchKeyFigures()
  }, [locale])

  return (
    <section aria-label="Key figures" className="bg-white border-b border-hairline">
      <div className="container-max py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-100 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
            {figures.map((fig, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <span className="font-bitter text-[clamp(24px,4vw,34px)] font-bold text-accent">
                  {fig.value}
                </span>
                <span className="text-[15px] text-muted leading-snug">
                  {fig.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {usingFallback && (
        <div className="container-max pb-6">
          <p className="text-[13.5px] text-[#8A6A2F] bg-[#FDF6E3] border border-[#E8D9AE] rounded-md px-3.5 py-2.5 inline-block">
            {t('placeholderNote')}
          </p>
        </div>
      )}
    </section>
  )
}
