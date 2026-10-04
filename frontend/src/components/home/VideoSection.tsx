'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { getSiteSettings } from '@/lib/api'

interface VideoData {
  url: string
  title: string
  description: string
  thumbnail: string | null
}

export function VideoSection() {
  const t = useTranslations()
  const locale = useLocale()
  const [video, setVideo] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideo() {
      try {
        const settings = await getSiteSettings(locale)
        if (settings?.video) {
          setVideo(settings.video)
        }
      } catch (error) {
        console.error('Failed to fetch video settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [locale])

  const videoTitle = video?.title || t('video.title')
  const videoDescription = video?.description || t('video.description')
  const videoThumbnail = video?.thumbnail || '/gallery/ocean-background.jpg'
  const isYouTube = video?.url?.includes('youtube') || video?.url?.includes('youtu.be')
  const isVimeo = video?.url?.includes('vimeo')

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : null
  }

  // Extract Vimeo video ID
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    return match ? match[1] : null
  }

  return (
    <section className="bg-surface">
      {/* Hero section with ocean blue background */}
      <div className="text-white py-16" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max text-center">
          <span className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2 block" style={{ color: '#CCE9F5' }}>
            {locale === 'en' ? 'Project Video' : 'Video ya Mradi'}
          </span>
          <h2 className="font-bitter text-[clamp(32px,5vw,48px)] font-bold mb-4">
            {videoTitle}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#E0F4FB' }}>
            {videoDescription}
          </p>
        </div>
      </div>

      {/* Video content section */}
      <div className="py-12" style={{ backgroundColor: '#10333F' }}>
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
              {video?.url && isYouTube ? (
                <iframe
                  className="w-full aspect-video"
                  src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
                  title={videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : video?.url && isVimeo ? (
                <iframe
                  className="w-full aspect-video"
                  src={`https://player.vimeo.com/video/${getVimeoId(video.url)}`}
                  title={videoTitle}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  className="w-full aspect-video"
                  poster={videoThumbnail}
                  preload="metadata"
                >
                  <source src={video?.url || '/tasfam-intro.mp4'} type="video/mp4" />
                  {t('video.notSupported')}
                </video>
              )}
            </div>

            {/* Video caption */}
            <p className="text-center mt-6 text-sm" style={{ color: '#9BB8C0' }}>
              {locale === 'en'
                ? 'TASFAM Project 2025-2030 | World Bank Supported Initiative'
                : 'Mradi wa TASFAM 2025-2030 | Mpango Unaofadhiliwa na Benki ya Dunia'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
