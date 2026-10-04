'use client'

import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'

export default function AboutPage() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'About TASFAM' : 'Kuhusu TASFAM'}
          </h1>
          <p className="text-lg text-ocean-100 max-w-2xl">
            {locale === 'en'
              ? 'Tanzania Scaling-up Sustainable Fisheries and Aquaculture Management Project (2025-2030)'
              : 'Mradi wa Kuimarisha Usimamizi Endelevu wa Uvuvi na Ufugaji wa Viumbe vya Maji Tanzania (2025-2030)'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
              {locale === 'en' ? 'Project Overview' : 'Muhtasari wa Mradi'}
            </h2>
            <p className="text-[#4A5C63] leading-relaxed mb-6">
              {locale === 'en'
                ? 'TASFAM is a World Bank-supported initiative that aims to improve the management effectiveness of selected priority fisheries at regional, national, and community levels across Unguja, Pemba, and the mainland coast of Tanzania.'
                : 'TASFAM ni mpango unaofadhiliwa na Benki ya Dunia unaolenga kuboresha ufanisi wa usimamizi wa uvuvi wa kipaumbele katika ngazi za kikanda, kitaifa na kijamii - Unguja, Pemba na ukanda wa pwani wa Tanzania Bara.'}
            </p>
            <p className="text-[#4A5C63] leading-relaxed mb-6">
              {locale === 'en'
                ? 'The project focuses on sustainable fisheries management, aquaculture development, value chain improvements, and strengthening governance and policy frameworks.'
                : 'Mradi unalenga usimamizi endelevu wa uvuvi, maendeleo ya ufugaji wa viumbe vya maji, uboreshaji wa minyororo ya thamani, na kuimarisha mifumo ya utawala na sera.'}
            </p>

            <h3 className="font-bitter text-xl font-bold text-ink mb-3 mt-8">
              {locale === 'en' ? 'Key Objectives' : 'Malengo Makuu'}
            </h3>
            <ul className="space-y-3 text-[#4A5C63]">
              <li className="flex gap-3">
                <span className="text-accent font-bold">1.</span>
                {locale === 'en' ? 'Strengthen fisheries governance and policy' : 'Kuimarisha utawala na sera za uvuvi'}
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">2.</span>
                {locale === 'en' ? 'Improve fisheries management at all levels' : 'Kuboresha usimamizi wa uvuvi katika ngazi zote'}
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">3.</span>
                {locale === 'en' ? 'Develop sustainable aquaculture and value chains' : 'Kuendeleza ufugaji endelevu na minyororo ya thamani'}
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">4.</span>
                {locale === 'en' ? 'Ensure effective project management and M&E' : 'Kuhakikisha usimamizi bora wa mradi na M&E'}
              </li>
            </ul>
          </div>

          <div>
            <Image
              src="/tasfam-logo.jpg"
              alt="TASFAM Project"
              width={400}
              height={400}
              className="rounded-xl shadow-lg mx-auto"
            />

            <div className="mt-8 bg-white rounded-xl p-6 border border-hairline">
              <h3 className="font-bitter text-lg font-bold text-ink mb-4">
                {locale === 'en' ? 'Project Details' : 'Maelezo ya Mradi'}
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">{locale === 'en' ? 'Duration' : 'Muda'}</dt>
                  <dd className="font-semibold">2025 - 2030</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{locale === 'en' ? 'Total Financing' : 'Fedha Zote'}</dt>
                  <dd className="font-semibold text-accent">USD 130M</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{locale === 'en' ? 'Implementing Agency' : 'Wakala wa Utekelezaji'}</dt>
                  <dd className="font-semibold">{locale === 'en' ? 'Ministry of Blue Economy' : 'Wizara ya Uchumi wa Buluu'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{locale === 'en' ? 'Funding Partner' : 'Mfadhili'}</dt>
                  <dd className="font-semibold">World Bank</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
