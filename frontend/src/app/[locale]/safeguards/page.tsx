'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function SafeguardsPage() {
  const locale = useLocale()

  const documents = [
    { nameEn: 'Environmental and Social Management Framework (ESMF)', nameSw: 'Mfumo wa Usimamizi wa Mazingira na Jamii (ESMF)', type: 'ESMF' },
    { nameEn: 'Resettlement Policy Framework (RPF)', nameSw: 'Mfumo wa Sera ya Uhamishaji (RPF)', type: 'RPF' },
    { nameEn: 'Stakeholder Engagement Plan (SEP)', nameSw: 'Mpango wa Ushirikishaji wa Wadau (SEP)', type: 'SEP' },
    { nameEn: 'Labor Management Procedures (LMP)', nameSw: 'Taratibu za Usimamizi wa Wafanyakazi (LMP)', type: 'LMP' },
  ]

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Safeguards & Grievances' : 'Ulinzi na Malalamiko'}
          </h1>
          <p className="text-lg text-ocean-100 max-w-2xl">
            {locale === 'en'
              ? 'Environmental and social safeguards documents and grievance redress mechanism'
              : 'Nyaraka za ulinzi wa mazingira na jamii na utaratibu wa kushughulikia malalamiko'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Safeguards Documents */}
          <div>
            <h2 className="font-bitter text-2xl font-bold text-ink mb-6">
              {locale === 'en' ? 'Safeguards Documents' : 'Nyaraka za Ulinzi'}
            </h2>
            <div className="space-y-4">
              {documents.map((doc, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-hairline flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wide">{doc.type}</span>
                    <h3 className="font-semibold text-ink mt-1">
                      {locale === 'en' ? doc.nameEn : doc.nameSw}
                    </h3>
                  </div>
                  <button className="px-4 py-2 bg-[#FBF8F2] border border-hairline rounded-lg text-sm font-medium text-ink hover:border-accent">
                    {locale === 'en' ? 'Download' : 'Pakua'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Grievance Redress */}
          <div>
            <h2 className="font-bitter text-2xl font-bold text-ink mb-6">
              {locale === 'en' ? 'Grievance Redress Mechanism' : 'Utaratibu wa Kushughulikia Malalamiko'}
            </h2>

            <div className="bg-white rounded-xl p-6 border border-hairline mb-6">
              <p className="text-[#4A5C63] mb-4">
                {locale === 'en'
                  ? 'If you have a concern, complaint, or feedback about the TASFAM project, you can submit it through our Grievance Redress Mechanism. All submissions are treated confidentially.'
                  : 'Ikiwa una wasiwasi, lalamiko, au maoni kuhusu mradi wa TASFAM, unaweza kuwasilisha kupitia Utaratibu wetu wa Kushughulikia Malalamiko. Mawasilisho yote yanashughulikiwa kwa siri.'}
              </p>
              <Link
                href={`/${locale}/grievance`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-[#12907F] transition-colors"
              >
                {locale === 'en' ? 'Submit a Grievance' : 'Wasilisha Lalamiko'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#E6D9B8]">
              <h3 className="font-semibold text-ink mb-2">
                {locale === 'en' ? 'GBV/SEA Sensitive Cases' : 'Kesi Nyeti za GBV/SEA'}
              </h3>
              <p className="text-sm text-[#4A5C63] mb-3">
                {locale === 'en'
                  ? 'Cases involving gender-based violence or sexual exploitation are handled with extra confidentiality by trained GBV focal points.'
                  : 'Kesi zinazohusisha unyanyasaji wa kijinsia au unyanyasaji wa kingono zinashughulikiwa kwa siri zaidi na wataalam wa GBV.'}
              </p>
              <p className="text-sm font-semibold text-accent">
                {locale === 'en' ? 'Hotline: +255 XXX XXX XXX' : 'Simu ya dharura: +255 XXX XXX XXX'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
