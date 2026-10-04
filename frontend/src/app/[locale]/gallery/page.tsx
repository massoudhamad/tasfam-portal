'use client'

import { useLocale } from 'next-intl'
import Image from 'next/image'

export default function GalleryPage() {
  const locale = useLocale()

  const images = [
    { src: '/gallery/ocean-background.jpg', captionEn: 'Tanzania coastal waters', captionSw: 'Maji ya pwani ya Tanzania' },
    { src: '/tasfam-logo.jpg', captionEn: 'TASFAM Project Logo', captionSw: 'Nembo ya Mradi wa TASFAM' },
  ]

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Photo Gallery' : 'Galari ya Picha'}
          </h1>
          <p className="text-lg text-ocean-100 max-w-2xl">
            {locale === 'en'
              ? 'Images from TASFAM project activities across Tanzania'
              : 'Picha kutoka shughuli za mradi wa TASFAM kote Tanzania'}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container-max py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              <Image
                src={image.src}
                alt={locale === 'en' ? image.captionEn : image.captionSw}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium">
                  {locale === 'en' ? image.captionEn : image.captionSw}
                </p>
              </div>
            </div>
          ))}

          {/* Placeholder for more images */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={`placeholder-${i}`}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#D4C9B5] flex flex-col items-center justify-center text-muted bg-white/50"
            >
              <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{locale === 'en' ? 'More photos coming soon' : 'Picha zaidi zinakuja hivi karibuni'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="container-max py-12">
        <h2 className="font-bitter text-2xl font-bold text-ink mb-6">
          {locale === 'en' ? 'Project Video' : 'Video ya Mradi'}
        </h2>
        <div className="max-w-3xl">
          <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
            <video
              controls
              className="w-full aspect-video"
              poster="/gallery/ocean-background.jpg"
            >
              <source src="/tasfam-intro.mp4" type="video/mp4" />
              {locale === 'en' ? 'Your browser does not support the video tag.' : 'Kivinjari chako hakiungi mkono video.'}
            </video>
          </div>
        </div>
      </section>
    </div>
  )
}
