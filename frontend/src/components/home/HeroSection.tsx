'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSiteSettings, getKeyFigures } from '@/lib/api'

interface HeroData {
  title: string
  subtitle: string
  image: string | null
  cta_text: string
  cta_link: string
}

interface KPIData {
  fishersRegistered: string
  womenBeneficiaries: string
  implementationProgress: number
}

export function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [hero, setHero] = useState<HeroData | null>(null)
  const [kpis, setKpis] = useState<KPIData>({
    fishersRegistered: '11,400',
    womenBeneficiaries: '19.1K',
    implementationProgress: 62,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [settings, indicators] = await Promise.all([
          getSiteSettings(locale),
          getKeyFigures(locale),
        ])

        if (settings?.hero) {
          setHero(settings.hero)
        }

        // Extract KPIs from indicators if available
        if (indicators && indicators.length > 0) {
          const fishers = indicators.find(i => i.code === 'FISHERS_REGISTERED')
          const women = indicators.find(i => i.code === 'WOMEN_BENEFICIARIES')
          const progress = indicators.find(i => i.code === 'IMPLEMENTATION_PROGRESS')

          if (fishers?.current_value || women?.current_value || progress?.current_value) {
            setKpis({
              fishersRegistered: fishers?.current_value ? parseFloat(fishers.current_value).toLocaleString() : kpis.fishersRegistered,
              womenBeneficiaries: women?.current_value ? `${(parseFloat(women.current_value) / 1000).toFixed(1)}K` : kpis.womenBeneficiaries,
              implementationProgress: progress?.current_value ? parseFloat(progress.current_value) : kpis.implementationProgress,
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch hero data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale])

  const backgroundImage = hero?.image || '/images/hero-bg.jpg'

  return (
    <section className="relative bg-ink text-white overflow-hidden">
      {/* Ocean blue background with fish pattern */}
      <div
        className="absolute inset-0 bg-ocean-gradient"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A2530] via-[rgba(10,37,48,0.82)] to-[rgba(10,37,48,0.35)]" />

      <div className="relative container-max py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-11 items-center">
        {/* Left content */}
        <div className="flex flex-col gap-6">
          <span className="text-[13px] tracking-[0.14em] uppercase text-light-accent font-bold">
            {t('worldBankSupported')} &middot; 2025&ndash;2030
          </span>
          <h1 className="font-bitter text-[clamp(30px,5vw,52px)] leading-[1.1] font-bold max-w-[20ch]">
            {hero?.title || t('heroTitle')}
          </h1>
          <p className="text-[19px] leading-relaxed max-w-[58ch] text-[#DCE9EA]">
            {hero?.subtitle || t('heroDescription')}
          </p>
          <div className="flex flex-wrap gap-3 mt-1">
            <Link href={`/${locale}/map`} className="btn-primary">
              {t('exploreMap')}
            </Link>
            <Link href={`/${locale}/results`} className="btn-secondary">
              {t('viewResults')}
            </Link>
          </div>
        </div>

        {/* Right side - Live snapshot cards */}
        <aside aria-label="Live snapshot" className="flex flex-col gap-3.5">
          {/* Implementation progress card */}
          <div className="bg-[rgba(9,32,42,0.82)] border border-[#2C5560] rounded-xl p-5 flex flex-col gap-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-light-accent flex-none" />
              <span className="text-xs tracking-[0.14em] uppercase font-bold text-light-accent">
                {t('implementation')}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-bitter text-[19px] font-semibold leading-snug">
                {t('fisherRegistration')}
              </span>
              <div className="flex items-baseline justify-between gap-3 text-sm text-[#BFD6D9]">
                <span>{t('component2Phase1')}</span>
                <span className="font-bitter text-xl font-bold text-white">{kpis.implementationProgress}%</span>
              </div>
              <div
                role="img"
                aria-label={`${kpis.implementationProgress} percent complete`}
                className="h-2 bg-[#1C4350] rounded-full overflow-hidden"
              >
                <div className="h-full bg-light-accent" style={{ width: `${kpis.implementationProgress}%` }} />
              </div>
              <span className="text-[13.5px] text-light-accent font-semibold">
                &#8599; {t('onSchedule')}
              </span>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-[rgba(9,32,42,0.82)] border border-[#2C5560] rounded-xl p-4 flex flex-col gap-1.5">
              <span className="text-xs tracking-[0.1em] uppercase text-light-accent font-bold">
                {t('liveKPI')}
              </span>
              <span className="font-bitter text-[28px] font-bold">{kpis.fishersRegistered}</span>
              <span className="text-[13.5px] text-[#BFD6D9] leading-snug">
                {t('fishersRegistered')}
              </span>
            </div>
            <div className="bg-[rgba(9,32,42,0.82)] border border-[#2C5560] rounded-xl p-4 flex flex-col gap-1.5">
              <span className="text-xs tracking-[0.1em] uppercase text-light-accent font-bold">
                {t('women')}
              </span>
              <span className="font-bitter text-[28px] font-bold">{kpis.womenBeneficiaries}</span>
              <span className="text-[13.5px] text-[#BFD6D9] leading-snug">
                {t('ofBeneficiaries')}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
