/**
 * TASFAM API Client
 * Connects frontend to Django REST Framework backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface Publication {
  id: string
  slug: string
  title: string
  description: string
  doc_type: string
  file_url: string
  file_size: number
  page_count: number | null
  disclosure_date: string
  is_safeguard: boolean
  version: string
}

interface NewsItem {
  id: string
  slug: string
  title: string
  summary: string
  date: string
  category: string
  is_featured: boolean
  hero_image: string | null
}

interface Tender {
  id: string
  slug: string
  reference_no: string
  title: string
  description: string
  category: string
  procurement_method: string
  issue_date: string
  closing_datetime: string
  tender_status: string
  award_supplier: string
  award_amount: string | null
  award_date: string | null
  documents: {
    name: string
    url: string
    size: number
  }[]
}

interface Story {
  id: string
  slug: string
  headline: string
  pull_quote: string
  subject_name: string
  subject_role: string
  location: string
  photo: string | null
}

interface Partner {
  id: string
  name: string
  abbreviation: string
  role: string
  logo: string | null
  url: string
  description: string
}

interface SubProject {
  id: string
  slug: string
  name: string
  description: string
  component: number
  district: string
  island: string
  status: string
  budget_usd: string | null
  physical_progress_pct: string
  coordinates: [number, number] | null
}

async function fetchAPI<T>(endpoint: string, lang: string = 'en'): Promise<T> {
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${API_BASE_URL}${endpoint}${separator}lang=${lang}`

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    next: {
      revalidate: 60, // Revalidate every 60 seconds
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

// Publications
export async function getPublications(lang: string = 'en', type?: string, year?: string, safeguards?: boolean): Promise<Publication[]> {
  let endpoint = '/publications'
  const params = new URLSearchParams()

  if (type) params.append('type', type)
  if (year) params.append('year', year)
  if (safeguards) params.append('safeguards', 'true')

  const queryString = params.toString()
  if (queryString) endpoint += `?${queryString}`

  return fetchAPI<Publication[]>(endpoint, lang)
}

// News
export async function getNews(lang: string = 'en', category?: string, year?: string): Promise<NewsItem[]> {
  let endpoint = '/news'
  const params = new URLSearchParams()

  if (category) params.append('category', category)
  if (year) params.append('year', year)

  const queryString = params.toString()
  if (queryString) endpoint += `?${queryString}`

  return fetchAPI<NewsItem[]>(endpoint, lang)
}

export async function getNewsItem(slug: string, lang: string = 'en'): Promise<NewsItem & { body: string; gallery: string[] }> {
  return fetchAPI(`/news/${slug}`, lang)
}

// Tenders
export async function getTenders(lang: string = 'en', status?: string, category?: string): Promise<Tender[]> {
  let endpoint = '/tenders'
  const params = new URLSearchParams()

  if (status) params.append('tender_status', status)
  if (category) params.append('category', category)

  const queryString = params.toString()
  if (queryString) endpoint += `?${queryString}`

  return fetchAPI<Tender[]>(endpoint, lang)
}

export async function getTender(slug: string, lang: string = 'en'): Promise<Tender> {
  return fetchAPI(`/tenders/${slug}`, lang)
}

// Stories
export async function getStories(lang: string = 'en'): Promise<Story[]> {
  return fetchAPI<Story[]>('/stories', lang)
}

export async function getStory(slug: string, lang: string = 'en'): Promise<Story & { body: string; photos: string[] }> {
  return fetchAPI(`/stories/${slug}`, lang)
}

// Partners
export async function getPartners(lang: string = 'en'): Promise<Partner[]> {
  return fetchAPI<Partner[]>('/partners', lang)
}

// Sub-projects
export async function getSubProjects(lang: string = 'en', component?: number, island?: string, status?: string): Promise<SubProject[]> {
  let endpoint = '/sub-projects'
  const params = new URLSearchParams()

  if (component) params.append('component', component.toString())
  if (island) params.append('island', island)
  if (status) params.append('status', status)

  const queryString = params.toString()
  if (queryString) endpoint += `?${queryString}`

  return fetchAPI<SubProject[]>(endpoint, lang)
}

// GeoJSON for map
export async function getSubProjectsGeoJSON(lang: string = 'en'): Promise<GeoJSON.FeatureCollection> {
  return fetchAPI('/sub-projects.geojson', lang)
}

// Indicators / KPIs
interface Indicator {
  id: string
  code: string
  name: string
  definition: string
  unit: string
  lens: string
  level: string
  baseline: string
  target: string
  current_value: string | null
  display_format: string
  values: {
    fiscal_year: number
    period: string
    value: string
    disaggregation: string
  }[]
}

export async function getIndicators(lang: string = 'en', lens?: string): Promise<Indicator[]> {
  let endpoint = '/indicators'
  if (lens) {
    endpoint += `?lens=${lens}`
  }
  return fetchAPI<Indicator[]>(endpoint, lang)
}

// Key figures for homepage dashboard
export async function getKeyFigures(lang: string = 'en'): Promise<Indicator[]> {
  // Fetch indicators marked as public for the dashboard
  return fetchAPI<Indicator[]>('/indicators', lang)
}

// Site Settings (Hero, Video, Featured Story)
interface SiteSettings {
  hero: {
    title: string
    subtitle: string
    image: string | null
    cta_text: string
    cta_link: string
  }
  video: {
    url: string
    title: string
    description: string
    thumbnail: string | null
  }
  featured_story: {
    id: string
    slug: string
    headline: string
    pull_quote: string
    subject_name: string
    subject_role: string
    location: string
    photo: string | null
  } | null
  impact: {
    title: string
    subtitle: string
  }
}

export async function getSiteSettings(lang: string = 'en'): Promise<SiteSettings> {
  return fetchAPI<SiteSettings>('/site-settings', lang)
}

// Implementation Progress (S-curve data)
interface ProgressData {
  fiscal_year: string
  planned: number
  actual: number | null
  notes: string
}

export async function getImplementationProgress(lang: string = 'en'): Promise<ProgressData[]> {
  return fetchAPI<ProgressData[]>('/implementation-progress', lang)
}

// Gallery images
interface GalleryImage {
  id: string
  url: string
  alt: string
  caption: string
  credit: string
  category: string
}

export async function getGalleryImages(lang: string = 'en', category?: string): Promise<GalleryImage[]> {
  let endpoint = '/gallery'
  if (category) {
    endpoint += `?category=${category}`
  }
  return fetchAPI<GalleryImage[]>(endpoint, lang)
}

// Project Components (for Dashboard)
interface ProjectComponent {
  number: number
  title: string
  summary: string
  allocation_usd: string
  allocation_share: string
  start_year: number
  end_year: number
}

export async function getProjectComponents(lang: string = 'en'): Promise<ProjectComponent[]> {
  return fetchAPI<ProjectComponent[]>('/components', lang)
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${(bytes / 1024).toFixed(1)} KB`
}
