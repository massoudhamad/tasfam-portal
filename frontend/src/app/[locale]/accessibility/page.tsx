'use client'

import { useLocale } from 'next-intl'

export default function AccessibilityPage() {
  const locale = useLocale()

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Accessibility Statement' : 'Taarifa ya Ufikiwaji'}
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#E0F4FB' }}>
            {locale === 'en'
              ? 'Our commitment to making this website accessible to everyone'
              : 'Ahadi yetu ya kufanya tovuti hii ifikie kwa kila mtu'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-max py-12">
        <div className="max-w-3xl">
          <div className="bg-white rounded-xl p-8 border border-hairline space-y-8">
            <div>
              <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
                {locale === 'en' ? 'Our Commitment' : 'Ahadi Yetu'}
              </h2>
              <p className="text-[#4A5C63] leading-relaxed">
                {locale === 'en'
                  ? 'TASFAM is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.'
                  : 'TASFAM imejitolea kuhakikisha upatikanaji wa kidijitali kwa watu wenye ulemavu. Tunaendelea kuboresha uzoefu wa mtumiaji kwa kila mtu na kutumia viwango vya upatikanaji vinavyofaa.'}
              </p>
            </div>

            <div>
              <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
                {locale === 'en' ? 'Accessibility Features' : 'Vipengele vya Ufikiwaji'}
              </h2>
              <ul className="space-y-3 text-[#4A5C63]">
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  {locale === 'en' ? 'Keyboard navigation support' : 'Msaada wa urambazaji wa kibodi'}
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  {locale === 'en' ? 'Screen reader compatibility' : 'Uoanifu wa kisomaji skrini'}
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  {locale === 'en' ? 'Sufficient color contrast' : 'Utofauti wa kutosha wa rangi'}
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  {locale === 'en' ? 'Responsive design for all devices' : 'Muundo unaobadilika kwa vifaa vyote'}
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  {locale === 'en' ? 'Bilingual support (English/Kiswahili)' : 'Msaada wa lugha mbili (Kiingereza/Kiswahili)'}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-bitter text-2xl font-bold text-ink mb-4">
                {locale === 'en' ? 'Feedback' : 'Maoni'}
              </h2>
              <p className="text-[#4A5C63] leading-relaxed">
                {locale === 'en'
                  ? 'We welcome your feedback on the accessibility of this website. Please let us know if you encounter accessibility barriers by contacting us at tasfam@blueeconomysmz.go.tz'
                  : 'Tunakaribisha maoni yako kuhusu upatikanaji wa tovuti hii. Tafadhali tujulishe ikiwa unakutana na vikwazo vya upatikanaji kwa kuwasiliana nasi kwa tasfam@blueeconomysmz.go.tz'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
