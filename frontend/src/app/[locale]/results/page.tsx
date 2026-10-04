'use client'

import { useLocale } from 'next-intl'

export default function ResultsPage() {
  const locale = useLocale()

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Results & Impact' : 'Matokeo na Athari'}
          </h1>
          <p className="text-lg text-ocean-100 max-w-2xl">
            {locale === 'en'
              ? 'Tracking our progress towards sustainable fisheries and improved livelihoods'
              : 'Kufuatilia maendeleo yetu kuelekea uvuvi endelevu na maisha bora'}
          </p>
        </div>
      </section>

      {/* Key Results */}
      <section className="container-max py-12">
        <h2 className="font-bitter text-2xl font-bold text-ink mb-8">
          {locale === 'en' ? 'Key Performance Indicators' : 'Viashiria Vikuu vya Utendaji'}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { value: '42,500', labelEn: 'Direct Beneficiaries', labelSw: 'Wanufaika wa Moja kwa Moja' },
            { value: '45%', labelEn: 'Women Participation', labelSw: 'Ushiriki wa Wanawake' },
            { value: '12', labelEn: 'Districts Covered', labelSw: 'Wilaya Zinazofikiwa' },
            { value: '$130M', labelEn: 'Total Investment', labelSw: 'Uwekezaji Wote' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-hairline text-center">
              <div className="text-4xl font-bold text-accent mb-2">{item.value}</div>
              <div className="text-muted text-sm">{locale === 'en' ? item.labelEn : item.labelSw}</div>
            </div>
          ))}
        </div>

        <h2 className="font-bitter text-2xl font-bold text-ink mb-6">
          {locale === 'en' ? 'Impact Areas' : 'Maeneo ya Athari'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              titleEn: 'People Reached',
              titleSw: 'Watu Waliofikiwa',
              descEn: 'Improving livelihoods for fishing communities through training, equipment, and market access.',
              descSw: 'Kuboresha maisha ya jamii za wavuvi kupitia mafunzo, vifaa, na upatikanaji wa masoko.',
            },
            {
              titleEn: 'Ocean & Stocks',
              titleSw: 'Bahari na Rasilimali',
              descEn: 'Restoring fish stocks and marine ecosystems through sustainable management practices.',
              descSw: 'Kurejesha rasilimali za samaki na mazingira ya bahari kupitia usimamizi endelevu.',
            },
            {
              titleEn: 'Institutions',
              titleSw: 'Taasisi',
              descEn: 'Strengthening governance, policy frameworks, and enforcement capacity.',
              descSw: 'Kuimarisha utawala, mifumo ya sera, na uwezo wa utekelezaji.',
            },
            {
              titleEn: 'Jobs & Livelihoods',
              titleSw: 'Ajira na Maisha',
              descEn: 'Creating employment opportunities in fishing, aquaculture, and value chains.',
              descSw: 'Kuunda fursa za ajira katika uvuvi, ufugaji, na minyororo ya thamani.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-hairline">
              <h3 className="font-bitter text-xl font-bold text-ink mb-3">
                {locale === 'en' ? item.titleEn : item.titleSw}
              </h3>
              <p className="text-[#4A5C63]">
                {locale === 'en' ? item.descEn : item.descSw}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
