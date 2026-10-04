'use client'

import { useLocale } from 'next-intl'

export default function ComponentsPage() {
  const locale = useLocale()

  const components = [
    {
      number: 1,
      titleEn: 'Governance and Policy',
      titleSw: 'Utawala na Sera',
      descEn: 'Strengthening the legal, policy, and institutional frameworks for sustainable fisheries management.',
      descSw: 'Kuimarisha mifumo ya kisheria, sera, na kitaasisi kwa usimamizi endelevu wa uvuvi.',
      budget: '15%',
    },
    {
      number: 2,
      titleEn: 'Fisheries Management',
      titleSw: 'Usimamizi wa Uvuvi',
      descEn: 'Improving management effectiveness of priority fisheries through science-based approaches and community engagement.',
      descSw: 'Kuboresha ufanisi wa usimamizi wa uvuvi wa kipaumbele kupitia mbinu za kisayansi na ushiriki wa jamii.',
      budget: '35%',
    },
    {
      number: 3,
      titleEn: 'Aquaculture and Value Chains',
      titleSw: 'Ufugaji na Minyororo ya Thamani',
      descEn: 'Developing sustainable aquaculture and improving post-harvest handling, processing, and market access.',
      descSw: 'Kuendeleza ufugaji endelevu na kuboresha usimamizi baada ya mavuno, usindikaji, na upatikanaji wa masoko.',
      budget: '40%',
    },
    {
      number: 4,
      titleEn: 'Project Management and M&E',
      titleSw: 'Usimamizi wa Mradi na M&E',
      descEn: 'Ensuring effective project coordination, monitoring, evaluation, and knowledge management.',
      descSw: 'Kuhakikisha uratibu bora wa mradi, ufuatiliaji, tathmini, na usimamizi wa maarifa.',
      budget: '10%',
    },
  ]

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Project Components' : 'Vipengele vya Mradi'}
          </h1>
          <p className="text-lg text-ocean-100 max-w-2xl">
            {locale === 'en'
              ? 'TASFAM is organized into four main components, each addressing critical aspects of fisheries and aquaculture management.'
              : 'TASFAM imegawanywa katika vipengele vinne vikuu, kila kimoja kikishughulikia mambo muhimu ya usimamizi wa uvuvi na ufugaji.'}
          </p>
        </div>
      </section>

      {/* Components */}
      <section className="container-max py-12">
        <div className="space-y-8">
          {components.map((comp) => (
            <div key={comp.number} className="bg-white rounded-xl border border-hairline overflow-hidden">
              <div className="grid md:grid-cols-[120px,1fr] gap-0">
                <div className="bg-accent text-white p-6 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{comp.number}</span>
                  <span className="text-sm mt-1">{comp.budget}</span>
                </div>
                <div className="p-6">
                  <h2 className="font-bitter text-2xl font-bold text-ink mb-3">
                    {locale === 'en' ? comp.titleEn : comp.titleSw}
                  </h2>
                  <p className="text-[#4A5C63] leading-relaxed">
                    {locale === 'en' ? comp.descEn : comp.descSw}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
