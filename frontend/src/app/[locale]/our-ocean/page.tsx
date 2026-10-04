'use client'

import { useLocale } from 'next-intl'
import Image from 'next/image'

export default function OurOceanPage() {
  const locale = useLocale()

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero with ocean image */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src="/gallery/ocean-background.jpg"
          alt="Tanzania Ocean"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-max pb-12">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold text-white mb-4">
            {locale === 'en' ? 'Our Ocean' : 'Bahari Yetu'}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            {locale === 'en'
              ? 'Tanzania\'s coastal and marine resources are vital for livelihoods, food security, and economic growth'
              : 'Rasilimali za pwani na bahari ya Tanzania ni muhimu kwa maisha, usalama wa chakula, na ukuaji wa uchumi'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
              {locale === 'en' ? 'Marine Resources' : 'Rasilimali za Bahari'}
            </h2>
            <p className="text-[#4A5C63] leading-relaxed mb-6">
              {locale === 'en'
                ? 'Tanzania has a coastline of over 1,400 km along the Indian Ocean, with rich marine biodiversity including coral reefs, mangroves, and diverse fish species. The fisheries sector supports millions of livelihoods.'
                : 'Tanzania ina ukanda wa pwani wa zaidi ya km 1,400 kwenye Bahari ya Hindi, na bioanuwai tajiri ya bahari ikiwa ni pamoja na miamba ya matumbawe, mikoko, na aina mbalimbali za samaki.'}
            </p>

            <h3 className="font-bitter text-xl font-bold text-ink mb-3">
              {locale === 'en' ? 'Key Statistics' : 'Takwimu Muhimu'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-hairline">
                <div className="text-2xl font-bold text-accent">1,400+</div>
                <div className="text-sm text-muted">{locale === 'en' ? 'km coastline' : 'km ukanda wa pwani'}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-hairline">
                <div className="text-2xl font-bold text-accent">200+</div>
                <div className="text-sm text-muted">{locale === 'en' ? 'fish species' : 'aina za samaki'}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-hairline">
                <div className="text-2xl font-bold text-accent">4M+</div>
                <div className="text-sm text-muted">{locale === 'en' ? 'people dependent' : 'watu wanaotegemea'}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-hairline">
                <div className="text-2xl font-bold text-accent">$500M</div>
                <div className="text-sm text-muted">{locale === 'en' ? 'annual value' : 'thamani ya mwaka'}</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
              {locale === 'en' ? 'Challenges We Address' : 'Changamoto Tunazoshughulikia'}
            </h2>
            <ul className="space-y-4">
              {[
                { en: 'Overfishing and declining fish stocks', sw: 'Uvuvi wa kupita kiasi na kupungua kwa samaki' },
                { en: 'Illegal, unreported, and unregulated fishing', sw: 'Uvuvi haramu, usioripotiwa, na usio na udhibiti' },
                { en: 'Climate change impacts on marine ecosystems', sw: 'Athari za mabadiliko ya hali ya hewa' },
                { en: 'Limited value chain infrastructure', sw: 'Miundombinu duni ya minyororo ya thamani' },
                { en: 'Weak governance and enforcement', sw: 'Utawala dhaifu na utekelezaji' },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 bg-white rounded-lg p-4 border border-hairline">
                  <span className="text-accent font-bold">{i + 1}.</span>
                  <span className="text-[#4A5C63]">{locale === 'en' ? item.en : item.sw}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
