'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Lens = 'people' | 'ocean' | 'institutions' | 'jobs'

export function ImpactSection() {
  const t = useTranslations('home')
  const [activeLens, setActiveLens] = useState<Lens>('people')

  const lenses: { key: Lens; label: string }[] = [
    { key: 'people', label: t('peopleReached') },
    { key: 'ocean', label: t('oceanStocks') },
    { key: 'institutions', label: t('institutions') },
    { key: 'jobs', label: t('jobsLivelihoods') },
  ]

  const lensData: Record<Lens, { title: string; value: string; description: string }[]> = {
    people: [
      { title: 'Direct beneficiaries', value: '42,500', description: 'Fishers, processors, and coastal community members directly reached' },
      { title: 'Women beneficiaries', value: '19,100', description: '45% of all direct beneficiaries are women' },
      { title: 'Youth (18-35)', value: '12,750', description: '30% of beneficiaries are young people' },
    ],
    ocean: [
      { title: 'Marine area managed', value: '2,400 km²', description: 'Under improved management practices' },
      { title: 'Fish landing sites', value: '156', description: 'Upgraded with monitoring infrastructure' },
      { title: 'Stock assessments', value: '12', description: 'Priority species with completed assessments' },
    ],
    institutions: [
      { title: 'Fishers registered', value: '11,400', description: 'In the SAMAKI digital registry' },
      { title: 'BMUs strengthened', value: '85', description: 'Beach Management Units with improved capacity' },
      { title: 'Staff trained', value: '340', description: 'Government officers trained in fisheries management' },
    ],
    jobs: [
      { title: 'Jobs created', value: '8,500', description: 'New employment opportunities in fisheries value chains' },
      { title: 'Income increase', value: '35%', description: 'Average increase in household income for beneficiaries' },
      { title: 'Enterprises supported', value: '1,200', description: 'Small and medium enterprises in aquaculture' },
    ],
  }

  return (
    <section aria-label="Impact at scale" className="bg-white border-y border-hairline">
      <div className="container-max py-16">
        <div className="flex flex-col gap-2.5 max-w-[60ch] mb-6">
          <span className="text-[13px] tracking-[0.14em] uppercase text-accent font-bold">
            {t('impactAtScale')}
          </span>
          <h2 className="font-bitter text-[clamp(24px,3vw,34px)] font-semibold leading-tight">
            {t('outcomesTracked')}
          </h2>
        </div>

        {/* Tab buttons */}
        <div
          role="tablist"
          aria-label="Impact lenses"
          className="flex flex-wrap gap-2 border-b border-hairline pb-0 mb-6"
        >
          {lenses.map((lens) => (
            <button
              key={lens.key}
              type="button"
              role="tab"
              aria-selected={activeLens === lens.key}
              onClick={() => setActiveLens(lens.key)}
              className={`min-h-12 px-4 border-0 border-b-[3px] bg-transparent font-bold text-[15.5px] cursor-pointer transition-colors ${
                activeLens === lens.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-ink hover:text-accent'
              }`}
            >
              {lens.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          role="tabpanel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {lensData[activeLens].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FBF8F2] border border-hairline rounded-xl p-6 flex flex-col gap-2"
            >
              <span className="text-sm text-muted font-semibold uppercase tracking-wide">
                {item.title}
              </span>
              <span className="font-bitter text-[32px] font-bold text-accent">
                {item.value}
              </span>
              <span className="text-[15px] text-[#4A5C63] leading-relaxed">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
