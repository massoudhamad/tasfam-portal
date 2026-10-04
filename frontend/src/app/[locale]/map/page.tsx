'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet map (no SSR)
const LeafletMap = dynamic(() => import('@/components/Map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-[#E8F4F8] rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted">Loading map...</p>
      </div>
    </div>
  ),
})

interface SubProject {
  id: string
  name: string
  nameSw: string
  component: number
  district: string
  island: 'unguja' | 'pemba' | 'mainland'
  status: 'planned' | 'active' | 'completed'
  progress: number
  budget: number
  coordinates: [number, number]
}

// Demo data - sub-projects across Zanzibar
const demoSubProjects: SubProject[] = [
  {
    id: '1',
    name: 'Mkokotoni Fish Landing Site',
    nameSw: 'Kituo cha Kutoshea Samaki Mkokotoni',
    component: 2,
    district: 'Kaskazini A',
    island: 'unguja',
    status: 'active',
    progress: 65,
    budget: 850000,
    coordinates: [39.2947, -5.9775],
  },
  {
    id: '2',
    name: 'Nungwi Fisher Registration Center',
    nameSw: 'Kituo cha Usajili wa Wavuvi Nungwi',
    component: 2,
    district: 'Kaskazini A',
    island: 'unguja',
    status: 'completed',
    progress: 100,
    budget: 120000,
    coordinates: [39.2989, -5.7267],
  },
  {
    id: '3',
    name: 'Chake Chake Aquaculture Training',
    nameSw: 'Mafunzo ya Ufugaji Samaki Chake Chake',
    component: 3,
    district: 'Chake Chake',
    island: 'pemba',
    status: 'active',
    progress: 40,
    budget: 280000,
    coordinates: [39.7666, -5.2396],
  },
  {
    id: '4',
    name: 'Wete Cold Storage Facility',
    nameSw: 'Kituo cha Kuhifadhi Baridi Wete',
    component: 3,
    district: 'Wete',
    island: 'pemba',
    status: 'planned',
    progress: 0,
    budget: 520000,
    coordinates: [39.7282, -5.0566],
  },
  {
    id: '5',
    name: 'Paje Seaweed Processing',
    nameSw: 'Usindikaji wa Mwani Paje',
    component: 3,
    district: 'Kusini',
    island: 'unguja',
    status: 'active',
    progress: 75,
    budget: 180000,
    coordinates: [39.5333, -6.2667],
  },
  {
    id: '6',
    name: 'Stone Town Fish Market Upgrade',
    nameSw: 'Uboreshaji wa Soko la Samaki Stone Town',
    component: 3,
    district: 'Mjini Magharibi',
    island: 'unguja',
    status: 'completed',
    progress: 100,
    budget: 450000,
    coordinates: [39.1880, -6.1622],
  },
  {
    id: '7',
    name: 'Mkoani Fishing Port Development',
    nameSw: 'Maendeleo ya Bandari ya Uvuvi Mkoani',
    component: 2,
    district: 'Mkoani',
    island: 'pemba',
    status: 'active',
    progress: 55,
    budget: 920000,
    coordinates: [39.6500, -5.3167],
  },
  {
    id: '8',
    name: 'Kizimkazi Marine Conservation',
    nameSw: 'Uhifadhi wa Bahari Kizimkazi',
    component: 2,
    district: 'Kusini',
    island: 'unguja',
    status: 'active',
    progress: 30,
    budget: 350000,
    coordinates: [39.4833, -6.4333],
  },
]

export default function MapPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [selectedProject, setSelectedProject] = useState<SubProject | null>(null)
  const [filterIsland, setFilterIsland] = useState<string>('all')
  const [filterComponent, setFilterComponent] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredProjects = demoSubProjects.filter((p) => {
    if (filterIsland !== 'all' && p.island !== filterIsland) return false
    if (filterComponent !== 'all' && p.component.toString() !== filterComponent) return false
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    return true
  })

  const handleSelectProject = useCallback((project: SubProject) => {
    setSelectedProject(project)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'active':
        return 'bg-accent'
      case 'planned':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; sw: string }> = {
      completed: { en: 'Completed', sw: 'Imekamilika' },
      active: { en: 'In Progress', sw: 'Inaendelea' },
      planned: { en: 'Planned', sw: 'Imepangwa' },
    }
    return locale === 'en' ? labels[status]?.en : labels[status]?.sw
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <section className="text-white py-12" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max">
          <span className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2 block" style={{ color: '#CCE9F5' }}>
            {locale === 'en' ? 'Interactive Map' : 'Ramani Shirikishi'}
          </span>
          <h1 className="font-bitter text-[clamp(28px,4vw,40px)] font-bold mb-3">
            {t('nav.whereWeWork')}
          </h1>
          <p style={{ color: '#E0F4FB' }} className="max-w-2xl">
            {locale === 'en'
              ? 'Explore TASFAM sub-projects and landing sites across Unguja, Pemba, and the mainland coast.'
              : 'Tazama miradi midogo ya TASFAM na mialo kote Unguja, Pemba, na ukanda wa Bara.'}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-hairline">
        <div className="container-max py-4 flex flex-wrap gap-4 items-center">
          {/* Island filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-muted">
              {locale === 'en' ? 'Island' : 'Kisiwa'}:
            </label>
            <select
              value={filterIsland}
              onChange={(e) => setFilterIsland(e.target.value)}
              className="h-10 px-3 border border-hairline rounded-lg bg-white text-sm"
            >
              <option value="all">{locale === 'en' ? 'All' : 'Zote'}</option>
              <option value="unguja">Unguja</option>
              <option value="pemba">Pemba</option>
              <option value="mainland">{locale === 'en' ? 'Mainland' : 'Bara'}</option>
            </select>
          </div>

          {/* Component filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-muted">
              {locale === 'en' ? 'Component' : 'Kipengele'}:
            </label>
            <select
              value={filterComponent}
              onChange={(e) => setFilterComponent(e.target.value)}
              className="h-10 px-3 border border-hairline rounded-lg bg-white text-sm"
            >
              <option value="all">{locale === 'en' ? 'All' : 'Zote'}</option>
              <option value="1">1 - {locale === 'en' ? 'Governance' : 'Utawala'}</option>
              <option value="2">2 - {locale === 'en' ? 'Fisheries' : 'Uvuvi'}</option>
              <option value="3">3 - {locale === 'en' ? 'Aquaculture' : 'Ufugaji'}</option>
              <option value="4">4 - {locale === 'en' ? 'Management' : 'Usimamizi'}</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-muted">
              {locale === 'en' ? 'Status' : 'Hali'}:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 border border-hairline rounded-lg bg-white text-sm"
            >
              <option value="all">{locale === 'en' ? 'All' : 'Zote'}</option>
              <option value="planned">{locale === 'en' ? 'Planned' : 'Imepangwa'}</option>
              <option value="active">{locale === 'en' ? 'In Progress' : 'Inaendelea'}</option>
              <option value="completed">{locale === 'en' ? 'Completed' : 'Imekamilika'}</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-muted">
            {filteredProjects.length} {locale === 'en' ? 'sub-projects' : 'miradi midogo'}
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="bg-white border-b border-hairline">
        <div className="container-max py-3 flex flex-wrap gap-6 items-center text-sm">
          <span className="text-muted font-semibold">{locale === 'en' ? 'Legend' : 'Ufafanuzi'}:</span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></span>
            <span>{locale === 'en' ? 'Completed' : 'Imekamilika'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-accent border-2 border-white shadow"></span>
            <span>{locale === 'en' ? 'In Progress' : 'Inaendelea'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gray-400 border-2 border-white shadow"></span>
            <span>{locale === 'en' ? 'Planned' : 'Imepangwa'}</span>
          </div>
        </div>
      </section>

      {/* Map + List view */}
      <section className="container-max py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-hairline">
              <LeafletMap
                projects={filteredProjects}
                selectedProject={selectedProject}
                onSelectProject={handleSelectProject}
                locale={locale}
              />
            </div>
          </div>

          {/* Project list */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-hairline rounded-xl overflow-hidden">
              <div className="p-4 border-b border-hairline">
                <h2 className="font-bitter font-semibold text-lg">
                  {locale === 'en' ? 'Sub-Projects' : 'Miradi Midogo'}
                </h2>
              </div>
              <div className="divide-y divide-hairline max-h-[440px] overflow-y-auto">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left p-4 hover:bg-[#FBF8F2] transition-colors ${
                      selectedProject?.id === project.id ? 'bg-[#FBF8F2]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-3 h-3 rounded-full mt-1.5 flex-none ${getStatusColor(project.status)}`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {locale === 'en' ? project.name : project.nameSw}
                        </h3>
                        <p className="text-xs text-muted mt-0.5">
                          {project.district} &bull; {locale === 'en' ? 'Component' : 'Kipengele'} {project.component}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 bg-[#EFE9DC] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-accent">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected project details */}
        {selectedProject && (
          <div className="mt-6 bg-white border border-hairline rounded-xl p-6">
            <div className="flex flex-wrap gap-6 items-start justify-between">
              <div>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full text-white mb-2 ${getStatusColor(selectedProject.status)}`}>
                  {getStatusLabel(selectedProject.status)}
                </span>
                <h3 className="font-bitter text-xl font-semibold mb-2">
                  {locale === 'en' ? selectedProject.name : selectedProject.nameSw}
                </h3>
                <p className="text-muted">
                  {selectedProject.district}, {selectedProject.island.charAt(0).toUpperCase() + selectedProject.island.slice(1)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted mb-1">
                  {locale === 'en' ? 'Budget' : 'Bajeti'}
                </p>
                <p className="font-bitter text-2xl font-bold text-accent">
                  USD {selectedProject.budget.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted mb-2">
                {locale === 'en' ? 'Physical Progress' : 'Maendeleo ya Kimwili'}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-[#EFE9DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
                <span className="font-bold text-accent">{selectedProject.progress}%</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
