'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getGalleryImages } from '@/lib/api'

interface GalleryImage {
  id: string
  url: string
  alt: string
  caption: string
}

// Default fallback images
const defaultImages: GalleryImage[] = [
  { id: '1', url: '/gallery/ocean-background.jpg', alt: 'Ocean view', caption: '' },
  { id: '2', url: '/tasfam-logo.jpg', alt: 'TASFAM Logo', caption: '' },
]

export function GallerySection() {
  const t = useTranslations()
  const locale = useLocale()
  const [images, setImages] = useState<GalleryImage[]>(defaultImages)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const data = await getGalleryImages(locale, 'homepage')
        if (data && data.length > 0) {
          setImages(data)
          setUsingFallback(false)
        } else {
          setUsingFallback(true)
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [locale])

  return (
    <section className="py-16" style={{ backgroundColor: '#F6F2EA' }}>
      <div className="container-max">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Bitter, Georgia, serif', color: '#10333F' }}>
              {t('gallery.title')}
            </h2>
            <p className="text-lg" style={{ color: '#5C6B72' }}>
              {t('gallery.description')}
            </p>
          </div>
          <Link
            href={`/${locale}/gallery`}
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#0F766E' }}
          >
            {t('gallery.viewAll')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Placeholder for more images when using fallback */}
            {usingFallback && (
              <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#D4C9B5] flex flex-col items-center justify-center text-muted bg-white/50">
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{t('gallery.moreComingSoon')}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 md:hidden text-center">
          <Link
            href={`/${locale}/gallery`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold"
          >
            {t('gallery.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}
