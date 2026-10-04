'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { getTenders, formatFileSize } from '@/lib/api'

type TenderStatus = 'all' | 'open' | 'closed' | 'awarded'
type TenderCategory = 'all' | 'goods' | 'works' | 'consultancy' | 'non_consultancy'

interface TenderDocument {
  name: string
  url: string
  size: number | string
}

interface Tender {
  id: string
  slug?: string
  reference_no?: string
  referenceNo?: string
  title: string
  titleSw?: string
  description: string
  descriptionSw?: string
  category: string
  procurement_method?: string
  procurementMethod?: string
  issue_date?: string
  issueDate?: string
  closing_datetime?: string
  closingDate?: string
  tender_status?: string
  status?: string
  award_supplier?: string
  awardedTo?: string
  award_amount?: string | null
  awardAmount?: number
  documents: TenderDocument[]
}

// Demo data - fallback when API is unavailable
const demoTenders: Tender[] = [
  {
    id: '0',
    referenceNo: 'TASFAM/C/001/2026',
    title: 'Full Assessment Consultancy - Terms of Reference',
    titleSw: 'Ushauri wa Tathmini Kamili - Hadidu za Rejea',
    description: 'Terms of Reference for consultancy services to conduct a full assessment for the TASFAM project implementation.',
    descriptionSw: 'Hadidu za Rejea kwa huduma za ushauri kufanya tathmini kamili ya utekelezaji wa mradi wa TASFAM.',
    category: 'consultancy',
    procurementMethod: 'QCBS',
    issueDate: '2026-09-20',
    closingDate: '2026-10-30',
    status: 'open',
    documents: [
      { name: 'Terms of Reference (ToR)', url: '/tenders/tasfam-tor-assessment.docx', size: '75 KB' },
    ],
  },
  {
    id: '1',
    referenceNo: 'TASFAM/G/001/2025',
    title: 'Supply of Fishing Monitoring Equipment',
    titleSw: 'Usambazaji wa Vifaa vya Ufuatiliaji wa Uvuvi',
    description: 'Procurement of GPS devices, VMS transponders, and electronic catch documentation systems for 150 fishing vessels.',
    descriptionSw: 'Manunuzi ya vifaa vya GPS, vitoa ishara vya VMS, na mifumo ya kielektroniki ya kuhifadhi taarifa za mavuno kwa meli 150 za uvuvi.',
    category: 'goods',
    procurementMethod: 'NCB',
    issueDate: '2025-09-01',
    closingDate: '2025-10-15',
    status: 'open',
    documents: [
      { name: 'Bidding Document', url: '/documents/tenders/tasfam-bidding-doc-equipment.pdf', size: '2.4 MB' },
      { name: 'Technical Specifications', url: '/documents/tenders/tasfam-tech-specs-equipment.pdf', size: '1.1 MB' },
    ],
  },
  {
    id: '2',
    referenceNo: 'TASFAM/W/002/2025',
    title: 'Construction of Fish Landing Site - Mkokotoni',
    titleSw: 'Ujenzi wa Kituo cha Kutoshea Samaki - Mkokotoni',
    description: 'Construction of modern fish landing facility including cold storage, processing area, and market stalls.',
    descriptionSw: 'Ujenzi wa kituo cha kisasa cha kutoshea samaki ikiwa ni pamoja na hifadhi ya baridi, eneo la usindikaji, na vibanda vya soko.',
    category: 'works',
    procurementMethod: 'ICB',
    issueDate: '2025-08-15',
    closingDate: '2025-09-30',
    status: 'closed',
    documents: [
      { name: 'Bidding Document', url: '/documents/tenders/tasfam-bidding-doc-mkokotoni.pdf', size: '5.2 MB' },
      { name: 'Drawings', url: '/documents/tenders/tasfam-drawings-mkokotoni.pdf', size: '12.8 MB' },
    ],
  },
  {
    id: '3',
    referenceNo: 'TASFAM/C/003/2025',
    title: 'Consultancy for Stock Assessment Study',
    titleSw: 'Ushauri kwa Utafiti wa Tathmini ya Rasilimali za Uvuvi',
    description: 'Technical consultancy for comprehensive stock assessment of priority commercial fish species in Tanzanian waters.',
    descriptionSw: 'Ushauri wa kitaalamu kwa tathmini kamili ya rasilimali za aina za samaki wa kibiashara wa kipaumbele katika maji ya Tanzania.',
    category: 'consultancy',
    procurementMethod: 'QCBS',
    issueDate: '2025-07-01',
    closingDate: '2025-08-15',
    status: 'awarded',
    awardedTo: 'Tanzania Fisheries Research Institute',
    awardAmount: 450000,
    documents: [
      { name: 'Contract Award Notice', url: '/documents/tenders/tasfam-contract-award-stock.pdf', size: '245 KB' },
    ],
  },
]

export default function TendersPage() {
  const t = useTranslations('tenders')
  const locale = useLocale()
  const [statusFilter, setStatusFilter] = useState<TenderStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState<TenderCategory>('all')
  const [tenders, setTenders] = useState<Tender[]>(demoTenders)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  // Fetch tenders from API
  useEffect(() => {
    async function fetchTenders() {
      try {
        const status = statusFilter !== 'all' ? statusFilter : undefined
        const category = categoryFilter !== 'all' ? categoryFilter : undefined
        const data = await getTenders(locale, status, category)

        if (data && data.length > 0) {
          setTenders(data)
          setUsingFallback(false)
        } else {
          setTenders(demoTenders)
          setUsingFallback(true)
        }
      } catch (error) {
        console.error('Failed to fetch tenders:', error)
        setTenders(demoTenders)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTenders()
  }, [locale, statusFilter, categoryFilter])

  // Helper functions to normalize API/demo data
  const getReferenceNo = (tender: Tender) => tender.reference_no || tender.referenceNo || ''
  const getTitle = (tender: Tender) => locale === 'sw' && tender.titleSw ? tender.titleSw : tender.title
  const getDescription = (tender: Tender) => locale === 'sw' && tender.descriptionSw ? tender.descriptionSw : tender.description
  const getStatus = (tender: Tender) => tender.tender_status || tender.status || 'open'
  const getClosingDate = (tender: Tender) => tender.closing_datetime || tender.closingDate || ''
  const getAwardedTo = (tender: Tender) => tender.award_supplier || tender.awardedTo || ''
  const getAwardAmount = (tender: Tender) => {
    if (tender.award_amount) return parseFloat(tender.award_amount)
    return tender.awardAmount || 0
  }

  const getDocSize = (size: number | string) => {
    if (typeof size === 'number') return formatFileSize(size)
    return size
  }

  // Filter tenders for fallback data
  const filteredTenders = usingFallback
    ? tenders.filter((tender) => {
        const status = getStatus(tender)
        if (statusFilter !== 'all' && status !== statusFilter) return false
        if (categoryFilter !== 'all' && tender.category !== categoryFilter.replace('_', '-')) return false
        return true
      })
    : tenders

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryLabel = (category: string) => {
    const cat = category.replace('-', '_').replace('non_consultancy', 'nonConsultancy')
    const labels: Record<string, string> = {
      goods: t('goods'),
      works: t('works'),
      consultancy: t('consultancy'),
      non_consultancy: t('nonConsultancy'),
      nonConsultancy: t('nonConsultancy'),
    }
    return labels[cat] || category
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'awarded':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero section with ocean blue background */}
      <section className="text-white py-16 relative overflow-hidden" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max relative">
          <span className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2 block" style={{ color: '#CCE9F5' }}>
            {locale === 'en' ? 'Procurement' : 'Manunuzi'}
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
        <div className="container-max py-6 flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-semibold text-muted">Status:</span>
            {(['all', 'open', 'closed', 'awarded'] as TenderStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                  statusFilter === status
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-ink border-hairline hover:border-accent'
                }`}
              >
                {status === 'all' ? (locale === 'en' ? 'All' : 'Zote') :
                 status === 'open' ? t('openTenders') :
                 status === 'closed' ? t('closedTenders') : t('awardedContracts')}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-semibold text-muted">{t('category')}:</span>
            {(['all', 'goods', 'works', 'consultancy', 'non_consultancy'] as TenderCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                  categoryFilter === cat
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-ink border-hairline hover:border-accent'
                }`}
              >
                {cat === 'all' ? (locale === 'en' ? 'All' : 'Zote') : getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {usingFallback && (
            <div className="ml-auto text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              {locale === 'en' ? 'Showing placeholder data' : 'Inaonyesha data ya mfano'}
            </div>
          )}
        </div>
      </section>

      {/* Tender list */}
      <section className="container-max py-10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredTenders.map((tender) => {
              const status = getStatus(tender)
              const awardedTo = getAwardedTo(tender)
              const awardAmount = getAwardAmount(tender)

              return (
                <article
                  key={tender.id}
                  className="bg-white border border-hairline rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap gap-4 items-start justify-between mb-4">
                    <div>
                      <span className="text-sm text-muted font-medium">{getReferenceNo(tender)}</span>
                      <h2 className="font-bitter text-xl font-semibold mt-1">
                        {getTitle(tender)}
                      </h2>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(status)}`}>
                      {status === 'open' ? t('openTenders') :
                       status === 'closed' ? t('closedTenders') : t('awardedContracts')}
                    </span>
                  </div>

                  <p className="text-[#4A5C63] mb-4 leading-relaxed">
                    {getDescription(tender)}
                  </p>

                  <div className="flex flex-wrap gap-6 text-sm mb-4">
                    <div>
                      <span className="text-muted">{t('category')}:</span>{' '}
                      <span className="font-medium">{getCategoryLabel(tender.category)}</span>
                    </div>
                    <div>
                      <span className="text-muted">{t('closingDate')}:</span>{' '}
                      <span className="font-medium">{formatDate(getClosingDate(tender))}</span>
                    </div>
                    {awardedTo && (
                      <div>
                        <span className="text-muted">{locale === 'en' ? 'Awarded to' : 'Imetolewa kwa'}:</span>{' '}
                        <span className="font-medium">{awardedTo}</span>
                      </div>
                    )}
                    {awardAmount > 0 && (
                      <div>
                        <span className="text-muted">{locale === 'en' ? 'Amount' : 'Kiasi'}:</span>{' '}
                        <span className="font-medium text-accent">USD {awardAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  <div className="flex flex-wrap gap-3">
                    {tender.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#FBF8F2] border border-hairline rounded-lg text-sm font-medium text-ink hover:border-accent hover:bg-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {doc.name}
                        <span className="text-muted text-xs">({getDocSize(doc.size)})</span>
                      </a>
                    ))}
                  </div>
                </article>
              )
            })}

            {filteredTenders.length === 0 && (
              <div className="text-center py-16 text-muted">
                <p className="text-lg">
                  {locale === 'en' ? 'No tenders found matching your filters.' : 'Hakuna zabuni zinazolingana na vichujio vyako.'}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
