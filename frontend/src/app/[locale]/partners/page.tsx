'use client'

import { useLocale } from 'next-intl'
import Image from 'next/image'

export default function PartnersPage() {
  const locale = useLocale()

  const partners = [
    {
      nameEn: 'World Bank',
      nameSw: 'Benki ya Dunia',
      roleEn: 'Funding Partner',
      roleSw: 'Mfadhili',
      descEn: 'Providing USD 130 million in financing for the TASFAM project.',
      descSw: 'Kutoa USD milioni 130 kwa ufadhili wa mradi wa TASFAM.',
    },
    {
      nameEn: 'Ministry of Blue Economy and Fisheries',
      nameSw: 'Wizara ya Uchumi wa Buluu na Uvuvi',
      roleEn: 'Implementing Agency',
      roleSw: 'Wakala wa Utekelezaji',
      descEn: 'Leading the implementation of TASFAM in Zanzibar.',
      descSw: 'Kuongoza utekelezaji wa TASFAM Zanzibar.',
    },
    {
      nameEn: 'Revolutionary Government of Zanzibar',
      nameSw: 'Serikali ya Mapinduzi ya Zanzibar',
      roleEn: 'Government Partner',
      roleSw: 'Mshirika wa Serikali',
      descEn: 'Providing policy support and coordination for project activities.',
      descSw: 'Kutoa msaada wa sera na uratibu wa shughuli za mradi.',
    },
  ]

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Our Partners' : 'Washirika Wetu'}
          </h1>
          <p className="text-lg text-ocean-100 max-w-2xl">
            {locale === 'en'
              ? 'Working together for sustainable fisheries and aquaculture in Tanzania'
              : 'Kufanya kazi pamoja kwa uvuvi na ufugaji endelevu Tanzania'}
          </p>
        </div>
      </section>

      {/* Partners */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-hairline">
              <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mb-4">
                <Image
                  src="/tasfam-logo.jpg"
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-accent uppercase tracking-wide">
                {locale === 'en' ? partner.roleEn : partner.roleSw}
              </span>
              <h2 className="font-bitter text-xl font-bold text-ink mt-1 mb-3">
                {locale === 'en' ? partner.nameEn : partner.nameSw}
              </h2>
              <p className="text-[#4A5C63] text-sm">
                {locale === 'en' ? partner.descEn : partner.descSw}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TASFAM Logo */}
      <section className="container-max py-12 text-center">
        <Image
          src="/tasfam-logo.jpg"
          alt="TASFAM Project 2025-2030"
          width={200}
          height={200}
          className="mx-auto rounded-full shadow-lg"
        />
        <h2 className="font-bitter text-2xl font-bold text-ink mt-6 mb-2">
          TASFAM Project
        </h2>
        <p className="text-muted">2025 - 2030</p>
      </section>
    </div>
  )
}
