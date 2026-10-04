'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

interface LeafletMapProps {
  projects: SubProject[]
  selectedProject: SubProject | null
  onSelectProject: (project: SubProject) => void
  locale: string
}

// Custom marker icons
const createMarkerIcon = (status: string) => {
  const color = status === 'completed' ? '#22c55e' : status === 'active' ? '#0F766E' : '#9ca3af'

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

export default function LeafletMap({ projects, selectedProject, onSelectProject, locale }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on Zanzibar
    const map = L.map(mapRef.current, {
      center: [-5.8, 39.4],
      zoom: 8,
      zoomControl: true,
    })

    // Add OpenStreetMap tiles (free, no API key needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when projects change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    projects.forEach(project => {
      const marker = L.marker([project.coordinates[1], project.coordinates[0]], {
        icon: createMarkerIcon(project.status),
      })

      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #10333F;">
            ${locale === 'en' ? project.name : project.nameSw}
          </h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">
            ${project.district} • ${project.island.charAt(0).toUpperCase() + project.island.slice(1)}
          </p>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
            <div style="flex: 1; height: 6px; background: #EFE9DC; border-radius: 3px; overflow: hidden;">
              <div style="width: ${project.progress}%; height: 100%; background: #0F766E;"></div>
            </div>
            <span style="font-size: 12px; font-weight: 600; color: #0F766E;">${project.progress}%</span>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 13px; font-weight: 600; color: #0F766E;">
            USD ${project.budget.toLocaleString()}
          </p>
        </div>
      `

      marker.bindPopup(popupContent)
      marker.on('click', () => {
        onSelectProject(project)
      })
      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [projects, locale, onSelectProject])

  // Pan to selected project
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedProject) return

    map.setView([selectedProject.coordinates[1], selectedProject.coordinates[0]], 12, {
      animate: true,
    })

    // Open popup for selected marker
    markersRef.current.forEach(marker => {
      const latLng = marker.getLatLng()
      if (
        Math.abs(latLng.lat - selectedProject.coordinates[1]) < 0.001 &&
        Math.abs(latLng.lng - selectedProject.coordinates[0]) < 0.001
      ) {
        marker.openPopup()
      }
    })
  }, [selectedProject])

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl"
      style={{ minHeight: '500px' }}
    />
  )
}
