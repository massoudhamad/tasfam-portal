'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getNews } from '@/lib/api'

interface NewsItem {
  id: string
  slug?: string
  title: string
  titleSw?: string
  summary: string
  summarySw?: string
  date: string
  category: string
  is_featured?: boolean
  isFeatured?: boolean
  hero_image?: string | null
  heroImage?: string | null
}

// Demo news (fallback when API is unavailable)
const demoNews: NewsItem[] = [
  {
    id: '1',
    slug: 'tasfam-launches-vessel-monitoring',
    title: 'TASFAM Launches Vessel Monitoring System for 150 Fishing Boats',
    titleSw: 'TASFAM Inazindua Mfumo wa Ufuatiliaji wa Vyombo kwa Boti 150 za Uvuvi',
    summary: 'The project has successfully deployed GPS tracking and electronic catch documentation systems across fishing vessels in Unguja and Pemba.',
    summarySw: 'Mradi umefanikiwa kuweka mifumo ya ufuatiliaji wa GPS na uhifadhi wa kielektroniki wa mavuno katika vyombo vya uvuvi Unguja na Pemba.',
    date: '2026-09-15',
    category: 'news',
    isFeatured: true,
    heroImage: '/gallery/ocean-background.jpg',
  },
  {
    id: '2',
    slug: 'seaweed-farmers-training-paje',
    title: 'Over 200 Seaweed Farmers Complete Training in Paje',
    titleSw: 'Wakulima wa Mwani Zaidi ya 200 Wamekamilisha Mafunzo Paje',
    summary: 'Women seaweed farmers in Paje have completed intensive training on deep-water tubular farming techniques, tripling their yields.',
    summarySw: 'Wanawake wakulima wa mwani Paje wamekamilisha mafunzo makali ya mbinu za kilimo cha mwani cha maji ya kina.',
    date: '2026-09-01',
    category: 'news',
    isFeatured: false,
    heroImage: '/gallery/ocean-background.jpg',
  },
  {
    id: '3',
    slug: 'mkokotoni-landing-site-groundbreaking',
    title: 'Groundbreaking Ceremony for Mkokotoni Fish Landing Site',
    titleSw: 'Sherehe ya Kuweka Jiwe la Msingi la Kituo cha Kutoshea Samaki Mkokotoni',
    summary: 'Construction begins on modern fish landing facility with cold storage, processing areas, and market stalls.',
    summarySw: 'Ujenzi unaanza wa kituo cha kisasa cha kutoshea samaki chenye hifadhi ya baridi, maeneo ya usindikaji, na vibanda vya soko.',
    date: '2026-08-20',
    category: 'event',
    isFeatured: true,
    heroImage: '/gallery/ocean-background.jpg',
  },
  {
    id: '4',
    slug: 'world-bank-mission-review',
    title: 'World Bank Mission Commends TASFAM Progress',
    titleSw: 'Ujumbe wa Benki ya Dunia Unapongeza Maendeleo ya TASFAM',
    summary: 'The Implementation Support Mission rated the project as Satisfactory, highlighting achievements in fisher registration and community engagement.',
    summarySw: 'Ujumbe wa Msaada wa Utekelezaji ulitathmini mradi kuwa wa Kuridhisha, ukisisitiza mafanikio katika usajili wa wavuvi na ushirikishwaji wa jamii.',
    date: '2026-08-05',
    category: 'press',
    isFeatured: false,
    heroImage: '/gallery/ocean-background.jpg',
  },
  {
    id: '5',
    slug: 'stakeholder-consultation-pemba',
    title: 'Stakeholder Consultation Workshop Held in Pemba',
    titleSw: 'Warsha ya Mashauriano na Wadau Imefanyika Pemba',
    summary: 'Over 150 stakeholders participated in discussions on fisheries co-management and sustainable aquaculture practices.',
    summarySw: 'Wadau zaidi ya 150 walishiriki katika majadiliano kuhusu usimamizi shirikishi wa uvuvi na mazoea endelevu ya ufugaji samaki.',
    date: '2026-07-15',
    category: 'event',
    isFeatured: false,
    heroImage: '/gallery/ocean-background.jpg',
  },
]

export default function NewsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [news, setNews] = useState<NewsItem[]>(demoNews)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchNews() {
      try {
        const category = categoryFilter !== 'all' ? categoryFilter : undefined
        const data = await getNews(locale, category)

        if (data && data.length > 0) {
          setNews(data)
          setUsingFallback(false)
        } else {
          setNews(demoNews)
          setUsingFallback(true)
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
        setNews(demoNews)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [locale, categoryFilter])

  const getTitle = (item: NewsItem) => locale === 'sw' && item.titleSw ? item.titleSw : item.title
  const getSummary = (item: NewsItem) => locale === 'sw' && item.summarySw ? item.summarySw : item.summary
  const getIsFeatured = (item: NewsItem) => item.is_featured ?? item.isFeatured ?? false
  const getHeroImage = (item: NewsItem) => item.hero_image || item.heroImage || '/gallery/ocean-background.jpg'

  const filteredNews = usingFallback
    ? news.filter((item) => categoryFilter === 'all' || item.category === categoryFilter)
    : news

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { en: string; sw: string }> = {
      news: { en: 'News', sw: 'Habari' },
      event: { en: 'Event', sw: 'Tukio' },
      press: { en: 'Press Release', sw: 'Taarifa kwa Vyombo vya Habari' },
    }
    return locale === 'en' ? labels[category]?.en || category : labels[category]?.sw || category
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news':
        return 'bg-blue-100 text-blue-800'
      case 'event':
        return 'bg-green-100 text-green-800'
      case 'press':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero section */}
      <section className="text-white py-16" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max">
          <span className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2 block" style={{ color: '#CCE9F5' }}>
            {locale === 'en' ? 'Latest Updates' : 'Taarifa za Hivi Karibuni'}
          </span>
          <h1 className="font-bitter text-[clamp(32px,5vw,48px)] font-bold mb-4">
            {locale === 'en' ? 'News & Events' : 'Habari na Matukio'}
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#E0F4FB' }}>
            {locale === 'en'
              ? 'Stay updated with the latest news, events, and press releases from the TASFAM project.'
              : 'Endelea kupata taarifa za hivi karibuni, matukio, na taarifa kwa vyombo vya habari kutoka mradi wa TASFAM.'}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-hairline">
        <div className="container-max py-6 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-semibold text-muted">
            {locale === 'en' ? 'Filter by' : 'Chuja kwa'}:
          </span>
          {['all', 'news', 'event', 'press'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                categoryFilter === cat
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-ink border-hairline hover:border-accent'
              }`}
            >
              {cat === 'all'
                ? (locale === 'en' ? 'All' : 'Zote')
                : getCategoryLabel(cat)}
            </button>
          ))}

          {usingFallback && (
            <div className="ml-auto text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              {locale === 'en' ? 'Showing placeholder data' : 'Inaonyesha data ya mfano'}
            </div>
          )}
        </div>
      </section>

      {/* News grid */}
      <section className="container-max py-10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-hairline rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-48 bg-[#E8F4F8]">
                    <Image
                      src={getHeroImage(item)}
                      alt={getTitle(item)}
                      fill
                      className="object-cover"
                    />
                    {getIsFeatured(item) && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-accent text-white text-xs font-semibold rounded">
                        {locale === 'en' ? 'Featured' : 'Iliyoangaziwa'}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-xs text-muted">{formatDate(item.date)}</span>
                    </div>
                    <h2 className="font-bitter font-semibold text-lg mb-2 line-clamp-2">
                      {getTitle(item)}
                    </h2>
                    <p className="text-sm text-[#4A5C63] mb-4 line-clamp-3 flex-1">
                      {getSummary(item)}
                    </p>
                    <Link
                      href={`/${locale}/news/${item.slug || item.id}`}
                      className="text-accent font-semibold text-sm hover:underline inline-flex items-center gap-1"
                    >
                      {locale === 'en' ? 'Read more' : 'Soma zaidi'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-16 text-muted">
                <p className="text-lg">
                  {locale === 'en' ? 'No news found.' : 'Hakuna habari zilizopatikana.'}
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
