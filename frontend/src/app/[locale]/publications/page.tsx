'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { getPublications, formatFileSize } from '@/lib/api'

interface Publication {
  id: string
  slug?: string
  title: string
  titleSw?: string
  description: string
  descriptionSw?: string
  doc_type?: string
  type?: string
  disclosureDate?: string
  disclosure_date?: string
  file_url?: string
  fileUrl?: string
  file_size?: number
  fileSize?: string
  page_count?: number | null
  pageCount?: number
  language?: string
  file_language?: string
  is_safeguard?: boolean
  isSafeguard?: boolean
  version?: string
}

// Demo publications (fallback when API is unavailable)
const demoPublications: Publication[] = [
  {
    id: '1',
    title: 'Environmental and Social Management Framework (ESMF)',
    titleSw: 'Mfumo wa Usimamizi wa Mazingira na Jamii (ESMF)',
    description: 'Framework document outlining environmental and social risk management for TASFAM project activities.',
    descriptionSw: 'Nyaraka ya mfumo inayoelezea usimamizi wa hatari za mazingira na kijamii kwa shughuli za mradi wa TASFAM.',
    type: 'esmf',
    disclosureDate: '2025-01-15',
    fileUrl: '/documents/publications/tasfam-esmf.pdf',
    fileSize: '4.2 MB',
    pageCount: 156,
    language: 'English',
    isSafeguard: true,
  },
  {
    id: '2',
    title: 'Resettlement Policy Framework (RPF)',
    titleSw: 'Mfumo wa Sera ya Uhamishaji (RPF)',
    description: 'Policy framework for managing any involuntary resettlement under the project.',
    descriptionSw: 'Mfumo wa sera ya kusimamia uhamishaji wowote wa lazima chini ya mradi.',
    type: 'rpf',
    disclosureDate: '2025-01-15',
    fileUrl: '/documents/publications/tasfam-rpf.pdf',
    fileSize: '2.8 MB',
    pageCount: 98,
    language: 'English',
    isSafeguard: true,
  },
  {
    id: '3',
    title: 'Stakeholder Engagement Plan (SEP)',
    titleSw: 'Mpango wa Ushirikishwaji wa Wadau (SEP)',
    description: 'Comprehensive plan for stakeholder consultation and engagement throughout project implementation.',
    descriptionSw: 'Mpango kamili wa mashauriano na ushirikishaji wa wadau katika utekelezaji wote wa mradi.',
    type: 'sep',
    disclosureDate: '2025-01-20',
    fileUrl: '/documents/publications/tasfam-sep.pdf',
    fileSize: '1.9 MB',
    pageCount: 72,
    language: 'English/Kiswahili',
    isSafeguard: true,
  },
  {
    id: '4',
    title: 'Annual Progress Report FY2025',
    titleSw: 'Ripoti ya Maendeleo ya Mwaka 2025',
    description: 'Annual progress report covering implementation activities from July 2024 to June 2025.',
    descriptionSw: 'Ripoti ya maendeleo ya mwaka inayohusu shughuli za utekelezaji kutoka Julai 2024 hadi Juni 2025.',
    type: 'report',
    disclosureDate: '2025-07-30',
    fileUrl: '/documents/publications/tasfam-annual-report-2025.pdf',
    fileSize: '3.5 MB',
    pageCount: 84,
    language: 'English',
    isSafeguard: false,
  },
  {
    id: '5',
    title: 'Procurement Plan 2025-2026',
    titleSw: 'Mpango wa Manunuzi 2025-2026',
    description: 'Detailed procurement plan for goods, works, and consultancy services.',
    descriptionSw: 'Mpango wa kina wa manunuzi ya bidhaa, ujenzi, na huduma za ushauri.',
    type: 'plan',
    disclosureDate: '2025-06-01',
    fileUrl: '/documents/publications/tasfam-procurement-plan-2025.pdf',
    fileSize: '890 KB',
    pageCount: 28,
    language: 'English',
    isSafeguard: false,
  },
  {
    id: '6',
    title: 'Fisheries Co-Management Guidelines',
    titleSw: 'Mwongozo wa Usimamizi Shirikishi wa Uvuvi',
    description: 'Guidelines for establishing and operating Beach Management Units (BMUs).',
    descriptionSw: 'Mwongozo wa kuanzisha na kuendesha Vitengo vya Usimamizi wa Fukwe (BMU).',
    type: 'guideline',
    disclosureDate: '2025-03-15',
    fileUrl: '/documents/publications/tasfam-fisheries-guidelines.pdf',
    fileSize: '1.2 MB',
    pageCount: 45,
    language: 'English/Kiswahili',
    isSafeguard: false,
  },
]

export default function PublicationsPage() {
  const t = useTranslations('publications')
  const locale = useLocale()
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [publications, setPublications] = useState<Publication[]>(demoPublications)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  const types = ['report', 'esmf', 'rpf', 'sep', 'esmp', 'rap', 'audit', 'plan', 'guideline']
  const years = ['2026', '2025', '2024', '2023']

  // Fetch publications from API
  useEffect(() => {
    async function fetchPublications() {
      try {
        const type = typeFilter !== 'all' ? typeFilter : undefined
        const year = yearFilter !== 'all' ? yearFilter : undefined
        const data = await getPublications(locale, type, year)

        if (data && data.length > 0) {
          setPublications(data)
          setUsingFallback(false)
        } else {
          // API returned empty, use demo data
          setPublications(demoPublications)
          setUsingFallback(true)
        }
      } catch (error) {
        console.error('Failed to fetch publications:', error)
        // Use demo data as fallback
        setPublications(demoPublications)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [locale, typeFilter, yearFilter])

  // Helper to get normalized values
  const getTitle = (pub: Publication) => {
    if (locale === 'sw') {
      return pub.titleSw || pub.title
    }
    return pub.title
  }

  const getDescription = (pub: Publication) => {
    if (locale === 'sw') {
      return pub.descriptionSw || pub.description
    }
    return pub.description
  }

  const getDocType = (pub: Publication) => pub.doc_type || pub.type || 'report'
  const getDisclosureDate = (pub: Publication) => pub.disclosure_date || pub.disclosureDate || ''
  const getFileUrl = (pub: Publication) => pub.file_url || pub.fileUrl || '#'
  const getFileSize = (pub: Publication) => {
    if (pub.file_size) return formatFileSize(pub.file_size)
    return pub.fileSize || ''
  }
  const getPageCount = (pub: Publication) => pub.page_count || pub.pageCount || 0
  const getIsSafeguard = (pub: Publication) => pub.is_safeguard ?? pub.isSafeguard ?? false

  // Filter publications (for demo data that doesn't use API filtering)
  const filteredPublications = usingFallback
    ? publications.filter((pub) => {
        const type = getDocType(pub)
        const date = getDisclosureDate(pub)
        if (typeFilter !== 'all' && type !== typeFilter) return false
        if (yearFilter !== 'all' && !date.startsWith(yearFilter)) return false
        return true
      })
    : publications

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getTypeIcon = (type: string) => {
    const safeguardTypes = ['esmf', 'rpf', 'sep', 'esmp', 'rap']
    if (safeguardTypes.includes(type)) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero section */}
      <section className="text-white py-16" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max">
          <span className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2 block" style={{ color: '#CCE9F5' }}>
            {locale === 'en' ? 'Resources' : 'Rasilimali'}
          </span>
          <h1 className="font-bitter text-[clamp(32px,5vw,48px)] font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#E0F4FB' }}>
            {t('description')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-hairline">
        <div className="container-max py-6 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-muted">{t('filterByType')}:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3 border border-hairline rounded-lg bg-white text-sm"
            >
              <option value="all">{t('allTypes')}</option>
              {types.map((type) => (
                <option key={type} value={type}>{t(type)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-muted">{t('filterByYear')}:</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="h-10 px-3 border border-hairline rounded-lg bg-white text-sm"
            >
              <option value="all">{t('allYears')}</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {usingFallback && (
            <div className="ml-auto text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              {locale === 'en' ? 'Showing placeholder data' : 'Inaonyesha data ya mfano'}
            </div>
          )}
        </div>
      </section>

      {/* Publications grid */}
      <section className="container-max py-10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPublications.map((pub) => {
                const docType = getDocType(pub)
                const isSafeguard = getIsSafeguard(pub)

                return (
                  <article
                    key={pub.id}
                    className="bg-white border border-hairline rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`p-2 rounded-lg ${isSafeguard ? 'bg-amber-100 text-amber-700' : 'bg-[#E0F4FB] text-[#2196C8]'}`}>
                          {getTypeIcon(docType)}
                        </span>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                            {t(docType)}
                          </span>
                          {isSafeguard && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              {locale === 'en' ? 'Safeguard' : 'Ulinzi'}
                            </span>
                          )}
                        </div>
                      </div>
                      <h2 className="font-bitter font-semibold text-lg mb-2 line-clamp-2">
                        {getTitle(pub)}
                      </h2>
                      <p className="text-sm text-[#4A5C63] mb-4 line-clamp-3">
                        {getDescription(pub)}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted">
                        <span>{t('disclosedOn')} {formatDate(getDisclosureDate(pub))}</span>
                        {getPageCount(pub) > 0 && (
                          <span>{getPageCount(pub)} {t('pages')}</span>
                        )}
                        <span>{pub.language || pub.file_language || 'English'}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-[#FBF8F2] border-t border-hairline">
                      <a
                        href={getFileUrl(pub)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-[#12907F] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t('download')}
                        {getFileSize(pub) && (
                          <span className="opacity-75">({getFileSize(pub)})</span>
                        )}
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>

            {filteredPublications.length === 0 && (
              <div className="text-center py-16 text-muted">
                <p className="text-lg">
                  {locale === 'en' ? 'No publications found matching your filters.' : 'Hakuna machapisho yanayolingana na vichujio vyako.'}
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
