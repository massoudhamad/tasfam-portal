'use client'

import { useLocale } from 'next-intl'

export default function PrivacyPage() {
  const locale = useLocale()

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Privacy Policy' : 'Sera ya Faragha'}
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#E0F4FB' }}>
            {locale === 'en'
              ? 'How we collect, use, and protect your information'
              : 'Jinsi tunavyokusanya, kutumia, na kulinda taarifa zako'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-max py-12">
        <div className="max-w-3xl">
          <div className="bg-white rounded-xl p-8 border border-hairline space-y-8">
            <div>
              <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
                {locale === 'en' ? 'Information We Collect' : 'Taarifa Tunazokusanya'}
              </h2>
              <p className="text-[#4A5C63] leading-relaxed">
                {locale === 'en'
                  ? 'We collect information you provide directly to us, such as when you submit a grievance, contact us, or participate in project activities. This may include your name, contact information, and any other information you choose to provide.'
                  : 'Tunakusanya taarifa unazotupa moja kwa moja, kama vile unapowasilisha lalamiko, kuwasiliana nasi, au kushiriki katika shughuli za mradi. Hii inaweza kujumuisha jina lako, taarifa za mawasiliano, na taarifa nyingine yoyote unayochagua kutoa.'}
              </p>
            </div>

            <div>
              <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
                {locale === 'en' ? 'How We Use Your Information' : 'Jinsi Tunavyotumia Taarifa Zako'}
              </h2>
              <p className="text-[#4A5C63] leading-relaxed">
                {locale === 'en'
                  ? 'We use the information we collect to respond to your inquiries, process grievances, improve our services, and communicate with you about project activities and updates.'
                  : 'Tunatumia taarifa tunazokusanya kujibu maswali yako, kushughulikia malalamiko, kuboresha huduma zetu, na kuwasiliana nawe kuhusu shughuli na sasisho za mradi.'}
              </p>
            </div>

            <div>
              <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
                {locale === 'en' ? 'Data Protection' : 'Ulinzi wa Data'}
              </h2>
              <p className="text-[#4A5C63] leading-relaxed">
                {locale === 'en'
                  ? 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
                  : 'Tunatekeleza hatua zinazofaa za usalama kulinda taarifa zako binafsi dhidi ya ufikiaji usioruhusiwa, mabadiliko, ufunuaji, au uharibifu.'}
              </p>
            </div>

            <div>
              <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
                {locale === 'en' ? 'Contact Us' : 'Wasiliana Nasi'}
              </h2>
              <p className="text-[#4A5C63] leading-relaxed">
                {locale === 'en'
                  ? 'If you have any questions about this Privacy Policy, please contact us at tasfam@blueeconomysmz.go.tz'
                  : 'Ikiwa una maswali yoyote kuhusu Sera hii ya Faragha, tafadhali wasiliana nasi kwa tasfam@blueeconomysmz.go.tz'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
