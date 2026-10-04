'use client'

import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function StoriesPage() {
  const locale = useLocale()

  const stories = [
    {
      id: 'mwanaidi-juma',
      titleEn: '"We stopped guessing where the fish were."',
      titleSw: '"Tuliacha kubahatisha samaki walipo."',
      authorEn: 'Mwanaidi Juma, seaweed farmer, Paje - Unguja South',
      authorSw: 'Mwanaidi Juma, mkulima wa mwani, Paje - Kusini Unguja',
      excerptEn: 'Deep-water tubular lines raised her harvest from 0.6 to 1.9 tonnes a season.',
      excerptSw: 'Mistari ya maji ya kina iliongeza mavuno kutoka tani 0.6 hadi 1.9 kwa msimu.',
    },
    {
      id: 'hassan-omar',
      titleEn: '"The new GPS system changed everything for us."',
      titleSw: '"Mfumo mpya wa GPS umebadilisha kila kitu kwetu."',
      authorEn: 'Hassan Omar, fisherman, Nungwi - Unguja North',
      authorSw: 'Hassan Omar, mvuvi, Nungwi - Kaskazini Unguja',
      excerptEn: 'With vessel monitoring, catches are documented and markets pay better prices.',
      excerptSw: 'Kwa ufuatiliaji wa vyombo, mavuno yanarekodiwa na masoko yanalipa bei nzuri zaidi.',
    },
    {
      id: 'fatma-said',
      titleEn: '"I now earn three times what I used to."',
      titleSw: '"Sasa ninapata mara tatu ya nilichokuwa nikipata."',
      authorEn: 'Fatma Said, fish processor, Mkokotoni',
      authorSw: 'Fatma Said, msindikaji wa samaki, Mkokotoni',
      excerptEn: 'Access to cold storage means less waste and better quality fish for export.',
      excerptSw: 'Upatikanaji wa uhifadhi wa baridi unamaanisha upotevu mdogo na samaki bora kwa usafirishaji.',
    },
  ]

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Stories from the Field' : 'Hadithi kutoka Uwandani'}
          </h1>
          <p className="text-lg text-ocean-100 max-w-2xl">
            {locale === 'en'
              ? 'Real stories from fishers, farmers, and communities benefiting from TASFAM'
              : 'Hadithi halisi kutoka kwa wavuvi, wakulima, na jamii zinazofaidika na TASFAM'}
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <article key={story.id} className="bg-white rounded-xl overflow-hidden border border-hairline hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] relative bg-ocean-100">
                <Image
                  src="/gallery/ocean-background.jpg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="font-bitter text-xl font-bold text-ink mb-2 leading-tight">
                  {locale === 'en' ? story.titleEn : story.titleSw}
                </h2>
                <p className="text-sm text-accent font-medium mb-3">
                  {locale === 'en' ? story.authorEn : story.authorSw}
                </p>
                <p className="text-[#4A5C63] text-sm mb-4">
                  {locale === 'en' ? story.excerptEn : story.excerptSw}
                </p>
                <Link
                  href={`/${locale}/stories/${story.id}`}
                  className="text-accent font-semibold text-sm hover:underline"
                >
                  {locale === 'en' ? 'Read full story' : 'Soma hadithi kamili'} &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
