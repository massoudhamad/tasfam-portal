'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/api'

interface FeaturedStory {
  slug: string
  pull_quote: string
  subject_name: string
  subject_role: string
  location: string
  photo: string | null
}

// Default fallback story
const defaultStory = {
  en: {
    slug: 'mwanaidi-juma',
    pull_quote: '"We stopped guessing where the fish were."',
    subject_name: 'Mwanaidi Juma',
    subject_role: 'seaweed farmer',
    location: 'Paje — Unguja South',
    description: 'Deep-water tubular lines raised her harvest from 0.6 to 1.9 tonnes a season.',
  },
  sw: {
    slug: 'mwanaidi-juma',
    pull_quote: '"Tuliacha kubahatisha samaki walipo."',
    subject_name: 'Mwanaidi Juma',
    subject_role: 'mkulima wa mwani',
    location: 'Paje — Kusini Unguja',
    description: 'Mistari ya maji ya kina iliongeza mavuno kutoka tani 0.6 hadi 1.9 kwa msimu.',
  },
}

export function StoryHighlight() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [story, setStory] = useState<FeaturedStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  const fallback = defaultStory[locale as 'en' | 'sw'] || defaultStory.en

  useEffect(() => {
    async function fetchFeaturedStory() {
      try {
        const settings = await getSiteSettings(locale)
        if (settings.featured_story) {
          setStory(settings.featured_story)
          setUsingFallback(false)
        } else {
          setUsingFallback(true)
        }
      } catch (error) {
        console.error('Failed to fetch featured story:', error)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedStory()
  }, [locale])

  const displayStory = story || fallback
  const photoUrl = story?.photo || '/gallery/ocean-background.jpg'

  return (
    <section className="bg-[#0A2530] text-white">
      <div className="container-max px-0 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
          {/* Image */}
          <div
            className="min-h-[320px] bg-cover bg-center bg-[#123B44]"
            style={{
              backgroundImage: `url('${photoUrl}')`,
            }}
          />

          {/* Content */}
          <div className="py-14 px-6 md:px-11 flex flex-col gap-4 justify-center">
            <span className="text-[13px] tracking-[0.14em] uppercase text-light-accent font-bold">
              {t('storyFromField')}
            </span>
            <h2 className="font-bitter text-[clamp(24px,3vw,34px)] leading-tight font-semibold max-w-[24ch]">
              {displayStory.pull_quote}
            </h2>
            <p className="text-[17px] leading-relaxed text-[#DCE9EA] max-w-[46ch]">
              {displayStory.subject_name}, {displayStory.subject_role}, {displayStory.location}.
              {usingFallback && ` ${fallback.description}`}
            </p>
            <Link
              href={`/${locale}/stories/${displayStory.slug}`}
              className="min-h-[52px] self-start inline-flex items-center px-6 rounded-md bg-white text-[#0A2530] no-underline font-bold text-base hover:bg-light-accent"
            >
              {t('readStory')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
